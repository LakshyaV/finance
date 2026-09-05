# Budgety Design Guidelines

## Design Approach: Living AI Companion

**Inspiration Sources:**
- **AI Companion:** Gemini, Her (movie) - emotionally intelligent, personalized AI interactions
- **Fintech Core:** Revolut, Cash App (approachable financial UI)
- **Conversational:** Discord, iMessage (familiar chat patterns for Gen Z)
- **Gamification:** Duolingo (progress tracking, encouraging feedback)

**Design Principles:**
1. **Chat-first experience** - Conversation is the PRIMARY UI, full-screen and immersive
2. **Background menu access** - Dashboard/Goals/Settings are secondary, accessible through a subtle menu
3. Emotive and alive - not a chatbot, a companion
4. Warm and approachable - therapy-like financial coach
5. Customizable personality - users create their own experience
6. Mobile-native thinking

---

## Core Design Elements

### A. Color Palette - Mustard Yellow Theme

**Primary Colors (Light Mode):**
- Primary: 45 78% 58% (warm mustard yellow)
- Primary Foreground: 45 10% 98% (nearly white)
- Background: 45 35% 96% (light cream)
- Foreground: 45 20% 15% (warm dark brown)
- Card: 45 30% 94% (subtle cream background)
- Accent: 45 70% 75% (light mustard)
- Muted: 45 25% 88% (soft neutral)
- Border: 45 25% 85% (subtle borders)

**Dark Mode:**
- Background: 45 15% 10% (warm dark)
- Foreground: 45 20% 90% (warm light)
- Primary: 45 78% 58% (same mustard, high contrast)
- Card: 45 18% 14% (elevated dark surface)
- Accent: 45 70% 35% (darker mustard for dark mode)

**Accent Colors:**
- Success/Positive: 150 70% 55% (mint green)
- Warning/Coaching: 35 90% 60% (warm orange)
- Chart Colors: Complementary warm tones

### B. Typography

**Font Stack:** Century Gothic, AppleGothic, sans-serif

**Hierarchy:**
- Hero/Headers: 700 weight, 32-48px (tight leading for impact)
- Body (Chat): 400 weight, 16px, 1.6 line height
- AI Name/Labels: 600 weight, 14px, uppercase tracking
- Dashboard Metrics: 700 weight, 24-36px (tabular numbers)
- Captions: 400 weight, 12-14px, muted color

### C. Layout System

**Spacing Units:** Tailwind 4, 6, 8, 12, 16, 24 (px units: 1rem = 16px)
- Chat padding: p-4 to p-6
- Card spacing: gap-6 to gap-8
- Section margins: my-12 to my-16

**Container Strategy:**
- Chat: max-w-3xl mx-auto (readable conversation width)
- Dashboard cards: max-w-7xl with 2-3 column grid on desktop
- Mobile-first: single column, stack everything

---

## App Architecture - Chat-First Design

### Primary UI: Full-Screen Chat
**Chat is the main interface** - it occupies the entire screen at the root route "/"
- Full-screen conversational interface
- Companion avatar, name, and emotion in header
- Menu button (hamburger) for accessing secondary features
- No bottom navigation or floating buttons
- Immersive chat experience like messaging apps (WhatsApp, iMessage)

### Secondary UI: Background Menu
**Dashboard, Goals, Settings are secondary** - accessible through a slide-out menu
- Sheet/Drawer component triggered from chat header
- Menu button: Top-right corner of chat interface
- Navigation items:
  - Dashboard (/dashboard) - Financial snapshot
  - Goals (/goals) - Goal planning
  - Settings (/settings) - Companion customization & app settings
- Theme toggle in menu footer
- Ghost button variants for clean, non-intrusive menu items

### Navigation Flow
1. **Start at Chat** - Users land on conversation interface
2. **Menu for Secondary Features** - Hamburger menu reveals Dashboard/Goals/Settings
3. **Return to Chat** - Simple navigation back to main conversation
4. **No Persistent Nav** - No bottom tabs or sidebars cluttering the chat

### Design Philosophy
> "The conversation IS the app. Everything else supports it."

Dashboard and goals are tools to help the conversation, not the other way around. Users should feel like they're talking to a friend who happens to help with money, not using a financial app that has a chat feature.

---

## AI Companion System (Core Feature)

### Chat Header Design
**Location:** Fixed at top of chat interface

**Visual Elements:**
- Avatar: 40x40px circular with border
- Border: 2px solid, color matches avatar style
- Background: 20% opacity of style color
- Emoji: Large centered emotion (😊, ✨, 🤔, 💛, 🌟, 🤗)

**Avatar Styles:**
- Friendly: `bg-primary/20 border-primary` (mustard yellow)
- Professional: `bg-accent/20 border-accent` (light mustard)
- Playful: `bg-chart-2/20 border-chart-2` (green)
- Calm: `bg-chart-4/20 border-chart-4` (blue)

**Header Layout:**
- Left: Avatar + Companion Name + Subtitle ("Your AI financial coach")
- Right: Menu button (hamburger icon)
- Background: Semi-transparent with backdrop blur
- Border: Bottom border for separation

### Companion Personalities
**Supportive (Default):**
- Tone: Warm, encouraging, empathetic
- Language: "I'm so proud of you", "that makes total sense"
- Use case: Users who want emotional support

**Direct:**
- Tone: Straightforward, practical, honest
- Language: Clear, actionable, no sugar-coating
- Use case: Users who prefer efficiency

**Humorous:**
- Tone: Playful, fun, lighthearted
- Language: Casual, occasional humor
- Use case: Users who want finance to feel less serious

