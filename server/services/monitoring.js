/**
 * Monitoring Service - خدمة المراقبة
 * Real-time system monitoring and metrics collection
 * مراقبة النظام في الوقت الفعلي وجمع المقاييس
 */

import os from 'os';
import process from 'process';
import { EventEmitter } from 'events';

class MonitoringService extends EventEmitter {
  constructor(redis) {
    super();
    this.redis = redis;
    this.isRunning = false;
    this.intervals = [];
    this.metrics = {
      system: {},
      application: {},
      quantum: {},
      ai: {}
    };
    
    // Alert thresholds
    this.thresholds = {
      cpu: parseFloat(process.env.CPU_THRESHOLD) || 80,
      memory: parseFloat(process.env.MEMORY_THRESHOLD) || 85,
      responseTime: parseInt(process.env.RESPONSE_TIME_THRESHOLD) || 2000,
      errorRate: parseFloat(process.env.ERROR_RATE_THRESHOLD) || 5,
      diskSpace: parseFloat(process.env.DISK_SPACE_THRESHOLD) || 10
    };
    
    this.alertHistory = new Map();
    this.metricsHistory = [];
    this.maxHistorySize = 1000;
  }

  /**
   * Start monitoring service
   * بدء خدمة المراقبة
   */
  async start() {
    if (this.isRunning) {
      console.log('⚠️ Monitoring service is already running');
      return;
    }

    try {
      this.isRunning = true;
      
      // Start system metrics collection
      this.startSystemMonitoring();
      
      // Start application metrics collection
      this.startApplicationMonitoring();
      
      // Start Redis metrics collection
      this.startRedisMonitoring();
      
      // Start alert monitoring
      this.startAlertMonitoring();
      
      console.log('✅ Monitoring service started successfully');
      console.log('✅ تم بدء خدمة المراقبة بنجاح');
      
      this.emit('started');
    } catch (error) {
      console.error('❌ Failed to start monitoring service:', error);
      this.isRunning = false;
      throw error;
    }
  }

  /**
   * Stop monitoring service
   * إيقاف خدمة المراقبة
   */
  async stop() {
    if (!this.isRunning) {
      return;
    }

    try {
      this.isRunning = false;
      
      // Clear all intervals
      this.intervals.forEach(interval => clearInterval(interval));
      this.intervals = [];
      
      console.log('✅ Monitoring service stopped');
      console.log('✅ تم إيقاف خدمة المراقبة');
      
      this.emit('stopped');
    } catch (error) {
      console.error('❌ Error stopping monitoring service:', error);
      throw error;
    }
  }

  /**
   * Start system metrics monitoring
   * بدء مراقبة مقاييس النظام
   */
  startSystemMonitoring() {
    const interval = setInterval(async () => {
      try {
        const systemMetrics = await this.collectSystemMetrics();
        this.metrics.system = systemMetrics;
        
        // Store in Redis
        await this.storeMetrics('system', systemMetrics);
        
        // Check for alerts
        this.checkSystemAlerts(systemMetrics);
        
      } catch (error) {
        console.error('Error collecting system metrics:', error);
      }
    }, 5000); // Every 5 seconds
    
    this.intervals.push(interval);
  }

  /**
   * Start application metrics monitoring
   * بدء مراقبة مقاييس التطبيق
   */
  startApplicationMonitoring() {
    const interval = setInterval(async () => {
      try {
        const appMetrics = await this.collectApplicationMetrics();
        this.metrics.application = appMetrics;
        
        // Store in Redis
        await this.storeMetrics('application', appMetrics);
        
        // Check for alerts
        this.checkApplicationAlerts(appMetrics);
        
      } catch (error) {
        console.error('Error collecting application metrics:', error);
      }
    }, 10000); // Every 10 seconds
    
    this.intervals.push(interval);
  }

  /**
   * Start Redis metrics monitoring
   * بدء مراقبة مقاييس Redis
   */
  startRedisMonitoring() {
    const interval = setInterval(async () => {
      try {
        const redisMetrics = await this.collectRedisMetrics();
        this.metrics.redis = redisMetrics;
        
        // Store in Redis (ironically)
        await this.storeMetrics('redis', redisMetrics);
        
      } catch (error) {
        console.error('Error collecting Redis metrics:', error);
      }
    }, 15000); // Every 15 seconds
    
    this.intervals.push(interval);
  }

  /**
   * Start alert monitoring
   * بدء مراقبة التنبيهات
   */
  startAlertMonitoring() {
    const interval = setInterval(() => {
      this.processAlerts();
    }, 30000); // Every 30 seconds
    
    this.intervals.push(interval);
  }

