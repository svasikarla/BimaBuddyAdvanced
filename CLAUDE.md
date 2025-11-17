# CLAUDE.md - BimaBuddy Advanced

## Project Overview

BimaBuddy Advanced is a comprehensive health insurance comparison platform for India, built with Next.js 15, featuring AI-powered chatbot assistance and multilingual support. The platform helps users compare policies, understand terms, and make informed decisions about health insurance.

## Tech Stack

- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript
- **UI Components**: Radix UI + Tailwind CSS
- **Database**: Supabase
- **AI Integration**: OpenAI API (chatbot)
- **Voice**: ElevenLabs (voice agent)
- **Styling**: Tailwind CSS with custom animations
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod

## Project Structure

```
/app
  ├── page.tsx                          # Homepage
  ├── layout.tsx                        # Root layout with error boundary
  ├── analytics/                        # Analytics dashboard
  ├── wellness/                         # Wellness rewards dashboard (NEW - Phase 9)
  │   ├── page.tsx                      # Main wellness page
  │   └── callback/page.tsx             # OAuth callback handler
  ├── ayushman-bharat/                  # Ayushman Bharat scheme info
  ├── find-best-plan/                   # Plan recommendation wizard
  ├── policy-bare-open/                 # Policy comparison tools
  ├── policy-school/                    # Educational content
  ├── compare-plans/                    # Side-by-side comparison
  ├── all-policies/                     # Policy listing
  ├── claim-rejection-predictor/        # ML-based claim predictor
  ├── policy-details/[id]/              # Dynamic policy detail pages
  └── api/
      ├── chat/route.ts                 # Chatbot API endpoint
      ├── openai/route.ts               # OpenAI integration
      ├── elevenlabs/route.ts           # Voice agent API
      └── wellness/                     # Wellness API endpoints (NEW - Phase 9)
          ├── connect/route.ts          # Terra widget session
          ├── webhook/route.ts          # Terra data webhook
          ├── status/route.ts           # Connection status
          └── sync/route.ts             # Manual data sync

/components
  ├── charts/                           # Data visualization components
  │   ├── premium-comparison-chart.tsx  # Bar chart for premium comparison
  │   ├── coverage-breakdown-chart.tsx  # Donut chart for coverage
  │   ├── premium-trend-chart.tsx       # Line/Area chart for trends
  │   └── policy-radar-chart.tsx        # Spider chart for features
  ├── ui/                               # UI components
  │   ├── ai-badge.tsx                  # AI feature indicator
  │   ├── skeleton-loader.tsx           # Loading states
  │   ├── empty-state.tsx               # Empty state component
  │   ├── success-celebration.tsx       # Confetti animation
  │   ├── interactive-card.tsx          # Animated card
  │   ├── enhanced-policy-card.tsx      # Advanced policy card
  │   ├── animated-comparison.tsx       # Comparison table
  │   ├── animated-risk-meter.tsx       # Circular progress meter
  │   ├── typing-effect.tsx             # Typing animation
  │   └── optimized-image.tsx           # Lazy-loaded images
  ├── wellness-dashboard.tsx            # Wellness tracking dashboard (NEW - Phase 9)
  ├── terra-connect-widget.tsx          # Fitness tracker connection (NEW - Phase 9)
  ├── page-transition.tsx               # Page animations
  ├── mobile-bottom-nav.tsx             # Mobile navigation
  ├── error-boundary.tsx                # Error handling
  └── analytics-dashboard.tsx           # Analytics dashboard

/hooks
  ├── use-scroll-animation.ts           # Scroll-triggered animations
  ├── use-reduced-motion.ts             # Accessibility hook
  └── use-api.ts                        # Data fetching hooks

/lib
  ├── performance.ts                    # Performance utilities
  ├── language-utils.ts                 # i18n formatting
  ├── api.ts                            # API client with retry
  ├── error-handler.ts                  # Error handling
  ├── terra-client.ts                   # Terra API integration (NEW - Phase 9)
  ├── wellness-service.ts               # Points & rewards logic (NEW - Phase 9)
  └── types/
      └── wellness.ts                   # Wellness type definitions (NEW - Phase 9)

/public                                 # Static assets
/styles                                 # Global styles
```

