/**
 * Wellness Service
 * Handles points calculation, premium discounts, and rewards
 */

import type {
  WellnessActivity,
  WellnessPoints,
  WellnessStats,
  PointsRule,
  PremiumDiscountTier,
  DEFAULT_POINTS_RULES,
  PREMIUM_DISCOUNT_TIERS
} from './types/wellness'

export class WellnessService {
  private pointsRules: PointsRule[]
  private discountTiers: PremiumDiscountTier[]

  constructor(
    pointsRules?: PointsRule[],
    discountTiers?: PremiumDiscountTier[]
  ) {
    this.pointsRules = pointsRules || this.getDefaultPointsRules()
    this.discountTiers = discountTiers || this.getDefaultDiscountTiers()
  }

  /**
   * Get default points rules
   */
  private getDefaultPointsRules(): PointsRule[] {
    return [
      { activity_type: 'steps', threshold: 5000, points: 10, frequency: 'daily' },
      { activity_type: 'steps', threshold: 10000, points: 25, frequency: 'daily' },
      { activity_type: 'steps', threshold: 15000, points: 50, frequency: 'daily' },
      { activity_type: 'workout', threshold: 30, points: 20, frequency: 'daily' },
      { activity_type: 'workout', threshold: 60, points: 40, frequency: 'daily' },
      { activity_type: 'active_minutes', threshold: 150, points: 30, frequency: 'weekly' },
      { activity_type: 'sleep', threshold: 7, points: 15, frequency: 'daily' },
    ]
  }

  /**
   * Get default discount tiers
   */
  private getDefaultDiscountTiers(): PremiumDiscountTier[] {
    return [
      { min_monthly_points: 0, max_monthly_points: 99, discount_percentage: 0, tier_name: 'No Discount' },
      { min_monthly_points: 100, max_monthly_points: 299, discount_percentage: 2, tier_name: 'Bronze' },
      { min_monthly_points: 300, max_monthly_points: 599, discount_percentage: 5, tier_name: 'Silver' },
      { min_monthly_points: 600, max_monthly_points: 999, discount_percentage: 8, tier_name: 'Gold' },
      { min_monthly_points: 1000, max_monthly_points: 9999999, discount_percentage: 12, tier_name: 'Platinum' },
    ]
  }

  /**
   * Calculate points for a single activity
   */
  calculateActivityPoints(activity: WellnessActivity): number {
    let totalPoints = 0

    // Steps points
    const stepsRules = this.pointsRules
      .filter(rule => rule.activity_type === 'steps' && rule.frequency === 'daily')
      .sort((a, b) => b.threshold - a.threshold) // Highest threshold first

    for (const rule of stepsRules) {
      if (activity.steps >= rule.threshold) {
        totalPoints += rule.points
        break // Only award highest matching tier
      }
    }

    // Workout points
    if (activity.workout_duration_minutes) {
      const workoutRules = this.pointsRules
        .filter(rule => rule.activity_type === 'workout' && rule.frequency === 'daily')
        .sort((a, b) => b.threshold - a.threshold)

      for (const rule of workoutRules) {
        if (activity.workout_duration_minutes >= rule.threshold) {
          totalPoints += rule.points
          break
        }
      }
    }

    // Sleep points
    if (activity.sleep_hours) {
      const sleepRules = this.pointsRules
        .filter(rule => rule.activity_type === 'sleep' && rule.frequency === 'daily')

      for (const rule of sleepRules) {
        if (activity.sleep_hours >= rule.threshold) {
          totalPoints += rule.points
          break
        }
      }
    }

    // Active minutes points (calculated separately for weekly totals)

    return totalPoints
  }

  /**
   * Calculate weekly active minutes bonus
   */
  calculateWeeklyActiveMinutesBonus(weeklyActiveMinutes: number): number {
    const activeMinutesRules = this.pointsRules
      .filter(rule => rule.activity_type === 'active_minutes' && rule.frequency === 'weekly')
      .sort((a, b) => b.threshold - a.threshold)

    for (const rule of activeMinutesRules) {
      if (weeklyActiveMinutes >= rule.threshold) {
        return rule.points
      }
    }

    return 0
  }

  /**
   * Get premium discount tier based on monthly points
   */
  getDiscountTier(monthlyPoints: number): PremiumDiscountTier {
    for (const tier of this.discountTiers) {
      if (monthlyPoints >= tier.min_monthly_points && monthlyPoints <= tier.max_monthly_points) {
        return tier
      }
    }

    return this.discountTiers[0] // Return lowest tier as fallback
  }

  /**
   * Calculate premium discount amount
   */
  calculatePremiumDiscount(params: {
    original_premium: number
    monthly_points: number
  }): {
    discount_percentage: number
    discount_amount: number
    final_premium: number
    tier: PremiumDiscountTier
  } {
    const tier = this.getDiscountTier(params.monthly_points)
    const discount_amount = (params.original_premium * tier.discount_percentage) / 100
    const final_premium = params.original_premium - discount_amount

    return {
      discount_percentage: tier.discount_percentage,
      discount_amount,
      final_premium,
      tier
    }
  }

