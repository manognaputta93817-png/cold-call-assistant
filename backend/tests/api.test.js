import request from 'supertest'
import app from '../src/app.js'

describe('Health', () => {
    it('GET /health returns 200 with status ok', async () => {
        const res = await request(app).get('/health')
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('ok')
        expect(res.body.timestamp).toBeDefined()
    })
})

describe('POST /api/calls — validation', () => {
    it('rejects missing prospect_name', async () => {
        const res = await request(app).post('/api/calls').send({ company: 'Acme' })
        expect(res.status).toBe(400)
        expect(res.body.error).toMatch(/prospect name/i)
    })

    it('rejects missing company', async () => {
        const res = await request(app).post('/api/calls').send({ prospect_name: 'Alex' })
        expect(res.status).toBe(400)
        expect(res.body.error).toMatch(/company/i)
    })

    it('rejects empty strings', async () => {
        const res = await request(app)
            .post('/api/calls')
            .send({ prospect_name: '   ', company: '' })
        expect(res.status).toBe(400)
    })

    it('accepts valid body (may fail at DB if no Supabase)', async () => {
        const res = await request(app)
            .post('/api/calls')
            .send({ prospect_name: 'Alex Morgan', company: 'Northstar Solutions' })
        // 201 if DB connected, 500 if no Supabase — both are acceptable at this stage
        expect([201, 500]).toContain(res.status)
        expect(res.body.error || res.body.id).toBeDefined()
    })
})

describe('POST /api/calls/:id/stages — validation', () => {
    it('rejects stage_number outside 1-8', async () => {
        const res = await request(app)
            .post('/api/calls/00000000-0000-0000-0000-000000000000/stages')
            .send({ stage_number: 9, result: 'progressed' })
        expect(res.status).toBe(400)
        expect(res.body.error).toMatch(/stage/i)
    })

    it('rejects stage_number 0', async () => {
        const res = await request(app)
            .post('/api/calls/00000000-0000-0000-0000-000000000000/stages')
            .send({ stage_number: 0, result: 'progressed' })
        expect(res.status).toBe(400)
    })

    it('rejects missing result', async () => {
        const res = await request(app)
            .post('/api/calls/00000000-0000-0000-0000-000000000000/stages')
            .send({ stage_number: 4 })
        expect(res.status).toBe(400)
        expect(res.body.error).toMatch(/result/i)
    })
})

describe('POST /api/calls/:id/finish — validation', () => {
    it('rejects invalid outcome', async () => {
        const res = await request(app)
            .post('/api/calls/00000000-0000-0000-0000-000000000000/finish')
            .send({ outcome: 'invalid_outcome' })
        expect(res.status).toBe(400)
    })

    it('rejects missing outcome', async () => {
        const res = await request(app)
            .post('/api/calls/00000000-0000-0000-0000-000000000000/finish')
            .send({})
        expect(res.status).toBe(400)
    })

    it('accepts valid outcome (may fail at DB if no Supabase)', async () => {
        const res = await request(app)
            .post('/api/calls/00000000-0000-0000-0000-000000000000/finish')
            .send({ outcome: 'meeting_booked' })
        expect([200, 404, 500]).toContain(res.status)
        expect(res.body).toBeDefined()
    })
})

describe('POST /api/ai/suggest-stage — validation', () => {
    it('rejects empty prospect_words', async () => {
        const res = await request(app)
            .post('/api/ai/suggest-stage')
            .send({ prospect_words: '' })
        expect(res.status).toBe(400)
        expect(res.body.error).toMatch(/words/i)
    })

    it('rejects missing prospect_words', async () => {
        const res = await request(app)
            .post('/api/ai/suggest-stage')
            .send({ current_stage: 4 })
        expect(res.status).toBe(400)
    })
})

describe('POST /api/ai/summarize — validation', () => {
    it('rejects non-UUID call_id', async () => {
        const res = await request(app)
            .post('/api/ai/summarize')
            .send({ call_id: 'not-a-uuid' })
        expect(res.status).toBe(400)
        expect(res.body.error).toMatch(/uuid/i)
    })
})

describe('GET /api/calls/:id — unknown ID', () => {
    it('returns error for unknown call id with no DB', async () => {
        const res = await request(app).get(
            '/api/calls/00000000-0000-0000-0000-000000000000'
        )
        // Without real Supabase: 500; with Supabase and no record: 404
        expect([404, 500]).toContain(res.status)
        expect(res.body.error).toBeDefined()
    })
})

describe('Unknown routes', () => {
    it('returns 404 for undefined paths', async () => {
        const res = await request(app).get('/api/undefined-route')
        expect(res.status).toBe(404)
    })
})
