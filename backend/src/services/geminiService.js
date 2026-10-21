import { GoogleGenerativeAI } from '@google/generative-ai'

const STAGE_DEFINITIONS = [
    { id: 1, name: 'Opening & Introduction', purpose: 'Establish who you are and your company within the first 10–15 seconds.' },
    { id: 2, name: 'Permission & Pattern Interrupt', purpose: 'Obtain micro-permission to continue. Be transparent that it is a cold call.' },
    { id: 3, name: 'Reason for Calling', purpose: 'Deliver a concise, prospect-centric hook explaining why you called this person.' },
    { id: 4, name: 'Discovery & Qualification', purpose: 'Understand the prospect\'s situation, challenges, goals, and decision-making authority.' },
    { id: 5, name: 'Problem Agitation', purpose: 'Help the prospect feel the cost of the problem they described. Connect pain to business impact.' },
    { id: 6, name: 'Solution Presentation', purpose: 'Connect your solution to the specific pain named. Lead with outcomes, not feature lists.' },
    { id: 7, name: 'Objection Handling', purpose: 'Address concerns that prevent the prospect from agreeing to a next step.' },
    { id: 8, name: 'Close & Next Steps', purpose: 'Secure a specific, time-bound commitment for what happens next.' },
]

class GeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY
        this.provider = process.env.AI_PROVIDER || 'gemini'
    }

    _getClient() {
        if (!this.apiKey || this.provider === 'mock') return null
        return new GoogleGenerativeAI(this.apiKey)
    }

    _getMockSuggestion(current_stage) {
        return {
            suggested_stage_number: current_stage || 4,
            suggested_stage_name: STAGE_DEFINITIONS[(current_stage || 4) - 1]?.name,
            explanation:
                '[MOCK MODE — set GEMINI_API_KEY to enable real AI] Based on typical discovery patterns, the prospect appears engaged. Continue with open-ended questions.',
            confidence: 'moderate',
            suggested_question: 'What does that process look like for your team today?',
            question_rationale:
                'This open-ended question invites the prospect to elaborate on their workflow, revealing pain points organically.',
        }
    }

    _getMockSummary(call, stageResults, outcome) {
        return `[MOCK MODE — set GEMINI_API_KEY for real AI summary]\n\nCall with ${call.prospect_name} at ${call.company}.\nOutcome: ${outcome}.\n${stageResults.length} stage(s) recorded.\n\nSet GEMINI_API_KEY in your .env to generate real AI call summaries.`
    }

    async suggestStage({ current_stage, prospect_words, caller_notes }) {
        const client = this._getClient()
        if (!client) {
            return this._getMockSuggestion(current_stage)
        }

        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const prompt = `You are an expert B2B sales coach helping a salesperson during a live cold call.

COLD CALL STAGE DEFINITIONS:
${STAGE_DEFINITIONS.map((s) => `Stage ${s.id}: ${s.name} — ${s.purpose}`).join('\n')}

CURRENT CONTEXT:
- Current stage: ${current_stage ? `Stage ${current_stage} — ${STAGE_DEFINITIONS[current_stage - 1]?.name}` : 'Unknown'}
- Prospect's actual words: "${prospect_words}"
- Caller notes: "${caller_notes || 'None'}"

TASK:
Based ONLY on the prospect's actual words and caller notes above, suggest:
1. Which stage the conversation is currently at (1–8)
2. A short explanation (2–3 sentences) citing specific evidence from the prospect's words
3. A confidence level: high / moderate / low
4. One specific follow-up question the caller should ask next
5. A brief rationale for why that question is appropriate

IMPORTANT RULES:
- Base suggestions ONLY on the provided notes, never invent facts
- Indicate low confidence if evidence is insufficient
- Never suggest overwriting notes the caller has already entered
- Return ONLY valid JSON, no markdown fences

Return this exact JSON structure:
{
  "suggested_stage_number": <integer 1-8>,
  "suggested_stage_name": "<stage name>",
  "explanation": "<2-3 sentence explanation citing the prospect's exact words>",
  "confidence": "high" | "moderate" | "low",
  "suggested_question": "<one specific question to ask next>",
  "question_rationale": "<one sentence explaining why>"
}`

        try {
            const result = await model.generateContent(prompt)
            const text = result.response.text().trim()

            // Strip markdown fences if model adds them
            const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()
            const parsed = JSON.parse(cleaned)

            // Validate required fields
            if (!parsed.suggested_stage_number || !parsed.explanation) {
                throw new Error('Invalid AI response structure')
            }

            return parsed
        } catch (err) {
            console.error('[Gemini] suggestStage error:', err.message)
            throw new Error('AI suggestion failed: ' + err.message)
        }
    }

    async summarizeCall({ call, stage_results, outcome, final_note }) {
        const client = this._getClient()
        if (!client) {
            return this._getMockSummary(call, stage_results, outcome)
        }

        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const stageContext = stage_results
            .map((r) => {
                const stageName = STAGE_DEFINITIONS[r.stage_number - 1]?.name || `Stage ${r.stage_number}`
                return `### ${stageName}\nResult: ${r.result}\nProspect's words: "${r.prospect_words || 'None recorded'}"\nCaller notes: "${r.caller_notes || 'None'}"`
            })
            .join('\n\n')

        const prompt = `You are an expert sales assistant. Create a concise, factual call summary from the notes below.

CALL DETAILS:
- Prospect: ${call.prospect_name}
- Company: ${call.company}
- Role: ${call.prospect_role || 'Not specified'}
- Final outcome: ${outcome}
- Final note: ${final_note || 'None'}

RECORDED STAGE NOTES:
${stageContext || 'No stage notes recorded.'}

INSTRUCTIONS:
Write a professional summary covering:
1. Prospect's main needs or challenges (ONLY from recorded notes)
2. Notable objections raised
3. Prospect's apparent level of interest (based only on evidence)
4. Agreed next steps or follow-up actions
5. Any other key points from the conversation

CRITICAL RULES:
- Base EVERY claim on the recorded notes above
- Never claim a meeting was booked or commitment made unless the notes confirm it
- Keep the summary under 200 words
- Use plain paragraphs, no bullet points
- Be factual and professional`

        try {
            const result = await model.generateContent(prompt)
            return result.response.text().trim()
        } catch (err) {
            console.error('[Gemini] summarizeCall error:', err.message)
            throw new Error('AI summary failed: ' + err.message)
        }
    }
}

export const geminiService = new GeminiService()
