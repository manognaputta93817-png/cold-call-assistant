# Video Demo Script — CallPilot (6 Minutes)

## Setup Before Recording
- Open CallPilot at your live Vercel URL
- Open Postman or browser dev tools to confirm backend is live (Render health endpoint)
- Have Call History page open showing at least 1–2 previous demo calls
- Frame: screen visible, your face in corner (use Loom, OBS, or macOS screen recorder + FaceTime)
- Test your microphone and resolution before starting

---

## Segment 1: Introduction (0:00–0:40)

**What to say:**
"Hi, I'm [your name], and today I'm walking through CallPilot — a cold-call assistant I built for this assignment.

The problem is simple: salespeople on live cold calls often lose track of where they are in the conversation. They miss key discovery questions, they forget to record what the prospect said, and by the time the call ends, the notes are gone.

CallPilot sits beside the phone as a digital guide. It walks the caller through 8 structured stages — from the opening to the close — captures the prospect's exact words at each stage, and uses AI to suggest follow-up questions and generate a post-call summary."

**Point to:** The app on screen. The sidebar showing "Live Call" and "Call History".

---

## Segment 2: Start a Call and Stage Guidance (0:40–1:40)

**What to say:**
"Let me start a real call. I'll call this prospect Alex Morgan at Northstar Solutions — Head of Operations."

**Demo steps:**
1. Click "Live Call" in the sidebar → lands on the Start Call form
2. Type: `Alex Morgan` / `Northstar Solutions` / `Head of Operations`
3. Add a pre-call note: "LinkedIn shows they recently hired 3 new ops staff — possible growth pain"
4. Click "Start Call"
5. Point to the Call Header — show the prospect name, progress bar, Stage 1 of 8

**What to say:**
"You can see I'm on Stage 1 — Opening & Introduction. On the left side of each stage card I have the stage's purpose, what prospects typically say at this point, suggested talking points, and objection responses. Everything is derived from standard cold-call methodology and the transcript analysis I ran on the provided call recordings.

I navigate between stages using this sidebar on the left. Already-completed stages turn green."

---

## Segment 3: Save a Stage Result and Verify Persistence (1:40–2:40)

**What to say:**
"Let me jump ahead to Stage 4 — Discovery. This is where the real magic happens."

**Demo steps:**
1. Click "Discovery" in the stage nav
2. Point to the "What They Commonly Say" list
3. In the Result dropdown, select: `Progressed — good fit identified`
4. In Prospect's Actual Words, type: `We already have a process, but it takes too much time.`
5. Add caller note: `Bandwidth issue — they've hired but still behind`
6. Click "Save Stage Result" → green success toast appears
7. Refresh the page (Cmd+R)
8. Show the same stage result still populated

**What to say:**
"I've saved the prospect's exact words — 'we already have a process, but it takes too much time.' When I refresh the page, the result is still there. Everything persists in Supabase — my PostgreSQL database on Supabase."

---

## Segment 4: AI Feature Demo (2:40–3:30)

**What to say:**
"Now let me show the AI feature. After entering the prospect's words, I can click 'Get AI Suggestion' to have Gemini analyze the conversation."

**Demo steps:**
1. With prospect words still showing, click "✨ Get AI suggestion"
2. Wait for the AI panel to appear
3. Point to: suggested stage, explanation, suggested question, confidence level
4. Dismiss the suggestion

**What to say:**
"Gemini 1.5 Flash is reading only the notes I've entered — it never invents facts. It suggests that given the prospect mentioned their process takes too long, a great next question would be 'Which specific part of the process takes the most time?' with the rationale that this narrows down the bottleneck.

Notice the label: 'suggestion only — you decide.' The AI is an assistant, not a decision-maker. The caller keeps full control of the conversation."

**Why Gemini?**
"I chose Gemini 1.5 Flash because it has a free tier via Google AI Studio, it handles structured JSON prompts reliably, and it's fast enough for real-time use during a live call."

---

## Segment 5: Finish Call and History (3:30–4:20)

**What to say:**
"Once I've worked through the stages, I finish the call."

**Demo steps:**
1. Click "Finish Call" (red button top-right)
2. Select outcome: `Follow-up Call Scheduled`
3. Add final note: `Sending case study first, call back Thursday`
4. Click "Confirm & Finish"
5. Wait for redirect to Call History
6. Point to the call in the history table — show outcome, stage reached, start time
7. Click "View" to open CallDetail
8. Show the AI summary at the top + all stage notes

**What to say:**
"The call is now in history. Opening it shows the AI-generated summary, which was created from my actual stage notes — not invented. Each stage shows the result, the prospect's exact words, and any caller notes."

---

## Segment 6: Transcript-Informed Design (4:20–5:10)

**What to say:**
"The stage content — the talking points, objection responses, and typical prospect phrases — was informed by analyzing the provided cold-call transcripts.

For example, the phrase 'We already have a process but it takes too much time' is exactly the kind of response that appeared repeatedly in the Discovery stage across the transcript data. So it's now listed as a typical Stage 4 response, priming the caller to recognize that pattern.

The eight stages follow the assignment's official cold-call structure. They're kept in a single configurable file — `frontend/src/data/stages.js` — so the client or team can update the content without touching the application logic."

**Point to:** The left side of Stage 4 — show the "What They Commonly Say" list.

---

## Segment 7: Architecture (5:10–6:00)

**What to say:**
"A quick word on architecture. CallPilot has three layers:

Frontend: React, Vite, and Tailwind deployed on Vercel. Single-page app with React Router.

Backend: Node.js and Express deployed on Render. REST API with eight endpoints. Gemini AI integration is server-side only — the API key never touches the browser.

Database: Supabase — PostgreSQL with Row Level Security. The service role key is only on the backend. Stage results use an upsert on a unique constraint, so saving a stage twice never creates duplicate records.

The most important design decision: I kept the eight-stage definitions in a single data file. The StageCard component is completely reusable — one component renders all eight stages. This means adding a ninth stage, or updating objection responses, requires editing one file, not eight pages."

**Show:** The sidebar animating between stages. Point to stage number indicator.

---

## End
Thank the viewer and remind them the live URLs are in the README.

---

## Recording Tips
- Use Loom (loom.com) for easy camera-in-corner + screen recording
- Record at 1080p, 16:9
- Keep the browser at full screen, no other tabs visible
- Speak at a normal pace — 6 minutes fills faster than expected
- If you make a mistake, pause, say "let me redo that", and cut in editing
