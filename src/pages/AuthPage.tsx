import { motion } from 'framer-motion';
import {
  Atom, Mail, Lock, User, Eye, EyeOff,
  ArrowLeft, CheckCircle, Building2, Globe,
  Crown, Zap, Star,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

import {
  apiRegister, apiLogin, checkBackendAvailable, type ApiError,
} from '../services/apiClient';
import {
  createUser, loginUser, getCurrentUser,
  PLANS, type PlanId,
} from '../services/subscriptionService';

// ═══════════════════════════════════════════════════════════
// ─── AUTH PAGE (Login / Register) ─────────────────────────
// ═══════════════════════════════════════════════════════════

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isLogin = location.pathname === '/login';

  const planParam = searchParams.get('plan');
  const validPlans: PlanId[] = ['free', 'professional', 'enterprise'];
  const initialPlan: PlanId = (planParam != null && validPlans.includes(planParam as PlanId))
    ? planParam as PlanId
    : 'free';

  const [selectedPlan, setSelectedPlan] = useState<PlanId>(initialPlan);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (!isLogin && !formData.name) {
      setError('يرجى إدخال الاسم الكامل');
      return;
    }

    if (!isLogin && !formData.agreeTerms) {
      setError('يرجى الموافقة على الشروط والأحكام');
      return;
    }

    setIsLoading(true);

    try {
      const backendUp = await checkBackendAvailable();

      if (backendUp) {
        // Real API auth
        if (isLogin) {
          const { user } = await apiLogin(formData.email, formData.password);
          // Sync to local for dashboard compatibility
          createUser(user.username, user.email, '', selectedPlan);
        } else {
          const nameParts = formData.name.split(' ');
          await apiRegister({
            username: formData.email.split('@')[0] ?? 'user',
            email: formData.email,
            password: formData.password,
            firstName: nameParts[0] ?? '',
            lastName: nameParts.slice(1).join(' '),
          });
          // Sync to local
          createUser(formData.name, formData.email, formData.company, selectedPlan);
        }
      } else {
        // Fallback: localStorage-only
        if (isLogin) {
          const user = loginUser(formData.email);
          if (user == null) {
            const existing = getCurrentUser();
            if (existing == null) {
              createUser(formData.email.split('@')[0] ?? 'User', formData.email, '', 'free');
            }
          }
        } else {
          createUser(formData.name, formData.email, formData.company, selectedPlan);
        }
      }

      void navigate('/dashboard');
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || 'حدث خطأ. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-900/50 via-purple-900/30 to-gray-950 flex-col justify-between p-12">
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Atom className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Top1 Quantum AI</h1>
              <p className="text-xs text-gray-400">Enterprise Platform</p>
            </div>
          </button>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            {isLogin ? 'مرحباً بعودتك' : 'انضم للمستقبل الكمي'}
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            {isLogin
              ? 'سجّل دخولك للوصول إلى لوحة التحكم الكمية ومتابعة عملياتك.'
              : 'أنشئ حسابك للوصول إلى منصة الحوسبة الكمية والذكاء الاصطناعي الأكثر تقدماً.'
            }
          </p>
          <div className="space-y-4">
            {[
              { icon: <Atom className="w-5 h-5 text-purple-400" />, text: 'محاكاة كمية بتقنية State-Vector' },
              { icon: <Globe className="w-5 h-5 text-blue-400" />, text: 'تحليلات AI متقدمة في الوقت الحقيقي' },
              { icon: <Lock className="w-5 h-5 text-green-400" />, text: 'أمان ما بعد الكم من الدرجة العسكرية' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.icon}
                <span className="text-gray-300 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-gray-500">
          <p>© 2026 Top1 Quantum AI — جميع الحقوق محفوظة</p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <button onClick={() => navigate('/')} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Atom className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg">Top1 Quantum AI</span>
            </button>
          </div>

          <h2 className="text-3xl font-bold mb-2">{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h2>
          <p className="text-gray-400 mb-8">
            {isLogin ? 'أدخل بياناتك للوصول إلى لوحة التحكم' : 'أنشئ حسابك وابدأ تجربة 14 يوم مجانية'}
          </p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2"
            >
              <Lock className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
            <div>
              <label htmlFor="auth-name" className="block text-sm font-medium mb-2">الاسم الكامل *</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="auth-name"
                  type="text"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full pr-11 pl-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                />
              </div>
            </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="auth-email"
                  type="email"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pr-11 pl-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium mb-2">كلمة المرور *</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => updateField('password', e.target.value)}
                  placeholder="أدخل كلمة مرور قوية"
                  className="w-full pr-11 pl-11 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                  dir="ltr"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="auth-company" className="block text-sm font-medium mb-2">اسم الشركة (اختياري)</label>
                  <div className="relative">
                    <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      id="auth-company"
                      type="text"
                      value={formData.company}
                      onChange={e => updateField('company', e.target.value)}
                      placeholder="اسم شركتك أو مؤسستك"
                      className="w-full pr-11 pl-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Plan Selection */}
                <div>
                  <p className="block text-sm font-medium mb-3">اختر خطتك</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['free', 'professional', 'enterprise'] as const).map(planId => {
                      const plan = PLANS[planId];
                      const isSelected = selectedPlan === planId;
                      return (
                        <button
                          key={planId}
                          type="button"
                          onClick={() => setSelectedPlan(planId)}
                          className={`relative p-3 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                              : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5">
                              <CheckCircle className="w-4 h-4 text-blue-400" />
                            </div>
                          )}
                          <div className="text-lg mb-1">
                            {planId === 'free' && <Zap className="w-5 h-5 mx-auto text-gray-400" />}
                            {planId === 'professional' && <Star className="w-5 h-5 mx-auto text-blue-400" />}
                            {planId === 'enterprise' && <Crown className="w-5 h-5 mx-auto text-purple-400" />}
                          </div>
                          <p className="text-xs font-semibold">{plan.name}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {plan.priceAnnual === 0 ? 'مجاني' : `$${plan.priceAnnual}/شهر`}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  {selectedPlan !== 'free' && (
                    <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      تجربة مجانية 14 يوم — بدون بطاقة ائتمان
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeTerms}
                    onChange={e => updateField('agreeTerms', e.target.checked)}
                    className="mt-1 rounded border-gray-600"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400">
                    أوافق على <button type="button" className="text-blue-400 hover:underline">شروط الاستخدام</button> و<button type="button" className="text-blue-400 hover:underline">سياسة الخصوصية</button>
                  </label>
                </div>
              </>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-blue-400 hover:underline">نسيت كلمة المرور؟</button>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  {isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
                  <ArrowLeft className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {isLogin ? (
              <>ليس لديك حساب؟ <button onClick={() => navigate('/register')} className="text-blue-400 hover:underline font-medium">أنشئ حساباً</button></>
            ) : (
              <>لديك حساب بالفعل؟ <button onClick={() => navigate('/login')} className="text-blue-400 hover:underline font-medium">سجّل الدخول</button></>
            )}
          </div>

          {!isLogin && (
            <div className="mt-8 pt-6 border-t border-gray-800">
              <p className="text-xs text-gray-500 text-center mb-4">
                ما ستحصل عليه مع خطة {PLANS[selectedPlan].name}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  selectedPlan !== 'free' ? '14 يوم تجربة مجانية' : 'مجاني للأبد',
                  `${PLANS[selectedPlan].limits.maxQubits} كيوبت محاكاة`,
                  `${!isFinite(PLANS[selectedPlan].limits.maxSimulationsPerMonth) ? '∞' : PLANS[selectedPlan].limits.maxSimulationsPerMonth.toLocaleString()} محاكاة/شهر`,
                  'بدون بطاقة ائتمان',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
