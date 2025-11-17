"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  TrendingUp,
  Clock,
  DollarSign,
  AlertCircle,
  Upload,
  ChevronRight,
  Award,
  Target
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { claimIntelligenceService } from '@/lib/claim-intelligence-service'
import type { ClaimPredictionInput, ClaimPredictionResult, ClaimType } from '@/lib/types/claim-intelligence'
import { formatCurrency } from '@/lib/language-utils'

export function ClaimPredictorPro() {
  const [step, setStep] = useState(1)
  const [prediction, setPrediction] = useState<ClaimPredictionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Partial<ClaimPredictionInput>>({
    policy_type: 'individual',
    coverage_amount: 500000,
    policy_tenure_months: 12,
    waiting_period_completed: true,
    claim_type: 'hospitalization',
    hospital_tier: 'network',
    cashless_facility: true,
    patient_age: 35,
    pre_existing_condition: false,
    previous_claims_count: 0,
    claim_filing_days_after_discharge: 5,
    policy_active_months: 12,
    documents_submitted: 8,
    documents_required: 10,
    critical_documents_missing: 0
  })

  const handleInputChange = (field: keyof ClaimPredictionInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const analyzeClaim = () => {
    setIsAnalyzing(true)

    // Simulate API call
    setTimeout(() => {
      const input = formData as ClaimPredictionInput
      const result = claimIntelligenceService.predictClaimApproval(input)
      setPrediction(result)
      setIsAnalyzing(false)
      setStep(4) // Go to results
    }, 2000)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'very_high': return 'text-red-600 bg-red-50 border-red-200'
      default: return ''
    }
  }

  const getApprovalColor = (probability: number) => {
    if (probability >= 70) return 'text-green-600'
    if (probability >= 50) return 'text-yellow-600'
    if (probability >= 30) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  s <= step
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-16 md:w-32 h-1 mx-2 transition-colors ${
                    s < step ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Policy Details */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Policy Details</CardTitle>
                <CardDescription>Enter your health insurance policy information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Policy Type</Label>
                    <Select
                      value={formData.policy_type}
                      onValueChange={(v) => handleInputChange('policy_type', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="family_floater">Family Floater</SelectItem>
                        <SelectItem value="senior_citizen">Senior Citizen</SelectItem>
                        <SelectItem value="critical_illness">Critical Illness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Sum Insured (Coverage Amount)</Label>
                    <Input
                      type="number"
                      value={formData.coverage_amount}
                      onChange={(e) => handleInputChange('coverage_amount', parseInt(e.target.value))}
                      placeholder="500000"
                    />
                  </div>

                  <div>
                    <Label>Policy Tenure (Months)</Label>
                    <Input
                      type="number"
                      value={formData.policy_tenure_months}
                      onChange={(e) => handleInputChange('policy_tenure_months', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Policy Active Since (Months)</Label>
                    <Input
                      type="number"
                      value={formData.policy_active_months}
                      onChange={(e) => handleInputChange('policy_active_months', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="waiting_period"
                      checked={formData.waiting_period_completed}
                      onChange={(e) => handleInputChange('waiting_period_completed', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="waiting_period">Waiting Period Completed</Label>
                  </div>
                </div>

                <Button onClick={() => setStep(2)} className="w-full">
                  Next: Claim Details <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Claim Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Claim Details</CardTitle>
                <CardDescription>Provide information about your claim</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Claim Type</Label>
                    <Select
                      value={formData.claim_type}
                      onValueChange={(v) => handleInputChange('claim_type', v as ClaimType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hospitalization">Hospitalization</SelectItem>
                        <SelectItem value="day_care">Day Care Procedure</SelectItem>
                        <SelectItem value="pre_hospitalization">Pre-Hospitalization</SelectItem>
                        <SelectItem value="post_hospitalization">Post-Hospitalization</SelectItem>
                        <SelectItem value="ambulance">Ambulance</SelectItem>
                        <SelectItem value="maternity">Maternity</SelectItem>
                        <SelectItem value="critical_illness">Critical Illness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Claim Amount</Label>
                    <Input
                      type="number"
                      value={formData.claim_amount}
                      onChange={(e) => handleInputChange('claim_amount', parseInt(e.target.value))}
                      placeholder="150000"
                    />
                  </div>

                  <div>
                    <Label>Diagnosis</Label>
                    <Input
                      value={formData.diagnosis}
                      onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                      placeholder="e.g., Appendicitis"
                    />
                  </div>

                  <div>
                    <Label>Treatment Type</Label>
                    <Input
                      value={formData.treatment_type}
                      onChange={(e) => handleInputChange('treatment_type', e.target.value)}
                      placeholder="e.g., Surgical"
                    />
                  </div>

                  <div>
                    <Label>Hospitalization Days</Label>
                    <Input
                      type="number"
                      value={formData.hospitalization_days}
                      onChange={(e) => handleInputChange('hospitalization_days', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Days Since Discharge</Label>
                    <Input
                      type="number"
                      value={formData.claim_filing_days_after_discharge}
                      onChange={(e) => handleInputChange('claim_filing_days_after_discharge', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="surgery"
                      checked={formData.surgery_performed}
                      onChange={(e) => handleInputChange('surgery_performed', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="surgery">Surgery Performed</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="pre_existing"
                      checked={formData.pre_existing_condition}
                      onChange={(e) => handleInputChange('pre_existing_condition', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="pre_existing">Pre-existing Condition</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => setStep(1)} variant="outline" className="w-full">
                    Previous
                  </Button>
                  <Button onClick={() => setStep(3)} className="w-full">
                    Next: Hospital & Documents <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Hospital & Documents */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Hospital & Documentation</CardTitle>
                <CardDescription>Hospital and document details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Hospital Name</Label>
                    <Input
                      value={formData.hospital_name}
                      onChange={(e) => handleInputChange('hospital_name', e.target.value)}
                      placeholder="e.g., Apollo Hospital"
                    />
                  </div>

                  <div>
                    <Label>Hospital Type</Label>
                    <Select
                      value={formData.hospital_tier}
                      onValueChange={(v) => handleInputChange('hospital_tier', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preferred">Preferred Network</SelectItem>
                        <SelectItem value="network">Network Hospital</SelectItem>
                        <SelectItem value="non_network">Non-Network</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Documents Submitted</Label>
                    <Input
                      type="number"
                      value={formData.documents_submitted}
                      onChange={(e) => handleInputChange('documents_submitted', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Documents Required</Label>
                    <Input
                      type="number"
                      value={formData.documents_required}
                      onChange={(e) => handleInputChange('documents_required', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Critical Documents Missing</Label>
                    <Input
                      type="number"
                      value={formData.critical_documents_missing}
                      onChange={(e) => handleInputChange('critical_documents_missing', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Patient Age</Label>
                    <Input
                      type="number"
                      value={formData.patient_age}
                      onChange={(e) => handleInputChange('patient_age', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Previous Claims Count</Label>
                    <Input
                      type="number"
                      value={formData.previous_claims_count}
                      onChange={(e) => handleInputChange('previous_claims_count', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="cashless"
                      checked={formData.cashless_facility}
                      onChange={(e) => handleInputChange('cashless_facility', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="cashless">Cashless Facility</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => setStep(2)} variant="outline" className="w-full">
                    Previous
                  </Button>
                  <Button onClick={analyzeClaim} className="w-full" disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>Analyzing Claim...</>
                    ) : (
                      <>Predict Claim Outcome <Target className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Results */}
        {step === 4 && prediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="factors">Factors</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                {/* Approval Probability Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Claim Approval Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className={`text-6xl font-bold mb-4 ${getApprovalColor(prediction.approval_probability)}`}>
                        {prediction.approval_probability}%
                      </div>
                      <p className="text-lg text-muted-foreground mb-4">
                        {prediction.predicted_status === 'likely_approved' && 'Likely to be Approved'}
                        {prediction.predicted_status === 'likely_partial' && 'Likely Partial Approval'}
                        {prediction.predicted_status === 'likely_rejected' && 'High Risk of Rejection'}
                      </p>
                      <Badge className={getRiskColor(prediction.risk_level)} variant="outline">
                        {prediction.risk_level.replace('_', ' ').toUpperCase()} RISK
                      </Badge>
                    </div>

                    <Progress value={prediction.approval_probability} className="h-3 mb-2" />
                    <p className="text-sm text-center text-muted-foreground">
                      Confidence: {prediction.confidence_score}%
                    </p>
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Processing Time</span>
                      </div>
                      <p className="text-2xl font-bold">{prediction.estimated_processing_days} days</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Est. Approval Amount</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {formatCurrency(prediction.estimated_approval_amount || 0)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Missing Documents</span>
                      </div>
                      <p className="text-2xl font-bold">{prediction.missing_documents.length}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Similar Cases */}
                {prediction.similar_cases_count > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Similar Cases
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-2">
                        Based on analysis of {prediction.similar_cases_count} similar claims
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress value={prediction.similar_cases_approval_rate} className="h-2" />
                        </div>
                        <span className="text-lg font-semibold">
                          {prediction.similar_cases_approval_rate}% approved
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Factors Tab */}
              <TabsContent value="factors">
                <Card>
                  <CardHeader>
                    <CardTitle>Factors Affecting Your Claim</CardTitle>
                    <CardDescription>
                      Detailed analysis of all factors considered in the prediction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {prediction.factors.map((factor, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg border"
                        >
                          {factor.impact === 'positive' && (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          )}
                          {factor.impact === 'negative' && (
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          )}
                          {factor.impact === 'neutral' && (
                            <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{factor.factor}</h4>
                            <p className="text-sm text-muted-foreground">{factor.description}</p>
                            <div className="mt-2">
                              <Progress
                                value={factor.weight * 100}
                                className="h-1"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Impact Weight: {Math.round(factor.weight * 100)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle>Actionable Recommendations</CardTitle>
                    <CardDescription>
                      Follow these steps to improve your claim approval chances
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {prediction.recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-l-4 ${
                            rec.priority === 'critical'
                              ? 'border-red-500 bg-red-50'
                              : rec.priority === 'high'
                              ? 'border-orange-500 bg-orange-50'
                              : rec.priority === 'medium'
                              ? 'border-yellow-500 bg-yellow-50'
                              : 'border-blue-500 bg-blue-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant={rec.priority === 'critical' ? 'destructive' : 'secondary'}
                                >
                                  {rec.priority.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {rec.category}
                                </span>
                              </div>
                              <h4 className="font-semibold mb-1">{rec.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {rec.description}
                              </p>
                              <div className="bg-white p-2 rounded border">
                                <p className="text-sm font-medium">Action Required:</p>
                                <p className="text-sm">{rec.action_required}</p>
                              </div>
                            </div>
                            <div className="ml-4 text-right">
                              <div className="text-2xl font-bold text-green-600">
                                +{rec.impact_on_approval}%
                              </div>
                              <p className="text-xs text-muted-foreground">Impact</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 mt-6">
              <Button onClick={() => { setStep(1); setPrediction(null); }} variant="outline" className="w-full">
                Start New Prediction
              </Button>
              <Button className="w-full">
                Download Report
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
