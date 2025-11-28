"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PremiumComparisonChart } from "@/components/charts/premium-comparison-chart"
import { CoverageBreakdownChart } from "@/components/charts/coverage-breakdown-chart"
import { PremiumTrendChart } from "@/components/charts/premium-trend-chart"
import { PolicyRadarChart } from "@/components/charts/policy-radar-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Shield, IndianRupee, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnalyticsData {
  summary: {
    totalPolicies: number
    avgPremium: number
    avgCoverage: number
    avgCSR: number
  }
  topPolicies: {
    byPopularity: Array<{name: string; company: string; premium: number; coverage: number; csr: number; score: number}>
    byCSR: Array<{name: string; company: string; csr: number; premium: number}>
    byValue: Array<{name: string; company: string; premium: number; coverage: number; valueRatio: string}>
  }
  premiumByType: Array<{type: string; avgPremium: number; count: number}>
  premiumTrends: Array<{age: number; avgPremium: number}>
  coverageBreakdown: Array<{category: string; percentage: number}>
  companies: Array<{name: string; csr: number; hospitals: number; rating: number}>
}

// Fallback data for demonstration
const fallbackPremiumData = [
  { name: "Star Health Premier", premium: 18500, coverage: 10, recommended: true },
  { name: "Care Supreme", premium: 15200, coverage: 5 },
  { name: "HDFC Optima Secure", premium: 22000, coverage: 15 },
  { name: "ICICI Lombard", premium: 19800, coverage: 10 },
  { name: "Max Bupa", premium: 16500, coverage: 7.5 }
]

const coverageBreakdownData = [
  { name: "Hospitalization", value: 5, color: "#3b82f6" },
  { name: "Pre & Post Hospitalization", value: 1.5, color: "#10b981" },
  { name: "Day Care Procedures", value: 1, color: "#f59e0b" },
  { name: "Ambulance", value: 0.5, color: "#ef4444" },
  { name: "Home Care Treatment", value: 1, color: "#8b5cf6" },
  { name: "Organ Donor Expenses", value: 1, color: "#ec4899" }
]

const premiumTrendData = [
  { age: 25, premium: 5500, avgMarket: 6200 },
  { age: 30, premium: 7200, avgMarket: 7800 },
  { age: 35, premium: 9500, avgMarket: 10200 },
  { age: 40, premium: 12800, avgMarket: 13500 },
  { age: 45, premium: 16500, avgMarket: 17200 },
  { age: 50, premium: 21500, avgMarket: 22800 },
  { age: 55, premium: 28000, avgMarket: 29500 },
  { age: 60, premium: 36500, avgMarket: 38200 }
]

