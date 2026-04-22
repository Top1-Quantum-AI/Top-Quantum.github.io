/**
 * User Model - نموذج المستخدم
 * MongoDB user model with authentication and security features
 * نموذج المستخدم في MongoDB مع ميزات المصادقة والأمان
 */

import crypto from 'crypto';

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Basic Information - المعلومات الأساسية
  username: {
    type: String,
    required: [true, 'اسم المستخدم مطلوب'],
    unique: true,
    trim: true,
    minlength: [3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'],
    maxlength: [30, 'اسم المستخدم يجب أن يكون 30 حرف كحد أقصى'],
    match: [/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يجب أن يحتوي على أحرف وأرقام وشرطة سفلية فقط']
  },
  
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'البريد الإلكتروني غير صحيح']
  },
  
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'],
    select: false // Don't include password in queries by default
  },
  
  // Profile Information - معلومات الملف الشخصي
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'الاسم الأول يجب أن يكون 50 حرف كحد أقصى']
    },
    
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'الاسم الأخير يجب أن يكون 50 حرف كحد أقصى']
    },
    
    avatar: {
      type: String,
      default: null
    },
    
    bio: {
      type: String,
      maxlength: [500, 'النبذة الشخصية يجب أن تكون 500 حرف كحد أقصى']
    },
    
    language: {
      type: String,
      enum: ['ar', 'en'],
      default: 'ar'
    },
    
    timezone: {
      type: String,
      default: 'Asia/Riyadh'
    }
  },
  
  // Authentication & Security - المصادقة والأمان
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  emailVerificationToken: {
    type: String,
    select: false
  },
  
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  
  passwordResetToken: {
    type: String,
    select: false
  },
  
  passwordResetExpires: {
    type: Date,
    select: false
  },
  
  passwordChangedAt: {
    type: Date,
    select: false
  },
  
  // Login Security - أمان تسجيل الدخول
  loginAttempts: {
    type: Number,
    default: 0
  },
  
  lockUntil: {
    type: Date
  },
  
  lastLogin: {
    type: Date
  },
  
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    success: {
      type: Boolean,
      default: true
    }
  }],
  
  // API Usage - استخدام واجهة برمجة التطبيقات
  apiUsage: {
    totalRequests: {
      type: Number,
      default: 0
    },
    
    totalTokens: {
      type: Number,
      default: 0
    },
    
    dailyRequests: {
      type: Number,
      default: 0
    },
    
    dailyTokens: {
      type: Number,
      default: 0
    },
    
    lastResetDate: {
      type: Date,
      default: Date.now
    },
    
    limits: {
      dailyRequests: {
        type: Number,
        default: 100
      },
      
      dailyTokens: {
        type: Number,
        default: 10000
      }
    }
  },
  
  // Quantum Preferences - تفضيلات الحوسبة الكمية
  quantumPreferences: {
    defaultPersonality: {
      type: String,
      enum: ['quantum_assistant', 'creative_quantum', 'analytical_quantum', 'educational_quantum'],
      default: 'quantum_assistant'
    },
    
    preferredTemperature: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.7
    },
    
    maxTokensPerRequest: {
      type: Number,
      min: 100,
      max: 4000,
      default: 2000
    },
    
    enableQuantumEnhancement: {
      type: Boolean,
      default: true
    },
    
    saveConversationHistory: {
      type: Boolean,
      default: true
    }
  },
  
  // Subscription - الاشتراك
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'expired'],
      default: 'active'
    },
    
    startDate: {
      type: Date,
      default: Date.now
    },
    
    endDate: {
      type: Date
    },
    
    autoRenew: {
      type: Boolean,
      default: false
    }
  },
  
  // Timestamps - الطوابع الزمنية
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance - فهارس لتحسين الأداء
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'apiUsage.lastResetDate': 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLogin: -1 });

