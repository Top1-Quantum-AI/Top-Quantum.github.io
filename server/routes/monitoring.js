/**
 * Monitoring Routes - مسارات المراقبة
 * Routes for system monitoring, health checks, and performance metrics
 * مسارات لمراقبة النظام وفحص الصحة ومقاييس الأداء
 */

import os from 'os';
import process from 'process';

import express from 'express';
import rateLimit from 'express-rate-limit';

import { monitoringService } from '../index.js';
import { authMiddleware, requireSubscription } from '../middleware/auth.js';

const router = express.Router();

// Rate limiting for monitoring routes - تحديد المعدل لمسارات المراقبة
const monitoringLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 requests per 5 minutes
  message: {
    error: 'تم تجاوز عدد طلبات المراقبة المسموح بها.',
    errorEn: 'Too many monitoring requests.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 admin requests per minute
  message: {
    error: 'تم تجاوز عدد طلبات الإدارة المسموح بها.',
    errorEn: 'Too many admin requests.'
  }
});

/**
 * @route   GET /api/monitoring/health
 * @desc    Get system health status - الحصول على حالة صحة النظام
 * @access  Public
 */
router.get('/health', async (req, res) => {
  try {
    const health = await monitoringService.getHealthSummary();
    
    // Determine overall status - تحديد الحالة العامة
    const overallStatus = health.alerts.critical > 0 ? 'critical' :
                         health.alerts.warning > 0 ? 'warning' : 'healthy';
    
    const statusCode = overallStatus === 'critical' ? 503 :
                      overallStatus === 'warning' ? 200 : 200;
    
    res.status(statusCode).json({
      success: true,
      status: overallStatus,
      timestamp: new Date(),
      data: {
        system: {
          status: overallStatus,
          uptime: process.uptime(),
          version: process.version,
          platform: os.platform(),
          arch: os.arch()
        },
        resources: {
          cpu: health.metrics.cpu,
          memory: health.metrics.memory,
          redis: health.metrics.redis
        },
        alerts: health.alerts,
        services: {
          database: health.services?.database || 'unknown',
          redis: health.services?.redis || 'unknown',
          ai: health.services?.ai || 'unknown',
          quantum: health.services?.quantum || 'unknown'
        }
      }
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: 'خطأ في فحص صحة النظام',
      errorEn: 'System health check error',
      timestamp: new Date()
    });
  }
});

/**
 * @route   GET /api/monitoring/metrics
 * @desc    Get system metrics - الحصول على مقاييس النظام
 * @access  Private (Admin)
 */
router.get('/metrics', 
  authMiddleware, 
  requireSubscription('enterprise'), 
  monitoringLimiter, 
  async (req, res) => {
    try {
      const { timeRange = '1h', granularity = '5m' } = req.query;
      
      // Validate time range - التحقق من نطاق الوقت
      const validRanges = ['5m', '15m', '1h', '6h', '24h', '7d'];
      if (!validRanges.includes(timeRange)) {
        return res.status(400).json({
          success: false,
          error: 'نطاق زمني غير صالح',
          errorEn: 'Invalid time range',
          validRanges
        });
      }
      
      const metrics = await monitoringService.getMetrics(timeRange, granularity);
      
      console.log(`✅ Metrics retrieved for admin user: ${req.user.username}`);
      console.log(`✅ تم استرداد المقاييس للمستخدم الإداري: ${req.user.username}`);
      
      res.status(200).json({
        success: true,
        data: {
          timeRange,
          granularity,
          metrics,
          timestamp: new Date()
        }
      });
      
    } catch (error) {
      console.error('Get metrics error:', error);
      res.status(500).json({
        success: false,
        error: 'خطأ في الحصول على المقاييس',
        errorEn: 'Error getting metrics'
      });
    }
  }
);

/**
 * @route   GET /api/monitoring/alerts
 * @desc    Get system alerts - الحصول على تنبيهات النظام
 * @access  Private (Admin)
 */
