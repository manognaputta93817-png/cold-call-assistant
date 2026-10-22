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

