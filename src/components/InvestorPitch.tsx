import React, { useState } from 'react';
import {
  Atom,
  Brain,
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Zap,
  Globe,
  Award,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Layers,
  Lock,
  Cpu,
  Activity,
  Star,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
} from 'lucide-react';

// ==================== Data ====================

interface Slide {
  id: string;
  labelAr: string;
  labelEn: string;
}

const SLIDES: Slide[] = [
  { id: 'hero',        labelAr: 'الرؤية',        labelEn: 'Vision'       },
  { id: 'problem',     labelAr: 'المشكلة',       labelEn: 'Problem'      },
  { id: 'solution',    labelAr: 'الحل',          labelEn: 'Solution'     },
  { id: 'market',      labelAr: 'السوق',         labelEn: 'Market'       },
  { id: 'product',     labelAr: 'المنتج',        labelEn: 'Product'      },
  { id: 'business',    labelAr: 'النموذج التجاري', labelEn: 'Business'  },
  { id: 'traction',    labelAr: 'الإنجازات',     labelEn: 'Traction'     },
  { id: 'roadmap',     labelAr: 'خارطة الطريق',  labelEn: 'Roadmap'      },
  { id: 'team',        labelAr: 'الفريق',        labelEn: 'Team'         },
  { id: 'financials',  labelAr: 'الاستثمار',     labelEn: 'Investment'   },
];

// ==================== Slide helpers ====================

const SectionBadge: React.FC<{ text: string }> = ({ text }) => (
  <span className="inline-block bg-blue-900/60 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-700/50 mb-4">
    {text}
  </span>
);

const StatCard: React.FC<{ value: string; label: string; sub?: string; color?: string }> = ({
  value,
  label,
  sub,
  color = 'text-blue-400',
}) => (
  <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 text-center hover:border-blue-500/50 transition-colors">
    <div className={`text-4xl font-black mb-1 ${color}`}>{value}</div>
    <div className="text-white font-semibold text-sm">{label}</div>
    {sub && <div className="text-gray-400 text-xs mt-1">{sub}</div>}
  </div>
);

const FeaturePill: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5">
    <span className="text-blue-400">{icon}</span>
    <span className="text-gray-200 text-sm">{text}</span>
  </div>
);

const CheckItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start gap-3">
    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
    <span className="text-gray-300 text-sm leading-relaxed">{text}</span>
  </li>
);

// ==================== Individual Slides ====================

const HeroSlide: React.FC = () => (
  <div className="text-center max-w-4xl mx-auto py-8">
    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
      <Atom className="w-10 h-10 text-white" />
    </div>
    <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
      Top1 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Quantum AI</span>
    </h1>
    <p className="text-xl text-gray-300 mb-3 font-medium">
      منصة الحوسبة الكمية والذكاء الاصطناعي من الجيل القادم
    </p>
    <p className="text-base text-gray-400 mb-10 max-w-2xl mx-auto">
      Next-Generation Quantum Computing &amp; AI Platform
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      <StatCard value="127+" label="كيوبت نشط"        sub="Active Qubits"        color="text-blue-400"   />
      <StatCard value="99.1%" label="دقة البوابات"    sub="Gate Fidelity"        color="text-green-400"  />
      <StatCard value="$2.5T" label="حجم السوق"       sub="Market Size by 2030"  color="text-purple-400" />
      <StatCard value="10x"   label="الميزة الكمية"   sub="Quantum Speedup"      color="text-yellow-400" />
    </div>

    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/25">
      <Star className="w-5 h-5" />
      <span>فرصة استثمارية استراتيجية — Strategic Investment Opportunity</span>
    </div>
  </div>
);

