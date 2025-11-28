-- =====================================================
-- BimaBuddy Advanced - Wellness Integration Tables
-- Migration: 002_wellness_integration.sql
-- Description: Phase 9 - Fitness tracker to premium discount system
-- =====================================================

-- =====================================================
-- WELLNESS CONNECTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Provider Details
  provider VARCHAR(50) NOT NULL CHECK (provider IN ('terra', 'fitbit', 'apple_health', 'google_fit', 'garmin')),
  terra_user_id VARCHAR(255),
  fitbit_user_id VARCHAR(255),

  -- Connection Status
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'disconnected', 'error', 'pending')),

  -- OAuth Tokens (encrypted)
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,

  -- Sync Status
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_frequency_hours INTEGER DEFAULT 24,
  auto_sync_enabled BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_user_provider UNIQUE (user_id, provider)
);

-- =====================================================
-- WELLNESS ACTIVITIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  provider VARCHAR(50) NOT NULL CHECK (provider IN ('terra', 'fitbit', 'apple_health', 'google_fit', 'garmin')),

  -- Activity Date
  activity_date DATE NOT NULL,

  -- Daily Activity Metrics
  steps INTEGER DEFAULT 0,
  distance_meters INTEGER DEFAULT 0,
  calories_burned INTEGER DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,

  -- Exercise Data
  workout_duration_minutes INTEGER DEFAULT 0,
  workout_type VARCHAR(100),
  workout_intensity VARCHAR(20) CHECK (workout_intensity IN ('low', 'medium', 'high', 'very_high')),

  -- Health Metrics
  heart_rate_avg INTEGER,
  heart_rate_max INTEGER,
  heart_rate_min INTEGER,
  sleep_hours DECIMAL(4,2),
  sleep_quality_score INTEGER CHECK (sleep_quality_score BETWEEN 0 AND 100),

  -- Points and Rewards
  points_earned INTEGER DEFAULT 0,
  points_breakdown JSONB DEFAULT '{}', -- Details of how points were calculated

  -- Achievements Unlocked
  achievements_earned JSONB DEFAULT '[]',

  -- Data Quality
  data_completeness_score INTEGER CHECK (data_completeness_score BETWEEN 0 AND 100),
  data_source VARCHAR(50),

  -- Sync Details
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_user_activity_date UNIQUE (user_id, activity_date, provider)
);

