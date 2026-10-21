/**
 * Centralized error handler middleware.
 * Returns a consistent JSON error format without leaking stack traces to clients.
 */
export function errorHandler(err, req, res, next) {
    const isDev = process.env.NODE_ENV !== 'production'

    // Log error server-side (without exposing to client)
    console.error(`[ERROR] ${req.method} ${req.path} →`, err.message)
    if (isDev) console.error(err.stack)

    const statusCode = err.status || err.statusCode || 500
    res.status(statusCode).json({
        error: statusCode === 500 ? 'Internal server error' : err.message,
        ...(isDev && { detail: err.message }),
    })
}

export function createError(message, status = 400) {
    const err = new Error(message)
    err.status = status
    return err
}
