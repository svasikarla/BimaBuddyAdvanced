-- =====================================================
-- BimaBuddy Advanced - Policy Features Data
-- File: 007_seed_policy_features.sql
-- Description: Detailed features for each insurance policy
-- Data Sources: Company websites, PolicyBazaar, 2025 data
-- =====================================================

-- =====================================================
-- STAR HEALTH COMPREHENSIVE PLAN FEATURES
-- =====================================================

INSERT INTO insurance_policy_features (
  policy_id,
  feature_type,
  feature_name,
  description,
  is_optional,
  included,
  coverage_limit,
  waiting_period_months
) VALUES
-- Star Comprehensive Plan
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Comprehensive Insurance Plan' LIMIT 1),
  'coverage',
  'In-patient Hospitalization',
  'Covers all hospitalization expenses including room rent, nursing,ICU charges, surgery, and doctor fees',
  false,
  true,
  NULL,
  30
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Comprehensive Insurance Plan' LIMIT 1),
  'coverage',
  'Day Care Procedures',
  'Covers medical procedures that don''t require 24-hour hospitalization',
  false,
  true,
  NULL,
  30
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Comprehensive Insurance Plan' LIMIT 1),
  'coverage',
  'Ambulance Charges',
  'Emergency ambulance expenses covered',
  false,
  true,
  5000,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Comprehensive Insurance Plan' LIMIT 1),
  'coverage',
  'AYUSH Treatment',
  'Coverage for Ayurveda, Yoga, Unani, Siddha, and Homeopathy treatments',
  false,
  true,
  NULL,
  30
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Comprehensive Insurance Plan' LIMIT 1),
  'benefit',
  'No Claim Bonus',
  'Up to 25% increase in sum insured for every claim-free year',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Comprehensive Insurance Plan' LIMIT 1),
  'benefit',
  'Automatic Restoration',
  'Sum insured automatically restored once after exhaustion',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Comprehensive Insurance Plan' LIMIT 1),
  'coverage',
  'Organ Donor Expenses',
  'Covers expenses for organ donor for transplants',
  false,
  true,
  200000,
  48
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Comprehensive Insurance Plan' LIMIT 1),
  'coverage',
  'Modern Treatments',
  'Covers robotic surgery, stem cell therapy, and other modern treatments',
  false,
  true,
  NULL,
  30
);

-- =====================================================
-- STAR HEALTH ASSURE PLAN FEATURES
-- =====================================================

INSERT INTO insurance_policy_features (
  policy_id,
  feature_type,
  feature_name,
  description,
  is_optional,
  included,
  coverage_limit,
  waiting_period_months
) VALUES
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Health Assure Plan' LIMIT 1),
  'coverage',
  'Assisted Reproduction Treatment',
  'Coverage for IVF and related fertility treatments',
  false,
  true,
  NULL,
  48
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Health Assure Plan' LIMIT 1),
  'coverage',
  'Home Care Treatment',
  'Medical treatment at home covered when hospitalization not required',
  false,
  true,
  NULL,
  30
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Health Assure Plan' LIMIT 1),
  'coverage',
  'Chronic Severe Refractory Asthma Cover',
  'Specialized coverage for severe asthma treatment',
  false,
  true,
  300000,
  48
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Health Assure Plan' LIMIT 1),
  'benefit',
  'Automatic Restoration',
  'Full sum insured automatically restored',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Health Assure Plan' LIMIT 1),
  'coverage',
  'Air Ambulance',
  'Emergency air ambulance covered',
  false,
  true,
  100000,
  0
);

-- =====================================================
-- HDFC ERGO OPTIMA SECURE FEATURES
-- =====================================================

INSERT INTO insurance_policy_features (
  policy_id,
  feature_type,
  feature_name,
  description,
  is_optional,
  included,
  coverage_limit,
  waiting_period_months
) VALUES
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'HDFC ERGO Optima Secure Individual' LIMIT 1),
  'benefit',
  'Secure Benefit',
  'Instantly doubles the base cover to 20 lakhs at no extra cost for 10 lakh plan',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'HDFC ERGO Optima Secure Individual' LIMIT 1),
  'benefit',
  'Restore Benefit',
  'Unlimited restoration of sum insured',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'HDFC ERGO Optima Secure Individual' LIMIT 1),
  'coverage',
  'Home Care Treatment',
  'Treatment at home covered for up to 14 days',
  false,
  true,
  NULL,
  30
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'HDFC ERGO Optima Secure Individual' LIMIT 1),
  'coverage',
  'Organ Donor Expenses',
  'Harvesting and donor hospitalization covered',
  false,
  true,
  NULL,
  48
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'HDFC ERGO Optima Secure Individual' LIMIT 1),
  'coverage',
  'Emergency Ambulance',
  'Road and air ambulance covered',
  false,
  true,
  5000,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'HDFC ERGO Optima Secure Individual' LIMIT 1),
  'benefit',
  'Health Check-up',
  'Free annual health check-up',
  false,
  true,
  1000,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'HDFC ERGO Optima Secure Individual' LIMIT 1),
  'coverage',
  'Modern Treatments',
  'Robotic surgery, uterine artery embolization, deep brain stimulation',
  false,
  true,
  NULL,
  30
);

