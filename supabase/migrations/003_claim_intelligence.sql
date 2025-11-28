-- =====================================================
-- BimaBuddy Advanced - Claim Intelligence Tables
-- Migration: 003_claim_intelligence.sql
-- Description: Phase 10 - ML-based claim prediction system
-- =====================================================

-- =====================================================
-- CLAIMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS claims (
  claim_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  policy_id UUID REFERENCES insurance_policies(policy_id) ON DELETE CASCADE NOT NULL,
  user_policy_id UUID REFERENCES user_policies(id) ON DELETE CASCADE,

  -- Claim Identification
  claim_number VARCHAR(100) UNIQUE,
  external_claim_number VARCHAR(100), -- Insurer's claim number

  -- Claim Type
  claim_type VARCHAR(50) NOT NULL CHECK (claim_type IN (
    'hospitalization',
    'day_care',
    'pre_hospitalization',
    'post_hospitalization',
    'ambulance',
    'maternity',
    'critical_illness',
    'organ_transplant'
  )),

  -- Claim Amounts
  claim_amount INTEGER NOT NULL,
  approved_amount INTEGER,
  settled_amount INTEGER,

  -- Medical Details
  diagnosis VARCHAR(500) NOT NULL,
  diagnosis_code VARCHAR(20), -- ICD-10 code
  treatment_type VARCHAR(255),
  hospitalization_days INTEGER,
  surgery_performed BOOLEAN DEFAULT false,
  surgery_type VARCHAR(255),

  -- Hospital Details
  hospital_id UUID REFERENCES network_hospitals(id) ON DELETE SET NULL,
  hospital_name VARCHAR(255) NOT NULL,
  hospital_tier VARCHAR(50) CHECK (hospital_tier IN ('network', 'non_network', 'preferred')),
  cashless_facility BOOLEAN DEFAULT false,

  -- Patient Details
  patient_name VARCHAR(255) NOT NULL,
  patient_age INTEGER NOT NULL,
  patient_relation VARCHAR(50) CHECK (patient_relation IN ('self', 'spouse', 'child', 'parent', 'other')),
  pre_existing_condition BOOLEAN DEFAULT false,
  pre_existing_condition_details TEXT,

  -- Status Tracking
  current_status VARCHAR(50) DEFAULT 'draft' CHECK (current_status IN (
    'draft',
    'submitted',
    'under_review',
    'documents_requested',
    'approved',
    'rejected',
    'partial_approval',
    'appeal_pending',
    'settled'
  )),

  -- Important Dates
  admission_date DATE,
  discharge_date DATE,
  claim_filed_date DATE,
  claim_filing_days_after_discharge INTEGER,
  estimated_completion_date DATE,
  actual_completion_date DATE,

  -- Document Status
  documents_submitted INTEGER DEFAULT 0,
  documents_required INTEGER DEFAULT 0,
  critical_documents_missing INTEGER DEFAULT 0,
  document_completeness_percentage INTEGER DEFAULT 0,

  -- Claim History
  previous_claims_count INTEGER DEFAULT 0,
  previous_claims_total_amount INTEGER DEFAULT 0,

  -- Rejection/Appeal
  rejection_reason TEXT,
  rejection_category VARCHAR(100),
  appeal_option BOOLEAN DEFAULT false,
  appeal_deadline DATE,
  appeal_submitted BOOLEAN DEFAULT false,
  appeal_result VARCHAR(50),

  -- Internal Metadata
  claim_source VARCHAR(50) DEFAULT 'web_app' CHECK (claim_source IN ('web_app', 'mobile_app', 'offline', 'agent')),
  assigned_to VARCHAR(255), -- Claims processor

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  settled_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- CLAIM PREDICTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS claim_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID REFERENCES claims(claim_id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Prediction Results
  approval_probability DECIMAL(5,2) NOT NULL, -- 0-100
  confidence_score DECIMAL(5,2) NOT NULL, -- 0-100
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'very_high')),
  predicted_status VARCHAR(50) CHECK (predicted_status IN ('likely_approved', 'likely_partial', 'likely_rejected')),

  -- Estimates
  estimated_processing_days INTEGER,
  estimated_approval_amount INTEGER,
  estimated_approval_percentage DECIMAL(5,2),

  -- Model Details
  model_version VARCHAR(50),
  model_accuracy DECIMAL(5,2),

  -- Factors Analysis (JSON)
  positive_factors JSONB DEFAULT '[]',
  negative_factors JSONB DEFAULT '[]',
  neutral_factors JSONB DEFAULT '[]',

  -- Recommendations (JSON)
  critical_recommendations JSONB DEFAULT '[]',
  high_recommendations JSONB DEFAULT '[]',
  medium_recommendations JSONB DEFAULT '[]',

  -- Similar Cases
  similar_cases_count INTEGER DEFAULT 0,
  similar_cases_approval_rate DECIMAL(5,2),
  similar_cases_data JSONB DEFAULT '[]',

  -- Prediction Type
  prediction_type VARCHAR(50) DEFAULT 'pre_filing' CHECK (prediction_type IN ('pre_filing', 'post_filing', 'appeal')),

  -- Actual Outcome (for model improvement)
  actual_status VARCHAR(50),
  actual_approval_amount INTEGER,
  prediction_accuracy DECIMAL(5,2),

  -- Timestamps
  predicted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  outcome_recorded_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- CLAIM DOCUMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS claim_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID REFERENCES claims(claim_id) ON DELETE CASCADE NOT NULL,

  -- Document Type
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN (
    'hospital_bill',
    'discharge_summary',
    'prescriptions',
    'diagnostic_reports',
    'doctor_consultation',
    'pharmacy_bills',
    'ambulance_bill',
    'pre_auth_form',
    'claim_form',
    'policy_copy',
    'id_proof',
    'cancelled_cheque',
    'surgery_reports',
    'pathology_reports',
    'radiology_reports',
    'other'
  )),

  -- Document Details
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size_kb INTEGER,
  file_format VARCHAR(20),

  -- Document Metadata
  is_required BOOLEAN DEFAULT true,
  is_critical BOOLEAN DEFAULT false,
  document_description TEXT,

  -- Verification
  verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'unclear')),
  verified_by VARCHAR(255),
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,

  -- OCR/AI Analysis
  ocr_extracted_text TEXT,
  ai_analysis_result JSONB,
  confidence_score DECIMAL(5,2),

  -- Timestamps
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CLAIM STATUS HISTORY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS claim_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID REFERENCES claims(claim_id) ON DELETE CASCADE NOT NULL,

  -- Status Change
  previous_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,

  -- Change Details
  changed_by VARCHAR(50) CHECK (changed_by IN ('system', 'insurer', 'user', 'admin')),
  change_reason TEXT,
  notes TEXT,

  -- Additional Data
  metadata JSONB,

  -- Timestamp
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CLAIM NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS claim_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID REFERENCES claims(claim_id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Notification Type
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN (
    'status_update',
    'document_request',
    'action_required',
    'approval',
    'rejection',
    'payment_processed',
    'deadline_reminder',
    'appeal_update'
  )),

  -- Notification Content
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_link TEXT,

  -- Priority
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),

  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,

  -- Delivery
  delivered_via VARCHAR(50) DEFAULT 'in_app' CHECK (delivered_via IN ('in_app', 'email', 'sms', 'push')),
  delivery_status VARCHAR(20) DEFAULT 'pending',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CLAIM ACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS claim_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID REFERENCES claims(claim_id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Action Details
  action_type VARCHAR(50) NOT NULL CHECK (action_type IN (
    'upload_document',
    'submit_claim',
    'provide_information',
    'contact_hospital',
    'contact_insurer',
    'file_appeal',
    'accept_settlement',
    'other'
  )),

  -- Action Content
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT,

  -- Priority & Deadline
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  deadline TIMESTAMP WITH TIME ZONE,

  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'expired')),
  completed BOOLEAN DEFAULT false,
  completion_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- HOSPITAL SUCCESS RATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hospital_success_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES network_hospitals(id) ON DELETE CASCADE,
  hospital_name VARCHAR(255) NOT NULL,

  -- Overall Metrics
  overall_success_rate DECIMAL(5,2) NOT NULL,
  total_claims_processed INTEGER DEFAULT 0,
  average_processing_days DECIMAL(5,2),
  cashless_approval_rate DECIMAL(5,2),

  -- Claim Type Specific Rates (JSON)
  hospitalization_rate DECIMAL(5,2),
  day_care_rate DECIMAL(5,2),
  critical_illness_rate DECIMAL(5,2),
  maternity_rate DECIMAL(5,2),
  claim_type_rates JSONB DEFAULT '{}',

  -- Financial Metrics
  average_claim_amount DECIMAL(12,2),
  average_approved_amount DECIMAL(12,2),
  average_approval_percentage DECIMAL(5,2),

  -- Quality Metrics
  documentation_quality_score DECIMAL(5,2),
  patient_satisfaction_score DECIMAL(5,2),

  -- Time Period
  data_period_start DATE,
  data_period_end DATE,

  -- Timestamps
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_hospital_period UNIQUE (hospital_id, data_period_start, data_period_end)
);