router.get('/alerts', 
  authMiddleware, 
  requireSubscription('enterprise'), 
  monitoringLimiter, 
  async (req, res) => {
    try {
      const { 
        severity, 
        status = 'active', 
        page = 1, 
        limit = 20,
        timeRange = '24h'
      } = req.query;
      
      const alerts = await monitoringService.getAlerts({
        severity,
        status,
        timeRange,
        page: parseInt(page),
        limit: Math.min(parseInt(limit), 100)
      });
      
      console.log(`✅ Alerts retrieved for admin user: ${req.user.username}`);
      console.log(`✅ تم استرداد التنبيهات للمستخدم الإداري: ${req.user.username}`);
      
      res.status(200).json({
        success: true,
        data: {
          alerts: alerts.data,
          pagination: {
            currentPage: alerts.page,
            totalPages: alerts.totalPages,
            totalAlerts: alerts.total,
            hasNext: alerts.hasNext,
            hasPrev: alerts.hasPrev
          },
          summary: {
            critical: alerts.summary?.critical || 0,
            warning: alerts.summary?.warning || 0,
            info: alerts.summary?.info || 0,
            resolved: alerts.summary?.resolved || 0
          },
          timestamp: new Date()
        }
      });
      
    } catch (error) {
      console.error('Get alerts error:', error);
      res.status(500).json({
        success: false,
        error: 'خطأ في الحصول على التنبيهات',
        errorEn: 'Error getting alerts'
      });
    }
  }
);

/**
 * @route   POST /api/monitoring/alerts/:alertId/resolve
 * @desc    Resolve system alert - حل تنبيه النظام
 * @access  Private (Admin)
 */
router.post('/alerts/:alertId/resolve', 
  authMiddleware, 
  requireSubscription('enterprise'), 
  adminLimiter, 
  async (req, res) => {
    try {
      const { alertId } = req.params;
      const { resolution, notes } = req.body;
      
      if (!alertId) {
        return res.status(400).json({
          success: false,
          error: 'معرف التنبيه مطلوب',
          errorEn: 'Alert ID is required'
        });
      }
      
      const resolved = await monitoringService.resolveAlert(alertId, {
        resolution: resolution || 'manual',
        notes,
        resolvedBy: req.user._id.toString(),
        resolvedAt: new Date()
      });
      
      if (!resolved) {
        return res.status(404).json({
          success: false,
          error: 'التنبيه غير موجود',
          errorEn: 'Alert not found'
        });
      }
      
      console.log(`✅ Alert ${alertId} resolved by admin: ${req.user.username}`);
      console.log(`✅ تم حل التنبيه ${alertId} بواسطة الإداري: ${req.user.username}`);
      
      res.status(200).json({
        success: true,
        message: 'تم حل التنبيه بنجاح',
        messageEn: 'Alert resolved successfully',
        data: {
          alertId,
          resolvedBy: req.user.username,
          resolvedAt: new Date(),
          resolution,
          notes
        }
      });
      
    } catch (error) {
      console.error('Resolve alert error:', error);
      res.status(500).json({
        success: false,
        error: 'خطأ في حل التنبيه',
        errorEn: 'Error resolving alert'
      });
    }
  }
);

/**
 * @route   GET /api/monitoring/performance
 * @desc    Get performance statistics - الحصول على إحصائيات الأداء
 * @access  Private (Premium+)
 */
