-- =====================================================
-- BimaBuddy Advanced - Database Views and Functions
-- Migration: 005_views_and_functions.sql
-- Description: Materialized views, functions, and stored procedures
-- =====================================================

-- =====================================================
-- INSURANCE POLICY SCORE VIEW
-- =====================================================
-- This view calculates a comprehensive score for each policy
-- based on multiple factors to help users find the best plans

CREATE OR REPLACE VIEW insurance_policy_score_vw AS
SELECT
  p.policy_id,
  p.company_id,
  p.company_name,
  p.policy_name,
  p.type_of_plan,
  p.sum_insured_min,
  p.sum_insured_max,
  p.annual_premium,

  -- Coverage Details
  p.room_rent_limit,
  p.co_payment,
  p.pre_hospitalization_days,
  p.post_hospitalization_days,
  p.waiting_period_months,
  p.pre_existing_disease_waiting_period_months,

  -- Network and Claims
  p.network_hospitals_count,
  p.cashless_hospitals_count,
  p.claim_settlement_ratio,
  p.claim_settlement_time_days,

  -- Policy Terms
  p.entry_age_min,
  p.entry_age_max,
  p.renewal_age_max,

  -- Additional Benefits
  p.renewal_bonus_percentage,
  p.restoration_benefit,

  -- Status
  p.is_active,
  p.popularity_score,

  -- Calculated Score (0-1)
  (
    -- Claim Settlement Ratio (30% weight)
    (COALESCE(p.claim_settlement_ratio, 85) / 100) * 0.30 +

    -- Network Hospitals Count (20% weight) - normalized to 0-1
    (LEAST(COALESCE(p.network_hospitals_count, 0), 10000) / 10000.0) * 0.20 +

    -- Co-payment (15% weight) - lower is better
    (1 - COALESCE(p.co_payment, 0.1)) * 0.15 +

    -- Pre + Post Hospitalization Days (15% weight) - normalized
    (LEAST(COALESCE(p.pre_hospitalization_days, 30) + COALESCE(p.post_hospitalization_days, 60), 180) / 180.0) * 0.15 +

    -- Waiting Period (10% weight) - shorter is better
    (1 - (LEAST(COALESCE(p.waiting_period_months, 24), 48) / 48.0)) * 0.10 +

    -- Restoration Benefit (5% weight)
    (CASE WHEN p.restoration_benefit THEN 1 ELSE 0 END) * 0.05 +

    -- Renewal Bonus (5% weight) - normalized
    (COALESCE(p.renewal_bonus_percentage, 0) / 100.0) * 0.05

  ) AS total_score,

  -- Timestamp
  NOW() AS calculated_at

FROM insurance_policies p
WHERE p.is_active = true;

-- =====================================================
-- USER WELLNESS SUMMARY VIEW
-- =====================================================
-- Comprehensive wellness summary for each user

CREATE OR REPLACE VIEW user_wellness_summary_vw AS
SELECT
  u.id AS user_id,
  u.full_name,
  u.email,

  -- Points
  COALESCE(wp.total_points, 0) AS total_points,
  COALESCE(wp.monthly_points, 0) AS monthly_points,
  COALESCE(wp.weekly_points, 0) AS weekly_points,
  COALESCE(wp.daily_points, 0) AS daily_points,

  -- Streak
  COALESCE(wp.streak_days, 0) AS current_streak,
  COALESCE(wp.longest_streak, 0) AS longest_streak,

  -- Discount
  COALESCE(wp.discount_tier, 'No Discount') AS discount_tier,
  COALESCE(wp.premium_discount_percentage, 0) AS discount_percentage,
  COALESCE(wp.premium_discount_amount, 0) AS discount_amount,

  -- Activity Stats
  COALESCE(wp.total_days_active, 0) AS total_days_active,
  COALESCE(wp.total_workouts, 0) AS total_workouts,
  COALESCE(wp.total_steps, 0) AS total_steps,
  COALESCE(wp.total_active_minutes, 0) AS total_active_minutes,

  -- Connection Status
  (SELECT COUNT(*) FROM wellness_connections wc WHERE wc.user_id = u.id AND wc.status = 'active') AS active_connections,

  -- Recent Activity
  (SELECT MAX(activity_date) FROM wellness_activities wa WHERE wa.user_id = u.id) AS last_activity_date,

  -- Achievements
  (SELECT COUNT(*) FROM user_achievements ua WHERE ua.user_id = u.id AND ua.is_unlocked = true) AS achievements_unlocked

