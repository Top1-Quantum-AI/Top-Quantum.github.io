/**
 * User Routes - مسارات المستخدمين
 * Routes for user profile management, preferences, and account operations
 * مسارات لإدارة ملف المستخدم والتفضيلات وعمليات الحساب
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import { authMiddleware, trackApiUsage, requireSubscription } from '../middleware/auth.js';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Rate limiting for user routes - تحديد المعدل لمسارات المستخدمين
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per 15 minutes
  message: {
    error: 'تم تجاوز عدد الطلبات المسموح بها. حاول مرة أخرى بعد 15 دقيقة.',
    errorEn: 'Too many requests. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const profileUpdateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 profile updates per hour
  message: {
    error: 'تم تجاوز عدد تحديثات الملف الشخصي المسموح بها.',
    errorEn: 'Too many profile updates. Please try again later.'
  }
});

/**
 * @route   GET /api/user/profile
 * @desc    Get user profile - الحصول على الملف الشخصي للمستخدم
 * @access  Private
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken')
      .populate('conversations', 'title createdAt status category');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود',
        errorEn: 'User not found'
      });
    }
    
    // Calculate user statistics - حساب إحصائيات المستخدم
    const stats = {
      totalConversations: user.conversations?.length || 0,
      apiUsageToday: user.apiUsage.dailyUsage,
      apiUsageThisMonth: user.apiUsage.monthlyUsage,
      memberSince: user.createdAt,
      lastLogin: user.loginHistory.lastLogin,
      totalLogins: user.loginHistory.totalLogins
    };
    
    console.log(`✅ Profile retrieved for user: ${user.username}`);
    console.log(`✅ تم استرداد الملف الشخصي للمستخدم: ${user.username}`);
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          profile: user.profile,
          subscription: user.subscription,
          quantumPreferences: user.quantumPreferences,
          settings: user.settings,
          status: user.status,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        statistics: stats
      }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على الملف الشخصي',
      errorEn: 'Error getting profile'
    });
  }
});

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile - تحديث الملف الشخصي للمستخدم
 * @access  Private
 */
router.put('/profile', authMiddleware, profileUpdateLimiter, trackApiUsage(2), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      bio,
      location,
      website,
      avatar,
      language,
      timezone,
      theme,
      notifications
    } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود',
        errorEn: 'User not found'
      });
    }
    
    // Update profile fields - تحديث حقول الملف الشخصي
    if (firstName !== undefined) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (bio !== undefined) user.profile.bio = bio;
    if (location !== undefined) user.profile.location = location;
    if (website !== undefined) user.profile.website = website;
    if (avatar !== undefined) user.profile.avatar = avatar;
    
    // Update settings - تحديث الإعدادات
    if (language !== undefined) user.settings.language = language;
    if (timezone !== undefined) user.settings.timezone = timezone;
    if (theme !== undefined) user.settings.theme = theme;
    if (notifications !== undefined) {
      user.settings.notifications = { ...user.settings.notifications, ...notifications };
    }
    
    user.updatedAt = new Date();
    await user.save();
    
    console.log(`✅ Profile updated for user: ${user.username}`);
    console.log(`✅ تم تحديث الملف الشخصي للمستخدم: ${user.username}`);
    
    res.status(200).json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      messageEn: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          profile: user.profile,
          settings: user.settings,
          updatedAt: user.updatedAt
        }
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في تحديث الملف الشخصي',
      errorEn: 'Error updating profile'
    });
  }
});

/**
 * @route   PUT /api/user/quantum-preferences
 * @desc    Update quantum computing preferences - تحديث تفضيلات الحوسبة الكمية
 * @access  Private
 */
