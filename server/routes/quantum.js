/**
 * Quantum Routes - مسارات الحوسبة الكمية
 * Routes for quantum computing operations, simulations, and algorithms
 * مسارات لعمليات الحوسبة الكمية والمحاكاة والخوارزميات
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  authMiddleware,
  trackApiUsage,
  requireSubscription,
  optionalAuth,
} from '../middleware/auth.js';
import { quantumService } from '../index.js';

const router = express.Router();

// Rate limiting for quantum routes - تحديد المعدل لمسارات الحوسبة الكمية
const quantumLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 quantum operations per hour for free users
  message: {
    error: 'تم تجاوز عدد العمليات الكمية المسموح بها. حاول مرة أخرى بعد ساعة.',
    errorEn: 'Too many quantum operations. Please try again after 1 hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => {
    // Skip rate limiting for premium users - تخطي تحديد المعدل للمستخدمين المميزين
    return req.user && ['premium', 'enterprise'].includes(req.user.subscription.tier);
  },
});

const algorithmLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 algorithm executions per hour for free users
  message: {
    error: 'تم تجاوز عدد تنفيذ الخوارزميات الكمية المسموح بها.',
    errorEn: 'Too many quantum algorithm executions.',
  },
  skip: req => {
    return req.user && ['premium', 'enterprise'].includes(req.user.subscription.tier);
  },
});

/**
 * @route   POST /api/quantum/create-state
 * @desc    Create a new quantum state - إنشاء حالة كمية جديدة
 * @access  Private
 */
