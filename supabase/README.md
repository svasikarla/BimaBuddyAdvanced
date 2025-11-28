# BimaBuddy Advanced - Database Setup Guide

## Overview

This directory contains all the database migrations needed to set up the complete BimaBuddy Advanced database schema in Supabase (PostgreSQL).

## Database Architecture

The database is organized into 5 major migration files:

1. **001_core_tables.sql** - Core insurance and user tables
2. **002_wellness_integration.sql** - Phase 9: Wellness & fitness tracking
3. **003_claim_intelligence.sql** - Phase 10: ML-based claim prediction
4. **004_voice_assistant.sql** - Phase 11: Regional voice interface
5. **005_views_and_functions.sql** - Views, functions, and stored procedures

## Database Statistics

- **Total Tables**: 45+
- **Total Views**: 5
- **Total Functions**: 5
- **Total Indexes**: 100+
- **Estimated Size**: ~50MB (empty), ~5GB (with production data)

## Table Breakdown

### Core Tables (Migration 001)
- `users` - User accounts and profiles
- `insurance_companies` - Insurance providers
- `insurance_policies` - Available health insurance policies
- `insurance_policy_features` - Policy features and benefits
- `user_policies` - User's purchased policies
- `policy_comparisons` - Comparison history
- `network_hospitals` - Hospital network directory

### Wellness Integration (Migration 002)
- `wellness_connections` - Fitness tracker connections (Terra, Fitbit, etc.)
- `wellness_activities` - Daily activity data
- `wellness_points` - User points and discount tiers
- `activity_goals` - Fitness goals
- `wellness_rewards` - Earned rewards
- `wellness_achievements` - Available achievements
- `user_achievements` - User achievement progress
- `wellness_points_rules` - Points calculation rules
- `wellness_discount_tiers` - Premium discount tiers

### Claim Intelligence (Migration 003)
- `claims` - Health insurance claims
- `claim_predictions` - ML-based predictions
- `claim_documents` - Uploaded documents
- `claim_status_history` - Status audit trail
- `claim_notifications` - User notifications
- `claim_actions` - Required actions
- `hospital_success_rates` - Hospital statistics
- `diagnosis_coverage` - Coverage by diagnosis
- `claim_factors_analysis` - Prediction factor breakdown
- `claim_similar_cases` - Historical case studies

### Voice Assistant (Migration 004)
- `voice_conversations` - Voice session tracking
- `voice_commands` - Individual commands with intent
- `voice_messages` - Message history
- `voice_settings` - User preferences
- `voice_authentication` - Voiceprint biometrics
- `voice_analytics` - Usage analytics
- `voice_feedback` - User feedback
- `voice_language_stats` - System-wide language stats

### Views & Functions (Migration 005)
- `insurance_policy_score_vw` - Policy scoring
- `user_wellness_summary_vw` - Wellness summary
- `user_claim_summary_vw` - Claim summary
- `popular_policies_vw` - Top policies
- `hospital_network_summary_vw` - Hospital coverage

## Setup Instructions

### Option 1: Manual Setup via Supabase Dashboard

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Execute Migrations in Order**
   - Navigate to SQL Editor
   - Run migrations in sequence:
     ```
     001_core_tables.sql
     002_wellness_integration.sql
     003_claim_intelligence.sql
     004_voice_assistant.sql
     005_views_and_functions.sql
     ```

3. **Verify Setup**
   ```sql
   -- Check tables
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;

   -- Check views
   SELECT table_name FROM information_schema.views
   WHERE table_schema = 'public';

   -- Check functions
   SELECT routine_name FROM information_schema.routines
   WHERE routine_schema = 'public';
   ```

### Option 2: Using Supabase CLI

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Initialize Project**
   ```bash
   supabase init
   ```

3. **Link to Project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Run Migrations**
   ```bash
   supabase db push
   ```

### Option 3: Using psql (Direct PostgreSQL)

