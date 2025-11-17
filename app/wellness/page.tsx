/**
 * Wellness Page
 * Main wellness rewards and activity tracking dashboard
 */

import { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChatbotButton } from '@/components/chatbot-button'
import { WellnessDashboard } from '@/components/wellness-dashboard'
import { PageTransition } from '@/components/page-transition'

export const metadata: Metadata = {
  title: 'Wellness Rewards - BimaBuddy',
  description: 'Track your fitness activity and earn premium discounts on health insurance',
}

export default function WellnessPage() {
  // TODO: Get user ID from session/auth
  const userId = 'demo-user-123'

  // TODO: Fetch wellness stats and activities from database
  // Example:
  // const { data: stats } = await supabase
  //   .from('wellness_points')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .single()
  //
  // const { data: activities } = await supabase
  //   .from('wellness_activities')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .order('date', { ascending: false })
  //   .limit(30)
  //
  // const { data: connection } = await supabase
  //   .from('wellness_connections')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .eq('status', 'active')
  //   .single()

  // For demo purposes, using mock data
  const isConnected = false // Change to true when testing with real data

  const mockStats = {
    user_id: userId,
    total_days_active: 15,
    total_steps: 127000,
    total_workouts: 8,
    total_active_minutes: 450,
    average_daily_steps: 8467,
    current_streak: 5,
    total_points: 425,
    current_tier: {
      min_monthly_points: 300,
      max_monthly_points: 599,
      discount_percentage: 5,
      tier_name: 'Silver'
    },
    next_tier: {
      min_monthly_points: 600,
      max_monthly_points: 999,
      discount_percentage: 8,
      tier_name: 'Gold'
    },
    points_to_next_tier: 175
  }

  const mockActivities = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)

    return {
      id: `activity-${i}`,
      user_id: userId,
      provider: 'fitbit' as const,
      date,
      steps: Math.floor(Math.random() * 8000) + 3000,
      distance_meters: Math.floor(Math.random() * 5000) + 2000,
      calories_burned: Math.floor(Math.random() * 300) + 150,
      active_minutes: Math.floor(Math.random() * 60) + 30,
      workout_duration_minutes: i % 3 === 0 ? Math.floor(Math.random() * 30) + 20 : undefined,
      workout_type: i % 3 === 0 ? 'Running' : undefined,
      heart_rate_avg: Math.floor(Math.random() * 40) + 70,
      sleep_hours: undefined,
      points_earned: Math.floor(Math.random() * 40) + 10,
      synced_at: new Date(),
      created_at: date
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageTransition>
        <main className="flex-1">
          <WellnessDashboard
            userId={userId}
            stats={isConnected ? mockStats : undefined}
            activities={isConnected ? mockActivities : []}
            isConnected={isConnected}
          />
        </main>
      </PageTransition>
      <ChatbotButton />
      <Footer />
    </div>
  )
}
