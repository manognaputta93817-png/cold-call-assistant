# CallPilot — Architecture Overview

## System Diagram

```
Browser (Vercel)          Backend API (Render)         Supabase (PostgreSQL)
┌─────────────────┐       ┌─────────────────────┐       ┌──────────────────┐
│  React + Vite   │ HTTPS │  Node.js + Express  │  SDK  │  calls table     │
│  Tailwind CSS   │──────▶│                     │──────▶│  call_stage_     │
│  React Router   │       │  /api/calls/*       │       │  results table   │
│                 │◀──────│  /api/ai/*          │       └──────────────────┘
│  src/services/  │  JSON │  /health            │
│    api.js       │       └────────┬────────────┘
└─────────────────┘                │
                                   │ HTTPS
                            ┌──────▼──────────┐
                            │  Google Gemini  │
                            │  1.5 Flash API  │
                            └─────────────────┘
```

## Component Flow — Live Call

```
User navigates to /call/:id
      │
      ▼
LiveCall.jsx
  ├── Calls GET /api/calls/:id (on mount)
  ├── Renders CallHeader (prospect info, progress)
  ├── Renders StageNav (8-stage navigation sidebar)
  └── Renders StageCard (current stage)
        ├── Shows: purpose, typical responses, objections
        ├── Records: result, prospect words, caller notes
        ├── On "Save": POST /api/calls/:id/stages (upsert)
        └── On "Get AI suggestion": POST /api/ai/suggest-stage
              └── Gemini analyzes prospect words
              └── Returns: suggested stage, question, rationale
```

## Data Flow — Finish Call

```
User clicks "Finish Call" → selects outcome
      │
      ▼
POST /api/calls/:id/finish
  ├── Validates outcome
  ├── Loads all stage results from Supabase
  ├── Calls Gemini to summarize (from actual notes only)
  ├── Updates call: status=completed, outcome, summary, ended_at
  └── Returns updated call + summary_generated flag
```

## Key Design Decisions

### 1. Single Configurable Stage File
All 8 stage definitions live in `frontend/src/data/stages.js`. The `StageCard` component is reusable across all stages — it receives the stage definition as a prop. Adding or updating stage content requires editing one file, not eight pages.

### 2. Upsert on Stage Results
`call_stage_results` has a unique constraint on `(call_id, stage_number)`. The API uses a Supabase upsert, meaning the caller can save a stage multiple times (to update notes) without creating duplicate records.

### 3. AI Keys on Backend Only
The Gemini API key never touches the frontend. All AI requests go through the Express backend. The frontend calls `/api/ai/suggest-stage` — the backend makes the real Gemini call and returns the result.

### 4. Mock Mode for Development
If `GEMINI_API_KEY` is not set or `AI_PROVIDER=mock`, the Gemini service returns clearly labeled mock responses. This allows frontend development and testing without requiring an active API key.

### 5. RLS with Service Role
Supabase Row Level Security is enabled. The backend uses the `service_role` key which bypasses RLS — this is intentional and correct for a server-side API. No anon key access is granted to call data.

## Security Notes
- Service role key: backend-only environment variable
- No secrets in git: `.env` files are gitignored
- CORS: restricted to known frontend origin
- AI endpoints: rate limited to 20 req/min
- Error messages: stack traces never returned to clients in production

## Deployment Architecture

```
GitHub (source)
    ├── Vercel reads /frontend → builds Vite → deploys to CDN
    └── Render reads /backend → runs npm start → deploys to container
```
