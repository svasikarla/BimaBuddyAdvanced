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
  ├── layout.tsx                        # Root layout
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
      └── elevenlabs/route.ts           # Voice agent API

/components                             # Reusable UI components
/hooks                                  # Custom React hooks
/lib                                    # Utility functions and configs
/public                                 # Static assets
/styles                                 # Global styles
```

## Key Features

1. **Policy Comparison**: Side-by-side comparison of health insurance policies
2. **AI Chatbot**: OpenAI-powered assistant for insurance queries
3. **Voice Agent**: ElevenLabs integration for voice interactions
4. **Multilingual**: Support for 10+ Indian languages
5. **Claim Predictor**: ML-based claim rejection prediction
6. **Educational Content**: Policy school for insurance literacy

## Environment Setup

Required environment variables in `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# ElevenLabs (if using voice features)
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

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
