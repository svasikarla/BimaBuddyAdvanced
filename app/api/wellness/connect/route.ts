/**
 * API Route: /api/wellness/connect
 * Generates Terra widget session for user authentication
 */

import { NextRequest, NextResponse } from 'next/server'
import { terraClient } from '@/lib/terra-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, provider } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Generate widget session
    const session = await terraClient.generateWidgetSession({
      reference_id: userId,
      providers: provider ? [provider.toUpperCase()] : undefined,
      language: 'en',
      auth_success_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/wellness/callback?success=true`,
      auth_failure_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/wellness/callback?success=false`
    })

    return NextResponse.json({
      success: true,
      session_id: session.session_id,
      url: session.url
    })

  } catch (error: any) {
    console.error('Terra connect error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate connection session' },
      { status: 500 }
    )
  }
}
