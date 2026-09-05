# Budgety - AI Financial Coach for Gen Z

## Overview

Budgety is an AI-first financial wellness application designed for Gen Z users. The application takes a conversation-first approach, positioning itself as a warm, supportive financial coach rather than a traditional budgeting app. It feels like a therapy session about money - not a structured chatbot or financial journal.

The core experience centers around natural conversation with the AI coach, greeting users with "Hey - what's on your mind about money?" Users can share their financial thoughts freely through text or voice, receive personalized insights, set goals with AI-assisted planning, and track their spending - all while getting empathetic, non-judgmental guidance.

## Core Features Implemented

### 1. Conversational AI Coach
- **GPT-5 Integration**: Uses OpenAI's latest model for natural, empathetic financial conversations
- **Persistent Chat History**: All conversations saved to PostgreSQL and loaded on app start
- **Context-Aware Responses**: AI remembers conversation history for personalized coaching
- **Therapy-Like Tone**: Supportive, warm personality that avoids forced "financial journal" language

### 2. Voice Journaling
- **Web Speech API Integration**: Voice-to-text input for easier mobile usage
- **Real-Time Transcription**: Live transcript display as user speaks
- **Seamless Integration**: Voice button integrated directly in chat input
- **Browser Support Detection**: Graceful fallback messaging for unsupported browsers

### 3. Proactive Check-Ins
- **Customizable Notifications**: Daily mood check-ins, weekly spending reviews, goal progress nudges
- **Browser Notifications**: Permission-based desktop notifications for timely reminders
- **User-Controlled Settings**: Enable/disable and set frequency for each check-in type
- **Smart Scheduling**: Check-ins trigger based on user-defined intervals

### 4. Goal Planning System
- **AI-Assisted Goal Breakdown**: GPT-5 generates 3-5 actionable steps for each goal
- **Progress Tracking**: Visual progress bars showing amount saved vs. target
- **Flexible Goals**: Support for amounts, deadlines, descriptions, and statuses
- **CRUD Operations**: Create, view, update goals with full persistence
- **Graceful AI Fallback**: Goals save successfully even if AI step generation fails

### 5. Smart Transaction Tracking
- **Manual Logging**: Quick transaction entry with type, amount, category, description
- **Category System**: Pre-defined categories (Food & Dining, Shopping, Entertainment, etc.)
- **Income & Expense Tracking**: Support for both transaction types
- **Real-Time Metrics**: Automatic calculation of net balance, total income, total expenses
- **Transaction History**: Chronological view of recent transactions with details

### 6. AI-Powered Insights Dashboard
- **GPT-5 Financial Analysis**: AI analyzes spending patterns and provides summaries
- **Top Spending Categories**: Visual breakdown of expenses by category with percentage bars
- **Personalized Advice**: 3-4 specific, actionable recommendations based on transaction data
- **Graceful Error Handling**: Fallback insights when AI quota is exceeded
- **Dynamic Metrics**: Real-time financial snapshot with balance, income, expenses

## User Preferences

- **Communication Style**: Simple, everyday language - avoids technical financial jargon
- **Interface Tone**: Therapy-like conversations about money, not structured chatbot flows
- **Visual Preferences**: Gen Z-focused with vibrant gradients (purple→violet), dark mode default

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18+ with TypeScript for type safety and modern React patterns
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for lightweight client-side routing
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)

**UI Component System:**
- shadcn/ui component library with Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom CSS variables for theming (dark mode default with light mode toggle)
- Plus Jakarta Sans as the primary typeface via Google Fonts

**State Management:**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- Local component state with React hooks for UI state
- Custom query client configured with specific retry and refetch behaviors

**Design System:**
- Conversation-first interface with chat as the primary interaction model
- Card-based layouts for dashboard and settings
- Mobile-native responsive design with bottom navigation
- Gradient-heavy visual language (purple gradients for AI, dynamic color scales for metrics)
- Dark mode as default with theme toggle capability

### Backend Architecture

**Server Framework:**
- Express.js as the HTTP server framework
- TypeScript throughout the backend for type consistency
- Development mode integrates Vite middleware for HMR
- RESTful API patterns under `/api/*` namespace

**API Endpoints:**
```
GET  /api/chat/history          - Load conversation history
POST /api/chat                  - Send message and get AI response
GET  /api/goals                 - Get user's financial goals
POST /api/goals                 - Create new goal with AI step generation
GET  /api/transactions          - Get user's transactions
POST /api/transactions          - Log new transaction
GET  /api/insights              - Get AI-generated financial insights
GET  /api/checkins              - Get user's check-in preferences
POST /api/checkins              - Update check-in settings
```