// Virtual for account lock status - خاصية افتراضية لحالة قفل الحساب
userSchema.virtual('isLocked').get(function() {
  return Boolean(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for full name - خاصية افتراضية للاسم الكامل
userSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
});

// Pre-save middleware to hash password - وسطية ما قبل الحفظ لتشفير كلمة المرور
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    
    // Set password changed timestamp
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure JWT is created after password change
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update timestamps - وسطية ما قبل الحفظ لتحديث الطوابع الزمنية
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-save middleware to reset daily usage - وسطية ما قبل الحفظ لإعادة تعيين الاستخدام اليومي
userSchema.pre('save', function(next) {
  const now = new Date();
  const lastReset = new Date(this.apiUsage.lastResetDate);
  
  // Reset daily counters if it's a new day
  if (now.toDateString() !== lastReset.toDateString()) {
    this.apiUsage.dailyRequests = 0;
    this.apiUsage.dailyTokens = 0;
    this.apiUsage.lastResetDate = now;
  }
  
  next();
});

// Instance method to compare password - طريقة مثيل لمقارنة كلمة المرور
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if password changed after JWT was issued
// طريقة مثيل للتحقق من تغيير كلمة المرور بعد إصدار JWT
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  
  return false;
};

// Instance method to create password reset token - طريقة مثيل لإنشاء رمز إعادة تعيين كلمة المرور
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Instance method to create email verification token - طريقة مثيل لإنشاء رمز التحقق من البريد الإلكتروني
userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Instance method to increment login attempts - طريقة مثيل لزيادة محاولات تسجيل الدخول
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we have reached max attempts and it's not locked already, lock the account
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // Lock for 2 hours
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts - طريقة مثيل لإعادة تعيين محاولات تسجيل الدخول
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Instance method to add login history - طريقة مثيل لإضافة تاريخ تسجيل الدخول
userSchema.methods.addLoginHistory = function(ip, userAgent, success = true) {
  this.loginHistory.push({
    ip,
    userAgent,
    success,
    timestamp: new Date()
  });
  
  // Keep only last 10 login attempts
  if (this.loginHistory.length > 10) {
    this.loginHistory = this.loginHistory.slice(-10);
  }
  
  if (success) {
    this.lastLogin = new Date();
  }
  
  return this.save();
};

// Instance method to update API usage - طريقة مثيل لتحديث استخدام واجهة برمجة التطبيقات
userSchema.methods.updateApiUsage = function(tokens = 0) {
  this.apiUsage.totalRequests += 1;
  this.apiUsage.totalTokens += tokens;
  this.apiUsage.dailyRequests += 1;
  this.apiUsage.dailyTokens += tokens;
  
  return this.save();
};

// Instance method to check API limits - طريقة مثيل للتحقق من حدود واجهة برمجة التطبيقات
userSchema.methods.checkApiLimits = function() {
  const {limits} = this.apiUsage;
  
  return {
    canMakeRequest: this.apiUsage.dailyRequests < limits.dailyRequests,
    canUseTokens: this.apiUsage.dailyTokens < limits.dailyTokens,
    remainingRequests: Math.max(0, limits.dailyRequests - this.apiUsage.dailyRequests),
    remainingTokens: Math.max(0, limits.dailyTokens - this.apiUsage.dailyTokens)
  };
};

// Static method to find by email or username - طريقة ثابتة للبحث بالبريد الإلكتروني أو اسم المستخدم
userSchema.statics.findByEmailOrUsername = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  });
};

// Static method to get user statistics - طريقة ثابتة للحصول على إحصائيات المستخدم
userSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: {
            $cond: [{ $eq: ['$isActive', true] }, 1, 0]
          }
        },
        verifiedUsers: {
          $sum: {
            $cond: [{ $eq: ['$isEmailVerified', true] }, 1, 0]
          }
        },
        totalRequests: { $sum: '$apiUsage.totalRequests' },
        totalTokens: { $sum: '$apiUsage.totalTokens' }
      }
    }
  ]);
  
  return stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    totalRequests: 0,
    totalTokens: 0
  };
};

const User = mongoose.model('User', userSchema);

export default User;