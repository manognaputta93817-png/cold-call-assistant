# CallPilot API Reference

Base URL (local): `http://localhost:3001`  
Base URL (production): `https://YOUR-RENDER-URL.onrender.com`

---

## GET /health

Health check. Does **not** depend on LLM availability.

**Response 200:**
```json
{ "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z", "version": "1.0.0" }
```

---

## POST /api/calls

Create a new call.

**Request Body:**
```json
{
  "prospect_name": "Alex Morgan",
  "company": "Northstar Solutions",
  "prospect_role": "Head of Operations",
  "pre_call_notes": "LinkedIn shows recent growth..."
}
```

| Field | Type | Required |
|---|---|---|
| `prospect_name` | string (max 200) | ✅ |
| `company` | string (max 200) | ✅ |
| `prospect_role` | string (max 200) | No |
| `pre_call_notes` | string (max 5000) | No |

**Response 201:** Full call object with generated `id` (UUID).

---

## GET /api/calls

List all calls with optional search and filters.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `search` | string | Filter by prospect name or company (case-insensitive) |
| `outcome` | string | Filter by outcome value |
| `status` | `active` \| `completed` | Filter by call status |

**Response 200:**
```json
{ "calls": [ { ...call }, ... ] }
```

---

## GET /api/calls/:id

Get a single call with all its stage results.

**Response 200:**
```json
{
  "call": { "id": "...", "prospect_name": "...", ... },
  "stage_results": [
    { "stage_number": 4, "result": "progressed", "prospect_words": "...", ... }
  ]
}
```

**Response 404:** `{ "error": "Call not found" }`

---

## POST /api/calls/:id/stages

Create or update a stage result. Uses upsert — saving the same stage twice edits the existing record, never creates a duplicate.

**Request Body:**
```json
{
  "stage_number": 4,
  "result": "progressed",
  "prospect_words": "We already have a process, but it takes too much time.",
  "caller_notes": "Bandwidth issue — running lean"
}
```

| Field | Type | Required |
|---|---|---|
| `stage_number` | integer (1–8) | ✅ |
| `result` | string | ✅ |
| `prospect_words` | string (max 10000) | No |
| `caller_notes` | string (max 5000) | No |

**Response 201:** The saved stage result object.

**Response 404:** Call not found.  
**Response 409:** Call is already completed.

---

## POST /api/calls/:id/finish

Mark a call as completed. Generates an AI summary from saved stage notes.

**Request Body:**
```json
{
  "outcome": "follow_up_scheduled",
  "final_note": "Send case study, call back Thursday"
}
```

Valid `outcome` values: `meeting_booked`, `follow_up_scheduled`, `next_step_agreed`, `info_sent`, `not_interested`, `no_response`, `wrong_contact`, `nurture`, `other`

**Response 200:**
```json
{
  "call": { ...updatedCall, "status": "completed", "summary": "..." },
  "summary_generated": true
}
```

---

## POST /api/ai/suggest-stage

Get an AI suggestion based on the prospect's words. Rate limited: 20 req/min.

**Request Body:**
```json
{
  "current_stage": 4,
  "prospect_words": "We already have a process but it takes too much time.",
  "caller_notes": "They seem open to change"
}
```

**Response 200:**
```json
{
  "suggested_stage_number": 4,
  "suggested_stage_name": "Discovery & Qualification",
  "explanation": "The prospect acknowledges an existing workflow...",
  "confidence": "high",
  "suggested_question": "Which specific part of the process takes the most time?",
  "question_rationale": "..."
}
```

---

## POST /api/ai/summarize

Generate an AI summary for a completed call.

**Request Body:**
```json
{ "call_id": "uuid-of-call" }
```

**Response 200:**
```json
{ "summary": "Alex Morgan at Northstar Solutions indicated..." }
```

---

## Error Format

All errors use this format:
```json
{ "error": "Human-readable error message" }
```

HTTP codes used:
- `400` — Validation error (invalid or missing fields)
- `404` — Resource not found
- `409` — Conflict (e.g., trying to modify a completed call)
- `429` — Rate limit exceeded (AI endpoints)
- `500` — Internal server error
- `502` — AI provider error
