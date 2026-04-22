import { motion } from 'framer-motion';
import {
  Atom,
  Brain,
  Shield,
  Zap,
  Globe,
  BarChart3,
  Lock,
  Cpu,
  ArrowLeft,
  Star,
  CheckCircle,
  Play,
  ChevronDown,
  Building2,
  Users,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Stats Counter ─────────────────────────────────────────

const AnimatedCounter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({
  end,
  suffix = '',
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// ─── Particle Background ───────────────────────────────────

const ParticleField: React.FC = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className='absolute rounded-full bg-blue-400/20'
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ─── LANDING PAGE ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Atom className='w-8 h-8' />,
      title: 'محاكاة كمية حقيقية',
      titleEn: 'Real Quantum Simulation',
      description:
        'محاكي كمي متقدم بتقنية State-Vector يدعم 8+ خوارزميات كمية حقيقية مع تصور كرة بلوخ وخرائط التشابك',
      color: '#8b5cf6',
      stats: '20 كيوبت',
    },
    {
      icon: <Brain className='w-8 h-8' />,
      title: 'ذكاء اصطناعي متقدم',
      titleEn: 'Advanced AI Engine',
      description:
        'تكامل مع نماذج LLM المتقدمة (Llama 3.3 70B) لتحليل البيانات والتنبؤات الذكية والإجابة على الاستفسارات',
      color: '#3b82f6',
      stats: '96.8% دقة',
    },
    {
      icon: <Shield className='w-8 h-8' />,
      title: 'أمان ما بعد الكم',
      titleEn: 'Post-Quantum Security',
      description:
        'تشفير مقاوم للحوسبة الكمية باستخدام Kyber-1024 و CRYSTALS-Dilithium و SPHINCS+ لحماية بياناتك',
      color: '#10b981',
      stats: '99.9% حماية',
    },
    {
      icon: <BarChart3 className='w-8 h-8' />,
      title: 'تحليلات في الوقت الحقيقي',
      titleEn: 'Real-Time Analytics',
      description:
        'محرك تحليلات متقدم مع كشف الشذوذات والتنبؤات والرسوم البيانية الحية مع أكثر من 200 نقطة بيانات',
      color: '#f59e0b',
      stats: '< 2ms استجابة',
    },
    {
      icon: <Globe className='w-8 h-8' />,
      title: 'شبكة موزعة',
      titleEn: 'Distributed Network',
      description:
        'بنية تحتية موزعة مع 8 عقد متخصصة تشمل معالجات كمية ومجموعات AI وعقد أمان وبوابات',
      color: '#ec4899',
      stats: '8 عقد',
    },
    {
      icon: <Layers className='w-8 h-8' />,
      title: 'API للمطورين',
      titleEn: 'Developer API',
      description:
        'واجهة برمجية RESTful شاملة مع مصادقة JWT ومعدل تحديد متعدد المستويات ودعم WebSocket',
      color: '#06b6d4',
      stats: 'REST + WS',
    },
  ];

  const testimonials = [
    {
      name: 'د. أحمد النعيمي',
      role: 'CTO - Quantum Dynamics Inc.',
      text: 'النظام الكمي الأكثر تقدماً الذي رأيته. سهل التكامل مع بنيتنا التحتية.',
      rating: 5,
    },
    {
      name: 'Sarah Mitchell',
      role: 'VP Engineering - TechVault',
      text: 'Quantum security features are exceptional. Post-quantum cryptography out of the box.',
      rating: 5,
    },
    {
      name: 'م. فاطمة الزهراء',
      role: 'Lead Quantum Researcher',
      text: 'المحاكي الكمي يقدم نتائج دقيقة ومقاربة جداً للواقع. أداة بحثية ممتازة.',
      rating: 5,
    },
  ];

  const partners = [
    'Quantum Research Lab',
    'AI Solutions Corp',
    'CyberShield Pro',
    'DataFlow Systems',
    'NeuralTech',
    'SecureGrid Networks',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className='min-h-screen bg-gray-950 text-white overflow-x-hidden'>
      {/* ─── Hero Section ─────────────────────────────────── */}
      <section className='relative min-h-screen flex items-center'>
        <ParticleField />
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-gray-950' />

        {/* Navbar */}
        <nav className='absolute top-0 left-0 right-0 z-50 px-6 py-4'>
          <div className='max-w-7xl mx-auto flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30'>
                <Atom className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='font-bold text-lg'>Top1 Quantum AI</h1>
                <p className='text-xs text-gray-400'>Enterprise Platform</p>
              </div>
            </div>
            <div className='hidden md:flex items-center gap-8 text-sm text-gray-300'>
              <a href='#features' className='hover:text-white transition-colors'>
                الميزات
              </a>
              <a href='#stats' className='hover:text-white transition-colors'>
                الإحصائيات
              </a>
              <a href='#testimonials' className='hover:text-white transition-colors'>
                الآراء
              </a>
              <button
                onClick={() => navigate('/pricing')}
                className='hover:text-white transition-colors'
              >
                الأسعار
              </button>
            </div>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => navigate('/login')}
                className='px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors'
              >
                تسجيل الدخول
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className='px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/25'
              >
                ابدأ مجاناً
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className='relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className='inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-300 mb-6'>
                  <Zap className='w-4 h-4' />
                  الجيل القادم من الحوسبة الكمية
                </div>
                <h1 className='text-5xl md:text-6xl font-bold leading-tight mb-6'>
                  <span className='bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
                    النظام الكمي
                  </span>
                  <br />
                  الأكثر تقدماً
                  <br />
                  <span className='text-gray-400 text-3xl md:text-4xl'>للمؤسسات والشركات</span>
                </h1>
                <p className='text-lg text-gray-400 leading-relaxed mb-8 max-w-lg'>
                  دمج الحوسبة الكمية مع الذكاء الاصطناعي وأمان ما بعد الكم في منصة واحدة متكاملة.
                  صُمم لتلبية احتياجات المؤسسات الكبرى.
                </p>
                <div className='flex flex-wrap gap-4'>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/register')}
                    className='px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-lg shadow-2xl shadow-blue-500/30 flex items-center gap-2'
                  >
                    ابدأ الآن مجاناً
                    <ArrowLeft className='w-5 h-5' />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/demo')}
                    className='px-8 py-3.5 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 rounded-xl font-semibold text-lg flex items-center gap-2'
                  >
                    <Play className='w-5 h-5' />
                    عرض تجريبي
                  </motion.button>
                </div>
                <div className='flex items-center gap-6 mt-8 text-sm text-gray-400'>
                  <div className='flex items-center gap-1'>
                    <CheckCircle className='w-4 h-4 text-green-400' /> بدون بطاقة ائتمان
                  </div>
                  <div className='flex items-center gap-1'>
                    <CheckCircle className='w-4 h-4 text-green-400' /> 14 يوم تجربة
                  </div>
                  <div className='flex items-center gap-1'>
                    <CheckCircle className='w-4 h-4 text-green-400' /> إلغاء أي وقت
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Animated Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className='hidden lg:block'
            >
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-3xl' />
                <div className='relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-2xl'>
                  {/* Mini Dashboard Preview */}
                  <div className='flex items-center gap-2 mb-4'>
                    <div className='w-3 h-3 rounded-full bg-red-500' />
                    <div className='w-3 h-3 rounded-full bg-yellow-500' />
                    <div className='w-3 h-3 rounded-full bg-green-500' />
                    <span className='text-xs text-gray-500 mr-2'>Top1 Quantum AI Dashboard</span>
                  </div>
                  <div className='grid grid-cols-3 gap-3 mb-4'>
                    {[
                      { label: 'CPU', value: '42%', color: '#3b82f6' },
                      { label: 'كمي', value: '87%', color: '#8b5cf6' },
                      { label: 'أمان', value: '99.2%', color: '#10b981' },
                    ].map((m, i) => (
                      <div key={i} className='bg-gray-800/80 rounded-lg p-3 text-center'>
                        <div className='text-xs text-gray-400'>{m.label}</div>
                        <div className='text-lg font-bold' style={{ color: m.color }}>
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='h-24 bg-gray-800/50 rounded-lg p-3 mb-3'>
                    <div className='text-xs text-gray-400 mb-2'>الإنتاجية الحية</div>
                    <svg viewBox='0 0 300 60' className='w-full h-12'>
                      <path
                        d='M0,40 Q30,10 60,35 T120,20 T180,30 T240,15 T300,25'
                        fill='none'
                        stroke='#3b82f6'
                        strokeWidth='2'
                      />
                      <path
                        d='M0,40 Q30,10 60,35 T120,20 T180,30 T240,15 T300,25 L300,60 L0,60 Z'
                        fill='url(#grad)'
                        opacity='0.2'
                      />
                      <defs>
                        <linearGradient id='grad' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='0%' stopColor='#3b82f6' />
                          <stop offset='100%' stopColor='transparent' />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='bg-gray-800/50 rounded-lg p-3'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Atom className='w-4 h-4 text-purple-400' />
                        <span className='text-xs text-gray-400'>كيوبتات نشطة</span>
                      </div>
                      <div className='text-xl font-bold text-purple-300'>127</div>
                    </div>
                    <div className='bg-gray-800/50 rounded-lg p-3'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Shield className='w-4 h-4 text-green-400' />
                        <span className='text-xs text-gray-400'>تهديدات محجوبة</span>
                      </div>
                      <div className='text-xl font-bold text-green-300'>1,247</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className='absolute bottom-8 left-1/2 -translate-x-1/2'
          >
            <ChevronDown className='w-6 h-6 text-gray-500' />
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Section ────────────────────────────────── */}
      <section id='stats' className='py-20 bg-gray-900/50 border-y border-gray-800'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {[
              {
                value: 127,
                suffix: '+',
                label: 'كيوبت مدعوم',
                icon: <Atom className='w-6 h-6 text-purple-400' />,
              },
              {
                value: 99,
                suffix: '.9%',
                label: 'وقت التشغيل',
                icon: <TrendingUp className='w-6 h-6 text-green-400' />,
              },
              {
                value: 500,
                suffix: '+',
                label: 'شركة مستفيدة',
                icon: <Building2 className='w-6 h-6 text-blue-400' />,
              },
              {
                value: 50,
                suffix: 'M+',
                label: 'عملية كمية/شهر',
                icon: <Zap className='w-6 h-6 text-yellow-400' />,
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className='text-center'
              >
                <div className='flex justify-center mb-3'>{stat.icon}</div>
                <div className='text-4xl font-bold mb-1'>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className='text-gray-400 text-sm'>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Section ─────────────────────────────── */}
      <section id='features' className='py-24'>
        <div className='max-w-7xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl font-bold mb-4'>
              لماذا{' '}
              <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                Top1 Quantum AI
              </span>
              ؟
            </h2>
            <p className='text-gray-400 text-lg max-w-2xl mx-auto'>
              منصة شاملة تجمع بين أحدث تقنيات الحوسبة الكمية والذكاء الاصطناعي والأمان المتقدم
            </p>
          </motion.div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onHoverStart={() => setActiveFeature(i)}
                className={`group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${
                  activeFeature === i
                    ? 'border-gray-500 shadow-lg'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
                style={activeFeature === i ? { boxShadow: `0 0 40px ${feature.color}15` } : {}}
              >
                <div
                  className='p-3 rounded-xl w-fit mb-4'
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <div style={{ color: feature.color }}>{feature.icon}</div>
                </div>
                <h3 className='text-xl font-bold mb-1'>{feature.title}</h3>
                <p className='text-xs text-gray-500 mb-3'>{feature.titleEn}</p>
                <p className='text-gray-400 text-sm leading-relaxed mb-4'>{feature.description}</p>
                <div className='flex items-center justify-between'>
                  <span
                    className='text-xs font-medium px-3 py-1 rounded-full border'
                    style={{ borderColor: `${feature.color}40`, color: feature.color }}
                  >
                    {feature.stats}
                  </span>
                  <ArrowLeft className='w-4 h-4 text-gray-600 group-hover:text-gray-300 transition-colors' />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Use Cases ────────────────────────────────────── */}
      <section className='py-24 bg-gray-900/30'>
        <div className='max-w-7xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl font-bold mb-4'>حالات الاستخدام</h2>
            <p className='text-gray-400 text-lg'>مصمم لتلبية احتياجات مختلف القطاعات</p>
          </motion.div>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              {
                icon: <Building2 className='w-8 h-8' />,
                title: 'البنوك والتمويل',
                desc: 'تشفير كمي للمعاملات المالية وتحليل المخاطر بالذكاء الاصطناعي',
                color: '#3b82f6',
              },
              {
                icon: <Lock className='w-8 h-8' />,
                title: 'الدفاع والأمن',
                desc: 'حماية البيانات الحساسة بتشفير ما بعد الكم مع كشف التهديدات',
                color: '#10b981',
              },
              {
                icon: <Cpu className='w-8 h-8' />,
                title: 'البحث العلمي',
                desc: 'محاكاة الجزيئات والمواد باستخدام الحوسبة الكمية',
                color: '#8b5cf6',
              },
              {
                icon: <Users className='w-8 h-8' />,
                title: 'الرعاية الصحية',
                desc: 'اكتشاف الأدوية وتحليل الجينوم بتقنيات كمية هجينة',
                color: '#ec4899',
              },
            ].map((useCase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className='bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-all'
              >
                <div
                  className='p-3 rounded-lg w-fit mb-4'
                  style={{ backgroundColor: `${useCase.color}15` }}
                >
                  <div style={{ color: useCase.color }}>{useCase.icon}</div>
                </div>
                <h3 className='font-bold text-lg mb-2'>{useCase.title}</h3>
                <p className='text-sm text-gray-400 leading-relaxed'>{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────── */}
      <section id='testimonials' className='py-24'>
        <div className='max-w-7xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl font-bold mb-4'>ماذا يقول عملاؤنا</h2>
            <p className='text-gray-400 text-lg'>آراء المؤسسات والشركات التي تستخدم منصتنا</p>
          </motion.div>
          <div className='grid md:grid-cols-3 gap-6'>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className='bg-gray-900/50 rounded-2xl p-6 border border-gray-800'
              >
                <div className='flex gap-1 mb-4'>
                  {Array.from({ length: t.rating }, (_, j) => (
                    <Star key={j} className='w-4 h-4 text-yellow-400 fill-yellow-400' />
                  ))}
                </div>
                <p className='text-gray-300 leading-relaxed mb-6 text-sm'>"{t.text}"</p>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold'>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className='font-semibold text-sm'>{t.name}</div>
                    <div className='text-xs text-gray-400'>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Partners ─────────────────────────────────────── */}
      <section className='py-16 bg-gray-900/30 border-y border-gray-800'>
        <div className='max-w-7xl mx-auto px-6'>
          <p className='text-center text-gray-500 text-sm mb-8'>يثق بنا قادة الصناعة</p>
          <div className='flex flex-wrap justify-center gap-8'>
            {partners.map((partner, i) => (
              <div
                key={i}
                className='flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors'
              >
                <Award className='w-5 h-5' />
                <span className='text-sm font-medium'>{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────────────── */}
      <section className='py-24'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              جاهز للبدء مع
              <br />
              <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                الحوسبة الكمية
              </span>
              ؟
            </h2>
            <p className='text-lg text-gray-400 mb-8 max-w-2xl mx-auto'>
              انضم إلى أكثر من 500 شركة تستخدم Top1 Quantum AI لتسريع الابتكار وحماية بياناتها
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className='px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-lg shadow-2xl shadow-blue-500/30'
              >
                ابدأ مجاناً — 14 يوم تجربة
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/pricing')}
                className='px-10 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl font-bold text-lg'
              >
                عرض الأسعار
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────── */}
      <footer className='bg-gray-900 border-t border-gray-800 py-12'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid md:grid-cols-4 gap-8 mb-8'>
            <div>
              <div className='flex items-center gap-2 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                  <Atom className='w-5 h-5 text-white' />
                </div>
                <span className='font-bold'>Top1 Quantum AI</span>
              </div>
              <p className='text-sm text-gray-400 leading-relaxed'>
                منصة الحوسبة الكمية والذكاء الاصطناعي الأكثر تقدماً للمؤسسات.
              </p>
            </div>
            <div>
              <h4 className='font-semibold mb-4 text-sm'>المنتج</h4>
              <ul className='space-y-2 text-sm text-gray-400'>
                <li>
                  <a href='#features' className='hover:text-white transition-colors'>
                    الميزات
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/pricing')}
                    className='hover:text-white transition-colors'
                  >
                    الأسعار
                  </button>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    التوثيق
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4 text-sm'>الشركة</h4>
              <ul className='space-y-2 text-sm text-gray-400'>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    عن الشركة
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    المدونة
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    الوظائف
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    تواصل معنا
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4 text-sm'>قانوني</h4>
              <ul className='space-y-2 text-sm text-gray-400'>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    سياسة الخصوصية
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    شروط الاستخدام
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    SLA
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white transition-colors'>
                    الامتثال
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500'>
            <p>© 2026 Top1 Quantum AI. جميع الحقوق محفوظة.</p>
            <p>صُنع بـ ❤️ للمستقبل الكمي</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