## Key Features

### Core Features
1. **Policy Comparison**: Side-by-side comparison of health insurance policies
2. **AI Chatbot**: OpenAI-powered assistant with quick reply chips and actions
3. **Voice Agent**: ElevenLabs integration for voice interactions
4. **Multilingual**: Support for 10 Indian languages with formatting utilities
5. **Claim Predictor**: ML-based claim rejection prediction with animated risk meter
6. **Educational Content**: Policy school for insurance literacy

### New Advanced Features (Phases 4-8)

#### Data Visualization & Analytics
- **Analytics Dashboard**: Comprehensive dashboard with 4 interactive tabs
- **Premium Comparison Charts**: Bar charts comparing policies
- **Coverage Breakdown**: Donut charts showing coverage distribution
- **Trend Analysis**: Line/Area charts for age-based premium trends
- **Feature Comparison**: Radar charts comparing policy features
- **AI-Powered Insights**: Automated recommendations and analysis

#### UI/UX Enhancements
- **Page Transitions**: Smooth animations between pages
- **Micro-interactions**: Hover effects, tap animations on cards
- **Loading States**: 5+ skeleton loader variants
- **Empty States**: User-friendly no-data displays
- **Success Celebrations**: Confetti animations for positive outcomes
- **Animated Risk Meter**: Circular progress with color coding
- **Typing Effects**: Character-by-character animations

#### Mobile Experience
- **Bottom Navigation**: 5-item mobile nav with scroll behavior
- **Touch Optimizations**: 44x44px tap targets
- **Responsive Design**: Mobile-first utility classes
- **Safe Area Support**: iOS notch compatibility

#### Accessibility
- **Focus-Visible Styles**: Enhanced keyboard navigation
- **Skip-to-Content**: Screen reader support
- **Reduced Motion**: Respects user preferences
- **Error Boundaries**: Graceful error recovery

#### Performance
- **Lazy Loading**: Intersection Observer for images
- **Animation Quality**: Device-based optimization
- **Web Vitals Monitoring**: CLS, FID, FCP, LCP, TTFB tracking
- **Request Idle Callback**: Non-critical task scheduling

#### API & Data Management
- **Automatic Retry**: Exponential backoff on failures
- **In-Memory Cache**: 5-minute TTL, pattern-based clearing
- **Custom Hooks**: useAPI, useMutation, usePagination
- **Error Handling**: Typed errors with user-friendly messages
- **Form Validation**: 8+ common validators

#### Multilingual Support
- **47+ Translation Keys**: Navigation, actions, forms, messages
- **Currency Formatting**: Indian numbering (₹, lakhs, crores)
- **Date Formatting**: Locale-aware (10 Indian languages)
- **Phone Formatting**: +91 XXXXX XXXXX
- **PIN Validation**: 6-digit Indian format
- **Time-based Greetings**: Context-aware by language

### Phase 9: Wellness Integration (NEW) ⭐

A groundbreaking feature that connects fitness tracking with health insurance premiums, incentivizing healthy lifestyles.

