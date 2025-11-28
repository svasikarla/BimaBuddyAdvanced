-- =====================================================
-- BimaBuddy Advanced - Voice Assistant Tables
-- Migration: 004_voice_assistant.sql
-- Description: Phase 11 - Regional language voice interface
-- =====================================================

-- =====================================================
-- VOICE CONVERSATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS voice_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255) UNIQUE NOT NULL,

  -- Language
  language VARCHAR(10) NOT NULL CHECK (language IN (
    'en-IN', 'hi-IN', 'ta-IN', 'te-IN', 'bn-IN',
    'mr-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'pa-IN'
  )),

  -- Session Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),

  -- Conversation Metadata
  total_commands INTEGER DEFAULT 0,
  successful_commands INTEGER DEFAULT 0,
  failed_commands INTEGER DEFAULT 0,
  average_confidence DECIMAL(5,2),

  -- User Context (JSON)
  user_context JSONB DEFAULT '{}', -- name, age, location, family_size, etc.

  -- Intent Tracking
  intent_history JSONB DEFAULT '[]',
  most_common_intent VARCHAR(50),

  -- Emotion Trend
  emotion_trend JSONB DEFAULT '[]',
  dominant_emotion VARCHAR(20),

  -- Quality Metrics
  user_satisfaction_rating INTEGER CHECK (user_satisfaction_rating BETWEEN 1 AND 5),
  user_feedback TEXT,

  -- Session Duration
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VOICE COMMANDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS voice_commands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES voice_conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Language
  language VARCHAR(10) NOT NULL CHECK (language IN (
    'en-IN', 'hi-IN', 'ta-IN', 'te-IN', 'bn-IN',
    'mr-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'pa-IN'
  )),

  -- Audio Input
  audio_url TEXT,
  audio_duration_ms INTEGER,
  audio_format VARCHAR(20),

  -- Transcription
  raw_text TEXT NOT NULL,
  transcription TEXT NOT NULL,
  transcription_confidence DECIMAL(5,2),

  -- Intent Analysis
  intent VARCHAR(50) NOT NULL CHECK (intent IN (
    'compare_plans',
    'find_hospital',
    'explain_term',
    'file_claim',
    'check_policy',
    'get_quote',
    'track_claim',
    'wellness_status',
    'general_query',
    'navigation'
  )),
  intent_confidence DECIMAL(5,2) NOT NULL,

  -- Emotion Detection
  emotion VARCHAR(20) CHECK (emotion IN (
    'neutral', 'happy', 'stressed', 'confused', 'frustrated', 'urgent'
  )),
  emotion_confidence DECIMAL(5,2),

  -- Extracted Entities (JSON)
  entities JSONB DEFAULT '[]',

  -- Response
  response_text TEXT NOT NULL,
  response_audio_url TEXT,
  response_language VARCHAR(10),

  -- Performance Metrics
  transcription_time_ms INTEGER,
  intent_analysis_time_ms INTEGER,
  response_generation_time_ms INTEGER,
  tts_time_ms INTEGER,
  total_response_time_ms INTEGER,

  -- Context
  previous_intent VARCHAR(50),
  context_data JSONB,

  -- Quality
  was_successful BOOLEAN DEFAULT true,
  error_message TEXT,
  user_correction BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VOICE MESSAGES TABLE (Conversation History)
-- =====================================================
CREATE TABLE IF NOT EXISTS voice_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES voice_conversations(id) ON DELETE CASCADE NOT NULL,
  voice_command_id UUID REFERENCES voice_commands(id) ON DELETE SET NULL,

  -- Message Role
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),

  -- Message Content
  text TEXT NOT NULL,
  audio_url TEXT,
  language VARCHAR(10) NOT NULL,

  -- User Message Analysis (if role = 'user')
  intent VARCHAR(50),
  entities JSONB,
  emotion VARCHAR(20),

  -- Processing Metrics
  processing_time_ms INTEGER,
  tts_duration_ms INTEGER,

  -- Message Metadata
  is_automated BOOLEAN DEFAULT false,
  message_index INTEGER, -- Order in conversation

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VOICE SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS voice_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  -- Language Preferences
  preferred_language VARCHAR(10) DEFAULT 'en-IN' CHECK (preferred_language IN (
    'en-IN', 'hi-IN', 'ta-IN', 'te-IN', 'bn-IN',
    'mr-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'pa-IN'
  )),
  fallback_language VARCHAR(10) DEFAULT 'en-IN',

  -- Voice Preferences
  voice_speed DECIMAL(3,2) DEFAULT 1.0 CHECK (voice_speed BETWEEN 0.5 AND 2.0),
  voice_gender VARCHAR(10) DEFAULT 'neutral' CHECK (voice_gender IN ('male', 'female', 'neutral')),
  voice_pitch VARCHAR(10) DEFAULT 'normal' CHECK (voice_pitch IN ('low', 'normal', 'high')),

  -- Playback Settings
  auto_play_responses BOOLEAN DEFAULT true,
  audio_quality VARCHAR(20) DEFAULT 'standard' CHECK (audio_quality IN ('low', 'standard', 'high')),

  -- Accessibility
  hearing_assistance BOOLEAN DEFAULT false,
  speech_assistance BOOLEAN DEFAULT false,
  extended_pauses BOOLEAN DEFAULT false,
  text_size_preference VARCHAR(20) DEFAULT 'medium' CHECK (text_size_preference IN ('small', 'medium', 'large', 'extra_large')),

  -- Privacy
  save_recordings BOOLEAN DEFAULT true,
  voice_authentication_enabled BOOLEAN DEFAULT false,
  share_voice_data_for_improvement BOOLEAN DEFAULT true,

  -- Notifications
  voice_tip_of_day BOOLEAN DEFAULT true,
  voice_reminders BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VOICE AUTHENTICATION TABLE (Future: Voiceprint)