-- =====================================================
-- DIAGNOSIS COVERAGE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS diagnosis_coverage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Diagnosis Details
  diagnosis_name VARCHAR(500) NOT NULL,
  icd_code VARCHAR(20) UNIQUE,
  category VARCHAR(100),
  severity VARCHAR(50) CHECK (severity IN ('mild', 'moderate', 'severe', 'critical')),

  -- Coverage Information
  typical_coverage_percentage DECIMAL(5,2) NOT NULL,
  average_claim_amount DECIMAL(12,2),
  approval_rate DECIMAL(5,2),

  -- Waiting Periods
  waiting_period_days INTEGER DEFAULT 0,
  pre_existing_waiting_period_months INTEGER DEFAULT 48,

  -- Common Exclusions
  common_exclusions JSONB DEFAULT '[]',
  coverage_conditions TEXT,

  -- Required Documents
  critical_documents JSONB DEFAULT '[]',
  recommended_documents JSONB DEFAULT '[]',

  -- Treatment Information
  typical_hospitalization_days INTEGER,
  typical_treatment_cost DECIMAL(12,2),
  common_procedures JSONB DEFAULT '[]',

  -- Statistics
  total_claims_filed INTEGER DEFAULT 0,
  claims_approved INTEGER DEFAULT 0,
  claims_rejected INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CLAIM FACTORS ANALYSIS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS claim_factors_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_prediction_id UUID REFERENCES claim_predictions(id) ON DELETE CASCADE NOT NULL,

  -- Factor Details
  factor_name VARCHAR(255) NOT NULL,
  factor_category VARCHAR(100) NOT NULL CHECK (factor_category IN (
    'policy', 'hospital', 'diagnosis', 'documentation', 'timing', 'patient', 'history', 'financial'
  )),

  -- Impact
  impact VARCHAR(20) NOT NULL CHECK (impact IN ('positive', 'negative', 'neutral')),
  weight DECIMAL(5,4) NOT NULL CHECK (weight BETWEEN 0 AND 1), -- 0-1

  -- Description
  description TEXT NOT NULL,
  recommendation TEXT,

  -- Score Contribution
  score_contribution DECIMAL(5,2),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CLAIM SIMILAR CASES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS claim_similar_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Case Identification
  case_number VARCHAR(100) UNIQUE,

  -- Medical Details
  diagnosis VARCHAR(500) NOT NULL,
  diagnosis_code VARCHAR(20),
  treatment_type VARCHAR(255),

  -- Financial Details
  claim_amount INTEGER NOT NULL,
  approved_amount INTEGER,
  approval_percentage DECIMAL(5,2),

  -- Outcome
  final_status VARCHAR(50) NOT NULL CHECK (final_status IN ('approved', 'rejected', 'partial_approval', 'settled')),

  -- Hospital Details
  hospital_type VARCHAR(50) CHECK (hospital_type IN ('network', 'non_network', 'preferred')),
  hospital_city VARCHAR(100),

  -- Processing
  processing_days INTEGER,

  -- Documents
  documents_submitted JSONB DEFAULT '[]',

  -- Factors
  success_factors JSONB DEFAULT '[]',
  failure_reasons JSONB DEFAULT '[]',

  -- User Testimonial
  user_testimonial TEXT,
  user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),

  -- Case Metadata
  case_date DATE,
  patient_age_range VARCHAR(20),
  policy_type VARCHAR(100),

  -- Privacy
  is_anonymized BOOLEAN DEFAULT true,
  original_case_id UUID,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Claims indexes