router.get('/performance', 
  authMiddleware, 
  requireSubscription('premium'), 
  monitoringLimiter, 
  async (req, res) => {
    try {
      const { component, timeRange = '1h' } = req.query;
      
      const performance = await monitoringService.getPerformanceStats({
        component,
        timeRange
      });
      
      // Get current system info - الحصول على معلومات النظام الحالية
      const systemInfo = {
        uptime: process.uptime(),
        memory: {
          used: process.memoryUsage().heapUsed,
          total: process.memoryUsage().heapTotal,
          external: process.memoryUsage().external,
          rss: process.memoryUsage().rss
        },
        cpu: {
          usage: process.cpuUsage(),
          loadAverage: os.loadavg()
        },
        platform: {
          type: os.type(),
          platform: os.platform(),
          arch: os.arch(),
          release: os.release(),
          hostname: os.hostname()
        }
      };
      
      console.log(`✅ Performance stats retrieved for user: ${req.user.username}`);
      console.log(`✅ تم استرداد إحصائيات الأداء للمستخدم: ${req.user.username}`);
      
      res.status(200).json({
        success: true,
        data: {
          performance,
          systemInfo,
          timeRange,
          component: component || 'all',
          timestamp: new Date()
        }
      });
      
    } catch (error) {
      console.error('Get performance error:', error);
      res.status(500).json({
        success: false,
        error: 'خطأ في الحصول على إحصائيات الأداء',
        errorEn: 'Error getting performance statistics'
      });
    }
  }
);

/**
 * @route   GET /api/monitoring/logs
 * @desc    Get system logs - الحصول على سجلات النظام
 * @access  Private (Admin)
 */
router.get('/logs', 
  authMiddleware, 
  requireSubscription('enterprise'), 
  adminLimiter, 
  async (req, res) => {
    try {
      const {
        level = 'info',
        component,
        search,
        startTime,
        endTime,
        page = 1,
        limit = 50
      } = req.query;
      
      const logs = await monitoringService.getLogs({
        level,
        component,
        search,
        startTime: startTime ? new Date(startTime) : new Date(Date.now() - 24 * 60 * 60 * 1000),
        endTime: endTime ? new Date(endTime) : new Date(),
        page: parseInt(page),
        limit: Math.min(parseInt(limit), 100)
      });
      
      console.log(`✅ Logs retrieved for admin user: ${req.user.username}`);
      console.log(`✅ تم استرداد السجلات للمستخدم الإداري: ${req.user.username}`);
      
      res.status(200).json({
        success: true,
        data: {
          logs: logs.data,
          pagination: {
            currentPage: logs.page,
            totalPages: logs.totalPages,
            totalLogs: logs.total,
            hasNext: logs.hasNext,
            hasPrev: logs.hasPrev
          },
          filters: {
            level,
            component,
            search,
            startTime,
            endTime
          },
          timestamp: new Date()
        }
      });
      
    } catch (error) {
      console.error('Get logs error:', error);
      res.status(500).json({
        success: false,
        error: 'خطأ في الحصول على السجلات',
        errorEn: 'Error getting logs'
      });
    }
  }
);

/**
 * @route   GET /api/monitoring/status
 * @desc    Get detailed system status - الحصول على حالة النظام المفصلة
 * @access  Private (Premium+)
 */
router.get('/status', 
  authMiddleware, 
  requireSubscription('premium'), 
  monitoringLimiter, 
  async (req, res) => {
    try {
      const status = await monitoringService.getSystemStatus();
      
      // Add real-time system information - إضافة معلومات النظام في الوقت الفعلي
      const realTimeInfo = {
        timestamp: new Date(),
        uptime: {
          system: os.uptime(),
          process: process.uptime()
        },
        memory: {
          system: {
            total: os.totalmem(),
            free: os.freemem(),
            used: os.totalmem() - os.freemem(),
            percentage: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
          },
          process: process.memoryUsage()
        },
        cpu: {
          count: os.cpus().length,
          model: os.cpus()[0]?.model || 'Unknown',
          loadAverage: os.loadavg(),
          usage: process.cpuUsage()
        },
        network: {
          interfaces: Object.keys(os.networkInterfaces()).length,
          hostname: os.hostname()
        }
      };
      
      console.log(`✅ System status retrieved for user: ${req.user.username}`);
      console.log(`✅ تم استرداد حالة النظام للمستخدم: ${req.user.username}`);
      
      res.status(200).json({
        success: true,
        data: {
          ...status,
          realTime: realTimeInfo
        }
      });
      
    } catch (error) {
      console.error('Get system status error:', error);
      res.status(500).json({
        success: false,
        error: 'خطأ في الحصول على حالة النظام',
        errorEn: 'Error getting system status'
      });
    }
  }
);

