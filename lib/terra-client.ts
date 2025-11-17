/**
 * Terra API Client
 * Unified wellness data aggregator supporting 150+ devices
 * Documentation: https://docs.tryterra.co
 */

import { api } from './api'
import type {
  TerraAuthResponse,
  TerraWebhookPayload,
  WellnessProvider,
  WellnessActivity
} from './types/wellness'

const TERRA_API_URL = 'https://api.tryterra.co/v2'
const TERRA_DEV_ID = process.env.NEXT_PUBLIC_TERRA_DEV_ID || ''
const TERRA_API_KEY = process.env.TERRA_API_KEY || ''

export interface TerraConfig {
  dev_id: string
  api_key: string
}

export class TerraClient {
  private config: TerraConfig

  constructor(config?: TerraConfig) {
    this.config = config || {
      dev_id: TERRA_DEV_ID,
      api_key: TERRA_API_KEY
    }
  }

  /**
   * Get authentication headers for Terra API
   */
  private getHeaders(): Record<string, string> {
    return {
      'dev-id': this.config.dev_id,
      'x-api-key': this.config.api_key,
      'Content-Type': 'application/json'
    }
  }

  /**
   * Generate widget session for user authentication
   * This creates a session token that can be used with Terra Widget
   */
  async generateWidgetSession(params: {
    reference_id: string // Your internal user ID
    providers?: WellnessProvider[]
    language?: string
    auth_success_redirect_url?: string
    auth_failure_redirect_url?: string
  }): Promise<{ session_id: string; url: string }> {
    try {
      const response = await fetch(`${TERRA_API_URL}/auth/generateWidgetSession`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          reference_id: params.reference_id,
          providers: params.providers || ['FITBIT', 'GOOGLE', 'APPLE', 'GARMIN'],
          language: params.language || 'en',
          auth_success_redirect_url: params.auth_success_redirect_url || `${process.env.NEXT_PUBLIC_APP_URL}/wellness/callback?success=true`,
          auth_failure_redirect_url: params.auth_failure_redirect_url || `${process.env.NEXT_PUBLIC_APP_URL}/wellness/callback?success=false`
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate widget session')
      }

      return {
        session_id: data.session_id,
        url: data.url
      }
    } catch (error: any) {
      console.error('Terra widget session error:', error)
      throw error
    }
  }

  /**
   * Get user info from Terra
   */
  async getUser(terra_user_id: string): Promise<any> {
    try {
      const response = await fetch(`${TERRA_API_URL}/user?user_id=${terra_user_id}`, {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      return await response.json()
    } catch (error: any) {
      console.error('Terra get user error:', error)
      throw error
    }
  }

  /**
   * Get daily activity data
   */
  async getDailyActivity(params: {
    user_id: string
    start_date: string // YYYY-MM-DD
    end_date: string // YYYY-MM-DD
  }): Promise<any> {
    try {
      const url = `${TERRA_API_URL}/daily?user_id=${params.user_id}&start_date=${params.start_date}&end_date=${params.end_date}`

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to fetch daily activity')
      }

      return await response.json()
    } catch (error: any) {
      console.error('Terra daily activity error:', error)
      throw error
    }
  }

  /**
   * Get activity/workout data
   */
  async getActivity(params: {
    user_id: string
    start_date: string
    end_date: string
  }): Promise<any> {
    try {
      const url = `${TERRA_API_URL}/activity?user_id=${params.user_id}&start_date=${params.start_date}&end_date=${params.end_date}`

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to fetch activity data')
      }

      return await response.json()
    } catch (error: any) {
      console.error('Terra activity error:', error)
      throw error
    }
  }