-- =====================================================
-- NIVA BUPA REASSURE 2.0 FEATURES
-- =====================================================

INSERT INTO insurance_policy_features (
  policy_id,
  feature_type,
  feature_name,
  description,
  is_optional,
  included,
  coverage_limit,
  waiting_period_months
) VALUES
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Niva Bupa ReAssure 2.0 Individual' LIMIT 1),
  'benefit',
  'ReAssure Forever',
  'Unlimited reinstatement of sum insured for any illness within same year',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Niva Bupa ReAssure 2.0 Individual' LIMIT 1),
  'benefit',
  'Booster+ Benefit',
  'Carry forward unused sum insured up to 10x the base amount',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Niva Bupa ReAssure 2.0 Individual' LIMIT 1),
  'benefit',
  'Lock the Clock',
  'Pay premium as per entry age for life unless claim is made',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Niva Bupa ReAssure 2.0 Individual' LIMIT 1),
  'coverage',
  '2-Hour Hospitalization',
  'Coverage for hospitalization of 2 hours or more',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Niva Bupa ReAssure 2.0 Individual' LIMIT 1),
  'coverage',
  'No Room Rent Capping',
  'No limit on room rent for any type of room',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Niva Bupa ReAssure 2.0 Individual' LIMIT 1),
  'add-on',
  'Smart Health+ Rider',
  'Day 1 coverage for diabetes and hypertension',
  true,
  false,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Niva Bupa ReAssure 2.0 Individual' LIMIT 1),
  'benefit',
  'Live Healthy Benefit',
  'Save up to 30% on renewal premium by earning health points',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Niva Bupa ReAssure 2.0 Individual' LIMIT 1),
  'coverage',
  'E-Consultations',
  'Online medical consultations covered',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Niva Bupa ReAssure 2.0 Individual' LIMIT 1),
  'benefit',
  'Annual Health Check-up',
  'Free health check-up from day 1 on cashless basis',
  false,
  true,
  NULL,
  0
);

-- =====================================================
-- CARE HEALTH INSURANCE FEATURES
-- =====================================================

INSERT INTO insurance_policy_features (
  policy_id,
  feature_type,
  feature_name,
  description,
  is_optional,
  included,
  coverage_limit,
  waiting_period_months
) VALUES
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Care Health Insurance Individual Plan' LIMIT 1),
  'benefit',
  '2-Hour Cashless Claims',
  'Cashless claims settled within 2 hours',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Care Health Insurance Individual Plan' LIMIT 1),
  'coverage',
  'Non-Medical Expenses',
  'Gloves, oxygen masks, PPE kits covered',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Care Health Insurance Individual Plan' LIMIT 1),
  'coverage',
  'Outpatient Expenses',
  'Medicines, tests, consultations covered',
  false,
  true,
  25000,
  30
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Care Health Insurance Individual Plan' LIMIT 1),
  'coverage',
  'Day Care Procedures',
  'Over 150 day care procedures covered',
  false,
  true,
  NULL,
  30
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Care Health Insurance Individual Plan' LIMIT 1),
  'benefit',
  'Sum Insured Reload',
  'Additional sum insured after exhaustion',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Care Health Insurance Individual Plan' LIMIT 1),
  'coverage',
  'AYUSH Treatments',
  'Ayurveda, Yoga, Unani, Siddha, Homeopathy covered',
  false,
  true,
  NULL,
  30
);

-- =====================================================
-- ADITYA BIRLA ACTIV HEALTH FEATURES
-- =====================================================

INSERT INTO insurance_policy_features (
  policy_id,
  feature_type,
  feature_name,
  description,
  is_optional,
  included,
  coverage_limit,
  waiting_period_months
) VALUES
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Activ Health Platinum Enhanced Individual' LIMIT 1),
  'benefit',
  'HealthReturns',
  'Get back part of your premium as rewards for healthy behavior',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Activ Health Platinum Enhanced Individual' LIMIT 1),
  'benefit',
  'Reload Benefit',
  'Sum insured reloaded once after exhaustion',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Activ Health Platinum Enhanced Individual' LIMIT 1),
  'coverage',
  'Mental Illness Coverage',
  'Hospitalization for mental illnesses covered up to sum insured',
  false,
  true,
  NULL,
  48
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Activ Health Platinum Enhanced Individual' LIMIT 1),
  'coverage',
  'Bariatric Surgery',
  'Weight loss surgery covered',
  false,
  true,
  NULL,
  48
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Activ Health Platinum Enhanced Individual' LIMIT 1),
  'benefit',
  'Cumulative Bonus',
  'Increases sum insured by 50% up to 100% or Rs 1 crore for claim-free year',
  false,
  true,
  10000000,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Activ Health Platinum Enhanced Individual' LIMIT 1),
  'coverage',
  'Chronic Management Program',
  'Special program for managing chronic conditions',
  false,
  true,
  NULL,
  0
);

