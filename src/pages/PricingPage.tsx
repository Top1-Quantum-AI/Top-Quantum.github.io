import { motion } from 'framer-motion';
import { Atom, CheckCircle, Zap, ArrowLeft, Star, Shield, Brain, Headphones } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      planKey: 'free' as const,
      name: 'المجاني',
      nameEn: 'Free',
      price: annual ? 0 : 0,
      period: 'مجاناً للأبد',
      description: 'مثالي للتجربة والتعلم',
      color: '#6b7280',
      popular: false,
      features: [
        { text: 'محاكاة حتى 5 كيوبت', included: true },
        { text: '3 خوارزميات كمية', included: true },
        { text: 'لوحة تحكم أساسية', included: true },
        { text: '100 عملية محاكاة/شهر', included: true },
        { text: 'تحليلات AI أساسية', included: true },
        { text: 'دعم مجتمعي', included: true },
        { text: 'تصدير التقارير', included: false },
        { text: 'API access', included: false },
        { text: 'أمان ما بعد الكم', included: false },
        { text: 'دعم مخصص', included: false },
      ],
      cta: 'ابدأ مجاناً',
    },
    {
      name: 'الاحترافي',
      planKey: 'professional' as const,
      nameEn: 'Professional',
      price: annual ? 97 : 127,
      period: annual ? '/شهر (فاتورة سنوية)' : '/شهر',
      description: 'للمطورين والفرق الصغيرة',
      color: '#3b82f6',
      popular: true,
      features: [
        { text: 'محاكاة حتى 20 كيوبت', included: true },
        { text: 'جميع الخوارزميات الكمية (8+)', included: true },
        { text: 'لوحة تحكم متقدمة كاملة', included: true },
        { text: '10,000 عملية محاكاة/شهر', included: true },
        { text: 'تحليلات AI متقدمة (Llama 3.3)', included: true },
        { text: 'تصدير التقارير (PDF/CSV)', included: true },
        { text: 'REST API + مفاتيح API', included: true },
        { text: 'أمان ما بعد الكم كامل', included: true },
        { text: 'دعم بريد إلكتروني (24 ساعة)', included: true },
        { text: 'بناء دوائر مخصصة', included: true },
      ],
      cta: 'ابدأ التجربة المجانية',
    },
    {
      planKey: 'enterprise' as const,
      name: 'المؤسسات',
      nameEn: 'Enterprise',
      price: annual ? 497 : 647,
      period: annual ? '/شهر (فاتورة سنوية)' : '/شهر',
      description: 'للشركات الكبيرة والمؤسسات',
      color: '#8b5cf6',
      popular: false,
      features: [
        { text: 'كيوبتات غير محدودة', included: true },
        { text: 'خوارزميات مخصصة + SDK كامل', included: true },
        { text: 'لوحات تحكم مخصصة + White Label', included: true },
        { text: 'عمليات محاكاة غير محدودة', included: true },
        { text: 'AI مخصص + نماذج خاصة', included: true },
        { text: 'تقارير مخصصة + BI Integration', included: true },
        { text: 'API غير محدود + GraphQL + WebSocket', included: true },
        { text: 'HSM + تشفير مخصص + Audit Logs', included: true },
        { text: 'مدير حساب مخصص + SLA 99.99%', included: true },
        { text: 'تكامل IBM Quantum + AWS Braket', included: true },
      ],
      cta: 'تواصل مع المبيعات',
    },
  ];

  const comparisons = [
    {
      category: 'الحوسبة الكمية',
      icon: <Atom className='w-5 h-5 text-purple-400' />,
      items: [
        { feature: 'عدد الكيوبتات', free: '5', pro: '20', enterprise: 'غير محدود' },
        { feature: 'الخوارزميات المتاحة', free: '3', pro: '8+', enterprise: 'مخصصة' },
        { feature: 'عمليات المحاكاة/شهر', free: '100', pro: '10,000', enterprise: '∞' },
        { feature: 'دوائر مخصصة', free: '—', pro: '✓', enterprise: '✓' },
        { feature: 'تصور كرة بلوخ', free: '✓', pro: '✓', enterprise: '✓' },
      ],
    },
    {
      category: 'الذكاء الاصطناعي',
      icon: <Brain className='w-5 h-5 text-blue-400' />,
      items: [
        { feature: 'تحليل AI', free: 'أساسي', pro: 'متقدم', enterprise: 'مخصص' },
        { feature: 'نموذج LLM', free: '—', pro: 'Llama 3.3 70B', enterprise: 'مخصص' },
        { feature: 'استعلامات AI/شهر', free: '50', pro: '5,000', enterprise: '∞' },
      ],
    },
    {
      category: 'الأمان',
      icon: <Shield className='w-5 h-5 text-green-400' />,
      items: [
        { feature: 'تشفير ما بعد الكم', free: '—', pro: '✓', enterprise: '✓ + HSM' },
        { feature: 'كشف التهديدات', free: 'أساسي', pro: 'متقدم', enterprise: 'AI + Custom' },
        { feature: 'سجلات التدقيق', free: '—', pro: '30 يوم', enterprise: 'غير محدود' },
        { feature: 'MFA/SSO', free: '—', pro: 'MFA', enterprise: 'SSO + SAML' },
      ],
    },
    {
      category: 'الدعم والبنية التحتية',
      icon: <Headphones className='w-5 h-5 text-yellow-400' />,
      items: [
        { feature: 'الدعم', free: 'مجتمعي', pro: 'بريد 24h', enterprise: 'مدير مخصص' },
        { feature: 'SLA', free: '—', pro: '99.9%', enterprise: '99.99%' },
        { feature: 'API', free: '—', pro: 'REST', enterprise: 'REST+GraphQL+WS' },
        { feature: 'التكامل', free: '—', pro: 'Webhook', enterprise: 'Custom SDK' },
      ],
    },
  ];

  return (
    <div className='min-h-screen bg-gray-950 text-white'>
      {/* Navbar */}
      <nav className='px-6 py-4 border-b border-gray-800'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <button
            onClick={() => navigate('/')}
            className='flex items-center gap-3 hover:opacity-80 transition-opacity'
          >
            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center'>
              <Atom className='w-6 h-6 text-white' />
            </div>
            <span className='font-bold text-lg'>Top1 Quantum AI</span>
          </button>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => navigate('/login')}
              className='px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors'
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => navigate('/register')}
              className='px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-semibold'
            >
              ابدأ مجاناً
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className='py-20 text-center'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className='text-5xl font-bold mb-4'>
            خطط{' '}
            <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
              تناسب الجميع
            </span>
          </h1>
          <p className='text-gray-400 text-lg mb-8 max-w-xl mx-auto'>
            من المطورين المستقلين إلى المؤسسات الكبرى — اختر الخطة المناسبة لاحتياجاتك
          </p>
          <div className='inline-flex items-center bg-gray-800 rounded-full p-1'>
            <button
              onClick={() => setAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${annual ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              سنوي <span className='text-xs text-green-400 mr-1'>وفر 20%</span>
            </button>
            <button
              onClick={() => setAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!annual ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              شهري
            </button>
          </div>
        </motion.div>
      </section>

      {/* Plans */}
      <section className='max-w-7xl mx-auto px-6 pb-24'>
        <div className='grid md:grid-cols-3 gap-6'>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-2xl p-8 border transition-all ${
                plan.popular
                  ? 'bg-gray-800/80 border-blue-500/50 shadow-2xl shadow-blue-500/10 scale-105'
                  : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className='absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-xs font-bold flex items-center gap-1'>
                  <Star className='w-3 h-3 fill-white' /> الأكثر شعبية
                </div>
              )}
              <div className='mb-6'>
                <h3 className='text-xl font-bold'>{plan.name}</h3>
                <p className='text-xs text-gray-500'>{plan.nameEn}</p>
                <p className='text-sm text-gray-400 mt-1'>{plan.description}</p>
              </div>
              <div className='mb-6'>
                <span className='text-5xl font-bold' style={{ color: plan.color }}>
                  {plan.price === 0 ? 'مجاني' : `$${plan.price}`}
                </span>
                {plan.price > 0 && <span className='text-gray-400 text-sm'>{plan.period}</span>}
                {plan.price === 0 && <p className='text-sm text-gray-400 mt-1'>{plan.period}</p>}
              </div>
              <ul className='space-y-3 mb-8'>
                {plan.features.map((f, j) => (
                  <li
                    key={j}
                    className={`flex items-center gap-2 text-sm ${f.included ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    {f.included ? (
                      <CheckCircle className='w-4 h-4 text-green-400 flex-shrink-0' />
                    ) : (
                      <div className='w-4 h-4 rounded-full border border-gray-700 flex-shrink-0' />
                    )}
                    {f.text}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/register?plan=${plan.planKey}`)}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20'
                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className='max-w-5xl mx-auto px-6 pb-24'>
        <h2 className='text-3xl font-bold text-center mb-12'>مقارنة تفصيلية للخطط</h2>
        {comparisons.map((section, si) => (
          <div key={si} className='mb-8'>
            <div className='flex items-center gap-2 mb-4 py-2 px-4 bg-gray-800/50 rounded-lg'>
              {section.icon}
              <h3 className='font-semibold'>{section.category}</h3>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='text-gray-400'>
                    <th className='text-right py-2 px-4 font-medium w-1/4'>الميزة</th>
                    <th className='text-center py-2 px-4 font-medium'>المجاني</th>
                    <th className='text-center py-2 px-4 font-medium text-blue-400'>الاحترافي</th>
                    <th className='text-center py-2 px-4 font-medium text-purple-400'>المؤسسات</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, ii) => (
                    <tr key={ii} className='border-t border-gray-800'>
                      <td className='py-3 px-4 text-gray-300'>{item.feature}</td>
                      <td className='py-3 px-4 text-center text-gray-400'>{item.free}</td>
                      <td className='py-3 px-4 text-center'>{item.pro}</td>
                      <td className='py-3 px-4 text-center text-purple-300'>{item.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className='max-w-3xl mx-auto px-6 pb-24'>
        <h2 className='text-3xl font-bold text-center mb-12'>الأسئلة الشائعة</h2>
        {[
          {
            q: 'هل يمكنني التبديل بين الخطط؟',
            a: 'نعم، يمكنك الترقية أو التخفيض في أي وقت. سيتم احتساب الفرق تلقائياً.',
          },
          {
            q: 'هل تقدمون فترة تجربة مجانية؟',
            a: 'نعم، جميع الخطط المدفوعة تتضمن 14 يوم تجربة مجانية بدون بطاقة ائتمان.',
          },
          {
            q: 'ما هي طرق الدفع المقبولة؟',
            a: 'نقبل بطاقات الائتمان (Visa, Mastercard, Amex)، التحويل البنكي، وPayPal للخطط المؤسسية.',
          },
          {
            q: 'هل البيانات آمنة؟',
            a: 'نستخدم تشفير ما بعد الكم (Kyber-1024, CRYSTALS-Dilithium) مع تشفير AES-256 في السكون والنقل.',
          },
          {
            q: 'هل يمكنني استخدام المنصة مع أجهزة IBM Quantum الحقيقية؟',
            a: 'نعم، خطة المؤسسات تتضمن تكامل مباشر مع IBM Quantum وAWS Braket.',
          },
        ].map((faq, i) => (
          <details
            key={i}
            className='group bg-gray-900/50 border border-gray-800 rounded-xl mb-3 overflow-hidden'
          >
            <summary className='p-5 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors font-medium'>
              {faq.q}
              <Zap className='w-4 h-4 text-gray-500 group-open:rotate-45 transition-transform' />
            </summary>
            <p className='px-5 pb-5 text-gray-400 text-sm leading-relaxed'>{faq.a}</p>
          </details>
        ))}
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 border-t border-gray-800 py-8'>
        <div className='max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500'>
          <div className='flex items-center gap-2'>
            <Atom className='w-4 h-4' />
            <span>© 2026 Top1 Quantum AI. جميع الحقوق محفوظة.</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className='flex items-center gap-1 hover:text-white transition-colors mt-4 md:mt-0'
          >
            <ArrowLeft className='w-4 h-4' />
            العودة للرئيسية
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