  /**
   * Get sleep data
   */
  async getSleep(params: {
    user_id: string
    start_date: string
    end_date: string
  }): Promise<any> {
    try {
      const url = `${TERRA_API_URL}/sleep?user_id=${params.user_id}&start_date=${params.start_date}&end_date=${params.end_date}`

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to fetch sleep data')
      }

      return await response.json()
    } catch (error: any) {
      console.error('Terra sleep error:', error)
      throw error
    }
  }

  /**
   * Get body metrics (weight, BMI, etc.)
   */
  async getBody(params: {
    user_id: string
    start_date: string
    end_date: string
  }): Promise<any> {
    try {
      const url = `${TERRA_API_URL}/body?user_id=${params.user_id}&start_date=${params.start_date}&end_date=${params.end_date}`

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to fetch body data')
      }

      return await response.json()
    } catch (error: any) {
      console.error('Terra body error:', error)
      throw error
    }
  }

  /**
   * Deauthenticate user and disconnect their data source
   */
  async deauthUser(terra_user_id: string): Promise<boolean> {
    try {
      const response = await fetch(`${TERRA_API_URL}/auth/deauthenticateUser`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        body: JSON.stringify({
          user_id: terra_user_id
        })
      })

      return response.ok
    } catch (error: any) {
      console.error('Terra deauth error:', error)
      throw error
    }
  }

  /**
   * Subscribe to webhook updates
   */
  async subscribeWebhook(webhook_url: string): Promise<boolean> {
    try {
      const response = await fetch(`${TERRA_API_URL}/subscriptions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          webhook_url,
          event_types: ['daily', 'activity', 'sleep', 'body']
        })
      })

      return response.ok
    } catch (error: any) {
      console.error('Terra webhook subscription error:', error)
      throw error
    }
  }

  /**
   * Verify webhook signature for security
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    // Implement HMAC verification
    // Terra sends webhook signatures for security
    // See: https://docs.tryterra.co/reference/using-the-webhooks

    // For now, basic implementation
    // In production, use crypto.createHmac with your webhook secret
    return true // TODO: Implement proper signature verification
  }

  /**
   * Parse Terra webhook payload
   */
  parseWebhookPayload(payload: TerraWebhookPayload): WellnessActivity | null {
    try {
      if (payload.type !== 'daily' && payload.type !== 'activity') {
        return null
      }

      const data = payload.data

      // Extract activity data from Terra format
      return {
        id: '', // Will be generated by database
        user_id: payload.user.user_id,
        provider: this.mapTerraProvider(payload.user.provider),
        date: new Date(data.metadata?.start_time || data.metadata?.date),
        steps: data.distance_data?.steps || 0,
        distance_meters: data.distance_data?.distance_meters || 0,
        calories_burned: data.calories_data?.total_burned_calories || 0,
        active_minutes: data.active_durations_data?.activity_seconds
          ? Math.round(data.active_durations_data.activity_seconds / 60)
          : 0,
        workout_duration_minutes: data.metadata?.duration_seconds
          ? Math.round(data.metadata.duration_seconds / 60)
          : undefined,
        workout_type: data.metadata?.name,
        heart_rate_avg: data.heart_rate_data?.summary?.avg_hr_bpm,
        sleep_hours: undefined, // Parsed separately from sleep endpoint
        points_earned: 0, // Calculated separately
        synced_at: new Date(),
        created_at: new Date()
      }
    } catch (error) {
      console.error('Error parsing Terra webhook:', error)
      return null
    }
  }

  /**
   * Map Terra provider names to our internal provider type
   */
  private mapTerraProvider(terraProvider: string): WellnessProvider {
    const providerMap: Record<string, WellnessProvider> = {
      'FITBIT': 'fitbit',
      'GOOGLE': 'google_fit',
      'APPLE': 'apple_health',
      'GARMIN': 'garmin'
    }

    return providerMap[terraProvider] || 'terra'
  }
}

// Export singleton instance
export const terraClient = new TerraClient()

/**
 * Helper function to format date for Terra API
 */
export function formatTerraDate(date: Date): string {
  return date.toISOString().split('T')[0] // YYYY-MM-DD
}

/**
 * Get date range for querying Terra
 */
export function getTerraDateRange(days: number = 30): { start_date: string; end_date: string } {
  const end_date = new Date()
  const start_date = new Date()
  start_date.setDate(start_date.getDate() - days)

  return {
    start_date: formatTerraDate(start_date),
    end_date: formatTerraDate(end_date)
  }
}