-- =====================================================
-- WELLNESS POINTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_points (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  -- Points Totals
  total_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  monthly_points INTEGER DEFAULT 0,
  weekly_points INTEGER DEFAULT 0,
  daily_points INTEGER DEFAULT 0,

  -- Current Month/Week Tracking
  current_month INTEGER DEFAULT EXTRACT(MONTH FROM NOW()),
  current_year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
  current_week INTEGER DEFAULT EXTRACT(WEEK FROM NOW()),

  -- Streak Tracking
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,

  -- Premium Discount Conversion
  discount_tier VARCHAR(50) DEFAULT 'No Discount' CHECK (discount_tier IN ('No Discount', 'Bronze', 'Silver', 'Gold', 'Platinum')),
  premium_discount_percentage DECIMAL(5,2) DEFAULT 0,
  premium_discount_amount INTEGER DEFAULT 0,

  -- Tier Progress
  points_to_next_tier INTEGER DEFAULT 100,
  next_tier VARCHAR(50),

  -- Milestones
  total_days_active INTEGER DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  total_steps BIGINT DEFAULT 0,
  total_active_minutes INTEGER DEFAULT 0,

  -- Timestamps
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tier_achieved_at TIMESTAMP WITH TIME ZONE,
  discount_applied_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- ACTIVITY GOALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_goals (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  -- Daily Goals
  daily_steps_goal INTEGER DEFAULT 10000,
  daily_calories_goal INTEGER DEFAULT 500,
  daily_active_minutes_goal INTEGER DEFAULT 30,
  daily_sleep_hours_goal DECIMAL(4,2) DEFAULT 7.0,

  -- Weekly Goals
  weekly_active_minutes_goal INTEGER DEFAULT 150,
  weekly_workouts_goal INTEGER DEFAULT 5,

  -- Monthly Goals
  monthly_points_goal INTEGER DEFAULT 300,

  -- Goal Type
  goal_type VARCHAR(50) DEFAULT 'moderate' CHECK (goal_type IN ('beginner', 'moderate', 'advanced', 'custom')),

  -- Achievement Tracking
  goals_met_this_week INTEGER DEFAULT 0,
  goals_met_this_month INTEGER DEFAULT 0,
  goals_met_total INTEGER DEFAULT 0,

  -- Notifications
  goal_reminder_enabled BOOLEAN DEFAULT true,
  goal_reminder_time TIME DEFAULT '09:00:00',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- WELLNESS REWARDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Reward Details
  reward_type VARCHAR(50) NOT NULL CHECK (reward_type IN ('points', 'badge', 'premium_discount', 'gift_card', 'cashback', 'free_consultation')),
  reward_name VARCHAR(255) NOT NULL,
  reward_value INTEGER NOT NULL, -- Points value or rupees
  description TEXT,

  -- Reward Metadata
  badge_icon_url TEXT,
  coupon_code VARCHAR(100),
  terms_conditions TEXT,

  -- Status
  status VARCHAR(50) DEFAULT 'earned' CHECK (status IN ('earned', 'redeemed', 'expired', 'revoked')),

  -- Redemption
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  redeemed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,

  -- Redemption Details
  redemption_method VARCHAR(100),
  redemption_reference VARCHAR(255),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- WELLNESS ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Achievement Details
  achievement_name VARCHAR(255) NOT NULL UNIQUE,
  achievement_type VARCHAR(50) NOT NULL CHECK (achievement_type IN ('steps', 'workouts', 'streak', 'points', 'tier', 'milestone')),
  description TEXT,
  icon_emoji VARCHAR(10),

  -- Requirements
  requirement_value INTEGER NOT NULL,
  requirement_description TEXT,

  -- Rewards
  points_reward INTEGER DEFAULT 0,
  badge_url TEXT,

  -- Difficulty
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'legendary')),
  rarity VARCHAR(20) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER ACHIEVEMENTS TABLE (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES wellness_achievements(id) ON DELETE CASCADE NOT NULL,

  -- Achievement Progress
  progress_current INTEGER DEFAULT 0,
  progress_required INTEGER NOT NULL,
  progress_percentage INTEGER DEFAULT 0,

  -- Status
  is_unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

-- =====================================================
-- POINTS CALCULATION RULES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_points_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Rule Details
  rule_name VARCHAR(255) NOT NULL,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('steps', 'workout', 'sleep', 'active_minutes', 'calories', 'heart_rate')),

  -- Threshold and Points
  threshold_value INTEGER NOT NULL,
  points_awarded INTEGER NOT NULL,
  frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),

  -- Rule Priority (higher priority rules are applied first)
  priority INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PREMIUM DISCOUNT TIERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_discount_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Tier Details
  tier_name VARCHAR(50) NOT NULL UNIQUE CHECK (tier_name IN ('No Discount', 'Bronze', 'Silver', 'Gold', 'Platinum')),
  tier_order INTEGER NOT NULL UNIQUE,

  -- Points Requirements
  min_monthly_points INTEGER NOT NULL,
  max_monthly_points INTEGER NOT NULL,

  -- Discount
  discount_percentage DECIMAL(5,2) NOT NULL,

  -- Tier Benefits
  benefits JSONB DEFAULT '[]',
  badge_color VARCHAR(20),
  badge_icon_url TEXT,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Wellness connections indexes
CREATE INDEX idx_wellness_conn_user ON wellness_connections(user_id);
CREATE INDEX idx_wellness_conn_provider ON wellness_connections(provider);
CREATE INDEX idx_wellness_conn_status ON wellness_connections(status);
CREATE INDEX idx_wellness_conn_last_sync ON wellness_connections(last_sync_at);

-- Wellness activities indexes
CREATE INDEX idx_wellness_act_user ON wellness_activities(user_id);
CREATE INDEX idx_wellness_act_date ON wellness_activities(activity_date DESC);
CREATE INDEX idx_wellness_act_user_date ON wellness_activities(user_id, activity_date DESC);
CREATE INDEX idx_wellness_act_points ON wellness_activities(points_earned DESC);
CREATE INDEX idx_wellness_act_provider ON wellness_activities(provider);

-- Wellness points indexes (user_id is primary key, no additional index needed)

-- Activity goals indexes (user_id is primary key, no additional index needed)

-- Wellness rewards indexes
CREATE INDEX idx_wellness_rewards_user ON wellness_rewards(user_id);
CREATE INDEX idx_wellness_rewards_type ON wellness_rewards(reward_type);
CREATE INDEX idx_wellness_rewards_status ON wellness_rewards(status);
CREATE INDEX idx_wellness_rewards_earned ON wellness_rewards(earned_at DESC);

-- User achievements indexes
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_unlocked ON user_achievements(is_unlocked);

-- Points rules indexes
CREATE INDEX idx_points_rules_type ON wellness_points_rules(activity_type);
CREATE INDEX idx_points_rules_active ON wellness_points_rules(is_active);
CREATE INDEX idx_points_rules_priority ON wellness_points_rules(priority DESC);

-- Discount tiers indexes
CREATE INDEX idx_discount_tiers_name ON wellness_discount_tiers(tier_name);
CREATE INDEX idx_discount_tiers_order ON wellness_discount_tiers(tier_order);

-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================

