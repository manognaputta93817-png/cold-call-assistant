import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Response interceptor for consistent error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred'
        return Promise.reject(new Error(message))
    }
)

// ─── Calls ───────────────────────────────────────────────────────────────────

export const createCall = (data) =>
    api.post('/api/calls', data)

export const getCalls = (params = {}) =>
    api.get('/api/calls', { params })

export const getCall = (id) =>
    api.get(`/api/calls/${id}`)

export const saveStageResult = (callId, data) =>
    api.post(`/api/calls/${callId}/stages`, data)

export const finishCall = (callId, data) =>
    api.post(`/api/calls/${callId}/finish`, data)

// ─── AI ──────────────────────────────────────────────────────────────────────

export const getStageSuggestion = (data) =>
    api.post('/api/ai/suggest-stage', data)

export const summarizeCall = (callId) =>
    api.post('/api/ai/summarize', { call_id: callId })

export default api