**Analytical:**
- Tone: Thoughtful, detail-oriented
- Language: Data-driven, probing questions
- Use case: Users who want deep insights

### Customization Interface (Settings)
**Location:** Settings page, top priority section

**Controls:**
1. Avatar Preview: Large 64x64px display with current emotion
2. Name Input: Text field, default "Buddy"
3. Avatar Style: Dropdown (Friendly, Professional, Playful, Calm)
4. Emotion: Dropdown with emoji labels
5. Personality: Dropdown with descriptions
6. Save Button: Full-width, primary variant

**UX Flow:**
1. User modifies settings
2. Preview updates in real-time
3. Click save → API call → Success toast
4. Companion button updates immediately
5. AI responses reflect new personality in next chat

---

## Component Library

### 1. Chat Interface (Now Accessible via Floating Companion)

**Message Bubbles:**
- AI: Rounded-2xl, purple gradient background, white text, max-w-[85%], slide-in-left animation
- User: Rounded-2xl, dark gray background, white text, max-w-[85%], align right
- Spacing: mb-4 between messages, grouped by sender with mb-2

**Input Area:**
- Fixed bottom position with backdrop-blur background
- Rounded-full input field with p-4 padding
- Send button integrated (icon only, purple accent)
- Quick reply chips above input: rounded-full pills, purple outline, horizontal scroll

**Rich Media in Chat:**
- Inline charts: Lightweight sparklines/bar charts in AI messages
- Progress bars: Rounded-full, gradient fill based on metric
- Emojis: Native support, slightly larger (1.2em) for personality
- Goal cards: Compact card UI within chat bubble

### 2. Dashboard Components

**Metric Cards:**
- Rounded-xl, gradient borders (subtle)
- Large number display (tabular font)
- Trend indicator (↑↓ with color)
- Sparkline chart below metric
- Grid layout: 1 col mobile, 2-3 cols desktop

**Money Vibe Score:**
- Circular progress indicator (like Apple Watch rings)
- Center: Large emoji based on score (🔥 excellent, 😊 good, 😐 okay, 😰 needs work)
- Gradient color fill based on percentage
- Tap for detailed breakdown

**Peer Benchmarking:**
- Horizontal bar chart with user position highlighted
- Anonymous avatars/icons for peer groups
- Percentile labels (Top 25%, Average, etc.)
- Smooth animations on load

### 3. Onboarding Flow

**Progress Indicator:**
- Top of screen: dots or thin progress bar
- Current step highlighted in purple
- 3-5 steps maximum

**Question Cards:**
- Full-screen transitions (swipe up/down)
- Large, friendly question text
- Button options: rounded-2xl, stacked on mobile
- Skip link: subtle, bottom right

### 4. Initiative Slider

**Visual Design:**
- Horizontal slider with emoji anchors
- Left (😎 Chill): Minimal notifications
- Right (💪 Coach): Proactive guidance
- Purple thumb with smooth transitions
- Label updates dynamically

---

## Animations & Interactions

**Chat Animations:**
- Messages: Slide + fade in (150ms stagger)
- Typing indicator: Three animated dots in purple
- Quick replies: Fade in after AI message (200ms delay)

**Dashboard:**
- Cards: Stagger entrance (100ms per card)
- Charts: Animate values from 0 to target (500ms ease-out)
- NO auto-playing carousels or distracting loops

**Micro-interactions:**
- Button press: Scale 0.95 (100ms)
- Card hover: Subtle lift (2px shadow increase)
- Swipe gestures: Rubber band effect at boundaries

---

## Images

**Hero Section (Dashboard Home):**
- NO traditional hero image
- Instead: Animated chat preview showcasing Budgety conversation
- Or: Abstract financial visualization (geometric shapes, flowing data particles)
- Size: 60vh max, integrates with first metric cards

**Avatar/Branding:**
- Budgety Icon: Simple, friendly mascot (abstract coin/piggy bank hybrid)
- Color: Purple gradient, used in chat header and loading states
- Size: 40x40px in chat, 80x80px on splash

**In-Chat Imagery:**
- Goal illustrations: Minimal line art (travel, house, education)
- Celebration moments: Confetti/particle effects (canvas-based)
- Educational content: Embedded creator thumbnails with play button overlay

---

## Mobile-First Considerations

- Bottom navigation: 4 tabs (Chat, Dashboard, Goals, Profile)
- Thumb-friendly hit areas: minimum 44px
- Swipe gestures: Back navigation, card dismissal
- Safe area insets: Respect notch/home indicator
- Haptic feedback: On successful actions (savings goal met, check-in complete)

---

## Accessibility

- Dark mode: Maintain 4.5:1 contrast ratios minimum
- Focus states: 2px purple outline on interactive elements
- Screen reader: Proper ARIA labels for charts and dynamic content
- Reduce motion: Respect prefers-reduced-motion (disable animations)

---

## Key Screens Layout

**Chat Screen (Primary):**
- Top: Avatar + "Budgety" + initiative mode indicator
- Center: Scrollable message thread
- Bottom: Input + quick replies (sticky)

**Dashboard Screen:**
- Header: "Your Financial Snapshot" + week selector
- 3-card grid: Net Worth, Money Vibe Score, Weekly Spending
- Peer Benchmark: Full-width card below
- CTA: "Talk to Budgety about this" button

**Weekly Check-in:**
- Full-screen takeover (modal)
- Conversational format (like chat but focused flow)
- 3-5 questions with visual feedback
- Summary card at end with encouragement