router.post('/create-state', authMiddleware, quantumLimiter, trackApiUsage(5), async (req, res) => {
  try {
    const { numQubits, initialState, name } = req.body;

    // Validation - التحقق من صحة البيانات
    if (!numQubits || numQubits < 1 || numQubits > 10) {
      return res.status(400).json({
        success: false,
        error: 'عدد الكيوبتات يجب أن يكون بين 1 و 10',
        errorEn: 'Number of qubits must be between 1 and 10',
      });
    }

    // Create quantum state - إنشاء الحالة الكمية
    const quantumState = quantumService.createQuantumState(numQubits, initialState);

    // Store state with user reference - تخزين الحالة مع مرجع المستخدم
    const stateId = await quantumService.saveUserState(req.user._id.toString(), {
      name: name || `Quantum State ${numQubits}Q`,
      numQubits,
      state: quantumState.export(),
      createdAt: new Date(),
    });

    console.log(`✅ Quantum state created for user: ${req.user.username}`);
    console.log(`✅ تم إنشاء حالة كمية للمستخدم: ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحالة الكمية بنجاح',
      messageEn: 'Quantum state created successfully',
      data: {
        stateId,
        numQubits,
        name: name || `Quantum State ${numQubits}Q`,
        state: {
          amplitudes: quantumState.getAmplitudes(),
          probabilities: quantumState.getProbabilities(),
          entanglementEntropy: quantumState.getEntanglementEntropy(),
        },
        metadata: {
          dimension: Math.pow(2, numQubits),
          isNormalized: quantumState.isNormalized(),
          createdAt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error('Create quantum state error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في إنشاء الحالة الكمية',
      errorEn: 'Error creating quantum state',
    });
  }
});

/**
 * @route   POST /api/quantum/apply-gate
 * @desc    Apply quantum gate to state - تطبيق بوابة كمية على الحالة
 * @access  Private
 */
router.post('/apply-gate', authMiddleware, quantumLimiter, trackApiUsage(3), async (req, res) => {
  try {
    const { stateId, gateType, targetQubit, controlQubit, angle, customMatrix } = req.body;

    // Validation - التحقق من صحة البيانات
    if (!stateId || !gateType) {
      return res.status(400).json({
        success: false,
        error: 'معرف الحالة ونوع البوابة مطلوبان',
        errorEn: 'State ID and gate type are required',
      });
    }

    const validGates = ['X', 'Y', 'Z', 'H', 'CNOT', 'RX', 'RY', 'RZ', 'CUSTOM'];
    if (!validGates.includes(gateType)) {
      return res.status(400).json({
        success: false,
        error: 'نوع البوابة غير صالح',
        errorEn: 'Invalid gate type',
        validGates,
      });
    }

    // Get user's quantum state - الحصول على الحالة الكمية للمستخدم
    const userState = await quantumService.getUserState(req.user._id.toString(), stateId);
    if (!userState) {
      return res.status(404).json({
        success: false,
        error: 'الحالة الكمية غير موجودة',
        errorEn: 'Quantum state not found',
      });
    }

    // Load quantum state - تحميل الحالة الكمية
    const quantumState = quantumService.createQuantumState(userState.numQubits);
    quantumState.import(userState.state);

    // Apply gate - تطبيق البوابة
    let gate;
    switch (gateType) {
      case 'X':
      case 'Y':
      case 'Z':
      case 'H':
        if (targetQubit === undefined || targetQubit < 0 || targetQubit >= userState.numQubits) {
          return res.status(400).json({
            success: false,
            error: 'الكيوبت المستهدف غير صالح',
            errorEn: 'Invalid target qubit',
          });
        }
        gate = quantumService.createGate(gateType);
        quantumState.applyGate(gate, targetQubit);
        break;

      case 'CNOT':
        if (
          controlQubit === undefined ||
          targetQubit === undefined ||
          controlQubit < 0 ||
          controlQubit >= userState.numQubits ||
          targetQubit < 0 ||
          targetQubit >= userState.numQubits ||
          controlQubit === targetQubit
        ) {
          return res.status(400).json({
            success: false,
            error: 'كيوبتات التحكم والهدف غير صالحة',
            errorEn: 'Invalid control and target qubits',
          });
        }
        gate = quantumService.createGate('CNOT');
        quantumState.applyTwoQubitGate(gate, controlQubit, targetQubit);
        break;

      case 'RX':
      case 'RY':
      case 'RZ':
        if (targetQubit === undefined || angle === undefined) {
          return res.status(400).json({
            success: false,
            error: 'الكيوبت المستهدف والزاوية مطلوبان للبوابات الدورانية',
            errorEn: 'Target qubit and angle required for rotation gates',
          });
        }
        gate = quantumService.createRotationGate(gateType, angle);
        quantumState.applyGate(gate, targetQubit);
        break;

      case 'CUSTOM':
        if (!customMatrix || !Array.isArray(customMatrix)) {
          return res.status(400).json({
            success: false,
            error: 'مصفوفة البوابة المخصصة مطلوبة',
            errorEn: 'Custom gate matrix required',
          });
        }
        gate = quantumService.createCustomGate(customMatrix);
        quantumState.applyGate(gate, targetQubit);
        break;
    }

    // Update stored state - تحديث الحالة المخزنة
    await quantumService.updateUserState(req.user._id.toString(), stateId, {
      state: quantumState.export(),
      lastModified: new Date(),
    });

    console.log(`✅ Quantum gate ${gateType} applied for user: ${req.user.username}`);
    console.log(`✅ تم تطبيق البوابة الكمية ${gateType} للمستخدم: ${req.user.username}`);

    res.status(200).json({
      success: true,
      message: `تم تطبيق البوابة ${gateType} بنجاح`,
      messageEn: `Gate ${gateType} applied successfully`,
      data: {
        stateId,
        gateApplied: {
          type: gateType,
          targetQubit,
          controlQubit,
          angle,
        },
        newState: {
          amplitudes: quantumState.getAmplitudes(),
          probabilities: quantumState.getProbabilities(),
          entanglementEntropy: quantumState.getEntanglementEntropy(),
        },
        metadata: {
          isNormalized: quantumState.isNormalized(),
          lastModified: new Date(),
        },
      },
    });
  } catch (error) {
    console.error('Apply quantum gate error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في تطبيق البوابة الكمية',
      errorEn: 'Error applying quantum gate',
    });
  }
});

/**
 * @route   POST /api/quantum/measure
 * @desc    Measure quantum state - قياس الحالة الكمية
 * @access  Private
 */
router.post('/measure', authMiddleware, quantumLimiter, trackApiUsage(2), async (req, res) => {
  try {
    const { stateId, qubits, shots } = req.body;

    // Validation - التحقق من صحة البيانات
    if (!stateId) {
      return res.status(400).json({
        success: false,
        error: 'معرف الحالة مطلوب',
        errorEn: 'State ID is required',
      });
    }

    const numShots = Math.min(shots || 1000, 10000); // Max 10k shots

    // Get user's quantum state - الحصول على الحالة الكمية للمستخدم
    const userState = await quantumService.getUserState(req.user._id.toString(), stateId);
    if (!userState) {
      return res.status(404).json({
        success: false,
        error: 'الحالة الكمية غير موجودة',
        errorEn: 'Quantum state not found',
      });
    }

    // Load quantum state - تحميل الحالة الكمية
    const quantumState = quantumService.createQuantumState(userState.numQubits);
    quantumState.import(userState.state);

    // Perform measurements - إجراء القياسات
    const measurements = [];
    const results = {};

    for (let i = 0; i < numShots; i++) {
      const measurement = quantumState.measure(qubits);
      measurements.push(measurement);

      const key = measurement.join('');
      results[key] = (results[key] || 0) + 1;
    }

    // Calculate statistics - حساب الإحصائيات
    const statistics = {};
    for (const [outcome, count] of Object.entries(results)) {
      statistics[outcome] = {
        count,
        probability: count / numShots,
        percentage: ((count / numShots) * 100).toFixed(2) + '%',
      };
    }

    console.log(`✅ Quantum measurement completed for user: ${req.user.username}`);
    console.log(`✅ تم إكمال القياس الكمي للمستخدم: ${req.user.username}`);

    res.status(200).json({
      success: true,
      message: 'تم إجراء القياس الكمي بنجاح',
      messageEn: 'Quantum measurement completed successfully',
      data: {
        stateId,
        measurements: {
          shots: numShots,
          qubits: qubits || 'all',
          results: statistics,
          rawData: measurements.slice(0, 100), // First 100 measurements
        },
        stateInfo: {
          numQubits: userState.numQubits,
          probabilities: quantumState.getProbabilities(),
          entanglementEntropy: quantumState.getEntanglementEntropy(),
        },
        metadata: {
          timestamp: new Date(),
          totalOutcomes: Object.keys(results).length,
        },
      },
    });
  } catch (error) {
    console.error('Quantum measurement error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في القياس الكمي',
      errorEn: 'Error in quantum measurement',
    });
  }
});

/**
 * @route   POST /api/quantum/run-algorithm
 * @desc    Run quantum algorithm - تشغيل خوارزمية كمية
 * @access  Private (Premium)
 */
router.post(
  '/run-algorithm',
  authMiddleware,
  requireSubscription('premium'),
  algorithmLimiter,
  trackApiUsage(15),
  async (req, res) => {
    try {
      const { algorithm, parameters, numQubits } = req.body;

      // Validation - التحقق من صحة البيانات
      const validAlgorithms = ['grover', 'qft', 'shor', 'vqe'];
      if (!algorithm || !validAlgorithms.includes(algorithm)) {
        return res.status(400).json({
          success: false,
          error: 'خوارزمية غير صالحة',
          errorEn: 'Invalid algorithm',
          validAlgorithms,
        });
      }

      if (!numQubits || numQubits < 2 || numQubits > 8) {
        return res.status(400).json({
          success: false,
          error: 'عدد الكيوبتات يجب أن يكون بين 2 و 8',
          errorEn: 'Number of qubits must be between 2 and 8',
        });
      }

      let result;
      const startTime = Date.now();

      switch (algorithm) {
        case 'grover':
          const { targetState } = parameters || {};
          if (!targetState) {
            return res.status(400).json({
              success: false,
              error: 'الحالة المستهدفة مطلوبة لخوارزمية جروفر',
              errorEn: 'Target state required for Grover algorithm',
            });
          }
          result = await quantumService.runGroverAlgorithm(numQubits, targetState);
          break;

        case 'qft':
          result = await quantumService.runQuantumFourierTransform(numQubits);
          break;

        case 'shor':
          const { numberToFactor } = parameters || {};
          if (!numberToFactor || numberToFactor < 4) {
            return res.status(400).json({
              success: false,
              error: 'رقم صالح للتحليل مطلوب لخوارزمية شور',
              errorEn: 'Valid number to factor required for Shor algorithm',
            });
          }
          result = await quantumService.runShorAlgorithm(numberToFactor);
          break;

        case 'vqe':
          const { hamiltonian } = parameters || {};
          result = await quantumService.runVQE(numQubits, hamiltonian);
          break;
      }

      const processingTime = Date.now() - startTime;

      // Store algorithm result - تخزين نتيجة الخوارزمية
      const resultId = await quantumService.saveAlgorithmResult(req.user._id.toString(), {
        algorithm,
        parameters,
        numQubits,
        result,
        processingTime,
        timestamp: new Date(),
      });

      console.log(`✅ Quantum algorithm ${algorithm} completed for user: ${req.user.username}`);
      console.log(`✅ تم إكمال الخوارزمية الكمية ${algorithm} للمستخدم: ${req.user.username}`);

      res.status(200).json({
        success: true,
        message: `تم تشغيل خوارزمية ${algorithm} بنجاح`,
        messageEn: `Algorithm ${algorithm} executed successfully`,
        data: {
          resultId,
          algorithm,
          parameters,
          numQubits,
          result,
          metadata: {
            processingTime,
            timestamp: new Date(),
            complexity: result.complexity || 'O(√N)',
          },
        },
      });
    } catch (error) {
      console.error('Quantum algorithm error:', error);
      res.status(500).json({
        success: false,
        error: 'خطأ في تشغيل الخوارزمية الكمية',
        errorEn: 'Error running quantum algorithm',
      });
    }
  }
);

/**
 * @route   GET /api/quantum/states
 * @desc    Get user's quantum states - الحصول على الحالات الكمية للمستخدم
 * @access  Private
 */
router.get('/states', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const states = await quantumService.getUserStates(req.user._id.toString(), {
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 50),
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      data: {
        states: states.data,
        pagination: {
          currentPage: states.page,
          totalPages: states.totalPages,
          totalStates: states.total,
          hasNext: states.hasNext,
          hasPrev: states.hasPrev,
        },
      },
    });
  } catch (error) {
    console.error('Get quantum states error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على الحالات الكمية',
      errorEn: 'Error getting quantum states',
    });
  }
});

/**
 * @route   GET /api/quantum/state/:stateId
 * @desc    Get specific quantum state - الحصول على حالة كمية محددة
 * @access  Private
 */
router.get('/state/:stateId', authMiddleware, async (req, res) => {
  try {
    const { stateId } = req.params;

    const userState = await quantumService.getUserState(req.user._id.toString(), stateId);
    if (!userState) {
      return res.status(404).json({
        success: false,
        error: 'الحالة الكمية غير موجودة',
        errorEn: 'Quantum state not found',
      });
    }

    // Load quantum state for analysis - تحميل الحالة الكمية للتحليل
    const quantumState = quantumService.createQuantumState(userState.numQubits);
    quantumState.import(userState.state);

    res.status(200).json({
      success: true,
      data: {
        stateId,
        name: userState.name,
        numQubits: userState.numQubits,
        state: {
          amplitudes: quantumState.getAmplitudes(),
          probabilities: quantumState.getProbabilities(),
          entanglementEntropy: quantumState.getEntanglementEntropy(),
        },
        metadata: {
          dimension: Math.pow(2, userState.numQubits),
          isNormalized: quantumState.isNormalized(),
          createdAt: userState.createdAt,
          lastModified: userState.lastModified,
        },
      },
    });
  } catch (error) {
    console.error('Get quantum state error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على الحالة الكمية',
      errorEn: 'Error getting quantum state',
    });
  }
});

/**
 * @route   DELETE /api/quantum/state/:stateId
 * @desc    Delete quantum state - حذف الحالة الكمية
 * @access  Private
 */
router.delete('/state/:stateId', authMiddleware, async (req, res) => {
  try {
    const { stateId } = req.params;

    const deleted = await quantumService.deleteUserState(req.user._id.toString(), stateId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'الحالة الكمية غير موجودة',
        errorEn: 'Quantum state not found',
      });
    }

    console.log(`✅ Quantum state deleted for user: ${req.user.username}`);
    console.log(`✅ تم حذف الحالة الكمية للمستخدم: ${req.user.username}`);

    res.status(200).json({
      success: true,
      message: 'تم حذف الحالة الكمية بنجاح',
      messageEn: 'Quantum state deleted successfully',
    });
  } catch (error) {
    console.error('Delete quantum state error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في حذف الحالة الكمية',
      errorEn: 'Error deleting quantum state',
    });
  }
});

/**
 * @route   GET /api/quantum/algorithms
 * @desc    Get available quantum algorithms - الحصول على الخوارزميات الكمية المتاحة
 * @access  Public
 */
router.get('/algorithms', optionalAuth, (req, res) => {
  try {
    const algorithms = quantumService.getAvailableAlgorithms();

    // Filter algorithms based on subscription - تصفية الخوارزميات بناءً على الاشتراك
    const userTier = req.user?.subscription?.tier || 'free';
    const filteredAlgorithms = algorithms.filter(alg => {
      if (alg.requiresSubscription) {
        const tierLevels = { free: 0, basic: 1, premium: 2, enterprise: 3 };
        const userLevel = tierLevels[userTier] || 0;
        const requiredLevel = tierLevels[alg.requiresSubscription] || 0;
        return userLevel >= requiredLevel;
      }
      return true;
    });

    res.status(200).json({
      success: true,
      data: {
        algorithms: filteredAlgorithms,
        userTier,
        totalAvailable: filteredAlgorithms.length,
        totalAlgorithms: algorithms.length,
      },
    });
  } catch (error) {
    console.error('Get algorithms error:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على الخوارزميات',
      errorEn: 'Error getting algorithms',
    });
  }
});

/**
 * @route   GET /api/quantum/health
 * @desc    Get quantum service health status - الحصول على حالة صحة خدمة الحوسبة الكمية
 * @access  Public
 */
router.get('/health', async (req, res) => {
  try {
    const health = await quantumService.getHealthStatus();

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
    console.error('Quantum health check error:', error);
    res.status(503).json({
      success: false,
      error: 'خطأ في فحص صحة الخدمة',
      errorEn: 'Service health check error',
      status: 'unhealthy',
    });
  }
});

export default router;
