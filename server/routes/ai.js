/**
 * AI Routes - مسارات الذكاء الاصطناعي
 * Routes for AI chat, quantum processing, and conversation management
 * مسارات للدردشة بالذكاء الاصطناعي والمعالجة الكمية وإدارة المحادثات
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  authMiddleware,
  trackApiUsage,
  optionalAuth,
  requireSubscription,
} from '../middleware/auth.js';
import { aiService, quantumService } from '../index.js';
import Conversation from '../models/Conversation.js';

const router = express.Router();

// Rate limiting for AI routes - تحديد المعدل لمسارات الذكاء الاصطناعي
const aiChatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window for free users
  message: {
    error: 'تم تجاوز عدد طلبات الدردشة المسموح بها. حاول مرة أخرى بعد 15 دقيقة.',
    errorEn: 'Too many chat requests. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => {
    // Skip rate limiting for premium users - تخطي تحديد المعدل للمستخدمين المميزين
    return req.user && ['premium', 'enterprise'].includes(req.user.subscription.tier);
  },
});

const quantumLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 quantum operations per hour for free users
  message: {
    error: 'تم تجاوز عدد العمليات الكمية المسموح بها. حاول مرة أخرى بعد ساعة.',
    errorEn: 'Too many quantum operations. Please try again after 1 hour.',
  },
  skip: req => {
    return req.user && ['premium', 'enterprise'].includes(req.user.subscription.tier);
  },
});

/**
 * @route   POST /api/ai/chat
 * @desc    Send message to AI - إرسال رسالة للذكاء الاصطناعي
 * @access  Private
 */
router.post('/chat', authMiddleware, aiChatLimiter, trackApiUsage(10), async (req, res) => {
  try {
    const { message, personality, temperature, conversationId, language } = req.body;

    // Validation - التحقق من صحة البيانات
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'الرسالة مطلوبة ولا يمكن أن تكون فارغة',
        errorEn: 'Message is required and cannot be empty',
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        success: false,
        error: 'الرسالة طويلة جداً. الحد الأقصى 4000 حرف',
        errorEn: 'Message too long. Maximum 4000 characters',
      });
    }

    // Get or create conversation - الحصول على المحادثة أو إنشاؤها
    let conversation = null;
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        user: req.user._id,
      });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'المحادثة غير موجودة',
          errorEn: 'Conversation not found',
        });
      }
    }

    // Prepare AI request - تحضير طلب الذكاء الاصطناعي
    const aiRequest = {
      message: message.trim(),
      personality:
        personality || req.user.quantumPreferences.defaultPersonality || 'quantum_assistant',
      temperature: temperature || req.user.quantumPreferences.preferredTemperature || 0.7,
      language: language || req.user.profile.language || 'ar',
      userId: req.user._id.toString(),
      conversationHistory: conversation ? conversation.messages.slice(-10) : [], // Last 10 messages
    };

    // Process with AI service - المعالجة بخدمة الذكاء الاصطناعي
    const aiResponse = await aiService.sendMessage(aiRequest.message, aiRequest);

    // Create or update conversation - إنشاء أو تحديث المحادثة
    if (!conversation && req.user.quantumPreferences.saveConversationHistory) {
      conversation = new Conversation({
        user: req.user._id,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        settings: {
          personality: aiRequest.personality,
          temperature: aiRequest.temperature,
          language: aiRequest.language,
        },
      });
    }

    // Add messages to conversation - إضافة الرسائل للمحادثة
    if (conversation) {
      // Add user message - إضافة رسالة المستخدم
      await conversation.addMessage({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      // Add AI response - إضافة رد الذكاء الاصطناعي
      await conversation.addMessage({
        role: 'assistant',
        content: aiResponse.content,
        aiMetadata: {
          model: aiResponse.model,
          personality: aiRequest.personality,
          temperature: aiRequest.temperature,
          tokensUsed: aiResponse.tokensUsed,
          confidence: aiResponse.confidence,
        },
        quantumMetrics: aiResponse.quantumMetrics,
        timestamp: new Date(),
      });

      await conversation.save();
    }

    // Log successful interaction - تسجيل التفاعل الناجح
    console.log(`✅ AI chat completed for user: ${req.user.username}`);
    console.log(`✅ تم إكمال دردشة الذكاء الاصطناعي للمستخدم: ${req.user.username}`);

    res.status(200).json({
      success: true,
      data: {
        response: aiResponse.content,
        conversationId: conversation?._id,
        metadata: {
          model: aiResponse.model,
          personality: aiRequest.personality,
          temperature: aiRequest.temperature,
          tokensUsed: aiResponse.tokensUsed,
          confidence: aiResponse.confidence,
          quantumMetrics: aiResponse.quantumMetrics,
          processingTime: aiResponse.processingTime,
        },
        usage: {
          requestsRemaining: req.apiUsage.limits.dailyRequests - req.apiUsage.requestsUsed,
          tokensRemaining: req.apiUsage.limits.dailyTokens - req.apiUsage.tokensUsed,
        },
      },
    });
  } catch (error) {
    console.error('AI chat error:', error);

    if (error.message.includes('rate limit') || error.message.includes('quota')) {
      return res.status(429).json({
        success: false,
        error: 'تم تجاوز حد الاستخدام. يرجى المحاولة لاحقاً.',
        errorEn: 'Usage limit exceeded. Please try again later.',
      });
    }

    res.status(500).json({
      success: false,
      error: 'خطأ في معالجة طلب الذكاء الاصطناعي',
      errorEn: 'Error processing AI request',
    });
  }
});