FROM users u
LEFT JOIN wellness_points wp ON u.id = wp.user_id;

-- =====================================================
-- USER CLAIM SUMMARY VIEW
-- =====================================================
-- Summary of user's claims

CREATE OR REPLACE VIEW user_claim_summary_vw AS
SELECT
  u.id AS user_id,
  u.full_name,
  u.email,

  -- Claim Counts
  COUNT(c.claim_id) AS total_claims,
  SUM(CASE WHEN c.current_status = 'approved' THEN 1 ELSE 0 END) AS approved_claims,
  SUM(CASE WHEN c.current_status = 'rejected' THEN 1 ELSE 0 END) AS rejected_claims,
  SUM(CASE WHEN c.current_status IN ('draft', 'submitted', 'under_review') THEN 1 ELSE 0 END) AS pending_claims,

  -- Financial Summary
  SUM(c.claim_amount) AS total_claimed_amount,
  SUM(c.approved_amount) AS total_approved_amount,
  SUM(c.settled_amount) AS total_settled_amount,

  -- Success Rate
  CASE
    WHEN COUNT(c.claim_id) > 0 THEN
      (SUM(CASE WHEN c.current_status = 'approved' THEN 1 ELSE 0 END)::DECIMAL / COUNT(c.claim_id)::DECIMAL) * 100
    ELSE 0
  END AS approval_rate,

  -- Recent Claim
  MAX(c.claim_filed_date) AS last_claim_date

FROM users u
LEFT JOIN claims c ON u.id = c.user_id
GROUP BY u.id, u.full_name, u.email;

-- =====================================================
-- POPULAR POLICIES VIEW
-- =====================================================
-- Most popular and top-rated policies

CREATE OR REPLACE VIEW popular_policies_vw AS
SELECT
  p.*,
  COUNT(DISTINCT up.user_id) AS active_users,
  COUNT(DISTINCT pc.id) AS comparison_count,
  AVG(psv.total_score) AS avg_score
FROM insurance_policies p
LEFT JOIN user_policies up ON p.policy_id = up.policy_id AND up.status = 'active'
LEFT JOIN policy_comparisons pc ON p.policy_id::TEXT = ANY(
  SELECT jsonb_array_elements_text(pc.policy_ids)
)
LEFT JOIN insurance_policy_score_vw psv ON p.policy_id = psv.policy_id
WHERE p.is_active = true
GROUP BY p.policy_id
ORDER BY active_users DESC, comparison_count DESC, avg_score DESC
LIMIT 50;

-- =====================================================
-- HOSPITAL NETWORK SUMMARY VIEW
-- =====================================================
-- Hospital network coverage by city

CREATE OR REPLACE VIEW hospital_network_summary_vw AS
SELECT
  city,
  state,
  COUNT(*) AS total_hospitals,
  SUM(CASE WHEN hospital_type = 'network' THEN 1 ELSE 0 END) AS network_hospitals,
  SUM(CASE WHEN hospital_type = 'preferred' THEN 1 ELSE 0 END) AS preferred_hospitals,
  SUM(CASE WHEN is_cashless = true THEN 1 ELSE 0 END) AS cashless_hospitals,
  AVG(overall_success_rate) AS avg_success_rate
FROM network_hospitals
WHERE is_active = true
GROUP BY city, state
ORDER BY total_hospitals DESC;

