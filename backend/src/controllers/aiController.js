import { geminiService } from '../services/geminiService.js'
import { createError } from '../middleware/errorHandler.js'
import { supabase } from '../config/supabase.js'

// ─── POST /api/ai/suggest-stage ───────────────────────────────────────────────
export async function suggestStageHandler(req, res, next) {
    try {
        const { current_stage, prospect_words, caller_notes } = req.body

        const suggestion = await geminiService.suggestStage({
            current_stage,
            prospect_words,
            caller_notes,
        })

        res.json(suggestion)
    } catch (err) {
        next(createError(err.message, 502))
    }
}

// ─── POST /api/ai/summarize ───────────────────────────────────────────────────
export async function summarizeCallHandler(req, res, next) {
    try {
        const { call_id } = req.body

        // Load the call and its stage results
        const [callRes, stagesRes] = await Promise.all([
            supabase.from('calls').select('*').eq('id', call_id).single(),
            supabase.from('call_stage_results').select('*').eq('call_id', call_id),
        ])

        if (callRes.error?.code === 'PGRST116') throw createError('Call not found', 404)
        if (callRes.error) throw createError(callRes.error.message, 500)

        const summary = await geminiService.summarizeCall({
            call: callRes.data,
            stage_results: stagesRes.data || [],
            outcome: callRes.data.outcome || 'unknown',
        })

        res.json({ summary })
    } catch (err) {
        next(err)
    }
}
