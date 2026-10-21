import express from 'express'
import { suggestStageHandler, summarizeCallHandler } from '../controllers/aiController.js'
import { validate } from '../middleware/validation.js'
import { aiSuggestSchema, aiSummarizeSchema } from '../middleware/validation.js'
import { aiRateLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/suggest-stage', aiRateLimiter, validate(aiSuggestSchema), suggestStageHandler)
router.post('/summarize', aiRateLimiter, validate(aiSummarizeSchema), summarizeCallHandler)

export default router