CREATE INDEX idx_claims_user ON claims(user_id);
CREATE INDEX idx_claims_policy ON claims(policy_id);
CREATE INDEX idx_claims_status ON claims(current_status);
CREATE INDEX idx_claims_type ON claims(claim_type);
CREATE INDEX idx_claims_hospital ON claims(hospital_id);
CREATE INDEX idx_claims_filed_date ON claims(claim_filed_date DESC);
CREATE INDEX idx_claims_diagnosis ON claims(diagnosis);
CREATE INDEX idx_claims_claim_number ON claims(claim_number);

-- Claim predictions indexes
CREATE INDEX idx_predictions_claim ON claim_predictions(claim_id);
CREATE INDEX idx_predictions_user ON claim_predictions(user_id);
CREATE INDEX idx_predictions_risk ON claim_predictions(risk_level);
CREATE INDEX idx_predictions_type ON claim_predictions(prediction_type);
CREATE INDEX idx_predictions_date ON claim_predictions(predicted_at DESC);

-- Claim documents indexes
CREATE INDEX idx_documents_claim ON claim_documents(claim_id);
CREATE INDEX idx_documents_type ON claim_documents(document_type);
CREATE INDEX idx_documents_verification ON claim_documents(verification_status);
CREATE INDEX idx_documents_uploaded ON claim_documents(uploaded_at DESC);