CREATE TRIGGER update_wellness_conn_updated_at BEFORE UPDATE ON wellness_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_points_updated_at BEFORE UPDATE ON wellness_points
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activity_goals_updated_at BEFORE UPDATE ON activity_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_points_rules_updated_at BEFORE UPDATE ON wellness_points_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discount_tiers_updated_at BEFORE UPDATE ON wellness_discount_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA - Default Points Rules
-- =====================================================

INSERT INTO wellness_points_rules (rule_name, activity_type, threshold_value, points_awarded, frequency, priority, is_active) VALUES
('5K Steps Daily', 'steps', 5000, 10, 'daily', 1, true),
('10K Steps Daily', 'steps', 10000, 25, 'daily', 2, true),
('15K Steps Daily', 'steps', 15000, 50, 'daily', 3, true),
('30-Min Workout', 'workout', 30, 20, 'daily', 1, true),
('60-Min Workout', 'workout', 60, 40, 'daily', 2, true),
('150 Active Minutes Weekly', 'active_minutes', 150, 30, 'weekly', 1, true),
('7 Hours Sleep', 'sleep', 7, 15, 'daily', 1, true),
('300 Active Minutes Weekly', 'active_minutes', 300, 60, 'weekly', 2, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SEED DATA - Premium Discount Tiers
-- =====================================================

INSERT INTO wellness_discount_tiers (tier_name, tier_order, min_monthly_points, max_monthly_points, discount_percentage, badge_color, benefits) VALUES
('No Discount', 0, 0, 99, 0.00, '#gray', '["Access to wellness dashboard", "Activity tracking"]'),
('Bronze', 1, 100, 299, 2.00, '#CD7F32', '["2% premium discount", "Basic fitness insights", "Monthly wellness report"]'),
('Silver', 2, 300, 599, 5.00, '#C0C0C0', '["5% premium discount", "Advanced fitness insights", "Priority customer support", "Free health checkup voucher"]'),
('Gold', 3, 600, 999, 8.00, '#FFD700', '["8% premium discount", "Personalized fitness coach", "Telemedicine credits", "Premium achievement badges"]'),
('Platinum', 4, 1000, 999999, 12.00, '#E5E4E2', '["12% premium discount", "Dedicated wellness manager", "Unlimited telemedicine", "Exclusive wellness rewards", "Premium gift cards"]')
ON CONFLICT (tier_name) DO NOTHING;

-- =====================================================
-- SEED DATA - Wellness Achievements
-- =====================================================

INSERT INTO wellness_achievements (achievement_name, achievement_type, description, icon_emoji, requirement_value, points_reward, difficulty_level, rarity, is_active) VALUES
('First Steps', 'steps', 'Complete your first day of activity tracking', '👣', 1000, 10, 'easy', 'common', true),
('Week Warrior', 'streak', 'Maintain a 7-day activity streak', '🔥', 7, 50, 'medium', 'rare', true),
('Month Master', 'streak', 'Maintain a 30-day activity streak', '⭐', 30, 200, 'hard', 'epic', true),
('Step Master', 'steps', 'Walk 100,000 total steps', '🚶', 100000, 100, 'medium', 'rare', true),
('Workout Warrior', 'workouts', 'Complete 50 workouts', '💪', 50, 150, 'hard', 'epic', true),
('Bronze Achiever', 'tier', 'Reach Bronze wellness tier', '🥉', 100, 25, 'easy', 'common', true),
('Silver Achiever', 'tier', 'Reach Silver wellness tier', '🥈', 300, 50, 'medium', 'rare', true),
('Gold Achiever', 'tier', 'Reach Gold wellness tier', '🥇', 600, 100, 'hard', 'epic', true),
('Platinum Legend', 'tier', 'Reach Platinum wellness tier', '💎', 1000, 200, 'legendary', 'legendary', true),
('Early Riser', 'milestone', 'Complete 30 morning workouts', '🌅', 30, 75, 'medium', 'rare', true),
('Night Owl', 'milestone', 'Complete 30 evening workouts', '🌙', 30, 75, 'medium', 'rare', true),
('Marathon Ready', 'steps', 'Walk 42,195 steps in a single day (marathon distance)', '🏃', 42195, 250, 'legendary', 'legendary', true)
ON CONFLICT (achievement_name) DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE wellness_connections IS 'Fitness tracker connections (Terra API, Fitbit, etc.)';
COMMENT ON TABLE wellness_activities IS 'Daily activity data synced from fitness trackers';
COMMENT ON TABLE wellness_points IS 'User wellness points totals and discount tiers';
COMMENT ON TABLE activity_goals IS 'User fitness goals and targets';
COMMENT ON TABLE wellness_rewards IS 'Earned wellness rewards and redemptions';
COMMENT ON TABLE wellness_achievements IS 'Available wellness achievements/badges';
COMMENT ON TABLE user_achievements IS 'User progress on wellness achievements';
COMMENT ON TABLE wellness_points_rules IS 'Rules for calculating wellness points';
COMMENT ON TABLE wellness_discount_tiers IS 'Premium discount tiers based on monthly points';