-- =====================================================
-- FUNCTION: Calculate Wellness Points for Activity
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_wellness_points(
  p_steps INTEGER,
  p_workout_minutes INTEGER,
  p_sleep_hours DECIMAL,
  p_active_minutes INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  v_points INTEGER := 0;
BEGIN
  -- Steps points
  IF p_steps >= 15000 THEN
    v_points := v_points + 50;
  ELSIF p_steps >= 10000 THEN
    v_points := v_points + 25;
  ELSIF p_steps >= 5000 THEN
    v_points := v_points + 10;
  END IF;

  -- Workout points
  IF p_workout_minutes >= 60 THEN
    v_points := v_points + 40;
  ELSIF p_workout_minutes >= 30 THEN
    v_points := v_points + 20;
  END IF;

  -- Sleep points
  IF p_sleep_hours >= 7 THEN
    v_points := v_points + 15;
  END IF;

  -- Active minutes points (weekly)
  IF p_active_minutes >= 300 THEN
    v_points := v_points + 60;
  ELSIF p_active_minutes >= 150 THEN
    v_points := v_points + 30;
  END IF;

  RETURN v_points;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- FUNCTION: Get Discount Tier from Monthly Points
-- =====================================================

CREATE OR REPLACE FUNCTION get_discount_tier(p_monthly_points INTEGER)
RETURNS TABLE (
  tier_name VARCHAR(50),
  discount_percentage DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT wdt.tier_name, wdt.discount_percentage
  FROM wellness_discount_tiers wdt
  WHERE p_monthly_points >= wdt.min_monthly_points
    AND p_monthly_points <= wdt.max_monthly_points
    AND wdt.is_active = true
  ORDER BY wdt.tier_order DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- FUNCTION: Update User Wellness Points
-- =====================================================

CREATE OR REPLACE FUNCTION update_user_wellness_points(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_monthly_points INTEGER;
  v_weekly_points INTEGER;
  v_daily_points INTEGER;
  v_total_points INTEGER;
  v_streak_days INTEGER;
  v_last_activity_date DATE;
  v_current_month INTEGER;
  v_current_year INTEGER;
  v_tier_name VARCHAR(50);
  v_discount_percentage DECIMAL(5,2);
BEGIN
  v_current_month := EXTRACT(MONTH FROM NOW());
  v_current_year := EXTRACT(YEAR FROM NOW());

  -- Calculate monthly points
  SELECT COALESCE(SUM(points_earned), 0)
  INTO v_monthly_points
  FROM wellness_activities
  WHERE user_id = p_user_id
    AND EXTRACT(MONTH FROM activity_date) = v_current_month
    AND EXTRACT(YEAR FROM activity_date) = v_current_year;

  -- Calculate weekly points
  SELECT COALESCE(SUM(points_earned), 0)
  INTO v_weekly_points
  FROM wellness_activities
  WHERE user_id = p_user_id
    AND activity_date >= CURRENT_DATE - INTERVAL '7 days';

  -- Calculate daily points
  SELECT COALESCE(SUM(points_earned), 0)
  INTO v_daily_points
  FROM wellness_activities
  WHERE user_id = p_user_id
    AND activity_date = CURRENT_DATE;

  -- Calculate total points
  SELECT COALESCE(SUM(points_earned), 0)
  INTO v_total_points
  FROM wellness_activities
  WHERE user_id = p_user_id;

  -- Calculate streak
  SELECT MAX(activity_date)
  INTO v_last_activity_date
  FROM wellness_activities
  WHERE user_id = p_user_id;

  IF v_last_activity_date = CURRENT_DATE OR v_last_activity_date = CURRENT_DATE - 1 THEN
    -- Count consecutive days
    WITH RECURSIVE streak AS (
      SELECT activity_date, 1 AS streak_count
      FROM wellness_activities
      WHERE user_id = p_user_id
        AND activity_date = COALESCE(v_last_activity_date, CURRENT_DATE)
      UNION ALL
      SELECT wa.activity_date, s.streak_count + 1
      FROM wellness_activities wa
      INNER JOIN streak s ON wa.activity_date = s.activity_date - 1
      WHERE wa.user_id = p_user_id
    )
    SELECT MAX(streak_count) INTO v_streak_days FROM streak;
  ELSE
    v_streak_days := 0;
  END IF;

  -- Get discount tier
  SELECT tier_name, discount_percentage
  INTO v_tier_name, v_discount_percentage
  FROM get_discount_tier(v_monthly_points);

  -- Upsert wellness_points
  INSERT INTO wellness_points (
    user_id, total_points, monthly_points, weekly_points, daily_points,
    streak_days, discount_tier, premium_discount_percentage,
    current_month, current_year
  ) VALUES (
    p_user_id, v_total_points, v_monthly_points, v_weekly_points, v_daily_points,
    v_streak_days, v_tier_name, v_discount_percentage,
    v_current_month, v_current_year
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = v_total_points,
    monthly_points = v_monthly_points,
    weekly_points = v_weekly_points,
    daily_points = v_daily_points,
    streak_days = GREATEST(wellness_points.longest_streak, v_streak_days),
    longest_streak = GREATEST(wellness_points.longest_streak, v_streak_days),
    discount_tier = v_tier_name,
    premium_discount_percentage = v_discount_percentage,
    current_month = v_current_month,
    current_year = v_current_year,
    updated_at = NOW();

END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Record Voice Command
-- =====================================================

CREATE OR REPLACE FUNCTION record_voice_command(
  p_conversation_id UUID,
  p_user_id UUID,
  p_language VARCHAR(10),
  p_transcription TEXT,
  p_intent VARCHAR(50),
  p_response_text TEXT
)
RETURNS UUID AS $$
DECLARE
  v_command_id UUID;
BEGIN
  -- Insert voice command
  INSERT INTO voice_commands (
    conversation_id,
    user_id,
    language,
    raw_text,
    transcription,
    intent,
    response_text,
    was_successful
  ) VALUES (
    p_conversation_id,
    p_user_id,
    p_language,
    p_transcription,
    p_transcription,
    p_intent,
    p_response_text,
    true
  )
  RETURNING id INTO v_command_id;

  -- Update conversation stats
  UPDATE voice_conversations
  SET total_commands = total_commands + 1,
      successful_commands = successful_commands + 1,
      updated_at = NOW()
  WHERE id = p_conversation_id;

  RETURN v_command_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Get Policy Recommendation Score
-- =====================================================

CREATE OR REPLACE FUNCTION get_policy_recommendation_score(
  p_policy_id UUID,
  p_user_age INTEGER,
  p_budget INTEGER,
  p_family_size INTEGER,
  p_has_pre_existing BOOLEAN
)
RETURNS DECIMAL(5,4) AS $$
DECLARE
  v_score DECIMAL(5,4) := 0;
  v_policy_record RECORD;
BEGIN
  -- Get policy details
  SELECT * INTO v_policy_record
  FROM insurance_policies
  WHERE policy_id = p_policy_id;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  -- Base score from policy score view
  SELECT total_score INTO v_score
  FROM insurance_policy_score_vw
  WHERE policy_id = p_policy_id;

  -- Adjust for age compatibility
  IF p_user_age BETWEEN v_policy_record.entry_age_min AND v_policy_record.entry_age_max THEN
    v_score := v_score * 1.1; -- 10% bonus
  ELSE
    v_score := v_score * 0.5; -- 50% penalty
  END IF;

  -- Adjust for budget fit
  IF v_policy_record.annual_premium <= p_budget THEN
    v_score := v_score * 1.15; -- 15% bonus
  ELSIF v_policy_record.annual_premium <= p_budget * 1.2 THEN
    v_score := v_score * 0.95; -- 5% penalty
  ELSE
    v_score := v_score * 0.7; -- 30% penalty
  END IF;

  -- Adjust for family size (if family floater)
  IF p_family_size > 1 AND v_policy_record.type_of_plan = 'Family Floater' THEN
    v_score := v_score * 1.2; -- 20% bonus
  END IF;

  -- Adjust for pre-existing conditions
  IF p_has_pre_existing = true AND v_policy_record.pre_existing_disease_waiting_period_months < 48 THEN
    v_score := v_score * 1.1; -- 10% bonus for shorter waiting period
  END IF;

  RETURN LEAST(v_score, 1.0); -- Cap at 1.0
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON VIEW insurance_policy_score_vw IS 'Comprehensive policy scoring for recommendations';
COMMENT ON VIEW user_wellness_summary_vw IS 'User wellness points and activity summary';
COMMENT ON VIEW user_claim_summary_vw IS 'User claims history and success rate';
COMMENT ON VIEW popular_policies_vw IS 'Most popular and compared policies';
COMMENT ON VIEW hospital_network_summary_vw IS 'Hospital network coverage by location';

COMMENT ON FUNCTION calculate_wellness_points IS 'Calculate wellness points from activity metrics';
COMMENT ON FUNCTION get_discount_tier IS 'Get discount tier from monthly points';
COMMENT ON FUNCTION update_user_wellness_points IS 'Recalculate and update user wellness points';
COMMENT ON FUNCTION record_voice_command IS 'Record a voice command and update conversation';
COMMENT ON FUNCTION get_policy_recommendation_score IS 'Calculate personalized policy recommendation score';
