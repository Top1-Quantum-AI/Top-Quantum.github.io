/**
 * Authentication Middleware - وسطاء المصادقة
 * Middleware for protecting routes and handling authentication
 * وسطاء لحماية المسارات والتعامل مع المصادقة
 */

import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js';

/**
 * Authentication middleware - وسطاء المصادقة
 * Protects routes by verifying JWT tokens
 * يحمي المسارات من خلال التحقق من رموز JWT
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there - الحصول على الرمز والتحقق من وجوده
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'غير مصرح لك بالوصول. يرجى تسجيل الدخول.',
        errorEn: 'You are not logged in! Please log in to get access.',
      });
    }

    // 2) Verification token - التحقق من الرمز
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists - التحقق من وجود المستخدم
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        error: 'المستخدم الذي ينتمي إليه هذا الرمز لم يعد موجوداً.',
        errorEn: 'The user belonging to this token does no longer exist.',
      });
    }

    // 4) Check if user is active - التحقق من نشاط المستخدم
    if (!currentUser.isActive) {
      return res.status(401).json({
        success: false,
        error: 'حسابك غير نشط. يرجى الاتصال بالدعم.',
        errorEn: 'Your account is not active. Please contact support.',
      });
    }

    // 5) Check if account is locked - التحقق من قفل الحساب
    if (currentUser.isLocked) {
      return res.status(423).json({
        success: false,
        error: 'حسابك مقفل مؤقتاً. يرجى المحاولة لاحقاً.',
        errorEn: 'Your account is temporarily locked. Please try again later.',
      });
    }

    // 6) Update last activity - تحديث آخر نشاط
    currentUser.lastActivity = new Date();
    await currentUser.save({ validateBeforeSave: false });

    // GRANT ACCESS TO PROTECTED ROUTE - منح الوصول للمسار المحمي
    req.user = currentUser;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'رمز غير صالح. يرجى تسجيل الدخول مرة أخرى!',
        errorEn: 'Invalid token. Please log in again!',
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'انتهت صلاحية الرمز! يرجى تسجيل الدخول مرة أخرى.',
        errorEn: 'Your token has expired! Please log in again.',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'خطأ في الخادم الداخلي',
      errorEn: 'Internal server error',
    });
  }
};

/**
 * Role-based authorization middleware - وسطاء التفويض القائم على الأدوار
 * Restricts access based on user roles
 * يقيد الوصول بناءً على أدوار المستخدم
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'premium', 'user']. role='user'
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'ليس لديك صلاحية للقيام بهذا الإجراء',
        errorEn: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};

/**
 * API usage tracking middleware - وسطاء تتبع استخدام API
 * Tracks and limits API usage per user
 * يتتبع ويحدد استخدام API لكل مستخدم
 */
export const trackApiUsage = (tokenCost = 1) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      // Check if user has exceeded daily limits - التحقق من تجاوز الحدود اليومية
      if (user.apiUsage.dailyRequests >= user.apiUsage.limits.dailyRequests) {
        return res.status(429).json({
          success: false,
          error: 'تم تجاوز الحد اليومي للطلبات',
          errorEn: 'Daily request limit exceeded',
          limits: {
            dailyRequests: user.apiUsage.limits.dailyRequests,
            dailyTokens: user.apiUsage.limits.dailyTokens,
            current: {
              requests: user.apiUsage.dailyRequests,
              tokens: user.apiUsage.dailyTokens,
            },
          },
        });
      }

      if (user.apiUsage.dailyTokens + tokenCost > user.apiUsage.limits.dailyTokens) {
        return res.status(429).json({
          success: false,
          error: 'تم تجاوز الحد اليومي للرموز',
          errorEn: 'Daily token limit exceeded',
          limits: {
            dailyRequests: user.apiUsage.limits.dailyRequests,
            dailyTokens: user.apiUsage.limits.dailyTokens,
            current: {
              requests: user.apiUsage.dailyRequests,
              tokens: user.apiUsage.dailyTokens,
            },
          },
        });
      }

      // Update usage - تحديث الاستخدام
      await user.updateApiUsage(1, tokenCost);

      // Add usage info to request - إضافة معلومات الاستخدام للطلب
      req.apiUsage = {
        requestsUsed: user.apiUsage.dailyRequests + 1,
        tokensUsed: user.apiUsage.dailyTokens + tokenCost,
        limits: user.apiUsage.limits,
      };

      next();
    } catch (error) {
      console.error('API usage tracking error:', error);
      return res.status(500).json({
        success: false,
        error: 'خطأ في تتبع استخدام API',
        errorEn: 'API usage tracking error',
      });
    }
  };
};