const radarComparisonData = [
  { category: "Coverage Amount", policy1: 10, policy2: 5, policy3: 15, fullMark: 20 },
  { category: "Network Hospitals", policy1: 8500, policy2: 6000, policy3: 10000, fullMark: 12000 },
  { category: "Claim Settlement", policy1: 95, policy2: 88, policy3: 92, fullMark: 100 },
  { category: "Pre-existing Coverage", policy1: 3, policy2: 2, policy3: 4, fullMark: 5 },
  { category: "No Claim Bonus", policy1: 50, policy2: 30, policy3: 40, fullMark: 100 },
  { category: "Waiting Period", policy1: 2, policy2: 3, policy3: 1, fullMark: 4 }
]

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  async function fetchAnalyticsData() {
    try {
      setLoading(true)
      const response = await fetch('/api/analytics')

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }

      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching analytics:', err)
      setError(err.message)
      // Use fallback/mock data on error
    } finally {
      setLoading(false)
    }
  }

  // Calculate key metrics from real data or fallback
  const totalPoliciesCompared = data?.summary.totalPolicies || fallbackPremiumData.length
  const avgPremium = data?.summary.avgPremium || Math.round(
    fallbackPremiumData.reduce((acc, p) => acc + p.premium, 0) / fallbackPremiumData.length
  )
  const avgCoverage = data?.summary.avgCoverage || parseFloat((
    fallbackPremiumData.reduce((acc, p) => acc + p.coverage, 0) / fallbackPremiumData.length
  ).toFixed(1))

  const premiumComparisonData = data?.topPolicies.byPopularity.map(p => ({
    name: p.name,
    premium: p.premium,
    coverage: p.coverage,
    recommended: p.score > 90
  })) || fallbackPremiumData

  const bestValue = premiumComparisonData.reduce((best, current) => {
    const bestRatio = best.coverage / (best.premium / 10000)
    const currentRatio = current.coverage / (current.premium / 10000)
    return currentRatio > bestRatio ? current : best
  })

  const coverageBreakdownData = data?.coverageBreakdown.map((item, idx) => ({
    name: item.category,
    value: item.percentage / 10, // Convert percentage to value
    color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][idx % 6]
  })) || [
    { name: "Hospitalization", value: 5, color: "#3b82f6" },
    { name: "Pre & Post Hospitalization", value: 1.5, color: "#10b981" },
    { name: "Day Care Procedures", value: 1, color: "#f59e0b" },
    { name: "Ambulance", value: 0.5, color: "#ef4444" },
    { name: "Home Care Treatment", value: 1, color: "#8b5cf6" },
    { name: "Organ Donor Expenses", value: 1, color: "#ec4899" }
  ]

  const premiumTrendData = data?.premiumTrends || radarComparisonData

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-lg text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8 space-y-8">
      {/* Header with Refresh */}
      {data && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Live Analytics Dashboard</h3>
            <p className="text-sm text-gray-600 mt-1">Real-time data from {data.summary.totalPolicies} insurance policies</p>
          </div>
          <Button
            onClick={fetchAnalyticsData}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <p><strong>Notice:</strong> Could not load live data. Showing sample data instead.</p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Policies Analyzed
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoliciesCompared}</div>
              <p className="text-xs text-muted-foreground">
                Active comparisons
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Premium
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{avgPremium.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">
                Per year
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Coverage
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{avgCoverage}L</div>
              <p className="text-xs text-muted-foreground">
                Sum insured
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Best Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate text-sm sm:text-2xl">
                {bestValue.name.split(' ')[0]}
              </div>
              <p className="text-xs text-muted-foreground">
                {bestValue.coverage}L @ ₹{(bestValue.premium/1000).toFixed(0)}k
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PremiumComparisonChart
                data={premiumComparisonData}
                showCoverage={true}
              />
              <CoverageBreakdownChart
                data={coverageBreakdownData}
              />
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <PremiumComparisonChart
              data={premiumComparisonData}
              title="Detailed Premium Analysis"
              description="Compare premiums and coverage across all policies"
              showCoverage={true}
            />
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <PremiumTrendChart
              data={premiumTrendData}
              policyName="Star Health Premier"
              showMarketAverage={true}
            />
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <PolicyRadarChart
              data={radarComparisonData}
              policy1Name="Star Health Premier"
              policy2Name="Care Supreme"
              policy3Name="HDFC Optima Secure"
            />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Insights</CardTitle>
            <CardDescription>
              Key recommendations based on your policy analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
              <div>
                <p className="font-semibold text-blue-900 text-sm">Best Value Policy</p>
                <p className="text-sm text-blue-800 mt-1">
                  {bestValue.name} offers the best coverage-to-premium ratio at {bestValue.coverage}L
                  coverage for ₹{bestValue.premium.toLocaleString('en-IN')}/year.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
              <div>
                <p className="font-semibold text-green-900 text-sm">Premium Savings Opportunity</p>
                <p className="text-sm text-green-800 mt-1">
                  You could save up to ₹{(maxPremium - minPremium).toLocaleString('en-IN')}
                  annually by choosing a more affordable policy with similar coverage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
              <div>
                <p className="font-semibold text-purple-900 text-sm">Age-Based Recommendation</p>
                <p className="text-sm text-purple-800 mt-1">
                  Premium trends show significant increases after age 40. Consider purchasing
                  comprehensive coverage early to lock in lower rates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Helper to calculate min/max premiums
const minPremium = Math.min(...premiumComparisonData.map(p => p.premium))
const maxPremium = Math.max(...premiumComparisonData.map(p => p.premium))
