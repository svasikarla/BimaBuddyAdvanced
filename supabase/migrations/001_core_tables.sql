-- =====================================================
-- BimaBuddy Advanced - Core Database Tables
-- Migration: 001_core_tables.sql
-- Description: Core insurance policy and user tables
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  full_name VARCHAR(255),
  date_of_birth DATE,
  age INTEGER,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),

  -- Location
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),

  -- Profile
  family_size INTEGER DEFAULT 1,
  has_pre_existing_conditions BOOLEAN DEFAULT false,

  -- Auth metadata
  auth_provider VARCHAR(50) DEFAULT 'email',
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- INSURANCE COMPANIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS insurance_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(255) UNIQUE NOT NULL,
  irdai_registration_number VARCHAR(100),
  logo_url TEXT,
  website_url TEXT,
  customer_care_phone VARCHAR(20),
  customer_care_email VARCHAR(255),
  claim_settlement_ratio DECIMAL(5,2),
  grievance_ratio DECIMAL(5,2),
  network_hospitals_count INTEGER DEFAULT 0,
  founded_year INTEGER,
  rating DECIMAL(3,2),

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INSURANCE POLICIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS insurance_policies (
  policy_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES insurance_companies(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  policy_name VARCHAR(255) NOT NULL,

  -- Policy Details
  type_of_plan VARCHAR(50) NOT NULL CHECK (type_of_plan IN ('Individual', 'Family Floater', 'Senior Citizen', 'Critical Illness', 'Top-up')),
  sum_insured_min INTEGER NOT NULL,
  sum_insured_max INTEGER NOT NULL,
  annual_premium INTEGER NOT NULL,

  -- Coverage Details
  room_rent_limit VARCHAR(100),
  co_payment DECIMAL(5,2) DEFAULT 0,
  pre_hospitalization_days INTEGER DEFAULT 30,
  post_hospitalization_days INTEGER DEFAULT 60,
  waiting_period_months INTEGER DEFAULT 0,
  pre_existing_disease_waiting_period_months INTEGER DEFAULT 48,

  -- Network
  network_hospitals_count INTEGER DEFAULT 0,
  cashless_hospitals_count INTEGER DEFAULT 0,
  claim_settlement_ratio DECIMAL(5,2),
  claim_settlement_time_days INTEGER,

  -- Features (JSON for flexibility)
  key_features JSONB DEFAULT '[]',
  exclusions JSONB DEFAULT '[]',
  inclusions JSONB DEFAULT '[]',

  -- Policy Terms
  entry_age_min INTEGER DEFAULT 18,
  entry_age_max INTEGER DEFAULT 65,
  renewal_age_max INTEGER DEFAULT 99,
  policy_term_years INTEGER DEFAULT 1,

  -- Additional Details
  tax_benefits TEXT,
  renewal_bonus_percentage DECIMAL(5,2),
  restoration_benefit BOOLEAN DEFAULT false,

  -- Status
  is_active BOOLEAN DEFAULT true,
  popularity_score INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes
  CONSTRAINT unique_policy_per_company UNIQUE (company_id, policy_name)
);

-- =====================================================
-- INSURANCE POLICY FEATURES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS insurance_policy_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID REFERENCES insurance_policies(policy_id) ON DELETE CASCADE,

  -- Feature Details
  feature_type VARCHAR(50) NOT NULL CHECK (feature_type IN ('coverage', 'benefit', 'add-on', 'exclusion', 'rider')),
  feature_name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Availability
  is_optional BOOLEAN DEFAULT false,
  included BOOLEAN DEFAULT true,
  additional_premium INTEGER DEFAULT 0,

  -- Feature Metadata
  coverage_limit INTEGER,
  waiting_period_months INTEGER,
  conditions TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER POLICIES TABLE (User's purchased policies)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES insurance_policies(policy_id) ON DELETE CASCADE,

  -- Policy Details
  policy_number VARCHAR(100) UNIQUE NOT NULL,
  sum_insured INTEGER NOT NULL,
  annual_premium INTEGER NOT NULL,

  -- Coverage Period
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  renewal_date DATE,

  -- Status
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'lapsed', 'pending_renewal')),

  -- Covered Members (JSONB for flexibility)
  covered_members JSONB DEFAULT '[]',

  -- Wellness Discount Applied (Phase 9 integration)
  wellness_discount_percentage DECIMAL(5,2) DEFAULT 0,
  wellness_discount_amount INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_renewal_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- POLICY COMPARISONS TABLE (User comparison history)