-- =====================================================
CREATE TABLE IF NOT EXISTS voice_authentication (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  voiceprint_id VARCHAR(255) UNIQUE NOT NULL,

  -- Biometric Data (encrypted)
  voiceprint_hash TEXT NOT NULL, -- Encrypted voiceprint signature
  voiceprint_metadata JSONB,

  -- Sample Information
  sample_count INTEGER DEFAULT 0,
  enrollment_completed BOOLEAN DEFAULT false,
  enrollment_quality_score DECIMAL(5,2),

  -- Security
  verification_threshold DECIMAL(5,4) DEFAULT 0.85 CHECK (verification_threshold BETWEEN 0 AND 1),
  failed_attempts_count INTEGER DEFAULT 0,
  max_failed_attempts INTEGER DEFAULT 3,
  locked_until TIMESTAMP WITH TIME ZONE,

  -- Verification History
  last_verified_at TIMESTAMP WITH TIME ZONE,
  total_verifications INTEGER DEFAULT 0,
  successful_verifications INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- VOICE ANALYTICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS voice_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Time Period
  analytics_date DATE NOT NULL,
  analytics_period VARCHAR(20) CHECK (analytics_period IN ('daily', 'weekly', 'monthly')),

  -- Usage Statistics
  total_conversations INTEGER DEFAULT 0,
  total_commands INTEGER DEFAULT 0,
  total_duration_seconds INTEGER DEFAULT 0,
  average_conversation_duration DECIMAL(8,2),

  -- Language Usage
  language_usage JSONB DEFAULT '{}', -- {language: count}
  primary_language VARCHAR(10),

  -- Intent Distribution
  intent_distribution JSONB DEFAULT '{}', -- {intent: count}
  most_common_intents JSONB DEFAULT '[]',

  -- Emotion Insights
  emotion_distribution JSONB DEFAULT '{}', -- {emotion: count}
  dominant_emotions JSONB DEFAULT '[]',

  -- Quality Metrics
  average_confidence DECIMAL(5,2),
  average_response_time_ms INTEGER,
  success_rate DECIMAL(5,2),
  user_correction_rate DECIMAL(5,2),

  -- Satisfaction
  average_satisfaction_rating DECIMAL(3,2),
  total_feedback_count INTEGER DEFAULT 0,

  -- Feature Usage
  features_used JSONB DEFAULT '[]',
  top_queries JSONB DEFAULT '[]',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_user_date_period UNIQUE (user_id, analytics_date, analytics_period)
);

-- =====================================================
-- VOICE FEEDBACK TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS voice_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_command_id UUID REFERENCES voice_commands(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES voice_conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Feedback Type
  feedback_type VARCHAR(50) CHECK (feedback_type IN (
    'thumbs_up',
    'thumbs_down',
    'transcription_error',
    'intent_mismatch',
    'response_unhelpful',
    'response_incorrect',
    'other'
  )),

  -- Rating
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),

  -- Feedback Content
  feedback_text TEXT,
  suggested_response TEXT,
  correct_intent VARCHAR(50),

  -- Metadata
  was_helpful BOOLEAN,
  issue_category VARCHAR(100),

  -- Resolution
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'closed')),
  admin_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VOICE LANGUAGE STATS TABLE (System-wide)
