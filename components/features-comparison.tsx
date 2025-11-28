"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "./language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Loader2 } from "lucide-react"

interface Policy {
  id: string
  company_name: string
  policy_name: string
  type_of_plan: string
  annual_premium: number
  sum_insured_max: number
  key_features: string | string[]
  claim_settlement_ratio: number
  network_hospitals_count: number
  pre_hospitalization_days: number
  post_hospitalization_days: number
  co_payment: number
  restoration_benefit: boolean
}

export function FeaturesComparison() {
  const { t } = useLanguage()
  const [policies, setPolicies] = useState<Record<string, Policy[]>>({
    Individual: [],
    'Family Floater': [],
    'Senior Citizen': []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPolicies()
  }, [])

  async function fetchPolicies() {
    try {
      setLoading(true)
      const types = ['Individual', 'Family Floater', 'Senior Citizen']
      const results: Record<string, Policy[]> = {}

      for (const type of types) {
        const response = await fetch(`/api/policies?type=${encodeURIComponent(type)}&limit=2&sortBy=popularity`)
        if (!response.ok) throw new Error(`Failed to fetch ${type} policies`)

        const data = await response.json()
        results[type] = data.policies || []
      }

      setPolicies(results)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching policies:', err)
      setError(err.message || 'Failed to load policies')
      // Fall back to mock data on error
      setPolicies(getFallbackData())
    } finally {
      setLoading(false)
    }
  }

  // Fallback mock data if API fails
  function getFallbackData(): Record<string, Policy[]> {
    const insurancePlans = [
    {
      category: "basic",
      plans: [
        {
          name: "Basic Health Plan",
          provider: "ABC Insurance",
          premium: "₹5,000/year",
          coverage: "₹3 Lakhs",
          features: [
            { name: "Hospitalization", available: true },
            { name: "Pre & Post Hospitalization", available: true },
            { name: "Day Care Procedures", available: true },
            { name: "Ambulance Cover", available: true },
            { name: "Maternity Benefits", available: false },
            { name: "Critical Illness Cover", available: false },
            { name: "No Claim Bonus", available: true },
            { name: "Ayurvedic Treatment", available: false },
          ],
        },
        {
          name: "Essential Care",
          provider: "XYZ Health",
          premium: "₹6,500/year",
          coverage: "₹5 Lakhs",
          features: [
            { name: "Hospitalization", available: true },
            { name: "Pre & Post Hospitalization", available: true },
            { name: "Day Care Procedures", available: true },
            { name: "Ambulance Cover", available: true },
            { name: "Maternity Benefits", available: false },
            { name: "Critical Illness Cover", available: false },
            { name: "No Claim Bonus", available: true },
            { name: "Ayurvedic Treatment", available: true },
          ],
        },
      ],
    },
    {
      category: "family",
      plans: [
        {
          name: "Family Floater",
          provider: "PQR Insurance",
          premium: "₹12,000/year",
          coverage: "₹10 Lakhs",
          features: [
            { name: "Hospitalization", available: true },
            { name: "Pre & Post Hospitalization", available: true },
            { name: "Day Care Procedures", available: true },
            { name: "Ambulance Cover", available: true },
            { name: "Maternity Benefits", available: true },
            { name: "Critical Illness Cover", available: false },
            { name: "No Claim Bonus", available: true },
            { name: "Ayurvedic Treatment", available: true },
          ],
        },
        {
          name: "Complete Family Shield",
          provider: "LMN Health",
          premium: "₹15,000/year",
          coverage: "₹15 Lakhs",
          features: [
            { name: "Hospitalization", available: true },
            { name: "Pre & Post Hospitalization", available: true },
            { name: "Day Care Procedures", available: true },
            { name: "Ambulance Cover", available: true },
            { name: "Maternity Benefits", available: true },
            { name: "Critical Illness Cover", available: true },
            { name: "No Claim Bonus", available: true },
            { name: "Ayurvedic Treatment", available: true },
          ],
        },
      ],
    },
    {
      category: "senior",
      plans: [
        {
          name: "Senior Care",
          provider: "DEF Insurance",
          premium: "₹9,000/year",
          coverage: "₹5 Lakhs",
          features: [
            { name: "Hospitalization", available: true },
            { name: "Pre & Post Hospitalization", available: true },
            { name: "Day Care Procedures", available: true },
            { name: "Ambulance Cover", available: true },
            { name: "Maternity Benefits", available: false },
            { name: "Critical Illness Cover", available: true },
            { name: "No Claim Bonus", available: true },
            { name: "Ayurvedic Treatment", available: true },
          ],
        },
        {
          name: "Golden Years Plus",
          provider: "GHI Health",
          premium: "₹12,500/year",
          coverage: "₹10 Lakhs",
          features: [
            { name: "Hospitalization", available: true },
            { name: "Pre & Post Hospitalization", available: true },
            { name: "Day Care Procedures", available: true },
            { name: "Ambulance Cover", available: true },
            { name: "Maternity Benefits", available: false },
            { name: "Critical Illness Cover", available: true },
            { name: "No Claim Bonus", available: true },
            { name: "Ayurvedic Treatment", available: true },
            { name: "Domiciliary Treatment", available: true },
            { name: "Annual Health Check-up", available: true },
          ],
        },
      ],
    },
  ]

    return insurancePlans.reduce((acc, category) => {
      const type = category.category === 'basic' ? 'Individual' :
                   category.category === 'family' ? 'Family Floater' : 'Senior Citizen'
      acc[type] = category.plans as any
      return acc
    }, {} as Record<string, Policy[]>)
  }

  // Helper to parse key features
  function parseKeyFeatures(keyFeatures: string | string[]): string[] {
    if (Array.isArray(keyFeatures)) return keyFeatures
    if (typeof keyFeatures === 'string') {
      try {
        const parsed = JSON.parse(keyFeatures)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  }

  // Helper to format currency
  function formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}/year`
  }

  // Helper to format coverage
  function formatCoverage(amount: number): string {
    const lakhs = amount / 100000
    if (lakhs >= 10) {
      const crores = lakhs / 100
      return `₹${crores.toFixed(1)} Cr`
    }
    return `₹${lakhs.toFixed(0)} L`
  }

  if (loading) {
    return (
      <section id="features" className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-lg">Loading policies...</span>
        </div>
      </section>
    )
  }

  return (
    <section id="features" className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("features.title")}</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Compare different health insurance plans from leading Indian insurers
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl">
          <Tabs defaultValue="Individual" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="Individual">Individual Plans</TabsTrigger>
              <TabsTrigger value="Family Floater">Family Plans</TabsTrigger>
              <TabsTrigger value="Senior Citizen">Senior Citizen Plans</TabsTrigger>
            </TabsList>
            {Object.entries(policies).map(([planType, planList]) => (
              <TabsContent key={planType} value={planType} className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {planList.map((policy) => {
                    const features = parseKeyFeatures(policy.key_features)
                    return (
                      <Card key={policy.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                          <CardTitle className="text-xl">{policy.policy_name}</CardTitle>
                          <CardDescription className="text-sm font-medium">{policy.company_name}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid gap-6">
                            {/* Premium and Coverage */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col space-y-1">
                                <span className="text-sm font-medium text-gray-500">Annual Premium</span>
                                <span className="text-lg font-bold text-blue-600">{formatCurrency(policy.annual_premium)}</span>
                              </div>
                              <div className="flex flex-col space-y-1">
                                <span className="text-sm font-medium text-gray-500">Max Coverage</span>
                                <span className="text-lg font-bold text-green-600">{formatCoverage(policy.sum_insured_max)}</span>
                              </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{policy.claim_settlement_ratio}%</div>
                                <div className="text-xs text-gray-600">CSR</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{(policy.network_hospitals_count / 1000).toFixed(1)}K</div>
                                <div className="text-xs text-gray-600">Hospitals</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{policy.co_payment * 100}%</div>
                                <div className="text-xs text-gray-600">Co-pay</div>
                              </div>
                            </div>

                            {/* Key Features */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Key Features
                              </h4>
                              <ul className="space-y-2">
                                {features.slice(0, 6).map((feature, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                              {features.length > 6 && (
                                <p className="text-xs text-gray-500 mt-2">
                                  +{features.length - 6} more features
                                </p>
                              )}
                            </div>

                            {/* Additional Info */}
                            <div className="flex items-center justify-between pt-3 border-t text-xs text-gray-600">
                              <span>Pre: {policy.pre_hospitalization_days} days</span>
                              <span>Post: {policy.post_hospitalization_days} days</span>
                              {policy.restoration_benefit && (
                                <span className="text-green-600 font-medium">Restoration ✓</span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                {planList.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No {planType.toLowerCase()} plans available at the moment.
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  )
}
