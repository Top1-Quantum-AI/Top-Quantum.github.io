/**
 * Admin Routes - مسارات الإدارة
 * Routes for admin dashboard, user management, and system statistics
 * مسارات للوحة الإدارة وإدارة المستخدمين وإحصائيات النظام
 */

import express from 'express';
import rateLimit from 'express-rate-limit';

import { authMiddleware, restrictTo } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authMiddleware);
router.use(restrictTo('admin'));

// Rate limiting for admin routes
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: {
    error: 'تم تجاوز عدد الطلبات المسموح بها.',
    errorEn: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
router.use(adminLimiter);

/**
 * @route   GET /api/admin/stats
 * @desc    Get system-wide statistics - إحصائيات النظام
 * @access  Admin
 */
router.get('/stats', async (req, res) => {
  try {
    const [userStats, planDistribution, recentSignups] = await Promise.all([
      User.getUserStats(),
      User.aggregate([
        {
          $group: {
            _id: '$subscription.plan',
            count: { $sum: 1 },
          },
        },
      ]),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    const planMap = {};
    for (const p of planDistribution) {
      planMap[p._id] = p.count;
    }

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: userStats.totalUsers,
          active: userStats.activeUsers,
          verified: userStats.verifiedUsers,
          recentSignups,
        },
        plans: {
          free: planMap.free || 0,
          professional: planMap.professional || planMap.premium || 0,
          enterprise: planMap.enterprise || 0,
        },
        api: {
          totalRequests: userStats.totalRequests,
          totalTokens: userStats.totalTokens,
        },
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في جلب الإحصائيات',
      errorEn: 'Error fetching statistics',
    });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    List all users with pagination - قائمة المستخدمين مع التصفح
 * @access  Admin
 */
router.get('/users', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const plan = req.query.plan || '';

    const filter = {};
    if (search) {
      const sanitized = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { username: { $regex: sanitized, $options: 'i' } },
        { email: { $regex: sanitized, $options: 'i' } },
        { 'profile.firstName': { $regex: sanitized, $options: 'i' } },
        { 'profile.lastName': { $regex: sanitized, $options: 'i' } },
      ];
    }
    if (role) filter.role = role;
    if (plan) filter['subscription.plan'] = plan;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select(
          'username email profile role isActive isEmailVerified subscription apiUsage createdAt lastLogin'
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Admin list users error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في جلب المستخدمين',
      errorEn: 'Error fetching users',
    });
  }
});

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get single user details - تفاصيل مستخدم
 * @access  Admin
 */
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      '-password -passwordResetToken -passwordResetExpires -emailVerificationToken'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود',
        errorEn: 'User not found',
      });
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    console.error('Admin get user error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في جلب بيانات المستخدم',
      errorEn: 'Error fetching user',
    });
  }
});

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user (role, plan, status) - تحديث المستخدم
 * @access  Admin
 */
router.put('/users/:id', async (req, res) => {
  try {
    const { role, isActive, plan } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود',
        errorEn: 'User not found',
      });
    }

    // Prevent admin from demoting themselves
    if (user._id.toString() === req.user._id.toString() && role && role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: 'لا يمكنك تغيير دورك الخاص',
        errorEn: 'Cannot change your own role',
      });
    }

    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (plan !== undefined) user.subscription.plan = plan;

    await user.save();

    console.log(
      `✅ Admin ${req.user.username} updated user ${user.username}: role=${user.role}, active=${user.isActive}, plan=${user.subscription.plan}`
    );

    res.status(200).json({
      success: true,
      message: 'تم تحديث المستخدم بنجاح',
      messageEn: 'User updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          subscription: user.subscription,
        },
      },
    });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في تحديث المستخدم',
      errorEn: 'Error updating user',
    });
  }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Deactivate user (soft delete) - تعطيل المستخدم
 * @access  Admin
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود',
        errorEn: 'User not found',
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'لا يمكنك تعطيل حسابك الخاص',
        errorEn: 'Cannot deactivate your own account',
      });
    }

    user.isActive = false;
    await user.save();

    console.log(`✅ Admin ${req.user.username} deactivated user ${user.username}`);

    res.status(200).json({
      success: true,
      message: 'تم تعطيل المستخدم بنجاح',
      messageEn: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في تعطيل المستخدم',
      errorEn: 'Error deactivating user',
    });
  }
});

/**
 * @route   GET /api/admin/audit-logs
 * @desc    Get recent audit/login logs - سجلات التدقيق
 * @access  Admin
 */
router.get('/audit-logs', async (req, res) => {
  try {
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit) || 50));

    const logs = await User.aggregate([
      { $unwind: '$loginHistory' },
      { $sort: { 'loginHistory.timestamp': -1 } },
      { $limit: limit },
      {
        $project: {
          username: 1,
          email: 1,
          role: 1,
          'loginHistory.ip': 1,
          'loginHistory.userAgent': 1,
          'loginHistory.timestamp': 1,
          'loginHistory.success': 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        logs: logs.map((l) => ({
          userId: l._id,
          username: l.username,
          email: l.email,
          role: l.role,
          ...l.loginHistory,
        })),
      },
    });
  } catch (error) {
    console.error('Admin audit logs error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في جلب سجلات التدقيق',
      errorEn: 'Error fetching audit logs',
    });
  }
});

export default router;
