/**
 * API Route: /api/wellness/webhook
 * Receives wellness data updates from Terra via webhooks
 */

import { NextRequest, NextResponse } from 'next/server'
import { terraClient } from '@/lib/terra-client'
import { wellnessService } from '@/lib/wellness-service'
import type { TerraWebhookPayload } from '@/lib/types/wellness'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('terra-signature') || ''

    // Verify webhook signature for security
    const isValid = terraClient.verifyWebhookSignature(body, signature)

    if (!isValid) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const payload: TerraWebhookPayload = JSON.parse(body)

    console.log('Received Terra webhook:', payload.type, payload.user.user_id)

    // Parse webhook payload
    const activity = terraClient.parseWebhookPayload(payload)

    if (!activity) {
      console.log('Webhook type not handled:', payload.type)
      return NextResponse.json({ success: true, message: 'Webhook received but not processed' })
    }

    // Calculate points for this activity
    const points = wellnessService.calculateActivityPoints(activity)
    activity.points_earned = points

    // TODO: Save activity to database
    // Example with Supabase:
    // const { data, error } = await supabase
    //   .from('wellness_activities')
    //   .insert({
    //     user_id: activity.user_id,
    //     provider: activity.provider,
    //     date: activity.date,
    //     steps: activity.steps,
    //     distance_meters: activity.distance_meters,
    //     calories_burned: activity.calories_burned,
    //     active_minutes: activity.active_minutes,
    //     workout_duration_minutes: activity.workout_duration_minutes,
    //     workout_type: activity.workout_type,
    //     heart_rate_avg: activity.heart_rate_avg,
    //     points_earned: activity.points_earned,
    //     synced_at: activity.synced_at
    //   })

    // TODO: Update user's total points
    // const { data: pointsData } = await supabase
    //   .from('wellness_points')
    //   .select('*')
    //   .eq('user_id', activity.user_id)
    //   .single()
    //
    // if (pointsData) {
    //   await supabase
    //     .from('wellness_points')
    //     .update({
    //       total_points: pointsData.total_points + points,
    //       monthly_points: pointsData.monthly_points + points,
    //       updated_at: new Date()
    //     })
    //     .eq('user_id', activity.user_id)
    // }

    console.log(`Activity processed: ${points} points earned for user ${activity.user_id}`)

    return NextResponse.json({
      success: true,
      activity_date: activity.date,
      points_earned: points
    })

  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'wellness-webhook',
    timestamp: new Date().toISOString()
  })
}
