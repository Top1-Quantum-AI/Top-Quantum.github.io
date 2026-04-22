import { motion, AnimatePresence } from 'framer-motion';
import {
  Atom,
  Brain,
  Shield,
  BarChart3,
  Network,
  Zap,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';

interface OnboardingTourProps {
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Sparkles className='w-16 h-16' />,
      title: 'مرحباً بك في Top1 Quantum AI',
      titleEn: 'Welcome to Top1 Quantum AI',
      description:
        'منصة الحوسبة الكمية والذكاء الاصطناعي الأكثر تقدماً. دعنا نأخذك في جولة سريعة لاستكشاف الميزات.',
      color: '#8b5cf6',
      gradient: 'from-purple-600 to-blue-600',
      tips: [
        'تجربة مجانية 14 يوم كاملة',
        'لا حاجة لخبرة مسبقة في الحوسبة الكمية',
        'دعم عربي وإنجليزي كامل',
      ],
    },
    {
      icon: <Atom className='w-16 h-16' />,
      title: 'المحاكاة الكمية',
      titleEn: 'Quantum Simulation',
      description:
        'محاكي كمي حقيقي بتقنية State-Vector يدعم حتى 20 كيوبت. بوابات H, X, Y, Z, CNOT وأكثر مع 8 خوارزميات جاهزة.',
      color: '#8b5cf6',
      gradient: 'from-purple-600 to-pink-600',
      tips: [
        'اختر خوارزمية جاهزة أو ابنِ دائرتك المخصصة',
        'شاهد نتائج القياس وكرات بلوخ مباشرة',
        'تحكم في مستوى الضوضاء وعدد القياسات',
      ],
    },
    {
      icon: <Brain className='w-16 h-16' />,
      title: 'الذكاء الاصطناعي',
      titleEn: 'AI Intelligence',
      description:
        'تحليلات ذكية مدعومة بنموذج Llama 3.3 70B. اسأل أي سؤال وحصل على تحليل فوري لبياناتك.',
      color: '#3b82f6',
      gradient: 'from-blue-600 to-cyan-600',
      tips: [
        'محادثة AI تفاعلية باللغة العربية',
        'تحليل تلقائي لأداء النظام والتهديدات',
        '4 نماذج AI تعمل بالتوازي',
      ],
    },
    {
      icon: <Shield className='w-16 h-16' />,
      title: 'أمان ما بعد الكم',
      titleEn: 'Post-Quantum Security',
      description:
        'حماية بيانات من الدرجة العسكرية باستخدام تشفير مقاوم للحوسبة الكمية مع مراقبة التهديدات في الوقت الحقيقي.',
      color: '#10b981',
      gradient: 'from-green-600 to-emerald-600',
      tips: [
        'تشفير Kyber-1024 و CRYSTALS-Dilithium',
        'كشف التهديدات وحجبها تلقائياً',
        'درجة أمان حية مع سجل التهديدات',
      ],
    },
    {
      icon: <BarChart3 className='w-16 h-16' />,
      title: 'التحليلات والمراقبة',
      titleEn: 'Analytics & Monitoring',
      description: 'لوحة تحكم شاملة مع رسوم بيانية حية وتنبؤات ذكية وكشف الشذوذات التلقائي.',
      color: '#f59e0b',
      gradient: 'from-yellow-600 to-orange-600',
      tips: [
        'أكثر من 12 مقياس أداء في الوقت الحقيقي',
        'تنبؤات AI لاتجاهات النظام',
        'تصدير التقارير بصيغة PDF',
      ],
    },
    {
      icon: <Network className='w-16 h-16' />,
      title: 'أنت جاهز!',
      titleEn: "You're Ready!",
      description: 'استكشف جميع الميزات بحرية. يمكنك العودة لهذه الجولة من الإعدادات في أي وقت.',
      color: '#ec4899',
      gradient: 'from-pink-600 to-purple-600',
      tips: [
        'استكشف التبويبات التسعة في لوحة التحكم',
        'جرّب المحاكاة الكمية فوراً',
        'اطّلع على خريطة الشبكة التفاعلية',
      ],
    },
  ];

  const step = steps[currentStep];
  if (!step) return null;
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;

  return (
    <div className='fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-xl flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='w-full max-w-2xl'
      >
        {/* Progress */}
        <div className='flex gap-2 mb-8 justify-center'>
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= currentStep ? 'w-10' : 'w-4'
              }`}
              style={{ backgroundColor: i <= currentStep ? step.color : '#374151' }}
            />
          ))}
        </div>

        <AnimatePresence mode='wait'>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className='bg-gray-900/80 rounded-3xl border border-gray-700/50 p-10 text-center'
          >
            {/* Icon */}
            <div
              className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${step.gradient} mb-6 shadow-2xl`}
              style={{ boxShadow: `0 20px 60px ${step.color}30` }}
            >
              <div className='text-white'>{step.icon}</div>
            </div>

            {/* Content */}
            <h2 className='text-3xl font-bold mb-2'>{step.title}</h2>
            <p className='text-sm text-gray-500 mb-4'>{step.titleEn}</p>
            <p className='text-gray-400 leading-relaxed mb-8 max-w-lg mx-auto'>
              {step.description}
            </p>

            {/* Tips */}
            <div className='bg-gray-800/50 rounded-xl p-5 mb-8 text-right'>
              <div className='space-y-3'>
                {step.tips.map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className='flex items-center gap-3'
                  >
                    <CheckCircle className='w-4 h-4 flex-shrink-0' style={{ color: step.color }} />
                    <span className='text-sm text-gray-300'>{tip}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className='flex items-center justify-between'>
              <button
                onClick={() => !isFirst && setCurrentStep(prev => prev - 1)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all ${
                  isFirst
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                disabled={isFirst}
              >
                <ArrowRight className='w-4 h-4' />
                السابق
              </button>

              <span className='text-sm text-gray-500'>
                {currentStep + 1} / {steps.length}
              </span>

              {isLast ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onComplete}
                  className='flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25'
                >
                  <Zap className='w-4 h-4' />
                  ابدأ الآن
                </motion.button>
              ) : (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className='flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors'
                >
                  التالي
                  <ArrowLeft className='w-4 h-4' />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Skip button */}
        <div className='text-center mt-4'>
          <button
            onClick={onComplete}
            className='text-sm text-gray-500 hover:text-gray-300 transition-colors'
          >
            تخطي الجولة
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingTour;
