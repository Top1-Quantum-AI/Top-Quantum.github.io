/**
 * Quantum AI System - Production Server
 * خادم النظام الكمي للذكاء الاصطناعي - بيئة الإنتاج
 * 
 * This is the main server file that initializes and runs the quantum AI system
 * هذا هو ملف الخادم الرئيسي الذي يقوم بتهيئة وتشغيل نظام الذكاء الاصطناعي الكمي
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Import routes and middleware
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import quantumRoutes from './routes/quantum.js';
import userRoutes from './routes/user.js';
import monitoringRoutes from './routes/monitoring.js';
import adminRoutes from './routes/admin.js';
import mythosRoutes from './routes/mythos.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { validateRequest } from './middleware/validation.js';

// Import services
import { MonitoringService } from './services/monitoring.js';
import { QuantumService } from './services/quantum.js';
import { AIService } from './services/ai.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for reverse proxy setup (Nginx)
app.set('trust proxy', 1);

// Global variables for services
let redis;
let monitoringService;
let quantumService;
let aiService;

/**
 * Database Connection
 * اتصال قاعدة البيانات
 */
async function connectDatabase() {
  try {
    // MongoDB connection
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quantum-ai';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
    console.log('✅ تم الاتصال بـ MongoDB بنجاح');

    // Redis connection
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    };

    redis = new Redis(redisConfig);
    await redis.connect();
    console.log('✅ Redis connected successfully');
    console.log('✅ تم الاتصال بـ Redis بنجاح');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('❌ فشل الاتصال بقاعدة البيانات:', error.message);
    process.exit(1);
  }
}

/**
 * Initialize Services
 * تهيئة الخدمات
 */
function initializeServices() {
  try {
    // Initialize monitoring service
    monitoringService = new MonitoringService(redis);
    
    // Initialize quantum service
    quantumService = new QuantumService();
    
    // Initialize AI service
    aiService = new AIService({
      openaiApiKey: process.env.OPENAI_API_KEY,
      redis: redis,
      rateLimitConfig: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // requests per window
      }
    });

    console.log('✅ All services initialized successfully');
    console.log('✅ تم تهيئة جميع الخدمات بنجاح');
  } catch (error) {
    console.error('❌ Service initialization failed:', error.message);
    console.error('❌ فشل تهيئة الخدمات:', error.message);
    throw error;
  }
}

/**
 * Security Middleware
 * وسائل الحماية الأمنية
 */
function setupSecurity() {
  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false
  }));

  // CORS configuration
  const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  };
  app.use(cors(corsOptions));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      message: 'طلبات كثيرة جداً من هذا العنوان، يرجى المحاولة لاحقاً.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', limiter);

  // Compression
  app.use(compression());

  console.log('✅ Security middleware configured');
  console.log('✅ تم تكوين وسائل الحماية الأمنية');
}

/**
 * General Middleware
 * الوسائل العامة
 */
function setupMiddleware() {
  // Cookie parser (must be before routes)
  app.use(cookieParser());

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Logging
  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }

  // Custom request logger
  app.use(requestLogger);

  console.log('✅ General middleware configured');
  console.log('✅ تم تكوين الوسائل العامة');
}

/**
 * Routes Setup
 * إعداد المسارات
 */
function setupRoutes() {
  // Health check endpoint
  app.get('/health', async (req, res) => {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        services: {
          mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
          redis: redis.status === 'ready' ? 'connected' : 'disconnected',
        },
        version: process.env.npm_package_version || '1.0.0'
      };

      res.status(200).json(health);
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/ai', authenticateToken, aiRoutes);
  app.use('/api/quantum', authenticateToken, quantumRoutes);
  app.use('/api/user', authenticateToken, userRoutes);
  app.use('/api/monitoring', authenticateToken, monitoringRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/mythos', mythosRoutes);

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    const buildPath = join(__dirname, '../dist');
    if (fs.existsSync(buildPath)) {
      app.use(express.static(buildPath));
      
      // Handle React Router
      app.get('*', (req, res) => {
        res.sendFile(join(buildPath, 'index.html'));
      });
    }
  }

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Route not found',
      message: 'المسار غير موجود',
      path: req.originalUrl
    });
  });

  // Error handling middleware
  app.use(errorHandler);

  console.log('✅ Routes configured successfully');
  console.log('✅ تم تكوين المسارات بنجاح');
}

/**
 * Graceful Shutdown
 * إغلاق نظيف للخادم
 */
function setupGracefulShutdown(server) {
  const gracefulShutdown = async (signal) => {
    console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
    console.log(`\n🔄 تم استلام إشارة ${signal}. بدء الإغلاق النظيف...`);

    // Stop accepting new connections
    server.close(async () => {
      console.log('🔄 HTTP server closed');
      console.log('🔄 تم إغلاق خادم HTTP');

      try {
        // Close database connections
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
        console.log('✅ تم إغلاق اتصال MongoDB');

        if (redis) {
          await redis.quit();
          console.log('✅ Redis connection closed');
          console.log('✅ تم إغلاق اتصال Redis');
        }

        // Stop monitoring service
        if (monitoringService) {
          await monitoringService.stop();
          console.log('✅ Monitoring service stopped');
          console.log('✅ تم إيقاف خدمة المراقبة');
        }

        console.log('✅ Graceful shutdown completed');
        console.log('✅ تم الإغلاق النظيف بنجاح');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        console.error('❌ خطأ أثناء الإغلاق:', error);
        process.exit(1);
      }
    });

    // Force close after 30 seconds
    setTimeout(() => {
      console.error('❌ Could not close connections in time, forcefully shutting down');
      console.error('❌ لم يتم إغلاق الاتصالات في الوقت المحدد، إغلاق قسري');
      process.exit(1);
    }, 30000);
  };

  // Listen for termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    console.error('❌ استثناء غير معالج:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    console.error('❌ رفض غير معالج في:', promise, 'السبب:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
  });
}

/**
 * Start Server
 * بدء تشغيل الخادم
 */
async function startServer() {
  try {
    console.log('🚀 Starting Quantum AI System Server...');
    console.log('🚀 بدء تشغيل خادم النظام الكمي للذكاء الاصطناعي...');

    // Connect to databases
    await connectDatabase();

    // Initialize services
    initializeServices();

    // Setup security
    setupSecurity();

    // Setup middleware
    setupMiddleware();

    // Setup routes
    setupRoutes();

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`\n🎉 Server is running on port ${PORT}`);
      console.log(`🎉 الخادم يعمل على المنفذ ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 البيئة: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 فحص الصحة: http://localhost:${PORT}/health`);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔧 API Documentation: http://localhost:${PORT}/api-docs`);
        console.log(`🔧 وثائق API: http://localhost:${PORT}/api-docs`);
      }
    });

    // Setup graceful shutdown
    setupGracefulShutdown(server);

    // Start monitoring
    if (monitoringService) {
      await monitoringService.start();
      console.log('📊 Monitoring service started');
      console.log('📊 تم بدء خدمة المراقبة');
    }

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('❌ فشل في بدء تشغيل الخادم:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  startServer().catch((error) => {
    console.error('❌ Server startup failed:', error);
    console.error('❌ فشل بدء تشغيل الخادم:', error);
    process.exit(1);
  });
}

export default app;
export { startServer, redis, monitoringService, quantumService, aiService };