1. **Connect to Database**
   ```bash
   psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

2. **Run Migrations**
   ```bash
   \i supabase/migrations/001_core_tables.sql
   \i supabase/migrations/002_wellness_integration.sql
   \i supabase/migrations/003_claim_intelligence.sql
   \i supabase/migrations/004_voice_assistant.sql
   \i supabase/migrations/005_views_and_functions.sql
   ```

## Environment Variables Required

After setting up the database, ensure these environment variables are configured in `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional: Direct Database Connection (for migrations)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## Seed Data Included

The following seed data is automatically inserted:

### Wellness Points Rules (8 rules)
- 5K Steps Daily → 10 points
- 10K Steps Daily → 25 points
- 15K Steps Daily → 50 points
- 30-Min Workout → 20 points
- 60-Min Workout → 40 points
- 150 Active Minutes Weekly → 30 points
- 7 Hours Sleep → 15 points
- 300 Active Minutes Weekly → 60 points

### Premium Discount Tiers (5 tiers)
- No Discount: 0-99 points → 0%
- Bronze: 100-299 points → 2%
- Silver: 300-599 points → 5%
- Gold: 600-999 points → 8%
- Platinum: 1000+ points → 12%

### Wellness Achievements (12 achievements)
- First Steps, Week Warrior, Month Master
- Step Master, Workout Warrior
- Bronze/Silver/Gold/Platinum Achiever
- Early Riser, Night Owl, Marathon Ready

### Voice Language Support (10 languages)
- English (India), Hindi, Tamil, Telugu, Bengali
- Marathi, Gujarati, Kannada, Malayalam, Punjabi

## Row-Level Security (RLS)

⚠️ **Important**: After running migrations, you'll need to configure Row-Level Security policies in Supabase Dashboard.

### Recommended Policies

1. **Users Table**
   ```sql
   -- Users can view their own profile
   CREATE POLICY "Users can view own profile"
   ON users FOR SELECT
   USING (auth.uid() = id);

   -- Users can update their own profile
   CREATE POLICY "Users can update own profile"
   ON users FOR UPDATE
   USING (auth.uid() = id);
   ```

2. **User Policies Table**
   ```sql
   -- Users can view their own policies
   CREATE POLICY "Users can view own policies"
   ON user_policies FOR SELECT
   USING (auth.uid() = user_id);
   ```

3. **Wellness Data**
   ```sql
   -- Users can view their own wellness data
   CREATE POLICY "Users can view own wellness"
   ON wellness_activities FOR SELECT
   USING (auth.uid() = user_id);

   -- Users can insert their own wellness data
   CREATE POLICY "Users can insert own wellness"
   ON wellness_activities FOR INSERT
   WITH CHECK (auth.uid() = user_id);
   ```

4. **Claims**
   ```sql
   -- Users can view their own claims
   CREATE POLICY "Users can view own claims"
   ON claims FOR SELECT
   USING (auth.uid() = user_id);

   -- Users can create their own claims
   CREATE POLICY "Users can create own claims"
   ON claims FOR INSERT
   WITH CHECK (auth.uid() = user_id);
   ```

5. **Voice Data**
   ```sql
   -- Users can view their own voice data
   CREATE POLICY "Users can view own voice conversations"
   ON voice_conversations FOR SELECT
   USING (auth.uid() = user_id);

   -- Users can create their own voice conversations
   CREATE POLICY "Users can create own voice conversations"
   ON voice_conversations FOR INSERT
   WITH CHECK (auth.uid() = user_id);
   ```

## Database Maintenance

### Recommended Indexes (Already Created)

All necessary indexes are created automatically by the migration scripts. Key indexes include:

- User email, phone
- Policy company, type, premium
- Claims status, user, date
- Wellness activities user, date
- Voice conversations user, date

### Performance Monitoring

```sql
-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Check slow queries
SELECT
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;
```

### Backup Recommendations

1. **Automated Backups** (Supabase Pro)
   - Daily automated backups
   - 7-day retention

2. **Manual Backups**
   ```bash
   # Export entire database
   pg_dump -h db.your-project-ref.supabase.co -U postgres -d postgres > backup.sql

   # Export specific tables
   pg_dump -h db.your-project-ref.supabase.co -U postgres -d postgres -t users -t user_policies > user_data.sql
   ```