/**
 * @route   POST /api/ai/quantum-analyze
 * @desc    Analyze text with quantum enhancement - تحليل النص بالتعزيز الكمي
 * @access  Private (Premium)
 */
router.post(
  '/quantum-analyze',
  authMiddleware,
  requireSubscription('premium'),
  quantumLimiter,
  trackApiUsage(20),
  async (req, res) => {
    try {
      const { text, analysisType, quantumDepth } = req.body;

      // Validation - التحقق من صحة البيانات
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'النص مطلوب للتحليل',
          errorEn: 'Text is required for analysis',
        });
      }

      if (text.length > 10000) {
        return res.status(400).json({
          success: false,
          error: 'النص طويل جداً للتحليل الكمي. الحد الأقصى 10000 حرف',
          errorEn: 'Text too long for quantum analysis. Maximum 10000 characters',
        });
      }

      const validAnalysisTypes = [
        'sentiment',
        'complexity',
        'concepts',
        'quantum_state',
        'entanglement',
      ];
      if (analysisType && !validAnalysisTypes.includes(analysisType)) {
        return res.status(400).json({
          success: false,
          error: 'نوع التحليل غير صالح',
          errorEn: 'Invalid analysis type',
          validTypes: validAnalysisTypes,
        });
      }

      // Perform quantum analysis - إجراء التحليل الكمي
      const analysis = await aiService.quantumAnalyzeText({
        text: text.trim(),
        analysisType: analysisType || 'concepts',
        quantumDepth: Math.min(quantumDepth || 3, 5), // Max depth of 5
        userId: req.user._id.toString(),
      });

      // Log quantum analysis - تسجيل التحليل الكمي
      console.log(`✅ Quantum analysis completed for user: ${req.user.username}`);
      console.log(`✅ تم إكمال التحليل الكمي للمستخدم: ${req.user.username}`);

      res.status(200).json({
        success: true,
        data: {
          analysis,
          metadata: {
            textLength: text.length,
            analysisType: analysisType || 'concepts',
            quantumDepth: quantumDepth || 3,
            processingTime: analysis.processingTime,
          },
          usage: {
            requestsRemaining: req.apiUsage.limits.dailyRequests - req.apiUsage.requestsUsed,
            tokensRemaining: req.apiUsage.limits.dailyTokens - req.apiUsage.tokensUsed,
          },
        },
      });
    } catch (error) {
      console.error('Quantum analysis error:', error);
      res.status(500).json({
        success: false,
        error: 'خطأ في التحليل الكمي',
        errorEn: 'Quantum analysis error',
      });
    }
  }
);

/**
 * @route   GET /api/ai/personalities
 * @desc    Get available AI personalities - الحصول على شخصيات الذكاء الاصطناعي المتاحة
 * @access  Public
 */
