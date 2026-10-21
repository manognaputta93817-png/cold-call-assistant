import rateLimit from 'express-rate-limit'

export const aiRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    message: { error: 'Too many AI requests. Please wait a minute before trying again.' },
    standardHeaders: true,
    legacyHeaders: false,
})
