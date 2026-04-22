/**
 * Mythos proxy routes
 * مسارات proxy لخدمة OpenMythos Python
 *
 * يُعيد توجيه جميع الطلبات الواردة إلى /api/mythos/*
 * نحو خدمة FastAPI (MYTHOS_SERVICE_URL).
 */

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router = express.Router();

const MYTHOS_URL = process.env.MYTHOS_SERVICE_URL ?? 'http://mythos-service:8000';

/**
 * Proxy all /api/mythos/* → Python FastAPI service
 *
 * Path rewrite: /api/mythos/models/create → /models/create
 */
router.use(
  '/',
  createProxyMiddleware({
    target: MYTHOS_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/mythos': '' },
    on: {
      error: (err, _req, res) => {
        console.error('❌ Mythos proxy error:', err.message);
        if (!res.headersSent) {
          res.status(502).json({
            success: false,
            error: 'خدمة OpenMythos غير متاحة حالياً',
            errorEn: 'OpenMythos service is currently unavailable',
          });
        }
      },
    },
  })
);

export default router;
