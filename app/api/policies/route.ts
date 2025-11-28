import { NextResponse } from 'next/server'
import { supabase, logger } from '@/lib/supabase'

/**
 * GET /api/policies
 * Fetch insurance policies with optional filters
 * Query params:
 * - type: 'Individual' | 'Family Floater' | 'Senior Citizen'
 * - limit: number (default 10, max 50)
 * - sortBy: 'premium' | 'coverage' | 'csr' | 'popularity' (default 'popularity')
 * - minCoverage: number (in lakhs)
 * - maxPremium: number
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const type = searchParams.get('type') || undefined
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    const sortBy = searchParams.get('sortBy') || 'popularity'
    const minCoverage = searchParams.get('minCoverage')
      ? parseInt(searchParams.get('minCoverage')!) * 100000
      : undefined
    const maxPremium = searchParams.get('maxPremium')
      ? parseInt(searchParams.get('maxPremium')!)
      : undefined

    logger.INFO('Fetching policies with filters', {
      type,
      limit,
      sortBy,
      minCoverage,
      maxPremium
    })

    // Build query
    let query = supabase
      .from('insurance_policies')
      .select(`
        id,
        company_id,
        company_name,
        policy_name,
        type_of_plan,
        sum_insured_min,
        sum_insured_max,
        annual_premium,
        room_rent_limit,
        co_payment,
        pre_hospitalization_days,
        post_hospitalization_days,
        waiting_period_months,
        pre_existing_disease_waiting_period_months,
        network_hospitals_count,
        cashless_hospitals_count,
        claim_settlement_ratio,
        claim_settlement_time_days,
        entry_age_min,
        entry_age_max,
        renewal_age_max,
        policy_term_years,
        renewal_bonus_percentage,
        restoration_benefit,
        popularity_score,
        key_features,
        tax_benefits
      `)
      .eq('is_active', true)

    // Apply filters
    if (type) {
      query = query.eq('type_of_plan', type)
    }

    if (minCoverage) {
      query = query.gte('sum_insured_min', minCoverage)
    }

    if (maxPremium) {
      query = query.lte('annual_premium', maxPremium)
    }

    // Apply sorting
    switch (sortBy) {
      case 'premium':
        query = query.order('annual_premium', { ascending: true })
        break
      case 'coverage':
        query = query.order('sum_insured_max', { ascending: false })
        break
      case 'csr':
        query = query.order('claim_settlement_ratio', { ascending: false })
        break
      case 'popularity':
      default:
        query = query.order('popularity_score', { ascending: false })
        break
    }

    // Apply limit
    query = query.limit(limit)

    const { data, error } = await query

    if (error) {
      logger.ERROR('Error fetching policies', error)
      return NextResponse.json(
        { error: 'Failed to fetch policies', details: error.message },
        { status: 500 }
      )
    }

    logger.INFO('Successfully fetched policies', { count: data?.length || 0 })

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      policies: data || []
    })

  } catch (error: any) {
    logger.ERROR('Unexpected error in policies API', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
