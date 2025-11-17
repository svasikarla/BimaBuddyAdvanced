/**
 * Wellness Integration Types
 * Supports Terra API and Fitbit direct integration
 */

export type WellnessProvider = 'terra' | 'fitbit' | 'apple_health' | 'google_fit' | 'garmin'

export interface WellnessConnection {
  id: string
  user_id: string
  provider: WellnessProvider
  terra_user_id?: string
  fitbit_user_id?: string
  status: 'active' | 'disconnected' | 'error'
  access_token?: string
  refresh_token?: string
  token_expires_at?: Date
  created_at: Date
  updated_at: Date
  last_sync_at?: Date
}

export interface WellnessActivity {
  id: string
  user_id: string
  provider: WellnessProvider
  date: Date

  // Activity metrics
  steps: number
  distance_meters: number
  calories_burned: number
  active_minutes: number

  // Exercise data
  workout_duration_minutes?: number
  workout_type?: string

  // Health metrics
  heart_rate_avg?: number
  sleep_hours?: number

  // Points and rewards
  points_earned: number

  synced_at: Date
  created_at: Date
}

export interface WellnessPoints {
  user_id: string
  total_points: number
  monthly_points: number
  weekly_points: number

  // Milestones
  streak_days: number
  longest_streak: number

  // Conversion
  premium_discount_percentage: number
  premium_discount_amount: number

  updated_at: Date
}

export interface ActivityGoals {
  user_id: string
  daily_steps_goal: number
  weekly_active_minutes_goal: number
  weekly_workouts_goal: number
  created_at: Date
  updated_at: Date
}

export interface WellnessReward {
  id: string
  user_id: string
  reward_type: 'points' | 'badge' | 'premium_discount' | 'gift_card'
  reward_value: number
  description: string
  earned_at: Date
  redeemed_at?: Date
  status: 'earned' | 'redeemed' | 'expired'
}

// Terra API specific types
export interface TerraWebhookPayload {
  type: 'daily' | 'activity' | 'sleep' | 'body'
  user: {
    user_id: string
    provider: string
  }
  data: any
}

export interface TerraAuthResponse {
  status: 'success' | 'error'
  auth_url?: string
  user_id?: string
  error?: string
}

// Points calculation rules
export interface PointsRule {
  activity_type: 'steps' | 'workout' | 'sleep' | 'active_minutes'
  threshold: number
  points: number
  frequency: 'daily' | 'weekly' | 'monthly'
}

export const DEFAULT_POINTS_RULES: PointsRule[] = [
  { activity_type: 'steps', threshold: 5000, points: 10, frequency: 'daily' },
  { activity_type: 'steps', threshold: 10000, points: 25, frequency: 'daily' },
  { activity_type: 'steps', threshold: 15000, points: 50, frequency: 'daily' },
  { activity_type: 'workout', threshold: 30, points: 20, frequency: 'daily' },
  { activity_type: 'workout', threshold: 60, points: 40, frequency: 'daily' },
  { activity_type: 'active_minutes', threshold: 150, points: 30, frequency: 'weekly' },
  { activity_type: 'sleep', threshold: 7, points: 15, frequency: 'daily' },
]

// Premium discount tiers
export interface PremiumDiscountTier {
  min_monthly_points: number
  max_monthly_points: number
  discount_percentage: number
  tier_name: string
}

export const PREMIUM_DISCOUNT_TIERS: PremiumDiscountTier[] = [
  { min_monthly_points: 0, max_monthly_points: 99, discount_percentage: 0, tier_name: 'No Discount' },
  { min_monthly_points: 100, max_monthly_points: 299, discount_percentage: 2, tier_name: 'Bronze' },
  { min_monthly_points: 300, max_monthly_points: 599, discount_percentage: 5, tier_name: 'Silver' },
  { min_monthly_points: 600, max_monthly_points: 999, discount_percentage: 8, tier_name: 'Gold' },
  { min_monthly_points: 1000, max_monthly_points: 9999999, discount_percentage: 12, tier_name: 'Platinum' },
]

// Wellness statistics
export interface WellnessStats {
  user_id: string
  total_days_active: number
  total_steps: number
  total_workouts: number
  total_active_minutes: number
  average_daily_steps: number
  current_streak: number
  total_points: number
  current_tier: PremiumDiscountTier
  next_tier: PremiumDiscountTier | null
  points_to_next_tier: number
}
