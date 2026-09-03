# Implementation Plan: inFlow App Modernization

## Overview
Modernize the 'inFlow' app by implementing a professional SaaS Dashboard UI and migrating the AI agent from Anthropic to Google Gemini.

## 1. Design System & UI Foundation
### Tailwind Configuration
- Update `tailwind.config.ts` with the specified color palette:
  - Background: `#0B0F14`
  - Card BG: `#131A22`
  - Card Border: `#1D2632`
  - Text Primary: `#FFFFFF`
  - Text Secondary: `#8B95A7`
  - Accents: Blue `#3B82F6`, Green `#22C55E`, Orange `#F59E0B`, Red `#EF4444`
- Remove old "Midnight Navy" and "Glassmorphism" colors.

### Global Styles
- Update `src/styles/globals.css`:
  - Replace CSS variables (`--background`, `--foreground`, etc.) with the new palette.
  - Remove glassmorphism utility classes (`.glass`, `.glass-light`).
  - Implement a clean, flat dashboard aesthetic.

## 2. Global Shell Implementation
### Dashboard Shell Component
- Create `src/components/DashboardShell.tsx`:
  - **Sidebar (260px)**: 
    - Logo, Navigation (Overview, AI Advisor, Settings), User Profile/Logout.
    - Styling: BG `#131A22`, Border `#1D2632`.
  - **Header (80px)**:
    - Page Title, User Greeting, Notifications/Search.
    - Styling: BG `#0B0F14` (or semi-transparent), Border-bottom `#1D2632`.
  - **Content Area**:
    - Padding: `24px`.
    - BG: `#0B0F14`.

### Layout Integration
- Modify `src/app/layout.tsx` to wrap the `{children}` with the `DashboardShell`.

## 3. Page Refactors
### Overview Page (`src/app/stats/page.tsx`)
- Transform into a comprehensive dashboard:
  - **KPI Row**: 3-4 Stat cards (Total Capital, Projected, Growth %).
  - **Analytics Section**:
    - Revenue Chart: Line/Area chart using `recharts`.
    - Category Donut: Pie chart for expense/income distribution using `recharts`.
  - **Transactions Table**: A clean, professional table of recent activity replacing the current list.
- Replace `framer-motion` heavy animations with subtle transitions.

### AI Advisor Page (`src/app/chat/page.tsx`)
- Remove local sidebar and header (now provided by `DashboardShell`).
- Update the chat interface to match the new design system.
- Maintain the "Command Center" input style but with updated colors.

### Settings Page (`src/app/settings/page.tsx`)
- Remove local header/padding.
- Update form components (inputs, selects) to the new design system.
- Refactor "glass" sections into structured "Card" components.

## 4. AI Migration (Anthropic $\rightarrow$ Gemini)
### API Integration
- Install `@google/generative-ai`.
- Update `src/app/api/chat/route.ts`:
  - Swap `Anthropic` SDK for `GoogleGenerativeAI`.
  - Model: `gemini-1.5-flash` (for speed) or `gemini-1.5-pro` (for complex reasoning).
  - API Key: Use `process.env.GEMINI_API_KEY`.

### JSON Mode & Protocol
- Configure Gemini to return strict JSON:
  - Set `generationConfig: { responseMimeType: "application/json" }`.
  - Update `SYSTEM_PROMPT` to explicitly define the JSON schema:
    ```json
    {
      "reply": "string",
      "action": "insert_transaction" | "update_state" | "query",
      "data": { ... }
    }
    ```
- Maintain the current `action` / `data` protocol to avoid breaking the frontend.

### Context Preservation
- Keep the existing logic of fetching `profiles` and `transactions` from Supabase.
- Inject this data into the Gemini prompt as a "User Context" block.

## 5. Sequencing & Dependencies
1. **Env Setup**: Add `GEMINI_API_KEY`.
2. **Design Foundation**: `tailwind.config.ts` $\rightarrow$ `globals.css`.
3. **Layout**: `DashboardShell.tsx` $\rightarrow$ `layout.tsx`.
4. **Backend**: `api/chat/route.ts` (Verify AI is working with Gemini).
5. **Frontend**: `stats/page.tsx` $\rightarrow$ `chat/page.tsx` $\rightarrow$ `settings/page.tsx`.

## Critical Files for Implementation
- `tailwind.config.ts`
- `src/styles/globals.css`
- `src/app/layout.tsx`
- `src/app/api/chat/route.ts`
- `src/app/stats/page.tsx`
EOF`
