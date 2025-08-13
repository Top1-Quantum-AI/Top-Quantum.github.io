/**
 * Request Logger Middleware - وسيط تسجيل الطلبات
 * Lightweight logger that adds a trace ID and basic request timing.
 */

import { randomUUID } from 'crypto';

export const requestLogger = (req, res, next) => {
  const start = process.hrtime.bigint();

  // Attach a trace ID if not provided
  if (!req.id) {
    req.id = randomUUID();
  }
  res.setHeader('X-Trace-Id', req.id);

  // Basic log on finish
  res.on('finish', () => {
    try {
      const end = process.hrtime.bigint();
      const ms = Number(end - start) / 1_000_000; // ns to ms
      const log = {
        time: new Date().toISOString(),
        traceId: req.id,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Math.round(ms),
        ip: req.ip,
      };
      if (process.env.NODE_ENV !== 'test') {
        console.log('[REQ]', JSON.stringify(log));
      }
    } catch (e) {
      // avoid logger throwing
    }
  });

  next();
};