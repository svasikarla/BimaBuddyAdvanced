"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Award,
  TrendingUp,
  FileText
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { ClaimCase, ClaimStatus } from '@/lib/types/claim-intelligence'
import { formatCurrency } from '@/lib/language-utils'

interface ClaimSimilarCasesProps {
  cases: ClaimCase[]
  currentDiagnosis?: string
}

// Mock data for demonstration
const MOCK_CASES: ClaimCase[] = [
  {
    id: '1',
    diagnosis: 'Appendicitis',
    claim_amount: 125000,
    approved_amount: 120000,
    status: 'approved',
    hospital_type: 'network',
    processing_days: 12,
    documents_submitted: [
      'hospital_bill',
      'discharge_summary',
      'diagnostic_reports',
      'claim_form',
      'policy_copy',
      'id_proof',
      'cancelled_cheque'
    ],
    success_factors: [
      'Cashless treatment at network hospital',
      'All documents submitted within 7 days',
      'Clear diagnostic reports',
      'No pre-existing condition'
    ],
    user_testimonial: 'Smooth process. Got approval in 12 days without any follow-up.',
    similarity_score: 95
  },
  {
    id: '2',
    diagnosis: 'Appendectomy (Surgery)',
    claim_amount: 180000,
    approved_amount: 140000,
    status: 'partial_approval',
    hospital_type: 'network',
    processing_days: 18,
    documents_submitted: [
      'hospital_bill',
      'discharge_summary',
      'diagnostic_reports',
      'claim_form',
      'policy_copy'
    ],
    failure_reasons: [
      'Some pharmacy bills not submitted',
      'Room rent exceeded policy limit',
      'ICU charges partially covered'
    ],
    user_testimonial: 'Got 78% of claim amount. Room upgrade caused partial denial.',
    similarity_score: 88
  },
  {
    id: '3',
    diagnosis: 'Acute Appendicitis with Peritonitis',
    claim_amount: 210000,
    approved_amount: 210000,
    status: 'approved',
    hospital_type: 'preferred',
    processing_days: 10,
    documents_submitted: [
      'hospital_bill',
      'discharge_summary',
      'diagnostic_reports',
      'prescriptions',
      'doctor_consultation',
      'pharmacy_bills',
      'claim_form',
      'policy_copy',
      'id_proof',
      'cancelled_cheque'
    ],
    success_factors: [
      'Preferred network hospital',
      'Emergency admission with proper documentation',
      'Complete medical records',
      'Timely submission (3 days after discharge)'
    ],
    user_testimonial: 'Emergency surgery approved 100%. Excellent hospital support.',
    similarity_score: 92
  },
  {
    id: '4',
    diagnosis: 'Appendicitis',
    claim_amount: 95000,
    approved_amount: 0,
    status: 'rejected',
    hospital_type: 'non_network',
    processing_days: 25,
    documents_submitted: [
      'hospital_bill',
      'discharge_summary',
      'claim_form'
    ],
    failure_reasons: [
      'Non-network hospital without pre-approval',
      'Incomplete documentation',
      'Claim filed 45 days after discharge',
      'Missing diagnostic reports and prescriptions'
    ],
    user_testimonial: 'Rejected due to non-network hospital and late filing. Learned the hard way.',
    similarity_score: 75
  }
]

const getStatusColor = (status: ClaimStatus) => {
  switch (status) {
    case 'approved':
    case 'settled':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'partial_approval':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getApprovalRate = (approved: number, claimed: number) => {
  return Math.round((approved / claimed) * 100)
}

export function ClaimSimilarCases({ cases = MOCK_CASES, currentDiagnosis }: ClaimSimilarCasesProps) {
  // Calculate overall statistics
  const totalCases = cases.length
  const approvedCases = cases.filter(c => c.status === 'approved' || c.status === 'partial_approval').length
  const approvalRate = totalCases > 0 ? Math.round((approvedCases / totalCases) * 100) : 0

  const avgProcessingDays =
    totalCases > 0
      ? Math.round(cases.reduce((sum, c) => sum + c.processing_days, 0) / totalCases)
      : 0

  const totalClaimed = cases.reduce((sum, c) => sum + c.claim_amount, 0)
  const totalApproved = cases.reduce((sum, c) => sum + c.approved_amount, 0)
  const avgApprovalRate = totalClaimed > 0 ? Math.round((totalApproved / totalClaimed) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Overall Approval Rate</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{approvalRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {approvedCases} of {totalCases} cases approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Avg Processing Time</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{avgProcessingDays} days</p>
            <p className="text-xs text-muted-foreground mt-1">From submission to settlement</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Avg Approval Amount</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">{avgApprovalRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Of claimed amount on average</p>
          </CardContent>
        </Card>
      </div>

      {/* Case Studies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Similar Case Studies
          </CardTitle>
          <CardDescription>
            {currentDiagnosis
              ? `Historical cases similar to ${currentDiagnosis}`
              : 'Historical cases from our database'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cases.map((caseData, index) => {
              const approvalPercentage = getApprovalRate(
                caseData.approved_amount,
                caseData.claim_amount
              )

              return (
                <motion.div
                  key={caseData.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-5 border rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{caseData.diagnosis}</h3>
                        {caseData.similarity_score && (
                          <Badge variant="outline" className="text-xs">
                            {caseData.similarity_score}% match
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(caseData.status)} variant="outline">
                          {caseData.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {caseData.hospital_type.replace('_', ' ')} hospital
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {caseData.processing_days} days
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="grid grid-cols-2 gap-4 mb-3 p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Claimed Amount</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(caseData.claim_amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Approved Amount</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(caseData.approved_amount)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Approval Rate</span>
                      <span className="font-semibold">{approvalPercentage}%</span>
                    </div>
                    <Progress
                      value={approvalPercentage}
                      className={`h-2 ${
                        approvalPercentage >= 90
                          ? 'bg-green-100'
                          : approvalPercentage >= 50
                          ? 'bg-yellow-100'
                          : 'bg-red-100'
                      }`}
                    />
                  </div>

                  {/* Documents */}
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-2">Documents Submitted:</p>
                    <div className="flex flex-wrap gap-1">
                      {caseData.documents_submitted.map((doc) => (
                        <Badge key={doc} variant="outline" className="text-xs">
                          {doc.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Success Factors / Failure Reasons */}
                  {caseData.success_factors && caseData.success_factors.length > 0 && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Success Factors
                      </p>
                      <ul className="space-y-1">
                        {caseData.success_factors.map((factor, i) => (
                          <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {caseData.failure_reasons && caseData.failure_reasons.length > 0 && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-1">
                        <XCircle className="h-4 w-4" />
                        Reasons for Rejection/Partial Approval
                      </p>
                      <ul className="space-y-1">
                        {caseData.failure_reasons.map((reason, i) => (
                          <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                            <span className="text-red-600 mt-0.5">✗</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Testimonial */}
                  {caseData.user_testimonial && (
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p className="text-sm text-blue-900 italic">
                        "{caseData.user_testimonial}"
                      </p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {cases.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No similar cases found in our database yet.</p>
              <p className="text-sm">Be the first to contribute your case study!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
