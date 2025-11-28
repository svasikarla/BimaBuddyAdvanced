import { NextResponse } from 'next/server'
import { supabase, logger } from '@/lib/supabase'

/**
 * GET /api/analytics
 * Fetch aggregated analytics data for the analytics dashboard
 * Returns: policy statistics, premium trends, coverage breakdown, comparisons
 */
export async function GET(request: Request) {
  try {
    logger.INFO('Fetching analytics data')

    // Fetch all active policies for analysis
    const { data: policies, error } = await supabase
      .from('insurance_policies')
      .select(`
        id,
        company_name,
        policy_name,
        type_of_plan,
        sum_insured_min,
        sum_insured_max,
        annual_premium,
        claim_settlement_ratio,
        network_hospitals_count,
        cashless_hospitals_count,
        pre_hospitalization_days,
        post_hospitalization_days,
        co_payment,
        renewal_bonus_percentage,
        restoration_benefit,
        popularity_score
      `)
      .eq('is_active', true)
      .order('popularity_score', { ascending: false })

    if (error) {
      logger.ERROR('Error fetching analytics data', error)
      return NextResponse.json(
        { error: 'Failed to fetch analytics', details: error.message },
        { status: 500 }
      )
    }

    // Calculate aggregate statistics
    const totalPolicies = policies.length
    const avgPremium = Math.round(
      policies.reduce((sum, p) => sum + p.annual_premium, 0) / totalPolicies
    )
    const avgCoverage = Math.round(
      policies.reduce((sum, p) => sum + p.sum_insured_max, 0) / totalPolicies / 100000
    ) // In lakhs
    const avgCSR = (
      policies.reduce((sum, p) => sum + p.claim_settlement_ratio, 0) / totalPolicies
    ).toFixed(2)

    // Top 5 policies by different criteria
    const topByPopularity = policies.slice(0, 5).map(p => ({
      name: p.policy_name,
      company: p.company_name,
      premium: p.annual_premium,
      coverage: p.sum_insured_max / 100000, // Convert to lakhs
      csr: p.claim_settlement_ratio,
      score: p.popularity_score
    }))

    const topByCSR = [...policies]
      .sort((a, b) => b.claim_settlement_ratio - a.claim_settlement_ratio)
      .slice(0, 5)
      .map(p => ({
        name: p.policy_name,
        company: p.company_name,
        csr: p.claim_settlement_ratio,
        premium: p.annual_premium
      }))

    const topByValue = [...policies]
      .map(p => ({
        ...p,
        valueRatio: (p.sum_insured_max / 100000) / (p.annual_premium / 10000)
      }))
      .sort((a, b) => b.valueRatio - a.valueRatio)
      .slice(0, 5)
      .map(p => ({
        name: p.policy_name,
        company: p.company_name,
        premium: p.annual_premium,
        coverage: p.sum_insured_max / 100000,
        valueRatio: p.valueRatio.toFixed(2)
      }))

    // Premium distribution by plan type
    const planTypes = ['Individual', 'Family Floater', 'Senior Citizen']
    const premiumByType = planTypes.map(type => {
      const typePolicies = policies.filter(p => p.type_of_plan === type)
      return {
        type,
        avgPremium: typePolicies.length > 0
          ? Math.round(typePolicies.reduce((sum, p) => sum + p.annual_premium, 0) / typePolicies.length)
          : 0,
        count: typePolicies.length
      }
    })

    // Premium trends by age (simulated for different age groups)
    const premiumTrendData = [
      { age: 25, avgPremium: 6500 },
      { age: 30, avgPremium: 7800 },
      { age: 35, avgPremium: 9500 },
      { age: 40, avgPremium: 12000 },
      { age: 45, avgPremium: 15500 },
      { age: 50, avgPremium: 19000 },
      { age: 55, avgPremium: 24000 },
      { age: 60, avgPremium: 32000 }
    ]

    // Coverage breakdown (typical distribution)
    const coverageBreakdown = [
      { category: 'Hospitalization', percentage: 50 },
      { category: 'Pre & Post Hospitalization', percentage: 15 },
      { category: 'Day Care Procedures', percentage: 10 },
      { category: 'Ambulance', percentage: 5 },
      { category: 'Home Care Treatment', percentage: 10 },
      { category: 'Other Benefits', percentage: 10 }
    ]

    // Company-wise statistics
    const companyStats = await getCompanyStatistics()

    logger.INFO('Successfully generated analytics data', {
      totalPolicies,
      avgPremium,
      avgCoverage
    })

    return NextResponse.json({
      success: true,
      summary: {
        totalPolicies,
        avgPremium,
        avgCoverage,
        avgCSR: parseFloat(avgCSR)
      },
      topPolicies: {
        byPopularity: topByPopularity,
        byCSR: topByCSR,
        byValue: topByValue
      },
      premiumByType,
      premiumTrends: premiumTrendData,
      coverageBreakdown,
      companies: companyStats
    })

  } catch (error: any) {
    logger.ERROR('Unexpected error in analytics API', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * Get company-wise statistics
 */
async function getCompanyStatistics() {
  try {
    const { data: companies, error } = await supabase
      .from('insurance_companies')
      .select(`
        id,
        company_name,
        claim_settlement_ratio,
        network_hospitals_count,
        rating,
        is_active
      `)
      .eq('is_active', true)
      .order('claim_settlement_ratio', { ascending: false })

    if (error) {
      logger.ERROR('Error fetching company stats', error)
      return []
    }

    return companies.map(c => ({
      name: c.company_name,
      csr: c.claim_settlement_ratio,
      hospitals: c.network_hospitals_count,
      rating: c.rating
    }))

  } catch (error) {
    logger.ERROR('Error in getCompanyStatistics', error)
    return []
  }
}
