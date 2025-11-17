/**
 * API Route: /api/wellness/status
 * Check wellness connection status for a user
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const provider = searchParams.get('provider')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // TODO: Check database for connection status
    // Example with Supabase:
    // const { data, error } = await supabase
    //   .from('wellness_connections')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .eq('status', 'active')

    // For now, return mock data
    const mockConnected = false // Change to true when testing

    return NextResponse.json({
      connected: mockConnected,
      provider: provider || null,
      terraUserId: mockConnected ? 'terra_user_123' : null,
      lastSync: mockConnected ? new Date().toISOString() : null
    })

  } catch (error: any) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check status' },
      { status: 500 }
    )
  }
}