-- =====================================================
CREATE TABLE IF NOT EXISTS policy_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id VARCHAR(255),

  -- Compared Policies
  policy_ids JSONB NOT NULL, -- Array of policy IDs
  comparison_criteria JSONB, -- User's comparison filters

  -- User Actions
  selected_policy_id UUID REFERENCES insurance_policies(policy_id) ON DELETE SET NULL,
  resulted_in_purchase BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- NETWORK HOSPITALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS network_hospitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Hospital Details
  hospital_name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10),

  -- Contact
  phone VARCHAR(20),
  email VARCHAR(255),
  website_url TEXT,

  -- Hospital Type
  hospital_type VARCHAR(50) CHECK (hospital_type IN ('network', 'preferred', 'non_network')),
  is_cashless BOOLEAN DEFAULT true,

  -- Associated Companies (JSONB array of company IDs)
  company_ids JSONB DEFAULT '[]',

  -- Specializations
  specializations JSONB DEFAULT '[]',

  -- Success Metrics (Phase 10 integration)
  overall_success_rate DECIMAL(5,2),
  average_claim_processing_days INTEGER,
  cashless_approval_rate DECIMAL(5,2),
  total_claims_processed INTEGER DEFAULT 0,

  -- Coordinates for map
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Insurance companies indexes
CREATE INDEX idx_companies_name ON insurance_companies(company_name);
CREATE INDEX idx_companies_active ON insurance_companies(is_active);
CREATE INDEX idx_companies_rating ON insurance_companies(rating DESC);

-- Insurance policies indexes
CREATE INDEX idx_policies_company ON insurance_policies(company_id);
CREATE INDEX idx_policies_type ON insurance_policies(type_of_plan);
CREATE INDEX idx_policies_premium ON insurance_policies(annual_premium);
CREATE INDEX idx_policies_active ON insurance_policies(is_active);
CREATE INDEX idx_policies_popularity ON insurance_policies(popularity_score DESC);
CREATE INDEX idx_policies_company_name ON insurance_policies(company_name);

-- Policy features indexes
CREATE INDEX idx_features_policy ON insurance_policy_features(policy_id);
CREATE INDEX idx_features_type ON insurance_policy_features(feature_type);

-- User policies indexes
CREATE INDEX idx_user_policies_user ON user_policies(user_id);
CREATE INDEX idx_user_policies_policy ON user_policies(policy_id);
CREATE INDEX idx_user_policies_status ON user_policies(status);
CREATE INDEX idx_user_policies_end_date ON user_policies(end_date);

-- Network hospitals indexes
CREATE INDEX idx_hospitals_city ON network_hospitals(city);
CREATE INDEX idx_hospitals_state ON network_hospitals(state);
CREATE INDEX idx_hospitals_type ON network_hospitals(hospital_type);
CREATE INDEX idx_hospitals_active ON network_hospitals(is_active);
CREATE INDEX idx_hospitals_location ON network_hospitals(latitude, longitude);

-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON insurance_companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON insurance_policies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_policy_features_updated_at BEFORE UPDATE ON insurance_policy_features
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_policies_updated_at BEFORE UPDATE ON user_policies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON network_hospitals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE users IS 'User accounts for BimaBuddy platform';
COMMENT ON TABLE insurance_companies IS 'Insurance companies offering policies';
COMMENT ON TABLE insurance_policies IS 'Available health insurance policies';
COMMENT ON TABLE insurance_policy_features IS 'Features and benefits for each policy';
COMMENT ON TABLE user_policies IS 'Policies purchased by users';
COMMENT ON TABLE policy_comparisons IS 'User policy comparison history';
COMMENT ON TABLE network_hospitals IS 'Network and cashless hospitals';