router.put('/quantum-preferences', authMiddleware, trackApiUsage(1), async (req, res) => {
  try {
    const {
      defaultPersonality,
      preferredComplexity,
      visualizationStyle,
      algorithmPreferences,
      simulationSettings
    } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود',
        errorEn: 'User not found'
      });
    }
    
    // Update quantum preferences - تحديث التفضيلات الكمية
    if (defaultPersonality !== undefined) {
      const validPersonalities = ['quantum', 'creative', 'analytical', 'educational'];
      if (validPersonalities.includes(defaultPersonality)) {
        user.quantumPreferences.defaultPersonality = defaultPersonality;
      }
    }
    
    if (preferredComplexity !== undefined) {
      const validComplexity = ['beginner', 'intermediate', 'advanced', 'expert'];
      if (validComplexity.includes(preferredComplexity)) {
        user.quantumPreferences.preferredComplexity = preferredComplexity;
      }
    }
    
    if (visualizationStyle !== undefined) {
      const validStyles = ['bloch-sphere', 'circuit-diagram', 'probability-bars', 'state-vector'];
      if (validStyles.includes(visualizationStyle)) {
        user.quantumPreferences.visualizationStyle = visualizationStyle;
      }
    }
    
    if (algorithmPreferences !== undefined && Array.isArray(algorithmPreferences)) {
      user.quantumPreferences.algorithmPreferences = algorithmPreferences;
    }
    
    if (simulationSettings !== undefined) {
      user.quantumPreferences.simulationSettings = {
        ...user.quantumPreferences.simulationSettings,
        ...simulationSettings
      };
    }
    
    user.updatedAt = new Date();
    await user.save();
    
    console.log(`✅ Quantum preferences updated for user: ${user.username}`);
    console.log(`✅ تم تحديث التفضيلات الكمية للمستخدم: ${user.username}`);
    
    res.status(200).json({
      success: true,
      message: 'تم تحديث التفضيلات الكمية بنجاح',
      messageEn: 'Quantum preferences updated successfully',
      data: {
        quantumPreferences: user.quantumPreferences
      }
    });
    
  } catch (error) {
    console.error('Update quantum preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في تحديث التفضيلات الكمية',
      errorEn: 'Error updating quantum preferences'
    });
  }
});

/**
 * @route   PUT /api/user/change-password
 * @desc    Change user password - تغيير كلمة مرور المستخدم
 * @access  Private
 */
router.put('/change-password', authMiddleware, profileUpdateLimiter, trackApiUsage(3), async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Validation - التحقق من صحة البيانات
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'جميع الحقول مطلوبة',
        errorEn: 'All fields are required'
      });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'كلمة المرور الجديدة وتأكيدها غير متطابقين',
        errorEn: 'New password and confirmation do not match'
      });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
        errorEn: 'Password must be at least 8 characters long'
      });
    }
    
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود',
        errorEn: 'User not found'
      });
    }
    
    // Check current password - التحقق من كلمة المرور الحالية
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'كلمة المرور الحالية غير صحيحة',
        errorEn: 'Current password is incorrect'
      });
    }
    
    // Hash new password - تشفير كلمة المرور الجديدة
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordChangedAt = new Date();
    user.updatedAt = new Date();
    
    await user.save();
    
    console.log(`✅ Password changed for user: ${user.username}`);
    console.log(`✅ تم تغيير كلمة المرور للمستخدم: ${user.username}`);
    
    res.status(200).json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح',
      messageEn: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في تغيير كلمة المرور',
      errorEn: 'Error changing password'
    });
  }
});

/**
 * @route   GET /api/user/conversations
 * @desc    Get user conversations - الحصول على محادثات المستخدم
 * @access  Private
 */
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      category,
      search,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query - بناء الاستعلام
    const query = { user: req.user._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'messages.content': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination - تنفيذ الاستعلام مع التصفح
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    
    const [conversations, total] = await Promise.all([
      Conversation.find(query)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limitNum)
        .select('title status category createdAt updatedAt messageCount duration quantumScore tags')
        .lean(),
      Conversation.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(total / limitNum);
    
    console.log(`✅ Conversations retrieved for user: ${req.user.username}`);
    console.log(`✅ تم استرداد المحادثات للمستخدم: ${req.user.username}`);
    
    res.status(200).json({
      success: true,
      data: {
        conversations,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalConversations: total,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
          limit: limitNum
        },
        filters: {
          status,
          category,
          search,
          sortBy,
          sortOrder
        }
      }
    });
    
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على المحادثات',
      errorEn: 'Error getting conversations'
    });
  }
});

/**
 * @route   GET /api/user/statistics
 * @desc    Get user statistics - الحصول على إحصائيات المستخدم
 * @access  Private
 */
