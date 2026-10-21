# Stage Analysis — CallPilot Cold-Call Framework

## Overview

This document defines the eight official cold-call stages used in CallPilot, their design rationale, common prospect behaviors, and recommended caller actions.

The stage content is based on standard B2B cold-call methodology. Update this document when official assignment materials become available.

The configurable stage data file is at: `frontend/src/data/stages.js`

---

## The Eight Stages (in order)

### Stage 1 — Opening & Introduction

**Purpose:** Establish who you are and from which company within the first 10–15 seconds.

**Caller Goal:** State name and company clearly. Sound confident. Do not pitch before gaining permission.

**Common Prospect Responses:**
- "Who is this?"
- "How did you get this number?"
- "Is this a sales call?"
- "I'm in a meeting / I only have a minute."

**Suggested Caller Prompts:**
- "Hi [name], this is [caller] from [company]."
- "Quick note — this is a cold call, I'll be upfront."
- "Can I share why I picked up the phone to call you?"

**Available Results:** Progressed, Permission granted, Objection raised, Not interested, Unavailable, Callback requested

**Why Calls End Here:** Prospect hangs up on first contact; gatekeeper intercepts; voicemail only.

---

### Stage 2 — Permission & Pattern Interrupt

**Purpose:** Obtain micro-permission to continue. Transparency ("this is a cold call") breaks the automatic rejection reflex.

**Caller Goal:** Ask permission genuinely. Do not disguise intent. Be brief.

**Common Prospect Responses:**
- "Sure, what's this about?"
- "Go ahead, make it quick."
- "I usually don't take cold calls, but go ahead."
- "Just send me an email."

**Suggested Caller Prompts:**
- "I'll be honest — this is a cold call and I know you weren't expecting it."
- "Can I tell you specifically why I picked up the phone to call *you* today?"
- "I only need 90 seconds. If it doesn't land, you can hang up."

**Available Results:** Permission granted, Progressed, Objection raised, Not interested, Email requested

**Why Calls End Here:** Prospect refuses any engagement; firm email-only preference.

---

### Stage 3 — Reason for Calling

**Purpose:** Deliver a concise, prospect-centric hook explaining why you called this specific person at this company.

**Caller Goal:** State the business problem you solve without launching into features. Connect to their world.

**Common Prospect Responses:**
- "Interesting — what exactly do you do?"
- "We've looked at solutions like that before."
- "Tell me more."
- "That's not really a challenge for us."

**Suggested Caller Prompts:**
- "The reason I'm calling is that we work with [role/industry] teams struggling with [specific pain]."
- "Other [industry] leaders tell me that [main challenge]. Does that resonate?"

**Available Results:** Progressed, Engaged, Mild interest, Objection raised, Not relevant, Not interested

**Why Calls End Here:** Reason for calling is irrelevant to prospect's situation; timing poor.

---

### Stage 4 — Discovery & Qualification

**Purpose:** Understand current situation, challenges, goals, and decision-making authority. The most important stage for long-term outcomes.

**Caller Goal:** Ask open-ended questions. Listen actively. Qualify genuine fit.

**Common Prospect Responses (from transcript patterns):**
- "We already have a process, but it takes too much time."
- "Our main challenge is getting teams aligned."
- "We're actually looking at a few options right now."
- "I'd need to loop in my manager on this."
- "Budget is a concern at the moment."

**Suggested Caller Prompts:**
- "What does your current process for [X] look like?"
- "Where do you feel the most friction day to day?"
- "Who else is involved in decisions like this?"
- "Is this on your radar for the near future?"

**Available Results:** Progressed, Fully qualified, Partially qualified, Objection raised, Not a fit, Wrong contact, Follow-up required

**Why Calls End Here:** Prospect not the decision maker; no budget authority; clear mismatch.

---

### Stage 5 — Problem Agitation

**Purpose:** Help the prospect feel the cost of their problem. Connect pain to business impact, making the status quo harder to defend.

