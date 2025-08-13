/**
 * Global Error Handler - معالج الأخطاء العام
 * Centralized Express error handling with structured, bilingual responses
 * معالجة موحدة لأخطاء إكسبريس مع استجابات منظمة وثنائية اللغة
 */

// Error response normalizer
function buildErrorResponse(err, req) {
  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const isProd = process.env.NODE_ENV === 'production';

  // Known error types classification
  const name = err.name || 'Error';
  const type =
    name === 'ValidationError' || err.isJoi
      ? 'validation_error'
      : name === 'JsonWebTokenError' || name === 'TokenExpiredError'
      ? 'auth_error'
      : name === 'RateLimitError'
      ? 'rate_limit_error'
      : statusCode >= 500
      ? 'server_error'
      : 'client_error';

  const traceId = req.headers['x-trace-id'] || req.id || undefined;

  // Bilingual message
  const defaultMessages = {
    en: 'An unexpected error occurred. Please try again later.',
    ar: 'حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.'
  };

  const details = !isProd ? safeErrorDetails(err) : undefined;

  return {
    success: false,
    error: {
      type,
      name,
      message: err.message || defaultMessages.en,
      messageAr: err.messageAr || defaultMessages.ar,
      statusCode,
      path: req.originalUrl,
      method: req.method,
      traceId,
      timestamp: new Date().toISOString(),
      details
    }
  };
}

function safeErrorDetails(err) {
  // Avoid leaking secrets; only include safe, useful diagnostics
  return {
    stack: err.stack,
    code: err.code,
    cause: err.cause && typeof err.cause === 'object' ? { name: err.cause.name, message: err.cause.message } : undefined,
    context: err.context,
  };
}

// Named export to match import { errorHandler } from './middleware/errorHandler.js'
export const errorHandler = (err, req, res, next) => {
  try {
    // Respect headers already sent
    if (res.headersSent) {
      return next(err);
    }

    // Derive status code
    const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : (err.status || 500);

    // Build structured body
    const body = buildErrorResponse(err, req);

    // Minimal server-side logging (without secrets)
    const logLevel = statusCode >= 500 ? 'ERROR' : 'WARN';
    const traceId = body.error.traceId ? ` [traceId=${body.error.traceId}]` : '';
    console[statusCode >= 500 ? 'error' : 'warn'](`${logLevel}${traceId}: ${body.error.name}: ${body.error.message}`);

    // Respond
    res.status(statusCode).json(body);
  } catch (handlerErr) {
    // Fallback in case our handler crashes
    try {
      console.error('ERROR: Failed inside error handler:', handlerErr);
      res.status(500).json({
        success: false,
        error: {
          type: 'server_error',
          name: 'InternalServerError',
          message: 'Internal server error while handling another error',
          messageAr: 'حدث خطأ داخلي أثناء معالجة خطأ آخر',
          statusCode: 500,
          timestamp: new Date().toISOString()
        }
      });
    } catch (_) {
      // Give up gracefully
      // eslint-disable-next-line no-empty
    }
  }
};