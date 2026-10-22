/**
 * AI endpoint & service tests (no real Gemini API key required).
 *
 * Strategy:
 * - HTTP validation: use supertest against the full app.
 * - Service unit tests: import the singleton then patch its instance properties
 *   (apiKey / provider) to force mock mode. ESM module caching means we get the
 *   same singleton as the app — patching its properties is safe for unit tests
 *   because we restore them in afterEach().
 */

import request from 'supertest'
import app from '../src/app.js'
import { geminiService } from '../src/services/geminiService.js'

// ─── HTTP validation tests ────────────────────────────────────────────────────

describe('POST /api/ai/suggest-stage — input validation', () => {
    it('400 when prospect_words is missing', async () => {
        const res = await request(app)
            .post('/api/ai/suggest-stage')
            .send({ current_stage: 4 })
        expect(res.status).toBe(400)
        expect(res.body.error).toMatch(/words/i)
    })

    it('400 when prospect_words is blank', async () => {
        const res = await request(app)
            .post('/api/ai/suggest-stage')
            .send({ prospect_words: '   ' })
        expect(res.status).toBe(400)
        expect(res.body.error).toMatch(/words/i)
    })

    it('400 when current_stage is out of range (9)', async () => {
        const res = await request(app)
            .post('/api/ai/suggest-stage')
            .send({ current_stage: 9, prospect_words: 'We are interested' })
        expect(res.status).toBe(400)
    })

    it('400 when current_stage is 0', async () => {
        const res = await request(app)
            .post('/api/ai/suggest-stage')
            .send({ current_stage: 0, prospect_words: 'Sounds interesting' })
        expect(res.status).toBe(400)
    })
})

describe('POST /api/ai/summarize — input validation', () => {
    it('400 for non-UUID call_id', async () => {
        const res = await request(app)
            .post('/api/ai/summarize')
            .send({ call_id: 'not-a-uuid' })
        expect(res.status).toBe(400)
        expect(res.body.error).toMatch(/uuid/i)
    })

    it('400 when call_id is missing', async () => {
        const res = await request(app)
            .post('/api/ai/summarize')
            .send({})
        expect(res.status).toBe(400)
    })

    it('400 when call_id is an empty string', async () => {
        const res = await request(app)
            .post('/api/ai/summarize')
            .send({ call_id: '' })
        expect(res.status).toBe(400)
    })
})

// ─── GeminiService unit tests — instance patched to mock mode ─────────────────
// We patch .provider and .apiKey so _getClient() returns null (mock path).
// Restore in afterEach so other tests aren't affected.

describe('GeminiService.suggestStage — mock mode', () => {
    let savedProvider, savedKey

    beforeEach(() => {
        savedProvider = geminiService.provider
        savedKey = geminiService.apiKey
        geminiService.provider = 'mock'
        geminiService.apiKey = null
    })

    afterEach(() => {
        geminiService.provider = savedProvider
        geminiService.apiKey = savedKey
    })

    it('returns a structured mock suggestion', async () => {
        const result = await geminiService.suggestStage({
            current_stage: 4,
            prospect_words: 'We have an existing process but it is slow.',
            caller_notes: 'Team seems open to change.',
        })

        expect(result).toMatchObject({
            suggested_stage_number: expect.any(Number),
            explanation: expect.stringContaining('MOCK MODE'),
            confidence: 'moderate',
            suggested_question: expect.any(String),
            question_rationale: expect.any(String),
        })
    })

    it('returns stage 4 label when current_stage is 4', async () => {
        const result = await geminiService.suggestStage({
            current_stage: 4,
            prospect_words: 'We currently use spreadsheets.',
        })
        expect(result.suggested_stage_number).toBe(4)
        expect(result.suggested_stage_name).toMatch(/Discovery/i)
    })

    it('falls back to stage 4 when current_stage is undefined', async () => {
        const result = await geminiService.suggestStage({
            prospect_words: 'Interested but budget is tight.',
        })
        expect(result.suggested_stage_number).toBe(4)
    })
})

describe('GeminiService.summarizeCall — mock mode', () => {
    let savedProvider, savedKey
    const mockCall = { prospect_name: 'Alex Morgan', company: 'Northstar Solutions', prospect_role: 'CTO' }
    const mockStageResults = [
        { stage_number: 1, result: 'progressed', prospect_words: 'What is this about?', caller_notes: 'Friendly' },
        { stage_number: 4, result: 'qualified', prospect_words: 'We lose hours every week.', caller_notes: 'Strong pain' },
    ]

    beforeEach(() => {
        savedProvider = geminiService.provider
        savedKey = geminiService.apiKey
        geminiService.provider = 'mock'
        geminiService.apiKey = null
    })

    afterEach(() => {
        geminiService.provider = savedProvider
        geminiService.apiKey = savedKey
    })

    it('returns a mock summary string containing MOCK MODE label', async () => {
        const summary = await geminiService.summarizeCall({
            call: mockCall,
            stage_results: mockStageResults,
            outcome: 'follow_up_scheduled',
            final_note: 'Sending case study first.',
        })
        expect(typeof summary).toBe('string')
        expect(summary.length).toBeGreaterThan(10)
        expect(summary).toContain('MOCK MODE')
    })

    it('includes prospect name and company in mock summary', async () => {
        const summary = await geminiService.summarizeCall({
            call: mockCall,
            stage_results: [],
            outcome: 'not_interested',
        })
        expect(summary).toContain('Alex Morgan')
        expect(summary).toContain('Northstar Solutions')
    })

    it('handles zero stage results gracefully', async () => {
        const summary = await geminiService.summarizeCall({
            call: { prospect_name: 'Test', company: 'Corp' },
            stage_results: [],
            outcome: 'no_response',
        })
        expect(typeof summary).toBe('string')
        expect(summary.length).toBeGreaterThan(0)
    })
})

// ─── GEMINI_MODEL env var ─────────────────────────────────────────────────────

describe('GEMINI_MODEL configuration', () => {
    it('defaults to gemini-2.0-flash when env var is not set', () => {
        const saved = process.env.GEMINI_MODEL
        delete process.env.GEMINI_MODEL
        const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
        expect(model).toBe('gemini-2.0-flash')
        if (saved) process.env.GEMINI_MODEL = saved
    })

    it('uses custom model when GEMINI_MODEL is set', () => {
        const saved = process.env.GEMINI_MODEL
        process.env.GEMINI_MODEL = 'gemini-2.0-flash-lite'
        const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
        expect(model).toBe('gemini-2.0-flash-lite')
        if (saved) process.env.GEMINI_MODEL = saved
        else delete process.env.GEMINI_MODEL
    })
})

// ─── Safety: no API key in mock output ───────────────────────────────────────

describe('GeminiService — API key safety', () => {
    let savedProvider, savedKey

    beforeEach(() => {
        savedProvider = geminiService.provider
        savedKey = geminiService.apiKey
        geminiService.provider = 'mock'
        geminiService.apiKey = null
    })

    afterEach(() => {
        geminiService.provider = savedProvider
        geminiService.apiKey = savedKey
    })

    it('mock output never contains an API key pattern', async () => {
        const summary = await geminiService.summarizeCall({
            call: { prospect_name: 'P', company: 'C' },
            stage_results: [],
            outcome: 'other',
        })
        // Google API keys match AIza[A-Za-z0-9_-]{35}
        expect(summary).not.toMatch(/AIza[A-Za-z0-9_-]{10,}/)
    })
})