router.get('/personalities', optionalAuth, (req, res) => {
  try {
    const personalities = aiService.getAvailablePersonalities();

    // Filter personalities based on subscription - تصفية الشخصيات بناءً على الاشتراك
    const userTier = req.user?.subscription?.tier || 'free';
    const filteredPersonalities = personalities.filter(p => {
      if (p.requiresSubscription) {
        const tierLevels = { free: 0, basic: 1, premium: 2, enterprise: 3 };
        const userLevel = tierLevels[userTier] || 0;
        const requiredLevel = tierLevels[p.requiresSubscription] || 0;
        return userLevel >= requiredLevel;
      }
      return true;
    });

    res.status(200).json({
      success: true,
      data: {
        personalities: filteredPersonalities,
        userTier,
        totalAvailable: filteredPersonalities.length,
        totalPersonalities: personalities.length,
      },
    });
  } catch (error) {
    console.error('Get personalities error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على الشخصيات',
      errorEn: 'Error getting personalities',
    });
  }
});

/**
 * @route   GET /api/ai/usage-stats
 * @desc    Get AI usage statistics - الحصول على إحصائيات استخدام الذكاء الاصطناعي
 * @access  Private
 */
router.get('/usage-stats', authMiddleware, async (req, res) => {
  try {
    const stats = await aiService.getUserUsageStats(req.user._id.toString());

    res.status(200).json({
      success: true,
      data: {
        stats,
        currentUsage: {
          dailyRequests: req.user.apiUsage.dailyRequests,
          dailyTokens: req.user.apiUsage.dailyTokens,
          limits: req.user.apiUsage.limits,
        },
        subscription: {
          tier: req.user.subscription.tier,
          isActive: req.user.subscription.isActive,
          expiresAt: req.user.subscription.expiresAt,
        },
      },
    });
  } catch (error) {
    console.error('Get usage stats error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على إحصائيات الاستخدام',
      errorEn: 'Error getting usage statistics',
    });
  }
});

/**
 * @route   POST /api/ai/feedback
 * @desc    Submit feedback for AI response - إرسال تقييم لرد الذكاء الاصطناعي
 * @access  Private
 */
router.post('/feedback', authMiddleware, async (req, res) => {
  try {
    const { conversationId, messageId, rating, feedback, category } = req.body;

    // Validation - التحقق من صحة البيانات
    if (!conversationId || !messageId) {
      return res.status(400).json({
        success: false,
        error: 'معرف المحادثة ومعرف الرسالة مطلوبان',
        errorEn: 'Conversation ID and message ID are required',
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        error: 'التقييم يجب أن يكون بين 1 و 5',
        errorEn: 'Rating must be between 1 and 5',
      });
    }

    // Find conversation - البحث عن المحادثة
    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'المحادثة غير موجودة',
        errorEn: 'Conversation not found',
      });
    }

    // Add feedback - إضافة التقييم
    const feedbackData = {
      rating: rating || null,
      feedback: feedback || '',
      category: category || 'general',
      timestamp: new Date(),
    };

    await conversation.addFeedback(messageId, feedbackData);

    console.log(`✅ Feedback submitted by user: ${req.user.username}`);
    console.log(`✅ تم إرسال التقييم من المستخدم: ${req.user.username}`);

    res.status(200).json({
      success: true,
      message: 'تم إرسال التقييم بنجاح',
      messageEn: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في إرسال التقييم',
      errorEn: 'Error submitting feedback',
    });
  }
});

/**
 * @route   GET /api/ai/health
 * @desc    Get AI service health status - الحصول على حالة صحة خدمة الذكاء الاصطناعي
 * @access  Public
 */
router.get('/health', async (req, res) => {
  try {
    const health = await aiService.getHealthStatus();

    res.status(200).json({
      success: true,
      data: {
        status: health.status,
        services: health.services,
        metrics: health.metrics,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('AI health check error:', error);
    res.status(503).json({
      success: false,
      error: 'خطأ في فحص صحة الخدمة',
      errorEn: 'Service health check error',
      status: 'unhealthy',
    });
  }
});

export default router;