-- =====================================================
CREATE TABLE IF NOT EXISTS voice_language_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Language
  language VARCHAR(10) UNIQUE NOT NULL CHECK (language IN (
    'en-IN', 'hi-IN', 'ta-IN', 'te-IN', 'bn-IN',
    'mr-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'pa-IN'
  )),
  language_name VARCHAR(100) NOT NULL,
  native_name VARCHAR(100) NOT NULL,

  -- Usage Statistics
  total_users INTEGER DEFAULT 0,
  total_conversations INTEGER DEFAULT 0,
  total_commands INTEGER DEFAULT 0,

  -- Quality Metrics
  average_transcription_accuracy DECIMAL(5,2),
  average_intent_accuracy DECIMAL(5,2),
  average_user_satisfaction DECIMAL(3,2),

  -- Performance
  average_response_time_ms INTEGER,
  model_version VARCHAR(50),

  -- Status
  is_supported BOOLEAN DEFAULT true,
  is_beta BOOLEAN DEFAULT false,

  -- Timestamps
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Voice conversations indexes
CREATE INDEX idx_voice_conv_user ON voice_conversations(user_id);
CREATE INDEX idx_voice_conv_session ON voice_conversations(session_id);
CREATE INDEX idx_voice_conv_language ON voice_conversations(language);
CREATE INDEX idx_voice_conv_status ON voice_conversations(status);
CREATE INDEX idx_voice_conv_started ON voice_conversations(started_at DESC);

-- Voice commands indexes
CREATE INDEX idx_voice_cmd_conversation ON voice_commands(conversation_id);
CREATE INDEX idx_voice_cmd_user ON voice_commands(user_id);
CREATE INDEX idx_voice_cmd_language ON voice_commands(language);
CREATE INDEX idx_voice_cmd_intent ON voice_commands(intent);
CREATE INDEX idx_voice_cmd_emotion ON voice_commands(emotion);
CREATE INDEX idx_voice_cmd_created ON voice_commands(created_at DESC);
CREATE INDEX idx_voice_cmd_successful ON voice_commands(was_successful);

-- Voice messages indexes
CREATE INDEX idx_voice_msg_conversation ON voice_messages(conversation_id);
CREATE INDEX idx_voice_msg_command ON voice_messages(voice_command_id);
CREATE INDEX idx_voice_msg_role ON voice_messages(role);
CREATE INDEX idx_voice_msg_created ON voice_messages(created_at);

-- Voice settings indexes (user_id is primary key, no additional index needed)

-- Voice authentication indexes
CREATE INDEX idx_voice_auth_user ON voice_authentication(user_id);
CREATE INDEX idx_voice_auth_voiceprint ON voice_authentication(voiceprint_id);
CREATE INDEX idx_voice_auth_active ON voice_authentication(is_active);

-- Voice analytics indexes
CREATE INDEX idx_voice_analytics_user ON voice_analytics(user_id);
CREATE INDEX idx_voice_analytics_date ON voice_analytics(analytics_date DESC);
CREATE INDEX idx_voice_analytics_period ON voice_analytics(analytics_period);

-- Voice feedback indexes
CREATE INDEX idx_voice_feedback_command ON voice_feedback(voice_command_id);
CREATE INDEX idx_voice_feedback_conversation ON voice_feedback(conversation_id);
CREATE INDEX idx_voice_feedback_user ON voice_feedback(user_id);
CREATE INDEX idx_voice_feedback_type ON voice_feedback(feedback_type);
CREATE INDEX idx_voice_feedback_status ON voice_feedback(status);

-- Voice language stats indexes
CREATE INDEX idx_voice_lang_stats_language ON voice_language_stats(language);
CREATE INDEX idx_voice_lang_stats_supported ON voice_language_stats(is_supported);

-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================

CREATE TRIGGER update_voice_conv_updated_at BEFORE UPDATE ON voice_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voice_settings_updated_at BEFORE UPDATE ON voice_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voice_auth_updated_at BEFORE UPDATE ON voice_authentication
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA - Voice Language Stats
-- =====================================================

INSERT INTO voice_language_stats (language, language_name, native_name, is_supported, is_beta) VALUES
('en-IN', 'English (India)', 'English', true, false),
('hi-IN', 'Hindi', 'हिन्दी', true, false),
('ta-IN', 'Tamil', 'தமிழ்', true, false),
('te-IN', 'Telugu', 'తెలుగు', true, false),
('bn-IN', 'Bengali', 'বাংলা', true, false),
('mr-IN', 'Marathi', 'मराठी', true, false),
('gu-IN', 'Gujarati', 'ગુજરાતી', true, false),
('kn-IN', 'Kannada', 'ಕನ್ನಡ', true, false),
('ml-IN', 'Malayalam', 'മലയാളം', true, false),
('pa-IN', 'Punjabi', 'ਪੰਜਾਬੀ', true, false)
ON CONFLICT (language) DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE voice_conversations IS 'Voice assistant conversation sessions';
COMMENT ON TABLE voice_commands IS 'Individual voice commands with intent analysis';
COMMENT ON TABLE voice_messages IS 'Message history within conversations';
COMMENT ON TABLE voice_settings IS 'User voice assistant preferences';
COMMENT ON TABLE voice_authentication IS 'Voice biometric authentication (voiceprint)';
COMMENT ON TABLE voice_analytics IS 'Voice usage analytics and insights';
COMMENT ON TABLE voice_feedback IS 'User feedback on voice interactions';
COMMENT ON TABLE voice_language_stats IS 'System-wide language usage statistics';