**Caller Goal:** Deepen pain discovered in Stage 4. Ask about consequences. Use prospect's own words.

**Common Prospect Responses:**
- "Yeah, it does cost us a lot of time."
- "We've had to bring in extra staff to handle it."
- "Our team is frustrated with the current setup."
- "We lose clients over it sometimes."

**Suggested Caller Prompts:**
- "When that happens, what's the knock-on effect for the team?"
- "How long has this been going on?"
- "What happens if nothing changes in six months?"

**Available Results:** Progressed, High pain, Low pain, Objection raised, Not interested

**Why Calls End Here:** Prospect doesn't feel urgency; pain too low to justify action.

---

### Stage 6 — Solution Presentation

**Purpose:** Connect your solution directly to the specific pain the prospect named. Lead with outcomes and relevance.

**Caller Goal:** Present value proposition briefly and specifically. Use their words. Offer a next step.

**Common Prospect Responses:**
- "How does that actually work?"
- "We've tried something similar before."
- "What makes you different from [competitor]?"
- "What does it cost?"

**Suggested Caller Prompts:**
- "Based on what you told me about [pain], here's how we typically address that…"
- "Companies we work with see [specific outcome] within [timeframe]."
- "Would a short demo make sense?"

**Available Results:** Progressed, Interested, Demo requested, Info requested, Objection raised, Not interested

**Why Calls End Here:** Competitor already entrenched; pricing mismatch; solution not a fit.

---

### Stage 7 — Objection Handling

**Purpose:** Address concerns preventing the prospect from agreeing to a next step. Most objections are hesitations, not final decisions.

**Caller Goal:** Name the objection, validate it, respond with evidence or reframe. Do not argue.

**Common Prospect Responses:**
- "We don't have the budget for this."
- "Now isn't a good time."
- "We need to evaluate other options first."
- "I need to discuss with my team."
- "Just send me something to read."

**Suggested Caller Prompts:**
- "That's a fair concern. Can I ask what specifically is driving that?"
- "A lot of people say that initially. Here's what they usually tell me after…"
- "What would need to be true for this to be a priority?"

**Available Results:** Objection resolved, Partially resolved, Follow-up required, Objection unresolved, Not interested, Budget/timing issue

**Why Calls End Here:** Objection is genuine and unresolvable at this time; firm no.

---

### Stage 8 — Close & Next Steps

**Purpose:** Secure a specific, time-bound commitment for what happens next. A good cold call ends with a clear action, not vague follow-up.

**Caller Goal:** Propose a concrete next step. Make it easy to say yes. Confirm date/time.

**Common Prospect Responses:**
- "Sure, that works for me."
- "Let me check my calendar."
- "Send the invite and I'll confirm."
- "Can we do next week?"
- "Just send me the information first."

**Suggested Caller Prompts:**
- "Based on our conversation, I'd love to set up 30 minutes for a tailored demo."
- "Does [day] work, or is [alternative] better?"
- "I'll send you the invite now — does [email] reach you?"

**Available Results:** Meeting booked, Follow-up scheduled, Next step agreed, Prospect to confirm, Nurture, Not interested

**Why Calls End Here:** Prospect not ready to commit; good conversation but not actionable right now.

---

## Evidence Notes

These stage definitions are derived from:
1. Standard B2B cold-call methodology (Sandler, SPIN, and challenger frameworks)
2. The typical structure of a discovery → close sales progression
3. Common language patterns that appear in cold-call training materials

When official assignment transcripts are provided, update `frontend/src/data/stages.js` with:
- Exact prospect phrasing from the transcripts (in `typicalProspectResponses`)
- Specific objection patterns (in `objections`)
- Stage result options refined by what actually happened in the calls

---

## Updating Stage Definitions

All stage content is centralized in `frontend/src/data/stages.js`. Editing that file automatically updates:
- Stage guidance displayed during live calls
- Typical prospect responses shown to the caller
- Objection handling examples
- Available result options per stage

No other files need to be changed to update stage content.
