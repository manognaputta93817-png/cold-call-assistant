import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import callsRouter from './routes/calls.js'
import aiRouter from './routes/ai.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

// ─── Security & logging ───────────────────────────────────────────────────────
app.use(helmet())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:4173',
].filter(Boolean)

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error('CORS: origin not allowed'))
            }
        },
        credentials: true,
    })
)

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false }))

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    })
})

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/calls', callsRouter)
app.use('/api/ai', aiRouter)

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
})

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler)

export default app
