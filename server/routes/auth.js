/**
 * Authentication Routes - مسارات المصادقة
 * Routes for user authentication, registration, and account management
 * مسارات مصادقة المستخدم والتسجيل وإدارة الحساب
 */

import crypto from 'crypto';

import express from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

import { authMiddleware } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Rate limiting for authentication routes - تحديد المعدل لمسارات المصادقة
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: 'تم تجاوز عدد محاولات تسجيل الدخول المسموح بها. حاول مرة أخرى بعد 15 دقيقة.',
    errorEn: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registration attempts per hour
  message: {
    error: 'تم تجاوز عدد محاولات التسجيل المسموح بها. حاول مرة أخرى بعد ساعة.',
    errorEn: 'Too many registration attempts. Please try again after 1 hour.'
  }
});

// Helper function to generate JWT token - دالة مساعدة لتوليد رمز JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Helper function to create and send token response - دالة مساعدة لإنشاء وإرسال استجابة الرمز
const createSendToken = (user, statusCode, res, message) => {
  const token = generateToken(user._id);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
  
  res.cookie('jwt', token, cookieOptions);
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        quantumPreferences: user.quantumPreferences,
        subscription: user.subscription,
        apiUsage: {
          dailyRequests: user.apiUsage.dailyRequests,
          dailyTokens: user.apiUsage.dailyTokens,
          limits: user.apiUsage.limits
        }
      }
    }
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user - تسجيل مستخدم جديد
 * @access  Public
 */
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, language } = req.body;
    
    // Validation - التحقق من صحة البيانات
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'اسم المستخدم والبريد الإلكتروني وكلمة المرور مطلوبة',
        errorEn: 'Username, email, and password are required'
      });
    }
    
    // Check if user already exists - التحقق من وجود المستخدم
    const existingUser = await User.findByEmailOrUsername(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'المستخدم موجود بالفعل',
        errorEn: 'User already exists'
      });
    }
    
    // Create new user - إنشاء مستخدم جديد
    const userData = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      profile: {
        firstName: firstName || '',
        lastName: lastName || '',
        language: language || 'ar'
      }
    };
    
    const user = await User.create(userData);
    
    // Generate email verification token - توليد رمز التحقق من البريد الإلكتروني
    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });
    
    // Log registration - تسجيل عملية التسجيل
    console.log(`✅ New user registered: ${user.username} (${user.email})`);
    console.log(`✅ تم تسجيل مستخدم جديد: ${user.username} (${user.email})`);
    
    // TODO: Send verification email
    // إرسال بريد التحقق
    
    createSendToken(user, 201, res, 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني.');
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const message = field === 'email' ? 
        'البريد الإلكتروني مستخدم بالفعل' : 
        'اسم المستخدم مستخدم بالفعل';
      
      return res.status(400).json({
        success: false,
        error: message,
        errorEn: `${field} already exists`
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join('. '),
        errorEn: 'Validation error'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم الداخلي',
      errorEn: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user - تسجيل دخول المستخدم
 * @access  Public
 */
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username
    
    // Validation - التحقق من صحة البيانات
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'البريد الإلكتروني/اسم المستخدم وكلمة المرور مطلوبان',
        errorEn: 'Email/username and password are required'
      });
    }
    
    // Find user and include password - البحث عن المستخدم وتضمين كلمة المرور
    const user = await User.findByEmailOrUsername(identifier).select('+password +loginAttempts +lockUntil');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'بيانات الاعتماد غير صحيحة',
        errorEn: 'Invalid credentials'
      });
    }
    
    // Check if account is locked - التحقق من قفل الحساب
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        error: 'الحساب مقفل مؤقتاً بسبب محاولات تسجيل دخول متعددة فاشلة',
        errorEn: 'Account temporarily locked due to multiple failed login attempts'
      });
    }
    
    // Check if account is active - التحقق من نشاط الحساب
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'الحساب غير نشط',
        errorEn: 'Account is not active'
      });
    }
    
    // Check password - التحقق من كلمة المرور
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      // Increment login attempts - زيادة محاولات تسجيل الدخول
      await user.incLoginAttempts();
      
      // Add failed login to history - إضافة محاولة تسجيل دخول فاشلة للتاريخ
      await user.addLoginHistory(
        req.ip,
        req.get('User-Agent'),
        false
      );
      
      return res.status(401).json({
        success: false,
        error: 'بيانات الاعتماد غير صحيحة',
        errorEn: 'Invalid credentials'
      });
    }
    
    // Reset login attempts on successful login - إعادة تعيين محاولات تسجيل الدخول عند النجاح
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }
    
    // Add successful login to history - إضافة تسجيل دخول ناجح للتاريخ
    await user.addLoginHistory(
      req.ip,
      req.get('User-Agent'),
      true
    );
    
    console.log(`✅ User logged in: ${user.username}`);
    console.log(`✅ تم تسجيل دخول المستخدم: ${user.username}`);
    
    createSendToken(user, 200, res, 'تم تسجيل الدخول بنجاح');
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم الداخلي',
      errorEn: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user - تسجيل خروج المستخدم
 * @access  Private
 */