#### Overview
- **Integration**: Terra API (supports 150+ devices) + Fitbit direct
- **Coverage**: Apple Health, Google Fit, Fitbit, Garmin, and more
- **Cost**: FREE for first 10K users (Terra's 100K free credits/month)
- **Premium Discount**: Up to 12% off based on activity

#### Features

**Fitness Tracker Connection**
- **Multi-Provider Support**: Connect Apple Health, Google Fit, Fitbit, or Garmin
- **OAuth Integration**: Secure Terra widget for device authentication
- **Automatic Sync**: Real-time activity data via webhooks
- **Manual Sync**: On-demand data refresh (last 30 days)

**Points & Rewards System**
- **Activity-Based Points**: Earn points for steps, workouts, sleep
  - 5,000 steps = 10 points
  - 10,000 steps = 25 points
  - 15,000 steps = 50 points
  - 30-min workout = 20 points
  - 60-min workout = 40 points
  - 7+ hours sleep = 15 points
  - 150+ weekly active minutes = 30 points

**Premium Discount Tiers**
| Tier | Monthly Points | Discount | Annual Savings (₹15K policy) |
|------|----------------|----------|------------------------------|
| Bronze | 100-299 | 2% | ₹300 |
| Silver | 300-599 | 5% | ₹750 |
| Gold | 600-999 | 8% | ₹1,200 |
| Platinum | 1000+ | 12% | ₹1,800 |

**Wellness Dashboard**
- **3 Interactive Tabs**: Overview, Activity, Achievements
- **Key Metrics Cards**: Total points, discount %, current streak, avg daily steps
- **Activity Charts**:
  - 7-day steps trend (area chart)
  - Points earned (bar chart)
  - Activity summary cards
- **Tier Progress Bar**: Visual progress to next tier
- **Recent Activities Feed**: Last 10 activities with points earned
- **Achievements System**: 9 unlockable badges
  - First Steps, Week Warrior (7-day streak), Month Master (30-day)
  - Step Master (100K steps), Workout Warrior (50 workouts)
  - Bronze/Silver/Gold/Platinum tier badges

**Gamification Elements**
- **Streak Tracking**: Current & longest activity streaks
- **Motivational Messages**: Context-aware encouragement
- **Achievement Badges**: Visual milestones with emoji icons
- **Progress Visualization**: Animated charts and meters

#### Technical Implementation

**Terra API Client** (`lib/terra-client.ts`)
```typescript
- generateWidgetSession(): Creates auth session for device connection
- getDailyActivity(): Fetches step count, calories, active minutes
- getActivity(): Retrieves workout data
- getSleep(): Gets sleep duration and quality
- parseWebhookPayload(): Processes real-time updates
```

**Wellness Service** (`lib/wellness-service.ts`)
```typescript
- calculateActivityPoints(): Applies points rules to activities
- getDiscountTier(): Determines tier from monthly points
- calculatePremiumDiscount(): Computes savings on premium
- calculateStreak(): Tracks consecutive active days
- calculateStats(): Generates comprehensive wellness statistics
- getAchievements(): Returns earned/locked badges
```

**API Endpoints**
- `POST /api/wellness/connect`: Generate Terra widget session
- `POST /api/wellness/webhook`: Receive real-time activity updates
- `GET /api/wellness/status`: Check connection status
- `POST /api/wellness/sync`: Manually sync last 30 days

**Database Schema**
```typescript
wellness_connections: User-provider connection tracking
wellness_activities: Daily activity records with points
wellness_points: User point totals and tier info
activity_goals: Personalized daily/weekly goals
wellness_rewards: Earned rewards and redemption
```

#### User Flow

1. **Connection**: User clicks "Wellness" in navigation
2. **Device Selection**: Choose from Fitbit, Apple Health, Google Fit, Garmin
3. **Authorization**: Terra widget opens, user grants permissions
4. **Callback Handling**: OAuth redirect, save connection to DB
5. **Initial Sync**: Fetch last 30 days of activity data
6. **Points Calculation**: Apply rules, award points
7. **Dashboard Display**: Show stats, charts, achievements
8. **Ongoing Sync**: Webhooks update data automatically
9. **Premium Application**: Discount applied at policy renewal

#### Future Enhancements
- **Personalized Goals**: AI-recommended daily targets
- **Social Features**: Friend challenges and leaderboards
- **Wellness Coach**: AI chatbot for fitness advice
- **Health Metrics**: Heart rate zones, VO2 max tracking
- **Nutrition Integration**: MyFitnessPal, HealthifyMe
- **Mental Wellness**: Meditation app connections (Calm, Headspace)
- **Telemedicine Credits**: Free consultations for high activity

#### Competitive Advantage
- **ZERO competitors** in Indian health insurance offer fitness-to-premium conversion
- **Market potential**: $197B preventive healthcare market (22% CAGR)
- **User retention**: +25% from wellness engagement
- **Premium optimization**: ₹2,000 average annual savings per user

## Environment Setup

Required environment variables in `.env.local`:

```bash
# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# ElevenLabs (if using voice features)
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Terra API Configuration (Phase 9 - Wellness Integration)
# Sign up at https://tryterra.co to get your credentials
NEXT_PUBLIC_TERRA_DEV_ID=your_terra_dev_id
TERRA_API_KEY=your_terra_api_key

# Fitbit API (optional - for direct integration fallback)
FITBIT_CLIENT_ID=your_fitbit_client_id
FITBIT_CLIENT_SECRET=your_fitbit_client_secret
```

**Terra API Setup Instructions:**
1. Visit [tryterra.co](https://tryterra.co) and create a free account
2. Navigate to Dashboard → Settings → API Keys
3. Copy your `Dev ID` and `API Key`
4. Add them to your `.env.local` file
5. Free tier includes 100,000 credits/month (sufficient for 10K users)

See `.env.example` for complete template.

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Working with Claude Code

### Common Tasks

#### Adding a New Policy Page
1. Create new route in `/app/[policy-name]/page.tsx`
2. Use existing components from `/components` for consistency
3. Follow the pattern from existing policy pages
4. Update navigation if needed in layout components

#### Modifying the Chatbot
- API logic: `/app/api/chat/route.ts`
- Frontend component: Check `/components` for chat UI
- System prompts and behavior are configured in the API route
- Remember to handle multilingual responses

#### Adding API Endpoints
1. Create route handler in `/app/api/[endpoint]/route.ts`
2. Export `GET`, `POST`, `PUT`, `DELETE` as needed
3. Handle errors appropriately
4. Consider rate limiting for AI APIs

#### UI Component Updates
- Reusable components are in `/components`
- Use Radix UI primitives for consistency
- Apply Tailwind classes for styling
- Check `components.json` for component configuration

### Code Style Guidelines

1. **TypeScript**: Use strict typing, avoid `any`
2. **Components**: Prefer functional components with hooks
3. **Naming**: Use kebab-case for files, PascalCase for components
4. **API Routes**: Use try-catch for error handling
5. **Styling**: Use Tailwind utility classes, avoid inline styles

### Important Patterns

#### Data Fetching
```typescript
// Use Supabase client for database queries
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(url, key)
```

#### Form Handling
```typescript
// Use React Hook Form + Zod validation
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
```

#### AI Integration
- Chatbot uses OpenAI API with streaming responses
- Handle rate limits and API errors gracefully
- Implement fallback responses for API failures

### Multilingual Support

The app supports these languages:
- English, Hindi, Tamil, Telugu, Bengali
- Marathi, Gujarati, Kannada, Malayalam, Punjabi

When adding new content:
- Ensure all user-facing text supports localization
- Check existing language handling patterns
- Test with multiple languages

### Database (Supabase)

- Policy data is stored in Supabase
- Use the Supabase client for queries
- Consider implementing caching for frequently accessed data
- Handle authentication states if adding protected routes

## Testing Considerations

- Test chatbot responses across languages
- Verify policy comparison logic with edge cases
- Test responsive design on mobile devices
- Validate form submissions with various inputs
- Check API rate limiting behavior

## Deployment

The project is set up for Vercel deployment:
- Environment variables must be set in Vercel dashboard
- Build command: `npm run build`
- Output directory: `.next`
- Node.js version: 18.x or later

## Troubleshooting

### Common Issues

1. **API Key Errors**: Verify `.env.local` variables are set correctly
2. **Build Failures**: Check TypeScript errors with `npm run lint`
3. **Supabase Connection**: Confirm credentials and network access
4. **OpenAI Rate Limits**: Implement retry logic and user feedback

### Dependencies

- Major version updates should be tested thoroughly
- Next.js 15 uses React 19 - ensure compatibility
- Radix UI components have specific version requirements

## Git Workflow

Current branch: `claude/create-claude-md-01N8iRjuCiabdTxx18ig5SoB`

When making changes:
1. Develop on the designated feature branch
2. Commit with clear, descriptive messages
3. Push to origin with `git push -u origin <branch-name>`
4. Create PR when feature is complete

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Radix UI Components](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Notes for AI Assistants

- Prioritize user experience and accessibility
- Maintain consistent UI/UX patterns across the app
- Consider performance implications of AI API calls
- Ensure all features work across supported languages
- Follow Next.js App Router best practices
- Keep security in mind (API keys, user data)