router.get('/statistics', authMiddleware, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range - حساب نطاق التاريخ
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
    
    // Get user statistics - الحصول على إحصائيات المستخدم
    const [conversationStats, user] = await Promise.all([
      Conversation.aggregate([
        {
          $match: {
            user: req.user._id,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalConversations: { $sum: 1 },
            totalMessages: { $sum: '$messageCount' },
            avgQuantumScore: { $avg: '$quantumScore' },
            avgDuration: { $avg: '$duration' },
            categories: { $push: '$category' },
            statuses: { $push: '$status' }
          }
        }
      ]),
      User.findById(req.user._id).select('apiUsage subscription createdAt loginHistory')
    ]);
    
    const stats = conversationStats[0] || {
      totalConversations: 0,
      totalMessages: 0,
      avgQuantumScore: 0,
      avgDuration: 0,
      categories: [],
      statuses: []
    };
    
    // Process categories and statuses - معالجة الفئات والحالات
    const categoryCount = {};
    const statusCount = {};
    
    stats.categories.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    stats.statuses.forEach(status => {
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    // API usage statistics - إحصائيات استخدام API
    const apiStats = {
      dailyUsage: user.apiUsage.dailyUsage,
      monthlyUsage: user.apiUsage.monthlyUsage,
      totalTokensUsed: user.apiUsage.totalTokensUsed,
      lastReset: user.apiUsage.lastReset
    };
    
    console.log(`✅ Statistics retrieved for user: ${req.user.username}`);
    console.log(`✅ تم استرداد الإحصائيات للمستخدم: ${req.user.username}`);
    
    res.status(200).json({
      success: true,
      data: {
        period,
        dateRange: {
          start: startDate,
          end: new Date()
        },
        conversations: {
          total: stats.totalConversations,
          totalMessages: stats.totalMessages,
          avgQuantumScore: Math.round(stats.avgQuantumScore * 100) / 100,
          avgDuration: Math.round(stats.avgDuration),
          byCategory: categoryCount,
          byStatus: statusCount
        },
        apiUsage: apiStats,
        account: {
          memberSince: user.createdAt,
          subscriptionTier: user.subscription.tier,
          totalLogins: user.loginHistory.totalLogins,
          lastLogin: user.loginHistory.lastLogin
        }
      }
    });
    
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على الإحصائيات',
      errorEn: 'Error getting statistics'
    });
  }
});

/**
 * @route   DELETE /api/user/account
 * @desc    Delete user account - حذف حساب المستخدم
 * @access  Private
 */
router.delete('/account', authMiddleware, profileUpdateLimiter, async (req, res) => {
  try {
    const { password, confirmDeletion } = req.body;
    
    // Validation - التحقق من صحة البيانات
    if (!password || confirmDeletion !== 'DELETE_MY_ACCOUNT') {
      return res.status(400).json({
        success: false,
        error: 'كلمة المرور وتأكيد الحذف مطلوبان',
        errorEn: 'Password and deletion confirmation required'
      });
    }
    
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود',
        errorEn: 'User not found'
      });
    }
    
    // Verify password - التحقق من كلمة المرور
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'كلمة المرور غير صحيحة',
        errorEn: 'Invalid password'
      });
    }
    
    // Delete user conversations - حذف محادثات المستخدم
    await Conversation.deleteMany({ user: user._id });
    
    // Delete user account - حذف حساب المستخدم
    await User.findByIdAndDelete(user._id);
    
    console.log(`✅ Account deleted for user: ${user.username}`);
    console.log(`✅ تم حذف الحساب للمستخدم: ${user.username}`);
    
    res.status(200).json({
      success: true,
      message: 'تم حذف الحساب بنجاح',
      messageEn: 'Account deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في حذف الحساب',
      errorEn: 'Error deleting account'
    });
  }
});

/**
 * @route   GET /api/user/subscription
 * @desc    Get subscription details - الحصول على تفاصيل الاشتراك
 * @access  Private
 */