/**
 * @route   POST /api/monitoring/test-alert
 * @desc    Test alert system - اختبار نظام التنبيهات
 * @access  Private (Admin)
 */
router.post('/test-alert', 
  authMiddleware, 
  requireSubscription('enterprise'), 
  adminLimiter, 
  async (req, res) => {
    try {
      const { severity = 'info', message, component = 'test' } = req.body;
      
      const validSeverities = ['info', 'warning', 'critical'];
      if (!validSeverities.includes(severity)) {
        return res.status(400).json({
          success: false,
          error: 'مستوى الخطورة غير صالح',
          errorEn: 'Invalid severity level',
          validSeverities
        });
      }
      
      const testAlert = await monitoringService.createAlert({
        type: 'test',
        severity,
        message: message || `Test alert created by ${req.user.username}`,
        messageAr: message || `تنبيه اختبار تم إنشاؤه بواسطة ${req.user.username}`,
        component,
        metadata: {
          createdBy: req.user._id.toString(),
          username: req.user.username,
          isTest: true
        }
      });
      
      console.log(`✅ Test alert created by admin: ${req.user.username}`);
      console.log(`✅ تم إنشاء تنبيه اختبار بواسطة الإداري: ${req.user.username}`);
      
      res.status(201).json({
        success: true,
        message: 'تم إنشاء تنبيه الاختبار بنجاح',
        messageEn: 'Test alert created successfully',
        data: {
          alert: testAlert,
          createdBy: req.user.username,
          timestamp: new Date()
        }
      });
      
    } catch (error) {
      console.error('Test alert error:', error);
      res.status(500).json({
        success: false,
        error: 'خطأ في إنشاء تنبيه الاختبار',
        errorEn: 'Error creating test alert'
      });
    }
  }
);

/**
 * @route   GET /api/monitoring/dashboard
 * @desc    Get monitoring dashboard data - الحصول على بيانات لوحة المراقبة
 * @access  Private (Premium+)
 */
router.get('/dashboard', 
  authMiddleware, 
  requireSubscription('premium'), 
  monitoringLimiter, 
  async (req, res) => {
    try {
      const { timeRange = '1h' } = req.query;
      
      // Get comprehensive dashboard data - الحصول على بيانات لوحة المراقبة الشاملة
      const [health, metrics, alerts, performance] = await Promise.all([
        monitoringService.getHealthSummary(),
        monitoringService.getMetrics(timeRange, '5m'),
        monitoringService.getAlerts({ status: 'active', limit: 10 }),
        monitoringService.getPerformanceStats({ timeRange })
      ]);
      
      // Calculate trends - حساب الاتجاهات
      const trends = {
        cpu: metrics.cpu?.trend || 'stable',
        memory: metrics.memory?.trend || 'stable',
        requests: metrics.requests?.trend || 'stable',
        errors: metrics.errors?.trend || 'stable'
      };
      
      // System overview - نظرة عامة على النظام
      const overview = {
        status: health.alerts.critical > 0 ? 'critical' :
                health.alerts.warning > 0 ? 'warning' : 'healthy',
        uptime: process.uptime(),
        version: process.version,
        environment: process.env.NODE_ENV || 'development',
        activeAlerts: health.alerts.critical + health.alerts.warning,
        totalRequests: metrics.requests?.total || 0,
        errorRate: metrics.errors?.rate || 0
      };
      
      console.log(`✅ Dashboard data retrieved for user: ${req.user.username}`);
      console.log(`✅ تم استرداد بيانات لوحة المراقبة للمستخدم: ${req.user.username}`);
      
      res.status(200).json({
        success: true,
        data: {
          overview,
          health,
          metrics,
          alerts: alerts.data,
          performance,
          trends,
          timeRange,
          timestamp: new Date()
        }
      });
      
    } catch (error) {
      console.error('Get dashboard error:', error);
      res.status(500).json({
        success: false,
        error: 'خطأ في الحصول على بيانات لوحة المراقبة',
        errorEn: 'Error getting dashboard data'
      });
    }
  }
);

export default router;