  /**
   * Calculate streak days
   */
  calculateStreak(activities: WellnessActivity[]): {
    current_streak: number
    longest_streak: number
  } {
    if (activities.length === 0) {
      return { current_streak: 0, longest_streak: 0 }
    }

    // Sort activities by date (most recent first)
    const sortedActivities = activities.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    let current_streak = 0
    let longest_streak = 0
    let temp_streak = 0
    let expectedDate = new Date()
    expectedDate.setHours(0, 0, 0, 0)

    for (const activity of sortedActivities) {
      const activityDate = new Date(activity.date)
      activityDate.setHours(0, 0, 0, 0)

      // Check if this activity is from the expected date
      if (activityDate.getTime() === expectedDate.getTime()) {
        temp_streak++

        // Update current streak only for consecutive days from today
        if (current_streak === 0 || current_streak === temp_streak - 1) {
          current_streak = temp_streak
        }

        // Move to previous day
        expectedDate.setDate(expectedDate.getDate() - 1)
      } else if (activityDate.getTime() < expectedDate.getTime()) {
        // Gap in activity - streak broken
        longest_streak = Math.max(longest_streak, temp_streak)
        temp_streak = 1
        expectedDate = new Date(activityDate)
        expectedDate.setDate(expectedDate.getDate() - 1)
      }
    }

    longest_streak = Math.max(longest_streak, temp_streak, current_streak)

    return { current_streak, longest_streak }
  }

  /**
   * Calculate comprehensive wellness statistics
   */
  calculateStats(params: {
    activities: WellnessActivity[]
    total_points: number
    monthly_points: number
  }): WellnessStats {
    const { activities, total_points, monthly_points } = params

    // Calculate basic stats
    const total_days_active = new Set(
      activities.map(a => new Date(a.date).toDateString())
    ).size

    const total_steps = activities.reduce((sum, a) => sum + a.steps, 0)
    const total_workouts = activities.filter(a => a.workout_duration_minutes).length
    const total_active_minutes = activities.reduce((sum, a) => sum + a.active_minutes, 0)

    const average_daily_steps = total_days_active > 0 ? Math.round(total_steps / total_days_active) : 0

    // Calculate streaks
    const { current_streak, longest_streak } = this.calculateStreak(activities)

    // Get current tier and next tier
    const current_tier = this.getDiscountTier(monthly_points)
    const current_tier_index = this.discountTiers.findIndex(t => t.tier_name === current_tier.tier_name)
    const next_tier = current_tier_index < this.discountTiers.length - 1
      ? this.discountTiers[current_tier_index + 1]
      : null

    const points_to_next_tier = next_tier
      ? next_tier.min_monthly_points - monthly_points
      : 0

    return {
      user_id: activities[0]?.user_id || '',
      total_days_active,
      total_steps,
      total_workouts,
      total_active_minutes,
      average_daily_steps,
      current_streak,
      total_points,
      current_tier,
      next_tier,
      points_to_next_tier
    }
  }

  /**
   * Get motivational message based on progress
   */
  getMotivationalMessage(stats: WellnessStats): string {
    const messages = {
      newUser: [
        "Welcome to your wellness journey! Let's get started.",
        "Every step counts towards a healthier you!",
        "Start your fitness journey today and earn rewards!"
      ],
      lowActivity: [
        `You're ${stats.points_to_next_tier} points away from ${stats.next_tier?.tier_name} tier!`,
        "A little more activity can boost your rewards!",
        "You're almost at the next tier - keep going!"
      ],
      goodStreak: [
        `Amazing! ${stats.current_streak} day streak! Keep it up!`,
        "Your consistency is paying off!",
        `You're on fire! ${stats.current_streak} days and counting!`
      ],
      highActivity: [
        `You're crushing it! ${stats.current_tier.tier_name} tier achieved!`,
        `${stats.total_steps.toLocaleString()} steps and counting - incredible!`,
        "You're a wellness champion!"
      ]
    }

    // Determine user category
    if (stats.total_days_active === 0) {
      return messages.newUser[Math.floor(Math.random() * messages.newUser.length)]
    }

    if (stats.current_streak >= 7) {
      return messages.goodStreak[Math.floor(Math.random() * messages.goodStreak.length)]
    }

    if (stats.current_tier.tier_name === 'Gold' || stats.current_tier.tier_name === 'Platinum') {
      return messages.highActivity[Math.floor(Math.random() * messages.highActivity.length)]
    }

    return messages.lowActivity[Math.floor(Math.random() * messages.lowActivity.length)]
  }

  /**
   * Get achievements based on milestones
   */
  getAchievements(stats: WellnessStats): Array<{
    id: string
    title: string
    description: string
    icon: string
    earned: boolean
  }> {
    return [
      {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Complete your first activity',
        icon: '🎯',
        earned: stats.total_days_active >= 1
      },
      {
        id: 'week_warrior',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        earned: stats.current_streak >= 7
      },
      {
        id: 'month_master',
        title: 'Month Master',
        description: 'Maintain a 30-day streak',
        icon: '🏆',
        earned: stats.current_streak >= 30
      },
      {
        id: 'step_master',
        title: 'Step Master',
        description: 'Walk 100,000 total steps',
        icon: '👟',
        earned: stats.total_steps >= 100000
      },
      {
        id: 'workout_warrior',
        title: 'Workout Warrior',
        description: 'Complete 50 workouts',
        icon: '💪',
        earned: stats.total_workouts >= 50
      },
      {
        id: 'bronze_tier',
        title: 'Bronze Achiever',
        description: 'Reach Bronze tier',
        icon: '🥉',
        earned: stats.current_tier.tier_name !== 'No Discount'
      },
      {
        id: 'silver_tier',
        title: 'Silver Champion',
        description: 'Reach Silver tier',
        icon: '🥈',
        earned: ['Silver', 'Gold', 'Platinum'].includes(stats.current_tier.tier_name)
      },
      {
        id: 'gold_tier',
        title: 'Gold Legend',
        description: 'Reach Gold tier',
        icon: '🥇',
        earned: ['Gold', 'Platinum'].includes(stats.current_tier.tier_name)
      },
      {
        id: 'platinum_tier',
        title: 'Platinum Elite',
        description: 'Reach Platinum tier',
        icon: '💎',
        earned: stats.current_tier.tier_name === 'Platinum'
      }
    ]
  }
}

// Export singleton instance
export const wellnessService = new WellnessService()
