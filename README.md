# CallPilot — Cold-Call Assistant

> A real-time web application that guides salespeople through the structure of a cold call, powered by AI stage suggestions and backed by a persistent database.

## Problem Statement

Salespeople on live cold calls often lose track of where they are in the conversation, miss key questions, or fail to record what was said. CallPilot sits beside the phone as a digital co-pilot — guiding the caller through 8 structured stages, capturing the prospect's exact words, and generating AI-powered follow-up summaries.

## Features

- **8-Stage Call Framework** — Opening → Permission → Reason → Discovery → Problem Agitation → Solution → Objection Handling → Close
- **Live Stage Guidance** — purpose, typical prospect responses, talking points, and objection handling for each stage
- **Result Recording** — capture the exact stage outcome and the prospect's actual words
- **AI Stage Suggestion** — Gemini analyzes the prospect's words and suggests the most relevant next question
- **AI Call Summary** — after finishing a call, an AI summary is generated from the saved notes
- **Call History** — searchable, filterable list of all past calls
- **Call Detail View** — full breakdown of stage notes, AI summary, and call outcome
- **Persistence** — all data saved to Supabase; results survive page refreshes

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini 2.0 Flash |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

### Why Gemini?

Gemini 2.0 Flash provides a generous free tier suitable for a demo application, fast response times for real-time use during calls, reliable structured JSON output via careful prompting, and is available from Google AI Studio without requiring billing setup for low volumes.

## Project Structure

```
cold-call-assistant/
  frontend/           React + Vite + Tailwind app
    src/
      components/     Reusable UI (Layout, StageCard, CallHeader, StageNav)
      pages/          StartCall, LiveCall, CallHistory, CallDetail
      services/       api.js — all backend API calls
      data/           stages.js — 8-stage definitions (single source of truth)
  backend/            Node.js + Express API
    src/
      routes/         calls.js, ai.js
      controllers/    callsController.js, aiController.js
      services/       geminiService.js
      middleware/     validation.js, errorHandler.js, rateLimiter.js
      config/         supabase.js
  database/
    migrations/       001_initial_schema.sql
  docs/               Architecture, API docs, stage analysis, video script
```

## Local Development

### Prerequisites

- Node.js 18+
- A Supabase project
- A Gemini API key (from aistudio.google.com)

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/cold-call-assistant.git
cd cold-call-assistant

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Configure Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your Supabase URL, service role key, and Gemini key

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env — set VITE_API_URL=http://localhost:3001
```

### 3. Set Up Database

1. Go to your Supabase project → SQL Editor
2. Copy and paste the contents of `database/migrations/001_initial_schema.sql`
3. Click Run

### 4. Start Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open http://localhost:5173

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | No | `development` or `production` |
| `SUPABASE_URL` | **Yes** | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Service role key (never expose to frontend) |
| `GEMINI_API_KEY` | **Yes** | Google AI Studio API key |
| `GEMINI_MODEL` | No | Gemini model name (default: `gemini-2.0-flash`) |
| `FRONTEND_URL` | Yes | Allowed CORS origin (Vercel URL in production) |
| `AI_PROVIDER` | No | `gemini` (default) or `mock` |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | **Yes** | Backend API URL (Render URL in production) |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Service health check |
| POST | `/api/calls` | Create a new call |
| GET | `/api/calls` | List calls (search/filter) |
| GET | `/api/calls/:id` | Get call with stage results |
| POST | `/api/calls/:id/stages` | Save or update a stage result |
| POST | `/api/calls/:id/finish` | Finish a call with outcome + AI summary |
| POST | `/api/ai/suggest-stage` | AI stage suggestion from prospect words |
| POST | `/api/ai/summarize` | AI call summary for a call ID |

## Deployment

### Supabase
1. Create project at supabase.com
2. Run `database/migrations/001_initial_schema.sql` in the SQL Editor
3. Note your project URL and service role key

### Render (Backend)
1. Create a new Web Service → connect your GitHub repo
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all backend environment variables

### Vercel (Frontend)
1. Import your GitHub repo
2. Root directory: `frontend`
3. Framework preset: Vite
4. Add `VITE_API_URL` pointing to your Render backend URL

## Security Considerations

- The Supabase service role key is **only** in the backend `.env` — never in frontend code
- RLS is enabled on all tables; service role key bypasses RLS from the backend
- AI endpoints are rate-limited to 20 requests/minute
- No stack traces are returned to clients in production
- CORS is restricted to the known frontend origin

## Known Limitations

- No user authentication — this is a shared demo database. All callers see all calls.
- Gemini AI requires a valid API key; without it, labeled mock responses are returned.
- No pagination on call history (suitable for demo volumes).

## Live URLs

- **Frontend:** https://callpilot.vercel.app *(placeholder — update after deployment)*
- **Backend health:** https://callpilot-api.onrender.com/health *(placeholder)*
- **GitHub:** https://github.com/YOUR_USERNAME/cold-call-assistant *(update after push)*