router.get('/subscription', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('subscription apiUsage')
      .lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود',
        errorEn: 'User not found'
      });
    }
    
    // Calculate usage percentages - حساب نسب الاستخدام
    const limits = {
      free: { daily: 50, monthly: 1000 },
      basic: { daily: 200, monthly: 5000 },
      premium: { daily: 1000, monthly: 25000 },
      enterprise: { daily: -1, monthly: -1 } // Unlimited
    };
    
    const tierLimits = limits[user.subscription.tier] || limits.free;
    const usage = {
      daily: {
        used: user.apiUsage.dailyUsage,
        limit: tierLimits.daily,
        percentage: tierLimits.daily > 0 ? Math.round((user.apiUsage.dailyUsage / tierLimits.daily) * 100) : 0
      },
      monthly: {
        used: user.apiUsage.monthlyUsage,
        limit: tierLimits.monthly,
        percentage: tierLimits.monthly > 0 ? Math.round((user.apiUsage.monthlyUsage / tierLimits.monthly) * 100) : 0
      }
    };
    
    res.status(200).json({
      success: true,
      data: {
        subscription: user.subscription,
        usage,
        features: {
          quantumAlgorithms: ['basic', 'premium', 'enterprise'].includes(user.subscription.tier),
          advancedAnalytics: ['premium', 'enterprise'].includes(user.subscription.tier),
          prioritySupport: ['premium', 'enterprise'].includes(user.subscription.tier),
          customModels: user.subscription.tier === 'enterprise'
        }
      }
    });
    
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على تفاصيل الاشتراك',
      errorEn: 'Error getting subscription details'
    });
  }
});

/**
 * @route   POST /api/user/upgrade-subscription
 * @desc    Upgrade user subscription - ترقية اشتراك المستخدم
 * @access  Private
 */
router.post('/upgrade-subscription', 
  authMiddleware, 
  requireSubscription('free'), 
  trackApiUsage(5), 
  async (req, res) => {
    try {
      const { tier, paymentMethod, billingCycle } = req.body;
      
      // Validation - التحقق من صحة البيانات
      const validTiers = ['basic', 'premium', 'enterprise'];
      if (!tier || !validTiers.includes(tier)) {
        return res.status(400).json({
          success: false,
          error: 'مستوى الاشتراك غير صالح',
          errorEn: 'Invalid subscription tier',
          validTiers
        });
      }
      
      const validCycles = ['monthly', 'yearly'];
      if (!billingCycle || !validCycles.includes(billingCycle)) {
        return res.status(400).json({
          success: false,
          error: 'دورة الفوترة غير صالحة',
          errorEn: 'Invalid billing cycle',
          validCycles
        });
      }
      
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'المستخدم غير موجود',
          errorEn: 'User not found'
        });
      }
      
      // Check if already on this tier or higher - التحقق من المستوى الحالي
      const tierLevels = { 'free': 0, 'basic': 1, 'premium': 2, 'enterprise': 3 };
      const currentLevel = tierLevels[user.subscription.tier] || 0;
      const requestedLevel = tierLevels[tier] || 0;
      
      if (currentLevel >= requestedLevel) {
        return res.status(400).json({
          success: false,
          error: 'أنت بالفعل على هذا المستوى أو أعلى',
          errorEn: 'You are already on this tier or higher'
        });
      }
      
      // In a real application, you would integrate with a payment processor here
      // For demo purposes, we'll simulate the upgrade
      
      // Update subscription - تحديث الاشتراك
      user.subscription = {
        tier,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
        billingCycle,
        paymentMethod: paymentMethod || 'card',
        autoRenew: true
      };
      
      user.updatedAt = new Date();
      await user.save();
      
      console.log(`✅ Subscription upgraded to ${tier} for user: ${user.username}`);
      console.log(`✅ تم ترقية الاشتراك إلى ${tier} للمستخدم: ${user.username}`);
      
      res.status(200).json({
        success: true,
        message: `تم ترقية الاشتراك إلى ${tier} بنجاح`,
        messageEn: `Subscription upgraded to ${tier} successfully`,
        data: {
          subscription: user.subscription,
          features: {
            quantumAlgorithms: ['basic', 'premium', 'enterprise'].includes(tier),
            advancedAnalytics: ['premium', 'enterprise'].includes(tier),
            prioritySupport: ['premium', 'enterprise'].includes(tier),
            customModels: tier === 'enterprise'
          }
        }
      });
      
    } catch (error) {
      console.error('Upgrade subscription error:', error);
      res.status(500).json({
        success: false,
        error: 'خطأ في ترقية الاشتراك',
        errorEn: 'Error upgrading subscription'
      });
    }
  }
);

export default router;