-- Claim status history indexes
CREATE INDEX idx_status_history_claim ON claim_status_history(claim_id);
CREATE INDEX idx_status_history_date ON claim_status_history(changed_at DESC);

-- Claim notifications indexes
CREATE INDEX idx_notifications_claim ON claim_notifications(claim_id);
CREATE INDEX idx_notifications_user ON claim_notifications(user_id);
CREATE INDEX idx_notifications_type ON claim_notifications(notification_type);
CREATE INDEX idx_notifications_read ON claim_notifications(read);
CREATE INDEX idx_notifications_created ON claim_notifications(created_at DESC);

-- Claim actions indexes
CREATE INDEX idx_actions_claim ON claim_actions(claim_id);
CREATE INDEX idx_actions_user ON claim_actions(user_id);
CREATE INDEX idx_actions_status ON claim_actions(status);
CREATE INDEX idx_actions_priority ON claim_actions(priority);
CREATE INDEX idx_actions_deadline ON claim_actions(deadline);

-- Hospital success rates indexes
CREATE INDEX idx_hospital_rates_hospital ON hospital_success_rates(hospital_id);
CREATE INDEX idx_hospital_rates_success ON hospital_success_rates(overall_success_rate DESC);
CREATE INDEX idx_hospital_rates_period ON hospital_success_rates(data_period_start, data_period_end);

-- Diagnosis coverage indexes
CREATE INDEX idx_diagnosis_name ON diagnosis_coverage(diagnosis_name);
CREATE INDEX idx_diagnosis_icd ON diagnosis_coverage(icd_code);
CREATE INDEX idx_diagnosis_category ON diagnosis_coverage(category);
CREATE INDEX idx_diagnosis_approval_rate ON diagnosis_coverage(approval_rate DESC);

-- Claim factors analysis indexes
CREATE INDEX idx_factors_prediction ON claim_factors_analysis(claim_prediction_id);
CREATE INDEX idx_factors_category ON claim_factors_analysis(factor_category);
CREATE INDEX idx_factors_impact ON claim_factors_analysis(impact);

-- Claim similar cases indexes
CREATE INDEX idx_similar_cases_diagnosis ON claim_similar_cases(diagnosis);
CREATE INDEX idx_similar_cases_status ON claim_similar_cases(final_status);
CREATE INDEX idx_similar_cases_date ON claim_similar_cases(case_date DESC);
CREATE INDEX idx_similar_cases_hospital_type ON claim_similar_cases(hospital_type);

-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagnosis_coverage_updated_at BEFORE UPDATE ON diagnosis_coverage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE claims IS 'Health insurance claims filed by users';
COMMENT ON TABLE claim_predictions IS 'ML-based claim approval predictions';
COMMENT ON TABLE claim_documents IS 'Documents uploaded for claim processing';
COMMENT ON TABLE claim_status_history IS 'Audit trail of claim status changes';
COMMENT ON TABLE claim_notifications IS 'Notifications sent to users about claims';
COMMENT ON TABLE claim_actions IS 'Required actions for claim processing';
COMMENT ON TABLE hospital_success_rates IS 'Historical success rates by hospital';
COMMENT ON TABLE diagnosis_coverage IS 'Coverage information by diagnosis';
COMMENT ON TABLE claim_factors_analysis IS 'Detailed factor analysis for predictions';
COMMENT ON TABLE claim_similar_cases IS 'Historical similar claim cases for reference';
