import express from 'express'
import {
    createCallHandler,
    getCallsHandler,
    getCallHandler,
    saveStageResultHandler,
    finishCallHandler,
} from '../controllers/callsController.js'
import { validate } from '../middleware/validation.js'
import {
    createCallSchema,
    getCallsSchema,
    stageResultSchema,
    finishCallSchema,
} from '../middleware/validation.js'

const router = express.Router()

router.post('/', validate(createCallSchema), createCallHandler)
router.get('/', validate(getCallsSchema, 'query'), getCallsHandler)
router.get('/:id', getCallHandler)
router.post('/:id/stages', validate(stageResultSchema), saveStageResultHandler)
router.post('/:id/finish', validate(finishCallSchema), finishCallHandler)

export default router