3. **Point-in-Time Recovery** (Supabase Pro+)
   - Restore to any point in last 30 days

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Ensure you're logged in as a superuser or have appropriate permissions
   - Check RLS policies if queries return empty results

2. **Migration Already Run**
   - If migrations fail because tables exist, either:
     - Drop existing tables: `DROP TABLE table_name CASCADE;`
     - Or skip to next migration

3. **Function Creation Errors**
   - Ensure you have `plpgsql` extension enabled
   - Check function syntax for PostgreSQL version compatibility

4. **View Creation Errors**
   - Ensure all dependent tables exist first
   - Check for circular dependencies

### Rollback Migrations

If you need to rollback:

```sql
-- Drop all views
DROP VIEW IF EXISTS insurance_policy_score_vw CASCADE;
DROP VIEW IF EXISTS user_wellness_summary_vw CASCADE;
DROP VIEW IF EXISTS user_claim_summary_vw CASCADE;
DROP VIEW IF EXISTS popular_policies_vw CASCADE;
DROP VIEW IF EXISTS hospital_network_summary_vw CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS calculate_wellness_points CASCADE;
DROP FUNCTION IF EXISTS get_discount_tier CASCADE;
DROP FUNCTION IF EXISTS update_user_wellness_points CASCADE;
DROP FUNCTION IF EXISTS record_voice_command CASCADE;
DROP FUNCTION IF EXISTS get_policy_recommendation_score CASCADE;

-- Drop tables in reverse order (to handle foreign keys)
-- Voice Assistant
DROP TABLE IF EXISTS voice_language_stats CASCADE;
DROP TABLE IF EXISTS voice_feedback CASCADE;
DROP TABLE IF EXISTS voice_analytics CASCADE;
DROP TABLE IF EXISTS voice_authentication CASCADE;
DROP TABLE IF EXISTS voice_settings CASCADE;
DROP TABLE IF EXISTS voice_messages CASCADE;
DROP TABLE IF EXISTS voice_commands CASCADE;
DROP TABLE IF EXISTS voice_conversations CASCADE;

-- Claim Intelligence
DROP TABLE IF EXISTS claim_similar_cases CASCADE;
DROP TABLE IF EXISTS claim_factors_analysis CASCADE;
DROP TABLE IF EXISTS diagnosis_coverage CASCADE;
DROP TABLE IF EXISTS hospital_success_rates CASCADE;
DROP TABLE IF EXISTS claim_actions CASCADE;
DROP TABLE IF EXISTS claim_notifications CASCADE;
DROP TABLE IF EXISTS claim_status_history CASCADE;
DROP TABLE IF EXISTS claim_documents CASCADE;
DROP TABLE IF EXISTS claim_predictions CASCADE;
DROP TABLE IF EXISTS claims CASCADE;

-- Wellness Integration
DROP TABLE IF EXISTS wellness_discount_tiers CASCADE;
DROP TABLE IF EXISTS wellness_points_rules CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS wellness_achievements CASCADE;
DROP TABLE IF EXISTS wellness_rewards CASCADE;
DROP TABLE IF EXISTS activity_goals CASCADE;
DROP TABLE IF EXISTS wellness_points CASCADE;
DROP TABLE IF EXISTS wellness_activities CASCADE;
DROP TABLE IF EXISTS wellness_connections CASCADE;

-- Core Tables
DROP TABLE IF EXISTS network_hospitals CASCADE;
DROP TABLE IF EXISTS policy_comparisons CASCADE;
DROP TABLE IF EXISTS user_policies CASCADE;
DROP TABLE IF EXISTS insurance_policy_features CASCADE;
DROP TABLE IF EXISTS insurance_policies CASCADE;
DROP TABLE IF EXISTS insurance_companies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
```

## Support

For issues or questions:
- **Supabase Documentation**: https://supabase.com/docs
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **BimaBuddy GitHub Issues**: https://github.com/svasikarla/BimaBuddyAdvanced/issues

## License

This database schema is part of the BimaBuddy Advanced project.
