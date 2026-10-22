import { z } from 'zod'

const VALID_STATUSES = ['active', 'completed']
const VALID_STAGE_RESULTS = [
    'progressed', 'permission_granted', 'engaged', 'mild_interest', 'objection_raised',
    'not_interested', 'unavailable', 'callback_requested', 'email_requested',
    'not_relevant', 'follow_up_required', 'qualified', 'partially_qualified',
    'not_a_fit', 'wrong_contact', 'high_pain', 'low_pain', 'interested',
    'demo_requested', 'info_requested', 'partially_resolved', 'objection_unresolved',
    'budget_timing', 'nurture', 'meeting_booked', 'follow_up_scheduled',
    'next_step_agreed', 'prospect_to_confirm',
]

const VALID_FINAL_OUTCOMES = [
    'meeting_booked', 'follow_up_scheduled', 'next_step_agreed',
    'info_sent', 'not_interested', 'no_response', 'wrong_contact', 'nurture', 'other',
]

export const createCallSchema = z.object({
    prospect_name: z
        .string({ required_error: 'Prospect name is required', invalid_type_error: 'Prospect name is required' })
        .trim()
        .min(1, 'Prospect name is required')
        .max(200),
    company: z
        .string({ required_error: 'Company is required', invalid_type_error: 'Company is required' })
        .trim()
        .min(1, 'Company is required')
        .max(200),
    prospect_role: z.string().trim().max(200).optional().nullable(),
    pre_call_notes: z.string().trim().max(5000).optional().nullable(),
})

export const getCallsSchema = z.object({
    search: z.string().optional(),
    outcome: z.string().optional(),
    status: z.enum(['active', 'completed']).optional(),
})

export const stageResultSchema = z.object({
    stage_number: z.coerce
        .number()
        .int()
        .min(1, 'Stage number must be 1–8')
        .max(8, 'Stage number must be 1–8'),
    result: z
        .string({ required_error: 'Result is required', invalid_type_error: 'Result is required' })
        .min(1, 'Result is required'),
    prospect_words: z.string().trim().max(10000).optional().nullable().default(''),
    caller_notes: z.string().trim().max(5000).optional().nullable().default(''),
})

export const finishCallSchema = z.object({
    outcome: z.enum(VALID_FINAL_OUTCOMES, {
        errorMap: () => ({ message: `Outcome must be one of: ${VALID_FINAL_OUTCOMES.join(', ')}` }),
    }),
    final_note: z.string().trim().max(2000).optional().nullable(),
})

export const aiSuggestSchema = z.object({
    current_stage: z.coerce.number().int().min(1).max(8).optional(),
    prospect_words: z
        .string({ required_error: 'Prospect words are required', invalid_type_error: 'Prospect words are required' })
        .trim()
        .min(1, 'Prospect words are required')
        .max(5000),
    caller_notes: z.string().trim().max(2000).optional().nullable(),
})

export const aiSummarizeSchema = z.object({
    call_id: z.string().uuid('call_id must be a valid UUID'),
})

/**
 * Middleware factory that validates req.body against a Zod schema.
 */
export function validate(schema, source = 'body') {
    return (req, res, next) => {
        const result = schema.safeParse(req[source])
        if (!result.success) {
            const messages = result.error.issues.map((i) => i.message).join('; ')
            return res.status(400).json({ error: messages })
        }
        req[source] = result.data
        next()
    }
}
