import { supabase } from '../config/supabase.js'
import { createError } from '../middleware/errorHandler.js'
import { geminiService } from '../services/geminiService.js'

// ─── POST /api/calls ──────────────────────────────────────────────────────────
export async function createCallHandler(req, res, next) {
    try {
        const { prospect_name, company, prospect_role, pre_call_notes } = req.body

        const { data, error } = await supabase
            .from('calls')
            .insert({
                prospect_name,
                company,
                prospect_role: prospect_role || null,
                pre_call_notes: pre_call_notes || null,
                status: 'active',
                current_stage: 1,
                started_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (error) throw createError(error.message, 500)
        res.status(201).json(data)
    } catch (err) {
        next(err)
    }
}

// ─── GET /api/calls ───────────────────────────────────────────────────────────
export async function getCallsHandler(req, res, next) {
    try {
        const { search, outcome, status } = req.query

        let query = supabase
            .from('calls')
            .select('*')
            .order('started_at', { ascending: false })

        if (search) {
            query = query.or(
                `prospect_name.ilike.%${search}%,company.ilike.%${search}%`
            )
        }
        if (outcome) query = query.eq('outcome', outcome)
        if (status) query = query.eq('status', status)

        const { data, error } = await query

        if (error) throw createError(error.message, 500)
        res.json({ calls: data })
    } catch (err) {
        next(err)
    }
}

// ─── GET /api/calls/:id ───────────────────────────────────────────────────────
export async function getCallHandler(req, res, next) {
    try {
        const { id } = req.params

        const [callRes, stagesRes] = await Promise.all([
            supabase.from('calls').select('*').eq('id', id).single(),
            supabase
                .from('call_stage_results')
                .select('*')
                .eq('call_id', id)
                .order('stage_number', { ascending: true }),
        ])

        if (callRes.error) {
            if (callRes.error.code === 'PGRST116') throw createError('Call not found', 404)
            throw createError(callRes.error.message, 500)
        }

        res.json({
            call: callRes.data,
            stage_results: stagesRes.data || [],
        })
    } catch (err) {
        next(err)
    }
}

// ─── POST /api/calls/:id/stages ───────────────────────────────────────────────
export async function saveStageResultHandler(req, res, next) {
    try {
        const { id } = req.params
        const { stage_number, result, prospect_words, caller_notes } = req.body

        // Verify call exists and is active
        const { data: call, error: callError } = await supabase
            .from('calls')
            .select('id, status')
            .eq('id', id)
            .single()

        if (callError?.code === 'PGRST116') throw createError('Call not found', 404)
        if (callError) throw createError(callError.message, 500)
        if (call.status === 'completed') throw createError('Cannot modify a completed call', 409)

        // Upsert stage result (unique constraint: call_id + stage_number)
        const { data, error } = await supabase
            .from('call_stage_results')
            .upsert(
                {
                    call_id: id,
                    stage_number,
                    result,
                    prospect_words: prospect_words || '',
                    caller_notes: caller_notes || '',
                    updated_at: new Date().toISOString(),
                },
                { onConflict: 'call_id,stage_number' }
            )
            .select()
            .single()

        if (error) throw createError(error.message, 500)

        // Update call's current_stage to the furthest stage reached
        await supabase
            .from('calls')
            .update({
                current_stage: Math.max(call.current_stage || 1, stage_number),
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .lt('current_stage', stage_number)  // only update if new stage is further

        res.status(201).json(data)
    } catch (err) {
        next(err)
    }
}

// ─── POST /api/calls/:id/finish ───────────────────────────────────────────────
export async function finishCallHandler(req, res, next) {
    try {
        const { id } = req.params
        const { outcome, final_note } = req.body

        // Get call and all stage results for summary generation
        const [callRes, stagesRes] = await Promise.all([
            supabase.from('calls').select('*').eq('id', id).single(),
            supabase.from('call_stage_results').select('*').eq('call_id', id),
        ])

        if (callRes.error?.code === 'PGRST116') throw createError('Call not found', 404)
        if (callRes.error) throw createError(callRes.error.message, 500)
        if (callRes.data.status === 'completed') throw createError('Call is already completed', 409)

        // Generate AI summary
        let summary = null
        try {
            summary = await geminiService.summarizeCall({
                call: callRes.data,
                stage_results: stagesRes.data || [],
                outcome,
                final_note,
            })
        } catch (aiErr) {
            console.warn('[AI] Summary generation failed:', aiErr.message)
            summary = null // Don't fail the whole request if AI is unavailable
        }

        // Mark call as completed
        const { data, error } = await supabase
            .from('calls')
            .update({
                status: 'completed',
                outcome,
                summary,
                ended_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw createError(error.message, 500)

        res.json({ call: data, summary_generated: !!summary })
    } catch (err) {
        next(err)
    }
}
