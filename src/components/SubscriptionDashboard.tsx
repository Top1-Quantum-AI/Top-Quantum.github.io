import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Zap, Shield, Brain, BarChart3, ArrowUpRight,
  CheckCircle, Clock, CreditCard, Settings, Star,
  AlertTriangle, Atom, ChevronLeft,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getCurrentUser, changePlan, getTrialDaysRemaining,
  PLANS, type PlanId, type UserProfile,
} from '../services/subscriptionService';

// ─── Usage Gauge ─────────────────────────────────────────────
const UsageGauge: React.FC<{
  label: string;
  used: number;
  limit: number;
  color: string;
}> = ({ label, used, limit, color }) => {
  const isUnlimited = !isFinite(limit);
  const pct = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isWarning = pct > 80;
  const isCritical = pct > 95;

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-300">{label}</span>
        <span className={`text-xs font-mono ${isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-gray-400'}`}>
          {isUnlimited
            ? `${used.toLocaleString()} / ∞`
            : `${used.toLocaleString()} / ${limit.toLocaleString()}`
          }
        </span>
      </div>
      <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isUnlimited ? '3%' : `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{
            backgroundColor: isCritical ? '#ef4444' : isWarning ? '#f59e0b' : color,
          }}
        />
      </div>
      {isUnlimited && (
        <p className="text-xs text-purple-400 mt-1.5 flex items-center gap-1">
          <Crown className="w-3 h-3" /> غير محدود
        </p>
      )}
      {isCritical && !isUnlimited && (
        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> وشك الوصول للحد الأقصى
        </p>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ─── SUBSCRIPTION DASHBOARD ──────────────────────────────
// ═══════════════════════════════════════════════════════════
const SubscriptionDashboard: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [annual, setAnnual] = useState(true);
  const [upgrading, setUpgrading] = useState<PlanId | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const trialDays = getTrialDaysRemaining();

  const handleUpgrade = (planId: PlanId) => {
    setUpgrading(planId);
    // Simulate processing
    setTimeout(() => {
      changePlan(planId, annual ? 'annual' : 'monthly');
      setUser(getCurrentUser());
      setUpgrading(null);
      setShowUpgrade(false);
    }, 2000);
  };

  if (user == null) {
    return (
      <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">لم يتم تسجيل الدخول</h3>
          <p className="text-gray-400 mb-6">يرجى تسجيل الدخول أو إنشاء حساب للوصول لإدارة الاشتراك.</p>
          <div className="space-y-3">
            <button onClick={() => navigate('/register')} className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold">
              إنشاء حساب
            </button>
            <button onClick={onClose} className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm transition-colors">
              إغلاق
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentPlan = PLANS[user.subscription.planId];
  const {limits} = currentPlan;

  return (
    <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${currentPlan.color}20`, border: `1px solid ${currentPlan.color}40` }}
            >
              <CreditCard className="w-5 h-5" style={{ color: currentPlan.color }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">إدارة الاشتراك</h2>
              <p className="text-xs text-gray-400">إدارة خطتك واستخدامك</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Trial Banner */}
          {trialDays != null && trialDays > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-amber-200">
                    فترة التجربة: متبقي {trialDays} يوم
                  </p>
                  <p className="text-xs text-amber-400/70">
                    ترقّ الآن للاحتفاظ بجميع ميزاتك بعد انتهاء التجربة
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUpgrade(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm rounded-lg transition-colors"
              >
                ترقية الآن
              </button>
            </motion.div>
          )}

          {/* Current Plan Card */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{currentPlan.icon}</span>
                  <h3 className="text-xl font-bold text-white">
                    خطة {currentPlan.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.subscription.status === 'active'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : user.subscription.status === 'trial'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}
                  >
                    {user.subscription.status === 'active' ? 'نشط' :
                     user.subscription.status === 'trial' ? 'تجريبي' : 'منتهي'}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{currentPlan.description}</p>
              </div>
              <div className="text-left">
                <span className="text-3xl font-bold" style={{ color: currentPlan.color }}>
                  {currentPlan.priceAnnual === 0 ? 'مجاني' : `$${
                    user.subscription.billingCycle === 'annual'
                      ? currentPlan.priceAnnual
                      : currentPlan.priceMonthly
                  }`}
                </span>
                {currentPlan.priceAnnual > 0 && (
                  <p className="text-xs text-gray-500">
                    /{user.subscription.billingCycle === 'annual' ? 'شهر (سنوي)' : 'شهر'}
                  </p>
                )}
              </div>
            </div>

            {/* Plan Features Quick View */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'الكيوبتات', value: limits.maxQubits === 128 ? '128+' : `${limits.maxQubits}`, icon: <Atom className="w-4 h-4" /> },
                { label: 'الخوارزميات', value: !isFinite(limits.maxAlgorithms) ? '∞' : `${limits.maxAlgorithms}`, icon: <Zap className="w-4 h-4" /> },
                { label: 'أمان ما بعد الكم', value: limits.hasPostQuantumSecurity ? 'مفعل' : 'غير متوفر', icon: <Shield className="w-4 h-4" /> },
                { label: 'SLA', value: `${limits.slaUptime}%`, icon: <BarChart3 className="w-4 h-4" /> },
              ].map((item, i) => (
                <div key={i} className="bg-gray-700/30 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1">
                    {item.icon}
                    <span className="text-xs">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Upgrade Button */}
            {user.subscription.planId !== 'enterprise' && (
              <button
                onClick={() => setShowUpgrade(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
              >
                <ArrowUpRight className="w-5 h-5" />
                ترقية الخطة
              </button>
            )}
          </div>

          {/* Usage Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              استخدام هذا الشهر
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <UsageGauge
                label="عمليات المحاكاة"
                used={user.subscription.usage.simulationsThisMonth}
                limit={limits.maxSimulationsPerMonth}
                color="#3b82f6"
              />
              <UsageGauge
                label="استعلامات AI"
                used={user.subscription.usage.aiQueriesThisMonth}
                limit={limits.maxAiQueriesPerMonth}
                color="#8b5cf6"
              />
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              الميزات المتاحة
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'تصدير PDF', enabled: limits.hasPdfExport, icon: <BarChart3 className="w-4 h-4" /> },
                { label: 'API Access', enabled: limits.hasApiAccess, icon: <Zap className="w-4 h-4" /> },
                { label: 'دوائر مخصصة', enabled: limits.hasCustomCircuits, icon: <Atom className="w-4 h-4" /> },
                { label: 'سجلات التدقيق', enabled: limits.hasAuditLogs, icon: <Shield className="w-4 h-4" /> },
                { label: 'SSO / SAML', enabled: limits.hasSso, icon: <Settings className="w-4 h-4" /> },
                { label: 'دعم مخصص', enabled: limits.hasDedicatedSupport, icon: <Star className="w-4 h-4" /> },
                { label: 'White Label', enabled: limits.hasWhiteLabel, icon: <Crown className="w-4 h-4" /> },
                { label: 'نماذج AI مخصصة', enabled: limits.hasCustomModels, icon: <Brain className="w-4 h-4" /> },
                { label: 'أمان ما بعد الكم', enabled: limits.hasPostQuantumSecurity, icon: <Shield className="w-4 h-4" /> },
              ].map((f, i) => (
                <div key={i} className={`rounded-lg p-3 border flex items-center gap-2.5 ${
                  f.enabled
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-gray-800/30 border-gray-700/30 opacity-50'
                }`}
                >
                  <div className={f.enabled ? 'text-green-400' : 'text-gray-600'}>{f.icon}</div>
                  <span className={`text-sm ${f.enabled ? 'text-gray-200' : 'text-gray-500'}`}>{f.label}</span>
                  {f.enabled && <CheckCircle className="w-3.5 h-3.5 text-green-400 mr-auto" />}
                </div>
              ))}
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/30">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">معلومات الحساب</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">الاسم:</span>
                <p className="text-white">{user.name}</p>
              </div>
              <div>
                <span className="text-gray-500">البريد:</span>
                <p className="text-white" dir="ltr">{user.email}</p>
              </div>
              {user.company && (
                <div>
                  <span className="text-gray-500">الشركة:</span>
                  <p className="text-white">{user.company}</p>
                </div>
              )}
              <div>
                <span className="text-gray-500">تاريخ الاشتراك:</span>
                <p className="text-white">{new Date(user.subscription.startDate).toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Upgrade Modal ──────────────────────────────────── */}
        <AnimatePresence>
          {showUpgrade && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-3xl p-6 max-h-[85vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">ترقية خطتك</h3>
                  <button onClick={() => setShowUpgrade(false)} className="text-gray-400 hover:text-white text-sm">
                    إلغاء
                  </button>
                </div>

                {/* Billing toggle */}
                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center bg-gray-800 rounded-full p-1">
                    <button
                      onClick={() => setAnnual(true)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${annual ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                      سنوي <span className="text-xs text-green-400">وفر 20%</span>
                    </button>
                    <button
                      onClick={() => setAnnual(false)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!annual ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                      شهري
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {(['free', 'professional', 'enterprise'] as const).map(planId => {
                    const plan = PLANS[planId];
                    const isCurrent = user.subscription.planId === planId;
                    const price = annual ? plan.priceAnnual : plan.priceMonthly;

                    return (
                      <div key={planId} className={`rounded-xl p-5 border transition-all ${
                        isCurrent
                          ? 'border-green-500/50 bg-green-500/5'
                          : planId === 'professional'
                            ? 'border-blue-500/50 bg-blue-500/5'
                            : 'border-gray-700 bg-gray-800/30'
                      }`}
                      >
                        <div className="text-center mb-4">
                          <span className="text-2xl">{plan.icon}</span>
                          <h4 className="text-lg font-bold mt-1">{plan.name}</h4>
                          <p className="text-xs text-gray-400">{plan.nameEn}</p>
                          <div className="mt-3">
                            <span className="text-3xl font-bold" style={{ color: plan.color }}>
                              {price === 0 ? 'مجاني' : `$${price}`}
                            </span>
                            {price > 0 && <span className="text-gray-500 text-xs">/شهر</span>}
                          </div>
                        </div>

                        <ul className="space-y-2 mb-4 text-xs text-gray-300">
                          <li className="flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                            {plan.limits.maxQubits === 128 ? '128+' : plan.limits.maxQubits} كيوبت
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                            {!isFinite(plan.limits.maxSimulationsPerMonth) ? '∞' : plan.limits.maxSimulationsPerMonth.toLocaleString()} محاكاة/شهر
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                            SLA {plan.limits.slaUptime}%
                          </li>
                        </ul>

                        {isCurrent ? (
                          <div className="w-full py-2.5 text-center text-green-400 text-sm font-medium border border-green-500/30 rounded-lg bg-green-500/5">
                            خطتك الحالية ✓
                          </div>
                        ) : (
                          <button
                            onClick={() => handleUpgrade(planId)}
                            disabled={upgrading != null}
                            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 ${
                              planId === 'professional'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                                : planId === 'enterprise'
                                  ? 'bg-purple-600 hover:bg-purple-500'
                                  : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                          >
                            {upgrading === planId ? (
                              <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                جاري المعالجة...
                              </span>
                            ) : (
                              planId === 'free' ? 'تخفيض' : 'ترقية'
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SubscriptionDashboard;