  /**
   * Collect system metrics
   * جمع مقاييس النظام
   */
  async collectSystemMetrics() {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    // Calculate CPU usage
    const cpuUsage = await this.getCPUUsage();
    
    return {
      timestamp: new Date().toISOString(),
      cpu: {
        usage: cpuUsage,
        cores: cpus.length,
        model: cpus[0]?.model || 'Unknown'
      },
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usage: (usedMem / totalMem) * 100
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        uptime: os.uptime(),
        loadavg: os.loadavg()
      }
    };
  }

  /**
   * Collect application metrics
   * جمع مقاييس التطبيق
   */
  async collectApplicationMetrics() {
    const memUsage = process.memoryUsage();
    
    return {
      timestamp: new Date().toISOString(),
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        memory: {
          rss: memUsage.rss,
          heapTotal: memUsage.heapTotal,
          heapUsed: memUsage.heapUsed,
          external: memUsage.external,
          arrayBuffers: memUsage.arrayBuffers
        },
        cpu: process.cpuUsage()
      },
      eventLoop: {
        lag: await this.getEventLoopLag()
      },
      version: {
        node: process.version,
        v8: process.versions.v8
      }
    };
  }

  /**
   * Collect Redis metrics
   * جمع مقاييس Redis
   */
  async collectRedisMetrics() {
    try {
      const info = await this.redis.info();
      const memory = await this.redis.info('memory');
      const stats = await this.redis.info('stats');
      
      return {
        timestamp: new Date().toISOString(),
        connection: {
          status: this.redis.status,
          connectedClients: this.parseRedisInfo(info, 'connected_clients'),
          blockedClients: this.parseRedisInfo(info, 'blocked_clients')
        },
        memory: {
          used: this.parseRedisInfo(memory, 'used_memory'),
          peak: this.parseRedisInfo(memory, 'used_memory_peak'),
          rss: this.parseRedisInfo(memory, 'used_memory_rss')
        },
        stats: {
          totalConnections: this.parseRedisInfo(stats, 'total_connections_received'),
          totalCommands: this.parseRedisInfo(stats, 'total_commands_processed'),
          keyspaceHits: this.parseRedisInfo(stats, 'keyspace_hits'),
          keyspaceMisses: this.parseRedisInfo(stats, 'keyspace_misses')
        }
      };
    } catch (error) {
      return {
        timestamp: new Date().toISOString(),
        error: error.message,
        status: 'disconnected'
      };
    }
  }

  /**
   * Get CPU usage percentage
   * الحصول على نسبة استخدام المعالج
   */
  getCPUUsage() {
    return new Promise((resolve) => {
      const startUsage = process.cpuUsage();
      const startTime = process.hrtime();
      
      setTimeout(() => {
        const currentUsage = process.cpuUsage(startUsage);
        const currentTime = process.hrtime(startTime);
        
        const totalTime = currentTime[0] * 1000000 + currentTime[1] / 1000;
        const totalUsage = currentUsage.user + currentUsage.system;
        
        const cpuPercent = (totalUsage / totalTime) * 100;
        resolve(Math.min(100, Math.max(0, cpuPercent)));
      }, 100);
    });
  }

  /**
   * Get event loop lag
   * الحصول على تأخير حلقة الأحداث
   */
  getEventLoopLag() {
    return new Promise((resolve) => {
      const start = process.hrtime.bigint();
      setImmediate(() => {
        const lag = Number(process.hrtime.bigint() - start) / 1000000;
        resolve(lag);
      });
    });
  }

  /**
   * Parse Redis info string
   * تحليل سلسلة معلومات Redis
   */
  parseRedisInfo(info, key) {
    const lines = info.split('\r\n');
    for (const line of lines) {
      if (line.startsWith(key + ':')) {
        const value = line.split(':')[1];
        return isNaN(value) ? value : Number(value);
      }
    }
    return null;
  }

  /**
   * Store metrics in Redis
   * تخزين المقاييس في Redis
   */
  async storeMetrics(type, metrics) {
    try {
      const key = `metrics:${type}:${Date.now()}`;
      await this.redis.setex(key, 3600, JSON.stringify(metrics)); // Store for 1 hour
      
      // Keep only recent metrics
      const keys = await this.redis.keys(`metrics:${type}:*`);
      if (keys.length > 100) {
        const oldKeys = keys.sort().slice(0, keys.length - 100);
        if (oldKeys.length > 0) {
          await this.redis.del(...oldKeys);
        }
      }
    } catch (error) {
      console.error(`Error storing ${type} metrics:`, error);
    }
  }

  /**
   * Check system alerts
   * فحص تنبيهات النظام
   */
  checkSystemAlerts(metrics) {
    const alerts = [];
    
    // CPU usage alert
    if (metrics.cpu.usage > this.thresholds.cpu) {
      alerts.push({
        type: 'cpu_high',
        severity: 'warning',
        message: `High CPU usage: ${metrics.cpu.usage.toFixed(2)}%`,
        messageAr: `استخدام عالي للمعالج: ${metrics.cpu.usage.toFixed(2)}%`,
        value: metrics.cpu.usage,
        threshold: this.thresholds.cpu
      });
    }
    
    // Memory usage alert
    if (metrics.memory.usage > this.thresholds.memory) {
      alerts.push({
        type: 'memory_high',
        severity: 'warning',
        message: `High memory usage: ${metrics.memory.usage.toFixed(2)}%`,
        messageAr: `استخدام عالي للذاكرة: ${metrics.memory.usage.toFixed(2)}%`,
        value: metrics.memory.usage,
        threshold: this.thresholds.memory
      });
    }
    
    // Process alerts
    alerts.forEach(alert => this.processAlert(alert));
  }

  /**
   * Check application alerts
   * فحص تنبيهات التطبيق
   */
  checkApplicationAlerts(metrics) {
    const alerts = [];
    
    // Event loop lag alert
    if (metrics.eventLoop.lag > 100) {
      alerts.push({
        type: 'event_loop_lag',
        severity: 'warning',
        message: `High event loop lag: ${metrics.eventLoop.lag.toFixed(2)}ms`,
        messageAr: `تأخير عالي في حلقة الأحداث: ${metrics.eventLoop.lag.toFixed(2)}ms`,
        value: metrics.eventLoop.lag,
        threshold: 100
      });
    }
    
    // Process alerts
    alerts.forEach(alert => this.processAlert(alert));
  }

  /**
   * Process individual alert
   * معالجة تنبيه فردي
   */
  processAlert(alert) {
    const alertKey = `${alert.type}_${Date.now()}`;
    const lastAlert = this.alertHistory.get(alert.type);
    
    // Avoid spam - only alert if last alert was more than 5 minutes ago
    if (!lastAlert || Date.now() - lastAlert.timestamp > 300000) {
      this.alertHistory.set(alert.type, {
        ...alert,
        timestamp: Date.now()
      });
      
      // Emit alert event
      this.emit('alert', alert);
      
      // Log alert
      console.warn(`🚨 ALERT [${alert.severity.toUpperCase()}]: ${alert.message}`);
      console.warn(`🚨 تنبيه [${alert.severity.toUpperCase()}]: ${alert.messageAr}`);
      
      // Store alert in Redis
      this.storeAlert(alert);
    }
  }

  /**
   * Store alert in Redis
   * تخزين التنبيه في Redis
   */
  async storeAlert(alert) {
    try {
      const key = `alerts:${alert.type}:${Date.now()}`;
      await this.redis.setex(key, 86400, JSON.stringify(alert)); // Store for 24 hours
    } catch (error) {
      console.error('Error storing alert:', error);
    }
  }

  /**
   * Process all alerts
   * معالجة جميع التنبيهات
   */
  processAlerts() {
    // Clean up old alerts from history
    const now = Date.now();
    for (const [type, alert] of this.alertHistory.entries()) {
      if (now - alert.timestamp > 3600000) { // 1 hour
        this.alertHistory.delete(type);
      }
    }
  }

  /**
   * Get current metrics
   * الحصول على المقاييس الحالية
   */
  getCurrentMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      isRunning: this.isRunning
    };
  }

  /**
   * Get metrics history from Redis
   * الحصول على تاريخ المقاييس من Redis
   */
  async getMetricsHistory(type, limit = 50) {
    try {
      const keys = await this.redis.keys(`metrics:${type}:*`);
      const sortedKeys = keys.sort().slice(-limit);
      
      if (sortedKeys.length === 0) {
        return [];
      }
      
      const metrics = await this.redis.mget(...sortedKeys);
      return metrics
        .filter(metric => metric !== null)
        .map(metric => JSON.parse(metric))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } catch (error) {
      console.error(`Error getting ${type} metrics history:`, error);
      return [];
    }
  }

  /**
   * Get recent alerts
   * الحصول على التنبيهات الحديثة
   */
  async getRecentAlerts(limit = 20) {
    try {
      const keys = await this.redis.keys('alerts:*');
      const sortedKeys = keys.sort().slice(-limit);
      
      if (sortedKeys.length === 0) {
        return [];
      }
      
      const alerts = await this.redis.mget(...sortedKeys);
      return alerts
        .filter(alert => alert !== null)
        .map(alert => JSON.parse(alert))
        .sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error getting recent alerts:', error);
      return [];
    }
  }

  /**
   * Record custom metric
   * تسجيل مقياس مخصص
   */
  async recordMetric(category, name, value, tags = {}) {
    try {
      const metric = {
        category,
        name,
        value,
        tags,
        timestamp: new Date().toISOString()
      };
      
      const key = `custom_metrics:${category}:${name}:${Date.now()}`;
      await this.redis.setex(key, 3600, JSON.stringify(metric));
      
      this.emit('customMetric', metric);
    } catch (error) {
      console.error('Error recording custom metric:', error);
    }
  }

  /**
   * Get system health summary
   * الحصول على ملخص صحة النظام
   */
  getHealthSummary() {
    const metrics = this.getCurrentMetrics();
    const alerts = Array.from(this.alertHistory.values());
    
    return {
      status: alerts.length > 0 ? 'warning' : 'healthy',
      timestamp: new Date().toISOString(),
      metrics: {
        cpu: metrics.system.cpu?.usage || 0,
        memory: metrics.system.memory?.usage || 0,
        eventLoopLag: metrics.application.eventLoop?.lag || 0
      },
      activeAlerts: alerts.length,
      uptime: process.uptime(),
      isMonitoring: this.isRunning
    };
  }
}

export { MonitoringService };