-- =====================================================
-- FAMILY FLOATER SPECIFIC FEATURES
-- =====================================================

INSERT INTO insurance_policy_features (
  policy_id,
  feature_type,
  feature_name,
  description,
  is_optional,
  included,
  coverage_limit,
  waiting_period_months
) VALUES
-- Star Family Health Optima
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Family Health Optima' LIMIT 1),
  'coverage',
  'Maternity Coverage',
  'Normal and C-section delivery covered',
  false,
  true,
  50000,
  24
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Family Health Optima' LIMIT 1),
  'coverage',
  'Newborn Baby Coverage',
  'Automatic coverage for newborn from day 1',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Family Health Optima' LIMIT 1),
  'coverage',
  'Vaccination Expenses',
  'Childhood vaccination covered',
  false,
  true,
  5000,
  0
),
-- HDFC ERGO Optima Restore Family
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'HDFC ERGO Optima Restore Family Floater' LIMIT 1),
  'coverage',
  'Maternity Coverage',
  'Normal and C-section delivery with newborn coverage',
  true,
  false,
  75000,
  24
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'HDFC ERGO Optima Restore Family Floater' LIMIT 1),
  'benefit',
  'Family Restore Benefit',
  'Full sum insured restored for family after any claim',
  false,
  true,
  NULL,
  0
),
-- Niva Bupa Health Companion
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Niva Bupa Health Companion Family Floater' LIMIT 1),
  'coverage',
  'Up to 19 Relationships',
  'Covers extended family members including parents, siblings, in-laws',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Niva Bupa Health Companion Family Floater' LIMIT 1),
  'coverage',
  'Maternity Benefits',
  'Maternity hospitalization covered',
  true,
  false,
  100000,
  24
);

-- =====================================================
-- SENIOR CITIZEN SPECIFIC FEATURES
-- =====================================================

INSERT INTO insurance_policy_features (
  policy_id,
  feature_type,
  feature_name,
  description,
  is_optional,
  included,
  coverage_limit,
  waiting_period_months
) VALUES
-- Star Senior Citizen
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Senior Citizen Red Carpet Health Policy' LIMIT 1),
  'coverage',
  'Pre-Existing Diseases',
  'Diabetes, hypertension, heart disease covered after waiting period',
  false,
  true,
  NULL,
  12
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Senior Citizen Red Carpet Health Policy' LIMIT 1),
  'coverage',
  'Age-Related Ailments',
  'Alzheimer''s, Parkinson''s, osteoporosis covered',
  false,
  true,
  NULL,
  48
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Senior Citizen Red Carpet Health Policy' LIMIT 1),
  'benefit',
  'Domiciliary Hospitalization',
  'Treatment at home when hospitalization not possible',
  false,
  true,
  NULL,
  0
),
-- HDFC ERGO Optima Senior
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'HDFC ERGO Optima Senior' LIMIT 1),
  'coverage',
  'Cataract Surgery',
  'Both eyes covered with reduced waiting period',
  false,
  true,
  50000,
  12
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'HDFC ERGO Optima Senior' LIMIT 1),
  'coverage',
  'Joint Replacement',
  'Knee and hip replacement covered',
  false,
  true,
  NULL,
  24
),
-- Niva Bupa Senior First
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Niva Bupa Senior First Plan' LIMIT 1),
  'coverage',
  'Age Bands Coverage',
  'Specific benefits for 61-65, 66-70, 71-75, 76-80, 81-85, 86+ age groups',
  false,
  true,
  NULL,
  0
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Niva Bupa Senior First Plan' LIMIT 1),
  'benefit',
  'Restoration of Cover',
  'Full sum insured restored after first claim',
  false,
  true,
  NULL,
  0
);

-- =====================================================
-- COMMON EXCLUSIONS
-- =====================================================

INSERT INTO insurance_policy_features (
  policy_id,
  feature_type,
  feature_name,
  description,
  is_optional,
  included
) VALUES
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Comprehensive Insurance Plan' LIMIT 1),
  'exclusion',
  'Cosmetic Surgery',
  'Not covered unless medically necessary',
  false,
  false
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Comprehensive Insurance Plan' LIMIT 1),
  'exclusion',
  'Self-Inflicted Injuries',
  'Suicide attempts and self-harm not covered',
  false,
  false
),
(
  (SELECT policy_id FROM insurance_policies WHERE policy_name = 'Star Comprehensive Insurance Plan' LIMIT 1),
  'exclusion',
  'War and Nuclear Risks',
  'Injuries from war, nuclear weapons, radioactive contamination excluded',
  false,
  false
);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE insurance_policy_features IS 'Detailed features, benefits, and exclusions for each policy';