/**
 * Optional authentication middleware - وسطاء المصادقة الاختيارية
 * Adds user info if token is present, but doesn't require authentication
 * يضيف معلومات المستخدم إذا كان الرمز موجوداً، لكن لا يتطلب المصادقة
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (token && token !== 'loggedout') {
      try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.userId);

        if (currentUser && currentUser.isActive && !currentUser.isLocked) {
          req.user = currentUser;
        }
      } catch (error) {
        // Token is invalid, but we continue without user
        // الرمز غير صالح، لكننا نستمر بدون مستخدم
        console.log('Optional auth - invalid token:', error.message);
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue without authentication
  }
};

/**
 * Email verification required middleware - وسطاء التحقق من البريد الإلكتروني المطلوب
 * Requires email verification for certain actions
 * يتطلب التحقق من البريد الإلكتروني لإجراءات معينة
 */
export const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      error: 'يرجى التحقق من بريدك الإلكتروني أولاً',
      errorEn: 'Please verify your email first',
      requiresEmailVerification: true,
    });
  }

  next();
};

/**
 * Subscription check middleware - وسطاء فحص الاشتراك
 * Checks if user has required subscription level
 * يتحقق من وجود مستوى الاشتراك المطلوب للمستخدم
 */
export const requireSubscription = (requiredTier = 'premium') => {
  return (req, res, next) => {
    const user = req.user;
    const subscription = user.subscription;

    // Check if subscription is active - التحقق من نشاط الاشتراك
    if (!subscription.isActive || subscription.expiresAt < new Date()) {
      return res.status(403).json({
        success: false,
        error: 'يتطلب اشتراك نشط للوصول لهذه الميزة',
        errorEn: 'Active subscription required to access this feature',
        subscription: {
          current: subscription.tier,
          required: requiredTier,
          isActive: subscription.isActive,
          expiresAt: subscription.expiresAt,
        },
      });
    }

    // Check subscription tier - فحص مستوى الاشتراك
    const tierLevels = {
      free: 0,
      basic: 1,
      premium: 2,
      enterprise: 3,
    };

    const userTierLevel = tierLevels[subscription.tier] || 0;
    const requiredTierLevel = tierLevels[requiredTier] || 0;

    if (userTierLevel < requiredTierLevel) {
      return res.status(403).json({
        success: false,
        error: `يتطلب اشتراك ${requiredTier} للوصول لهذه الميزة`,
        errorEn: `${requiredTier} subscription required to access this feature`,
        subscription: {
          current: subscription.tier,
          required: requiredTier,
          isActive: subscription.isActive,
          expiresAt: subscription.expiresAt,
        },
      });
    }

    next();
  };
};

/**
 * Rate limiting by user middleware - وسطاء تحديد المعدل حسب المستخدم
 * Custom rate limiting based on user subscription
 * تحديد معدل مخصص بناءً على اشتراك المستخدم
 */
export const userBasedRateLimit = (baseLimit = 10, windowMs = 15 * 60 * 1000) => {
  const userRequests = new Map();

  return (req, res, next) => {
    const userId = req.user?.id || req.ip;
    const now = Date.now();

    // Get user's rate limit based on subscription - الحصول على حد المعدل للمستخدم بناءً على الاشتراك
    let userLimit = baseLimit;
    if (req.user) {
      const subscription = req.user.subscription;
      const multipliers = {
        free: 1,
        basic: 2,
        premium: 5,
        enterprise: 10,
      };
      userLimit = baseLimit * (multipliers[subscription.tier] || 1);
    }

    // Clean old requests - تنظيف الطلبات القديمة
    if (!userRequests.has(userId)) {
      userRequests.set(userId, []);
    }

    const requests = userRequests.get(userId);
    const validRequests = requests.filter(time => now - time < windowMs);

    if (validRequests.length >= userLimit) {
      return res.status(429).json({
        success: false,
        error: 'تم تجاوز حد المعدل المسموح',
        errorEn: 'Rate limit exceeded',
        rateLimit: {
          limit: userLimit,
          remaining: 0,
          resetTime: new Date(now + windowMs),
        },
      });
    }

    // Add current request - إضافة الطلب الحالي
    validRequests.push(now);
    userRequests.set(userId, validRequests);

    // Add rate limit headers - إضافة رؤوس حد المعدل
    res.set({
      'X-RateLimit-Limit': userLimit,
      'X-RateLimit-Remaining': userLimit - validRequests.length,
      'X-RateLimit-Reset': new Date(now + windowMs),
    });

    next();
  };
};

export { authMiddleware as authenticateToken };
export default {
  authMiddleware,
  restrictTo,
  trackApiUsage,
  optionalAuth,
  requireEmailVerification,
  requireSubscription,
  userBasedRateLimit,
};