**AI Integration:**
- OpenAI GPT-5 for conversational financial coaching
- AI-powered goal breakdown (3-5 actionable steps per goal)
- Transaction pattern analysis with personalized advice
- Graceful error handling for API quota limits
- System prompts configured for empathetic, non-judgmental tone

**Data Layer:**
- PostgreSQL database via Neon serverless driver
- Drizzle ORM for type-safe database operations
- Schema-first approach with TypeScript inference
- Shared schema definitions between client and server (`@shared/schema`)

**Database Schema:**
```typescript
// Users (demo user approach for now)
users { id, username, createdAt }

// Chat Messages (conversation persistence)
chat_messages { id, userId, role, content, timestamp }

// Financial Goals
goals { 
  id, userId, title, description, 
  targetAmount, currentAmount, deadline, 
  status, aiSteps[], createdAt 
}

// Transactions
transactions { 
  id, userId, amount, category, 
  description, date, type, createdAt 
}

// Check-in Preferences
checkins { 
  id, userId, type, frequency, 
  enabled, lastTriggered, createdAt 
}
```

### External Dependencies

**Database:**
- PostgreSQL via Neon serverless driver (`@neondatabase/serverless`)
- Environment variable: `DATABASE_URL`

**AI Service:**
- OpenAI API for GPT-5 model access
- Environment variable: `OPENAI_API_KEY`
- Used for: chat responses, goal breakdown, financial insights

**Development Tools:**
- Replit-specific plugins for development banner and error overlay
- TypeScript compiler for type checking
- esbuild for production server bundling

**UI Libraries:**
- Radix UI primitives for accessible component patterns
- React Hook Form with Zod resolvers for form validation
- Lucide React for icon system
- date-fns for date manipulation

**Voice Integration:**
- Web Speech API (browser native)
- SpeechRecognition for voice-to-text
- Continuous listening mode with real-time transcription

## Navigation Structure

**Bottom Navigation Tabs:**
1. **Chat** (`/`) - Main conversational interface with AI coach
2. **Dashboard** (`/dashboard`) - Financial metrics, insights, and transaction logging
3. **Goals** (`/goals`) - Goal planning with AI-assisted breakdown
4. **Settings** (`/settings`) - Check-in preferences and app configuration

## Key Technical Decisions

1. **In-Memory Storage**: Using `MemStorage` implementation for development/demo
2. **Demo User Approach**: Single user ID (`demo-user-001`) for MVP, prepared for auth
3. **Voice Mode**: Web Speech API for native browser support (Chrome, Edge)
4. **AI Quota Handling**: All AI features gracefully degrade with fallback content
5. **Dark Mode First**: Default dark theme with light mode toggle
6. **Mobile-First Design**: Bottom navigation, touch-friendly interactions

## Recent Development Progress

**Completed Features (Latest Session):**
1. ✅ Conversation Memory & Persistence - Chat history saved to DB
2. ✅ Proactive Check-ins System - Customizable browser notifications  
3. ✅ Voice Mode - Voice-to-text journaling capability
4. ✅ Goal Planning System - AI breakdown, progress tracking, CRUD
5. ✅ Smart Financial Tracking - Manual transaction logging with categories
6. ✅ AI Insights Dashboard - GPT-5 analysis, spending trends, personalized advice

**Important Files:**
- `client/src/pages/Chat.tsx` - Main chat interface
- `client/src/pages/Goals.tsx` - Goal planning page
- `client/src/pages/Dashboard.tsx` - Insights & transaction tracking
- `client/src/pages/Settings.tsx` - Check-in configuration
- `server/openai.ts` - AI coach responses
- `server/goals.ts` - AI goal breakdown logic
- `server/insights.ts` - AI financial analysis
- `server/routes.ts` - API endpoints
- `server/storage.ts` - Data persistence interface
- `shared/schema.ts` - Database schema definitions
- `client/src/hooks/useVoiceInput.ts` - Voice mode hook
- `client/src/components/ChatInput.tsx` - Voice-enabled input
- `client/src/components/CheckinSettings.tsx` - Notification settings

## Environment Variables Required

```
DATABASE_URL=<neon-postgres-connection-string>
OPENAI_API_KEY=<openai-api-key>
SESSION_SECRET=<random-secret-for-sessions>
```

## Future Enhancements

- Replit Auth integration for multi-user support
- Bank account connections (Plaid integration if available)
- Advanced analytics and trend visualizations
- Goal achievement celebrations and milestones
- Spending limits and budget alerts
- Export transaction history
- Multi-currency support
- Recurring transaction tracking