router.post('/logout', (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح',
    messageEn: 'Logged out successfully'
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user - الحصول على المستخدم الحالي
 * @access  Private
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود',
        errorEn: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          quantumPreferences: user.quantumPreferences,
          subscription: user.subscription,
          apiUsage: {
            dailyRequests: user.apiUsage.dailyRequests,
            dailyTokens: user.apiUsage.dailyTokens,
            limits: user.apiUsage.limits
          },
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم الداخلي',
      errorEn: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Update user profile - تحديث ملف المستخدم الشخصي
 * @access  Private
 */
router.put('/update-profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, bio, language, timezone } = req.body;
    
    const user = await User.findById(req.user.id);
    
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
    if (language !== undefined) user.profile.language = language;
    if (timezone !== undefined) user.profile.timezone = timezone;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      messageEn: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile
        }
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join('. '),
        errorEn: 'Validation error'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم الداخلي',
      errorEn: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/auth/update-quantum-preferences
 * @desc    Update quantum preferences - تحديث تفضيلات الحوسبة الكمية
 * @access  Private
 */
router.put('/update-quantum-preferences', authMiddleware, async (req, res) => {
  try {
    const {
      defaultPersonality,
      preferredTemperature,
      maxTokensPerRequest,
      enableQuantumEnhancement,
      saveConversationHistory
    } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود',
        errorEn: 'User not found'
      });
    }
    
    // Update quantum preferences - تحديث تفضيلات الحوسبة الكمية
    if (defaultPersonality !== undefined) {
      user.quantumPreferences.defaultPersonality = defaultPersonality;
    }
    if (preferredTemperature !== undefined) {
      user.quantumPreferences.preferredTemperature = preferredTemperature;
    }
    if (maxTokensPerRequest !== undefined) {
      user.quantumPreferences.maxTokensPerRequest = maxTokensPerRequest;
    }
    if (enableQuantumEnhancement !== undefined) {
      user.quantumPreferences.enableQuantumEnhancement = enableQuantumEnhancement;
    }
    if (saveConversationHistory !== undefined) {
      user.quantumPreferences.saveConversationHistory = saveConversationHistory;
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'تم تحديث تفضيلات الحوسبة الكمية بنجاح',
      messageEn: 'Quantum preferences updated successfully',
      data: {
        quantumPreferences: user.quantumPreferences
      }
    });
    
  } catch (error) {
    console.error('Update quantum preferences error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join('. '),
        errorEn: 'Validation error'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم الداخلي',
      errorEn: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password - تغيير كلمة مرور المستخدم
 * @access  Private
 */
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'كلمة المرور الحالية والجديدة مطلوبتان',
        errorEn: 'Current password and new password are required'
      });
    }
    
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود',
        errorEn: 'User not found'
      });
    }
    
    // Check current password - التحقق من كلمة المرور الحالية
    const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({
        success: false,
        error: 'كلمة المرور الحالية غير صحيحة',
        errorEn: 'Current password is incorrect'
      });
    }
    
    // Update password - تحديث كلمة المرور
    user.password = newPassword;
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
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join('. '),
        errorEn: 'Validation error'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم الداخلي',
      errorEn: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email - إرسال بريد إعادة تعيين كلمة المرور
 * @access  Public
 */
router.post('/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'البريد الإلكتروني مطلوب',
        errorEn: 'Email is required'
      });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Don't reveal if user exists - لا تكشف عن وجود المستخدم
      return res.status(200).json({
        success: true,
        message: 'إذا كان البريد الإلكتروني موجود، ستتلقى رسالة إعادة تعيين كلمة المرور',
        messageEn: 'If the email exists, you will receive a password reset message'
      });
    }
    
    // Generate reset token - توليد رمز الإعادة
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    // TODO: Send password reset email
    // إرسال بريد إعادة تعيين كلمة المرور
    
    console.log(`✅ Password reset requested for: ${user.email}`);
    console.log(`✅ تم طلب إعادة تعيين كلمة المرور لـ: ${user.email}`);
    
    res.status(200).json({
      success: true,
      message: 'تم إرسال رسالة إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
      messageEn: 'Password reset email sent to your email address'
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم الداخلي',
      errorEn: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/auth/reset-password/:token
 * @desc    Reset password with token - إعادة تعيين كلمة المرور بالرمز
 * @access  Public
 */
router.put('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'كلمة المرور الجديدة مطلوبة',
        errorEn: 'New password is required'
      });
    }
    
    // Hash the token - تشفير الرمز
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    
    // Find user with valid reset token - البحث عن المستخدم برمز إعادة صالح
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'رمز إعادة التعيين غير صالح أو منتهي الصلاحية',
        errorEn: 'Invalid or expired reset token'
      });
    }
    
    // Set new password - تعيين كلمة المرور الجديدة
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    await user.save();
    
    console.log(`✅ Password reset completed for: ${user.email}`);
    console.log(`✅ تم إكمال إعادة تعيين كلمة المرور لـ: ${user.email}`);
    
    createSendToken(user, 200, res, 'تم إعادة تعيين كلمة المرور بنجاح');
    
  } catch (error) {
    console.error('Reset password error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join('. '),
        errorEn: 'Validation error'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم الداخلي',
      errorEn: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email address - التحقق من عنوان البريد الإلكتروني
 * @access  Public
 */
router.get('/verify-email/:token', async (req, res) => {
  try {
    // Hash the token - تشفير الرمز
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    
    // Find user with valid verification token - البحث عن المستخدم برمز تحقق صالح
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'رمز التحقق غير صالح أو منتهي الصلاحية',
        errorEn: 'Invalid or expired verification token'
      });
    }
    
    // Verify email - التحقق من البريد الإلكتروني
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    
    await user.save({ validateBeforeSave: false });
    
    console.log(`✅ Email verified for: ${user.email}`);
    console.log(`✅ تم التحقق من البريد الإلكتروني لـ: ${user.email}`);
    
    res.status(200).json({
      success: true,
      message: 'تم التحقق من البريد الإلكتروني بنجاح',
      messageEn: 'Email verified successfully'
    });
    
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم الداخلي',
      errorEn: 'Internal server error'
    });
  }
});

export default router;