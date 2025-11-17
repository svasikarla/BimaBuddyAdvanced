"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Activity,
  TrendingUp,
  Award,
  Target,
  Calendar,
  Zap,
  Crown,
  ArrowRight,
  Footprints,
  Heart,
  Moon,
  Flame
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import type { WellnessStats, WellnessActivity } from '@/lib/types/wellness'
import { formatNumber } from '@/lib/language-utils'
import { TerraConnectWidget } from './terra-connect-widget'

interface WellnessDashboardProps {
  userId: string
  stats?: WellnessStats
  activities?: WellnessActivity[]
  isConnected?: boolean
}

export function WellnessDashboard({
  userId,
  stats,
  activities = [],
  isConnected = false
}: WellnessDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // If not connected, show connection widget
  if (!isConnected) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Wellness Rewards</h1>
            <p className="text-lg text-muted-foreground">
              Connect your fitness tracker and start earning rewards on your health insurance
            </p>
          </div>
          <TerraConnectWidget userId={userId} />
        </div>
      </div>
    )
  }

  // Default stats if not provided
  const defaultStats: WellnessStats = stats || {
    user_id: userId,
    total_days_active: 0,
    total_steps: 0,
    total_workouts: 0,
    total_active_minutes: 0,
    average_daily_steps: 0,
    current_streak: 0,
    total_points: 0,
    current_tier: {
      min_monthly_points: 0,
      max_monthly_points: 99,
      discount_percentage: 0,
      tier_name: 'No Discount'
    },
    next_tier: {
      min_monthly_points: 100,
      max_monthly_points: 299,
      discount_percentage: 2,
      tier_name: 'Bronze'
    },
    points_to_next_tier: 100
  }

  // Prepare chart data for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date
  })

  const activityChartData = last7Days.map(date => {
    const dateStr = date.toISOString().split('T')[0]
    const dayActivities = activities.filter(a =>
      new Date(a.date).toISOString().split('T')[0] === dateStr
    )

    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      steps: dayActivities.reduce((sum, a) => sum + a.steps, 0),
      calories: dayActivities.reduce((sum, a) => sum + a.calories_burned, 0),
      points: dayActivities.reduce((sum, a) => sum + a.points_earned, 0),
      active_minutes: dayActivities.reduce((sum, a) => sum + a.active_minutes, 0)
    }
  })

  const tierProgress = ((defaultStats.current_tier.min_monthly_points +
    (defaultStats.next_tier ? defaultStats.next_tier.min_monthly_points - defaultStats.points_to_next_tier : 0)) /
    (defaultStats.next_tier?.min_monthly_points || 1)) * 100

  return (
    <div className="container px-4 md:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Wellness Dashboard</h1>
          <p className="text-muted-foreground">
            Track your activity and earn premium discounts
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Crown className="mr-2 h-5 w-5 text-amber-500" />
          {defaultStats.current_tier.tier_name} Tier
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Total Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(defaultStats.total_points)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {defaultStats.points_to_next_tier > 0
                  ? `${defaultStats.points_to_next_tier} to ${defaultStats.next_tier?.tier_name}`
                  : 'Max tier reached!'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Premium Discount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{defaultStats.current_tier.discount_percentage}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Save up to ₹{(15000 * defaultStats.current_tier.discount_percentage / 100).toLocaleString()} per year
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{defaultStats.current_streak}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Days active in a row
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Footprints className="h-4 w-4 text-blue-500" />
                Avg Daily Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(defaultStats.average_daily_steps)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {defaultStats.total_days_active} days tracked
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tier Progress */}
      {defaultStats.next_tier && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Progress to {defaultStats.next_tier.tier_name}
            </CardTitle>
            <CardDescription>
              Earn {defaultStats.points_to_next_tier} more points this month to unlock {defaultStats.next_tier.discount_percentage}% discount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={tierProgress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{defaultStats.current_tier.tier_name}</span>
                <span>{defaultStats.next_tier.tier_name}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Steps Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Steps</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={activityChartData}>
                    <defs>
                      <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="steps"
                      stroke="#3b82f6"
                      fill="url(#colorSteps)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Points Earned Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Points Earned</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="points" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Footprints className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{formatNumber(defaultStats.total_steps)}</div>
                  <div className="text-sm text-muted-foreground">Total Steps</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{defaultStats.total_workouts}</div>
                  <div className="text-sm text-muted-foreground">Workouts</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <div className="text-2xl font-bold">{formatNumber(defaultStats.total_active_minutes)}</div>
                  <div className="text-sm text-muted-foreground">Active Minutes</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{defaultStats.total_days_active}</div>
                  <div className="text-sm text-muted-foreground">Days Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your latest tracked activities</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activities yet. Start moving to see your progress!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 10).map((activity, index) => (
                    <div
                      key={activity.id || index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {new Date(activity.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatNumber(activity.steps)} steps • {activity.calories_burned} cal
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">+{activity.points_earned} pts</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>Unlock badges by reaching milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sample achievements */}
                {[
                  { id: 1, title: 'First Steps', desc: 'Complete first activity', icon: '🎯', earned: true },
                  { id: 2, title: 'Week Warrior', desc: '7-day streak', icon: '🔥', earned: true },
                  { id: 3, title: 'Step Master', desc: '100K total steps', icon: '👟', earned: false },
                  { id: 4, title: 'Bronze Tier', desc: 'Reach Bronze', icon: '🥉', earned: true },
                  { id: 5, title: 'Silver Tier', desc: 'Reach Silver', icon: '🥈', earned: false },
                  { id: 6, title: 'Month Master', desc: '30-day streak', icon: '🏆', earned: false },
                ].map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={achievement.earned ? 'border-primary' : 'opacity-60'}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h3 className="font-semibold mb-1">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                      {achievement.earned && (
                        <Badge variant="default" className="mt-2">Unlocked</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
