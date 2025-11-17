/**
 * Claim Intelligence Types
 * Advanced claim prediction and document analysis system
 */

export type ClaimStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'partial_approval'
  | 'appeal_pending'
  | 'settled'

export type ClaimType =
  | 'hospitalization'
  | 'day_care'
  | 'pre_hospitalization'
  | 'post_hospitalization'
  | 'ambulance'
  | 'maternity'
  | 'critical_illness'
  | 'organ_transplant'

export type DocumentType =
  | 'hospital_bill'
  | 'discharge_summary'
  | 'prescriptions'
  | 'diagnostic_reports'
  | 'doctor_consultation'
  | 'pharmacy_bills'
  | 'ambulance_bill'
  | 'pre_auth_form'
  | 'claim_form'
  | 'policy_copy'
  | 'id_proof'
  | 'cancelled_cheque'

export interface ClaimDocument {
  type: DocumentType
  required: boolean
  uploaded: boolean
  file_url?: string
  file_name?: string
  upload_date?: Date
  verification_status?: 'pending' | 'verified' | 'rejected'
  rejection_reason?: string
}

export interface ClaimPredictionInput {
  // Policy details
  policy_type: string
  coverage_amount: number
  policy_tenure_months: number
  waiting_period_completed: boolean

  // Claim details
  claim_amount: number
  claim_type: ClaimType
  diagnosis: string
  diagnosis_code?: string // ICD-10 code
  treatment_type: string
  hospitalization_days?: number
  surgery_performed?: boolean

  // Hospital details
  hospital_name: string
  hospital_tier: 'network' | 'non_network' | 'preferred'
  hospital_success_rate?: number
  cashless_facility: boolean

  // Patient details
  patient_age: number
  pre_existing_condition: boolean
  previous_claims_count: number

  // Document completeness
  documents_submitted: number
  documents_required: number
  critical_documents_missing: number

  // Timing
  claim_filing_days_after_discharge: number
  policy_active_months: number
}

export interface ClaimPredictionResult {
  approval_probability: number // 0-100
  confidence_score: number // 0-100
  risk_level: 'low' | 'medium' | 'high' | 'very_high'
  predicted_status: 'likely_approved' | 'likely_partial' | 'likely_rejected'

  // Detailed analysis
  factors: ClaimFactor[]
  missing_documents: DocumentType[]
  recommendations: ClaimRecommendation[]
  estimated_processing_days: number
  estimated_approval_amount?: number

  // Similar cases
  similar_cases_count: number
  similar_cases_approval_rate: number
}

export interface ClaimFactor {
  factor: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number // 0-1
  description: string
}

export interface ClaimRecommendation {
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: 'document' | 'timing' | 'hospital' | 'coverage' | 'procedure'
  title: string
  description: string
  action_required: string
  impact_on_approval: number // +/- percentage points
}

export interface ClaimCase {
  id: string
  diagnosis: string
  claim_amount: number
  approved_amount: number
  status: ClaimStatus
  hospital_type: 'network' | 'non_network' | 'preferred'
  processing_days: number
  documents_submitted: DocumentType[]
  success_factors?: string[]
  failure_reasons?: string[]
  user_testimonial?: string
  similarity_score?: number // When comparing to current claim
}

export interface ClaimTracker {
  claim_id: string
  user_id: string
  policy_id: string

  // Basic info
  claim_number: string
  claim_type: ClaimType
  claim_amount: number
  filed_date: Date

  // Status tracking
  current_status: ClaimStatus
  status_history: ClaimStatusHistory[]
  estimated_completion_date: Date
  actual_completion_date?: Date

  // Documents
  documents: ClaimDocument[]
  pending_documents: DocumentType[]

  // Predictions
  initial_prediction: ClaimPredictionResult
  current_prediction?: ClaimPredictionResult

  // Communication
  notifications: ClaimNotification[]
  required_actions: ClaimAction[]

  // Settlement
  approved_amount?: number
  rejection_reason?: string
  appeal_option?: boolean
  appeal_deadline?: Date
}

export interface ClaimStatusHistory {
  status: ClaimStatus
  timestamp: Date
  notes?: string
  updated_by: 'system' | 'insurer' | 'user'
}

export interface ClaimNotification {
  id: string
  type: 'status_update' | 'document_request' | 'action_required' | 'approval' | 'rejection'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action_link?: string
}

export interface ClaimAction {
  id: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  title: string
  description: string
  deadline?: Date
  completed: boolean
  completed_date?: Date
}

// Document checklist templates
export const DOCUMENT_CHECKLIST: Record<ClaimType, DocumentType[]> = {
  hospitalization: [
    'hospital_bill',
    'discharge_summary',
    'prescriptions',
    'diagnostic_reports',
    'doctor_consultation',
    'pharmacy_bills',
    'claim_form',
    'policy_copy',
    'id_proof',
    'cancelled_cheque'
  ],
  day_care: [
    'hospital_bill',
    'discharge_summary',
    'prescriptions',
    'diagnostic_reports',
    'claim_form',
    'policy_copy',
    'id_proof'
  ],
  pre_hospitalization: [
    'diagnostic_reports',
    'doctor_consultation',
    'prescriptions',
    'pharmacy_bills',
    'claim_form',
    'policy_copy'
  ],
  post_hospitalization: [
    'discharge_summary',
    'prescriptions',
    'pharmacy_bills',
    'doctor_consultation',
    'claim_form',
    'policy_copy'
  ],
  ambulance: [
    'ambulance_bill',
    'hospital_bill',
    'discharge_summary',
    'claim_form',
    'policy_copy'
  ],
  maternity: [
    'hospital_bill',
    'discharge_summary',
    'prescriptions',
    'diagnostic_reports',
    'claim_form',
    'policy_copy',
    'id_proof'
  ],
  critical_illness: [
    'hospital_bill',
    'discharge_summary',
    'diagnostic_reports',
    'doctor_consultation',
    'prescriptions',
    'claim_form',
    'policy_copy',
    'id_proof',
    'cancelled_cheque'
  ],
  organ_transplant: [
    'hospital_bill',
    'discharge_summary',
    'diagnostic_reports',
    'surgery_reports',
    'doctor_consultation',
    'prescriptions',
    'pharmacy_bills',
    'claim_form',
    'policy_copy',
    'id_proof',
    'cancelled_cheque'
  ]
}

// Hospital success rate data (mock - in production, fetch from database)
export interface HospitalSuccessRate {
  hospital_name: string
  overall_success_rate: number
  claim_type_rates: Partial<Record<ClaimType, number>>
  average_processing_days: number
  cashless_approval_rate: number
  total_claims_processed: number
}

// Diagnosis to coverage mapping (mock - in production, use ML model)
export interface DiagnosisCoverage {
  diagnosis: string
  icd_code?: string
  typical_coverage_percentage: number
  exclusions: string[]
  waiting_period_days: number
  documents_critical: DocumentType[]
  average_claim_amount: number
  approval_rate: number
}