const ProblemSlide: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <SectionBadge text="المشكلة — The Problem" />
    <h2 className="text-3xl font-bold text-white mb-8">
      الحوسبة الكلاسيكية وصلت إلى حدودها
    </h2>
    <p className="text-gray-400 mb-8 text-sm leading-relaxed">
      Classical computing has hit a wall. The world needs fundamentally different computing paradigms.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[
        {
          icon: <Cpu className="w-7 h-7" />,
          title: 'الحدود الحسابية',
          titleEn: "Moore's Law End",
          desc: 'انتهاء قانون مور — تباطؤ كبير في معالجة البيانات الضخمة والمسائل المعقدة',
          color: 'border-red-500/40 bg-red-900/10',
          iconColor: 'text-red-400',
        },
        {
          icon: <Lock className="w-7 h-7" />,
          title: 'ثغرات أمنية حرجة',
          titleEn: 'Broken Encryption',
          desc: 'أجهزة الكم ستكسر التشفير التقليدي RSA وAES — مخاطر كارثية على البنى التحتية الرقمية',
          color: 'border-orange-500/40 bg-orange-900/10',
          iconColor: 'text-orange-400',
        },
        {
          icon: <Brain className="w-7 h-7" />,
          title: 'قيود الذكاء الاصطناعي',
          titleEn: 'AI Bottleneck',
          desc: 'نماذج الذكاء الاصطناعي الحالية تستهلك طاقة هائلة مع نتائج محدودة في المسائل المعقدة',
          color: 'border-yellow-500/40 bg-yellow-900/10',
          iconColor: 'text-yellow-400',
        },
      ].map((item) => (
        <div key={item.title} className={`rounded-2xl p-6 border ${item.color}`}>
          <div className={`${item.iconColor} mb-4`}>{item.icon}</div>
          <h3 className="text-white font-bold mb-1">{item.title}</h3>
          <p className="text-gray-400 text-xs mb-2">{item.titleEn}</p>
          <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>

    <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-5">
      <p className="text-red-300 text-sm font-medium text-center">
        ⚠️ تقدّر شركة McKinsey أن حجم الخسائر من عدم اعتماد الحوسبة الكمية سيبلغ&nbsp;
        <strong>$1.3 تريليون سنوياً</strong> بحلول 2035
      </p>
    </div>
  </div>
);

const SolutionSlide: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <SectionBadge text="الحل — The Solution" />
    <h2 className="text-3xl font-bold text-white mb-3">منصة متكاملة تجمع الكم والذكاء الاصطناعي</h2>
    <p className="text-gray-400 mb-8 text-sm">A unified platform merging quantum computing with enterprise-grade AI</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {[
        {
          icon: <Atom className="w-8 h-8" />,
          title: 'محرك الكم الهجين',
          titleEn: 'Hybrid Quantum Engine',
          desc: 'تشغيل خوارزميات Shor وGrover وVQE و QAOA على معالجات كمية حقيقية ومحاكيات بدقة 99.1%',
          gradient: 'from-blue-500/20 to-blue-600/10',
          border: 'border-blue-500/40',
        },
        {
          icon: <Brain className="w-8 h-8" />,
          title: 'ذكاء اصطناعي كمي',
          titleEn: 'Quantum-Enhanced AI',
          desc: 'نماذج الذكاء الاصطناعي مدمجة مع دوائر كمية لتسريع التعلم الآلي بمعامل 10x-100x مقارنة بالحوسبة الكلاسيكية',
          gradient: 'from-purple-500/20 to-purple-600/10',
          border: 'border-purple-500/40',
        },
        {
          icon: <Shield className="w-8 h-8" />,
          title: 'أمان ما بعد الكم',
          titleEn: 'Post-Quantum Security',
          desc: 'تشفير PQC مع بروتوكول BB84 لتوزيع المفاتيح الكمية — محصّن ضد هجمات أجهزة الكم المستقبلية',
          gradient: 'from-green-500/20 to-green-600/10',
          border: 'border-green-500/40',
        },
        {
          icon: <Activity className="w-8 h-8" />,
          title: 'واجهة ويب متكاملة',
          titleEn: 'Full-Stack Web Platform',
          desc: 'لوحة تحكم React + TypeScript مع API RESTful، قابلة للنشر على السحابة أو on-premise',
          gradient: 'from-cyan-500/20 to-cyan-600/10',
          border: 'border-cyan-500/40',
        },
      ].map((item) => (
        <div
          key={item.title}
          className={`rounded-2xl p-6 border ${item.border} bg-gradient-to-br ${item.gradient}`}
        >
          <div className="text-blue-400 mb-4">{item.icon}</div>
          <h3 className="text-white font-bold mb-0.5">{item.title}</h3>
          <p className="text-gray-400 text-xs mb-3">{item.titleEn}</p>
          <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const MarketSlide: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <SectionBadge text="حجم السوق — Market Size" />
    <h2 className="text-3xl font-bold text-white mb-8">سوق عالمي بنمو متسارع</h2>

    <div className="grid grid-cols-3 gap-4 mb-8">
      <StatCard value="$2.5T"  label="TAM — السوق الإجمالي"    sub="قطاعات الكم والأمان والذكاء الاصطناعي 2030" color="text-blue-400"   />
      <StatCard value="$850B"  label="SAM — السوق المستهدف"    sub="الحوسبة السحابية الكمية والمؤسسات"        color="text-purple-400" />
      <StatCard value="$12B"   label="SOM — الحصة القابلة"     sub="الأسواق الأولى: الخليج وشمال أفريقيا"    color="text-green-400"  />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" /> القطاعات المستهدفة
        </h3>
        <ul className="space-y-3">
          {[
            'الحكومات والدفاع والأمن القومي',
            'القطاع المالي والبنوك المركزية',
            'الرعاية الصحية واكتشاف الأدوية',
            'الطاقة والشبكات الذكية',
            'التعليم والبحث العلمي',
          ].map((s) => (
            <CheckItem key={s} text={s} />
          ))}
        </ul>
      </div>

      <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" /> مؤشرات النمو
        </h3>
        <div className="space-y-4">
          {[
            { label: 'معدل نمو سوق الكم (CAGR)', value: '38%', color: 'bg-blue-500' },
            { label: 'نمو الذكاء الاصطناعي المؤسسي', value: '45%', color: 'bg-purple-500' },
            { label: 'نمو أمان ما بعد الكم', value: '52%', color: 'bg-green-500' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{item.label}</span>
                <span className="text-white font-bold">{item.value}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full`}
                  style={{ width: item.value }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ProductSlide: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <SectionBadge text="المنتج — Product" />
    <h2 className="text-3xl font-bold text-white mb-3">منصة موحدة — Unified Platform</h2>
    <p className="text-gray-400 mb-8 text-sm">كل ما تحتاجه المؤسسة في نظام واحد مترابط</p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {[
        { icon: <Atom className="w-5 h-5" />,    label: 'محاكي الكم' },
        { icon: <Brain className="w-5 h-5" />,   label: 'ذكاء اصطناعي' },
        { icon: <Shield className="w-5 h-5" />,  label: 'أمان كمي' },
        { icon: <BarChart3 className="w-5 h-5" />, label: 'تحليلات' },
        { icon: <Layers className="w-5 h-5" />,  label: 'واجهة API' },
        { icon: <Cpu className="w-5 h-5" />,     label: 'معالج هجين' },
        { icon: <Globe className="w-5 h-5" />,   label: 'سحابة / محلي' },
        { icon: <Activity className="w-5 h-5" />, label: 'مراقبة فورية' },
      ].map((f) => (
        <FeaturePill key={f.label} icon={f.icon} text={f.label} />
      ))}
    </div>

    <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl p-6 border border-blue-700/40">
      <h3 className="text-white font-bold mb-4">الميزات التقنية الرئيسية</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          '127 كيوبت فعلي مع خطأ أقل من 0.9%',
          'خوارزميات: Shor · Grover · VQE · QAOA · QFT',
          'تشفير PQC مقاوم للكم — معيار NIST 2024',
          'زمن تماسك 156 ميكروثانية',
          'API RESTful + WebSocket للوقت الفعلي',
          'نشر Docker / Kubernetes / On-Premise',
          'لوحة تحكم React 18 + TypeScript',
          'دعم العربية والإنجليزية بالكامل',
        ].map((f) => (
          <CheckItem key={f} text={f} />
        ))}
      </div>
    </div>
  </div>
);

const BusinessSlide: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <SectionBadge text="النموذج التجاري — Business Model" />
    <h2 className="text-3xl font-bold text-white mb-8">مصادر إيرادات متعددة ومستدامة</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {[
        {
          icon: <Layers className="w-7 h-7" />,
          tier: 'Enterprise SaaS',
          price: '$50K–$500K / سنة',
          desc: 'اشتراك سنوي للمؤسسات الكبرى مع SLA وتدريب ودعم مخصص',
          highlight: false,
        },
        {
          icon: <DollarSign className="w-7 h-7" />,
          tier: 'Government Contracts',
          price: '$1M–$10M / مشروع',
          desc: 'عقود حكومية لأمن المعلومات والدفاع والبنية التحتية الوطنية',
          highlight: true,
        },
        {
          icon: <Globe className="w-7 h-7" />,
          tier: 'API & Cloud',
          price: '$0.10 / استدعاء',
          desc: 'نموذج Pay-as-you-go للشركات الناشئة والمطورين عبر السحابة',
          highlight: false,
        },
      ].map((t) => (
        <div
          key={t.tier}
          className={`rounded-2xl p-6 border ${
            t.highlight
              ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/10'
              : 'border-gray-700 bg-gray-800/60'
          }`}
        >
          {t.highlight && (
            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full mb-3 inline-block">
              الأعلى إيراداً
            </span>
          )}
          <div className="text-blue-400 mb-3">{t.icon}</div>
          <h3 className="text-white font-bold mb-1">{t.tier}</h3>
          <p className="text-green-400 font-semibold text-sm mb-3">{t.price}</p>
          <p className="text-gray-400 text-sm leading-relaxed">{t.desc}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-3 gap-4">
      <StatCard value="82%"   label="هامش الربح الإجمالي" sub="Gross Margin"        color="text-green-400"  />
      <StatCard value="$45K"  label="متوسط العقد"          sub="Average Contract"    color="text-blue-400"   />
      <StatCard value="18mo"  label="العودة للربحية"        sub="Payback Period"      color="text-purple-400" />
    </div>
  </div>
);

const TractionSlide: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <SectionBadge text="الإنجازات والقوة الدافعة — Traction" />
    <h2 className="text-3xl font-bold text-white mb-8">أرقام تتحدث عن نفسها</h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard value="3"    label="عملاء مؤسسيين"    sub="Enterprise Clients"   color="text-blue-400"   />
      <StatCard value="$2M"  label="عقود مبرمة"        sub="Signed Contracts"     color="text-green-400"  />
      <StatCard value="12"   label="براءة اختراع"       sub="Patents Filed"        color="text-purple-400" />
      <StatCard value="98%"  label="رضا العملاء"        sub="Customer Satisfaction" color="text-yellow-400" />
    </div>

    <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
      <h3 className="text-white font-bold mb-5">أبرز الشراكات والشهادات</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          'شراكة استراتيجية مع مركز أبوظبي للذكاء الاصطناعي (ADAIC)',
          'شهادة ISO 27001 للأمن المعلوماتي',
          'مطابقة معايير NIST للتشفير ما بعد الكمي',
          'عضو مجلس الحوسبة الكمية الدولي (IQC)',
          'مدرجون في قائمة Gartner Hype Cycle للكم 2025',
          'جائزة أفضل شركة ناشئة تقنية في الخليج 2025',
        ].map((item) => (
          <CheckItem key={item} text={item} />
        ))}
      </div>
    </div>
  </div>
);

const RoadmapSlide: React.FC = () => {
  const phases = [
    {
      q: 'Q1–Q2 2025',
      title: 'المرحلة الأولى: التأسيس',
      titleEn: 'Phase 1 — Foundation',
      items: ['إطلاق MVP للمحاكي الكمي', 'أول 5 عملاء مؤسسيين', 'جولة Pre-Seed $500K'],
      color: 'border-green-500',
      badge: 'مكتمل',
      badgeColor: 'bg-green-500',
    },
    {
      q: 'Q3–Q4 2025',
      title: 'المرحلة الثانية: التوسع',
      titleEn: 'Phase 2 — Scale',
      items: ['وحدة الأمان الكمي PQC', 'دمج الذكاء الاصطناعي مع الدوائر الكمية', 'جولة Seed $3M'],
      color: 'border-blue-500',
      badge: 'جارٍ',
      badgeColor: 'bg-blue-500',
    },
    {
      q: 'Q1–Q2 2026',
      title: 'المرحلة الثالثة: السوق الخليجي',
      titleEn: 'Phase 3 — Gulf Expansion',
      items: ['توسع في السعودية والإمارات وقطر', '25 عميل حكومي', 'Series A $15M'],
      color: 'border-purple-500',
      badge: 'مخطط',
      badgeColor: 'bg-purple-500',
    },
    {
      q: 'Q3 2026+',
      title: 'المرحلة الرابعة: العالمية',
      titleEn: 'Phase 4 — Global',
      items: ['دخول أسواق أوروبا وآسيا', 'شراكة مع IBM Quantum وGoogle', 'Series B $50M+'],
      color: 'border-yellow-500',
      badge: 'مستهدف',
      badgeColor: 'bg-yellow-500',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <SectionBadge text="خارطة الطريق — Roadmap" />
      <h2 className="text-3xl font-bold text-white mb-8">مسار واضح نحو القيادة العالمية</h2>

      <div className="space-y-4">
        {phases.map((phase) => (
          <div
            key={phase.q}
            className={`bg-gray-800/60 rounded-2xl p-5 border-r-4 ${phase.color} border border-gray-700`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className={`text-xs text-white px-2 py-0.5 rounded-full ${phase.badgeColor} mr-2`}>
                  {phase.badge}
                </span>
                <span className="text-gray-400 text-xs">{phase.q}</span>
              </div>
            </div>
            <h3 className="text-white font-bold mb-0.5">{phase.title}</h3>
            <p className="text-gray-400 text-xs mb-3">{phase.titleEn}</p>
            <div className="flex flex-wrap gap-2">
              {phase.items.map((item) => (
                <span
                  key={item}
                  className="bg-gray-700/70 text-gray-300 text-xs px-3 py-1 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeamSlide: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <SectionBadge text="الفريق — Team" />
    <h2 className="text-3xl font-bold text-white mb-8">فريق من قادة الصناعة</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {[
        {
          name: 'د. أحمد الكمي',
          nameEn: 'Dr. Ahmed Al-Qumi',
          role: 'المدير التنفيذي — CEO',
          bg: 'from-blue-600 to-blue-800',
          xp: [
            '15+ سنة في الحوسبة الكمية',
            'دكتوراه فيزياء كمية — MIT',
            'سابقاً: IBM Research & Google Quantum',
          ],
        },
        {
          name: 'م. سارة النووي',
          nameEn: 'Eng. Sara Al-Nawawi',
          role: 'المديرة التقنية — CTO',
          bg: 'from-purple-600 to-purple-800',
          xp: [
            '12+ سنة في AI/ML',
            'ماجستير علوم حاسوب — Stanford',
            'سابقاً: Microsoft AI & OpenAI',
          ],
        },
        {
          name: 'أ. خالد الأمني',
          nameEn: 'Khalid Al-Amni',
          role: 'مدير الأمن — CSO',
          bg: 'from-green-600 to-green-800',
          xp: [
            '18+ سنة في الأمن السيبراني',
            'CISSP · CEH · CISM',
            'سابقاً: NSA & وزارة الدفاع',
          ],
        },
      ].map((member) => (
        <div key={member.name} className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 text-center">
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${member.bg} flex items-center justify-center`}
          >
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-bold">{member.name}</h3>
          <p className="text-gray-400 text-xs mb-1">{member.nameEn}</p>
          <p className="text-blue-400 text-xs font-medium mb-4">{member.role}</p>
          <ul className="space-y-1.5 text-right">
            {member.xp.map((x) => (
              <li key={x} className="text-gray-300 text-xs flex items-start gap-1.5">
                <ArrowRight className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700 text-center">
      <p className="text-gray-400 text-sm">
        فريق موسّع من <strong className="text-white">24 مهندساً ومتخصصاً</strong> — مع مستشارين من
        شركات IBM وGoogle وMicrosoft
      </p>
    </div>
  </div>
);

const FinancialsSlide: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <SectionBadge text="الاستثمار — Investment Ask" />
    <h2 className="text-3xl font-bold text-white mb-3">نبحث عن شريك استراتيجي</h2>
    <p className="text-gray-400 mb-8 text-sm">Seeking a strategic investment partner for Series A</p>

    {/* Investment Ask */}
    <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-8 border border-blue-700/50 mb-6 text-center">
      <p className="text-gray-400 text-sm mb-2">إجمالي الجولة — Total Round</p>
      <div className="text-6xl font-black text-white mb-2">$15M</div>
      <div className="text-blue-300 font-semibold">Series A — جولة السلسلة الأولى</div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <StatCard value="$45M"  label="التقييم قبل الاستثمار"  sub="Pre-Money Valuation" color="text-yellow-400" />
      <StatCard value="25%"   label="الحصة المعروضة"         sub="Equity Offered"      color="text-green-400"  />
    </div>

    {/* Use of funds */}
    <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-400" /> توزيع الاستثمار — Use of Funds
      </h3>
      <div className="space-y-3">
        {[
          { label: 'البنية التحتية والأجهزة الكمية', pct: 35, color: 'bg-blue-500' },
          { label: 'البحث والتطوير (R&D)',             pct: 30, color: 'bg-purple-500' },
          { label: 'التوسع في الأسواق والمبيعات',      pct: 20, color: 'bg-green-500' },
          { label: 'الفريق والموارد البشرية',           pct: 15, color: 'bg-yellow-500' },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">{item.label}</span>
              <span className="text-white font-bold">{item.pct}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className={`${item.color} h-2.5 rounded-full`}
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Projections */}
    <div className="grid grid-cols-3 gap-4 mt-6">
      <StatCard value="$8M"   label="إيرادات 2025"   sub="Revenue Target" color="text-blue-400"   />
      <StatCard value="$35M"  label="إيرادات 2026"   sub="Revenue Target" color="text-purple-400" />
      <StatCard value="$120M" label="إيرادات 2027"   sub="Revenue Target" color="text-green-400"  />
    </div>

    {/* CTA */}
    <div className="mt-8 bg-gray-800/60 rounded-2xl p-6 border border-gray-700 text-center">
      <h3 className="text-white font-bold text-lg mb-4">للتواصل والاستفسار — Contact Us</h3>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="flex items-center gap-2 text-gray-300">
          <Mail className="w-4 h-4 text-blue-400" />
          <span className="text-sm">invest@top1quantum.ai</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Phone className="w-4 h-4 text-blue-400" />
          <span className="text-sm" dir="ltr">+966 50 000 0000</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Globe className="w-4 h-4 text-blue-400" />
          <span className="text-sm">www.top1quantum.ai</span>
        </div>
      </div>
      <p className="text-gray-500 text-xs mt-4">
        الرياض · أبوظبي · الدوحة | Riyadh · Abu Dhabi · Doha
      </p>
    </div>
  </div>
);

// ==================== Slide Map ====================

const SLIDE_COMPONENTS: Record<string, React.FC> = {
  hero:       HeroSlide,
  problem:    ProblemSlide,
  solution:   SolutionSlide,
  market:     MarketSlide,
  product:    ProductSlide,
  business:   BusinessSlide,
  traction:   TractionSlide,
  roadmap:    RoadmapSlide,
  team:       TeamSlide,
  financials: FinancialsSlide,
};

// ==================== FAQ ====================

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'ما الذي يميزكم عن المنافسين؟',
    a: 'نحن الوحيدون الذين يجمعون بين الحوسبة الكمية الهجينة والذكاء الاصطناعي التوليدي وأمان ما بعد الكم في منصة عربية واحدة مع دعم كامل للغة العربية وفهم لمتطلبات المنطقة.',
  },
  {
    q: 'ما الحد الأدنى لقيمة الاستثمار؟',
    a: 'الحد الأدنى للمشاركة في جولة Series A هو $500,000 مع خيار مقعد في مجلس الإدارة للمستثمرين فوق $2M.',
  },
  {
    q: 'هل التكنولوجيا جاهزة للسوق؟',
    a: 'نعم، المنصة في مرحلة الإنتاج الفعلي مع 3 عملاء مؤسسيين نشطين وعقود موقّعة بقيمة $2M.',
  },
  {
    q: 'ما هي استراتيجية الخروج للمستثمرين؟',
    a: 'الخيارات المتاحة: طرح عام أولي (IPO) في سوق Nasdaq بحلول 2029، أو استحواذ استراتيجي من IBM / Google / Microsoft Quantum.',
  },
];

const FAQSection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">أسئلة شائعة — FAQ</h2>
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => (
          <div key={idx} className="bg-gray-800/60 rounded-xl border border-gray-700">
            <button
              className="w-full text-right flex items-center justify-between p-5"
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
            >
              <span className="text-white font-medium text-sm">{item.q}</span>
              {open === idx ? (
                <ChevronUp className="w-4 h-4 text-blue-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
            </button>
            {open === idx && (
              <div className="px-5 pb-5">
                <p className="text-gray-300 text-sm leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== Main Component ====================

const InvestorPitch: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState('hero');

  const ActiveSlideComponent = SLIDE_COMPONENTS[activeSlide] ?? HeroSlide;
  const currentIdx = SLIDES.findIndex((s) => s.id === activeSlide);

  const goNext = () => {
    if (currentIdx < SLIDES.length - 1) {
      setActiveSlide(SLIDES[currentIdx + 1]!.id);
    }
  };
  const goPrev = () => {
    if (currentIdx > 0) {
      setActiveSlide(SLIDES[currentIdx - 1]!.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Atom className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-sm">Top1 Quantum AI</span>
              <span className="text-gray-500 text-xs block">ملف الاستثمار — Investor Deck</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            <span>Series A 2025</span>
          </div>
        </div>
      </header>

      {/* Nav tabs */}
      <nav className="bg-gray-800/50 border-b border-gray-800 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex min-w-max px-4">
          {SLIDES.map((slide) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(slide.id)}
              className={`px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeSlide === slide.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {slide.labelAr}
            </button>
          ))}
        </div>
      </nav>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800">
        <div
          className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
          style={{ width: `${((currentIdx + 1) / SLIDES.length) * 100}%` }}
        />
      </div>

      {/* Slide content */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <ActiveSlideComponent />

        {/* FAQ on last slide */}
        {activeSlide === 'financials' && <FAQSection />}
      </main>

      {/* Navigation arrows + page counter */}
      <div className="sticky bottom-0 bg-gray-900/95 border-t border-gray-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm transition-colors"
            aria-label="الشريحة السابقة"
          >
            <Zap className="w-3.5 h-3.5 rotate-180" />
            السابق
          </button>

          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(SLIDES[i]!.id)}
                className={`rounded-full transition-all ${
                  i === currentIdx ? 'w-4 h-2 bg-blue-500' : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`الانتقال للشريحة ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={currentIdx === SLIDES.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm transition-colors"
            aria-label="الشريحة التالية"
          >
            التالي
            <Zap className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestorPitch;
