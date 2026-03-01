import React, { useState, useEffect, useCallback } from 'react';
import { Atom, Shield, Brain, Activity, CheckCircle, Zap, BarChart3, Lock, Cpu, Network } from 'lucide-react';
import { aiService } from '../aiService';
import { AI_PERSONALITIES } from '../config';

// ==================== واجهات البيانات ====================

interface DemoMetric {
  label: string;
  value: number;
  unit: string;
  color: string;
}

interface SystemFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'active' | 'standby' | 'processing';
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ==================== مكون بطاقة المقياس ====================

const MetricCard: React.FC<{ metric: DemoMetric }> = ({ metric }) => (
  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex flex-col gap-2">
    <span className="text-gray-400 text-sm">{metric.label}</span>
    <div className="flex items-end gap-1">
      <span className={`text-3xl font-bold ${metric.color}`}>{metric.value}</span>
      <span className="text-gray-400 text-sm mb-1">{metric.unit}</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all duration-1000 ${metric.color.replace('text-', 'bg-')}`}
        style={{ width: `${Math.min(metric.value, 100)}%` }}
      />
    </div>
  </div>
);

// ==================== مكون بطاقة الميزة ====================

const FeatureCard: React.FC<{ feature: SystemFeature }> = ({ feature }) => {
  const statusColors: Record<SystemFeature['status'], string> = {
    active: 'bg-green-500',
    standby: 'bg-yellow-500',
    processing: 'bg-blue-500 animate-pulse',
  };
  const statusLabels: Record<SystemFeature['status'], string> = {
    active: 'نشط',
    standby: 'انتظار',
    processing: 'يعمل',
  };

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-blue-500 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="text-blue-400">{feature.icon}</div>
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className={`w-2 h-2 rounded-full ${statusColors[feature.status]}`} />
          {statusLabels[feature.status]}
        </span>
      </div>
      <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
      <p className="text-gray-400 text-sm">{feature.description}</p>
    </div>
  );
};

// ==================== المكون الرئيسي للعرض الشامل ====================

const QuantumSystemDemo: React.FC = () => {
  const [metrics, setMetrics] = useState<DemoMetric[]>([
    { label: 'الكيوبتات النشطة', value: 0, unit: 'qubit', color: 'text-blue-400' },
    { label: 'دقة البوابات', value: 0, unit: '%', color: 'text-green-400' },
    { label: 'زمن التماسك', value: 0, unit: 'μs', color: 'text-purple-400' },
    { label: 'معدل الخطأ', value: 0, unit: '%', color: 'text-yellow-400' },
  ]);

  const [features] = useState<SystemFeature[]>([
    {
      icon: <Atom className="w-6 h-6" />,
      title: 'الحوسبة الكمية',
      description: 'تشغيل خوارزميات Shor وGrover وVQE باستخدام محاكاة كمية متقدمة.',
      status: 'active',
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'الذكاء الاصطناعي التوليدي',
      description: 'دمج GPT مع أنظمة كمية لتحليل البيانات وتوليد الاستجابات الذكية.',
      status: 'active',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'الأمان الكمي',
      description: 'تشفير ما بعد الكم (PQC) مع بروتوكولات BB84 لتوزيع المفاتيح.',
      status: 'active',
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: 'المراقبة في الوقت الفعلي',
      description: 'رصد أداء النظام والكشف عن الشذوذات باستخدام تحليل طيفي.',
      status: 'processing',
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: 'الشبكة الكمية',
      description: 'توصيل العقد الكمية عبر بروتوكول التشابك الكمي الموزع.',
      status: 'standby',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'إدارة المفاتيح',
      description: 'توليد وتوزيع المفاتيح الكمية بأمان تام مقاوم للحواسيب الكمية.',
      status: 'active',
    },
  ]);

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activePersonality, setActivePersonality] = useState<keyof typeof AI_PERSONALITIES>('friendly');
  const [activeTab, setActiveTab] = useState<'overview' | 'quantum' | 'ai' | 'security'>('overview');

  // تحديث المقاييس بشكل دوري
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics([
        { label: 'الكيوبتات النشطة', value: 127, unit: 'qubit', color: 'text-blue-400' },
        { label: 'دقة البوابات', value: 99.1, unit: '%', color: 'text-green-400' },
        { label: 'زمن التماسك', value: 156, unit: 'μs', color: 'text-purple-400' },
        { label: 'معدل الخطأ', value: 0.9, unit: '%', color: 'text-yellow-400' },
      ]);
    };

    const timer = setTimeout(updateMetrics, 800);
    return () => clearTimeout(timer);
  }, []);

  // إرسال رسالة إلى الذكاء الاصطناعي
  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const result = await aiService.sendMessage(userMsg.content, activePersonality);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatInput, isChatLoading, activePersonality]);

  // ==================== واجهة تبويب النظرة العامة ====================

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* مقاييس الأداء */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          مقاييس الأداء الكمي
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </section>

      {/* ميزات النظام */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          مكونات النظام
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>
    </div>
  );

  // ==================== واجهة تبويب الكم ====================

  const QuantumTab = () => {
    const algorithms = [
      { name: "خوارزمية Shor", use: "تحليل الأعداد الأولية", complexity: "O(log³ N)", status: "جاهز" },
      { name: "خوارزمية Grover", use: "البحث الكمي", complexity: "O(√N)", status: "جاهز" },
      { name: "VQE", use: "محاكاة الجزيئات", complexity: "متغير", status: "نشط" },
      { name: "QAOA", use: "تحسين التوافق", complexity: "O(p·m)", status: "جاهز" },
      { name: "QFT", use: "التحويل فورييه الكمي", complexity: "O(n²)", status: "نشط" },
    ];

    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Atom className="w-5 h-5 text-blue-400" />
            الخوارزميات الكمية المدعومة
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-right py-2 pr-4">الخوارزمية</th>
                  <th className="text-right py-2">الاستخدام</th>
                  <th className="text-right py-2">التعقيد</th>
                  <th className="text-right py-2 pl-4">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {algorithms.map((alg) => (
                  <tr key={alg.name} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 pr-4 text-blue-400 font-medium">{alg.name}</td>
                    <td className="py-3 text-gray-300">{alg.use}</td>
                    <td className="py-3 text-purple-400 font-mono text-xs">{alg.complexity}</td>
                    <td className="py-3 pl-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        alg.status === 'نشط'
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-blue-900/50 text-blue-400'
                      }`}>
                        {alg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'بوابات الكيوبت الأحادية', value: '45', icon: <Zap className="w-4 h-4" /> },
            { label: 'بوابات الكيوبتين', value: '12', icon: <Activity className="w-4 h-4" /> },
            { label: 'عمق الدائرة', value: '28', icon: <BarChart3 className="w-4 h-4" /> },
          ].map((item) => (
            <div key={item.label} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-blue-400 mb-2">{item.icon}<span className="text-sm text-gray-400">{item.label}</span></div>
              <span className="text-3xl font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==================== واجهة تبويب الذكاء الاصطناعي ====================

  const AITab = () => (
    <div className="space-y-4">
      {/* اختيار الشخصية */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="text-white font-semibold mb-3">شخصية المساعد</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(AI_PERSONALITIES) as Array<keyof typeof AI_PERSONALITIES>).map((key) => (
            <button
              key={key}
              onClick={() => setActivePersonality(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePersonality === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {AI_PERSONALITIES[key].name}
            </button>
          ))}
        </div>
      </div>

      {/* نافذة المحادثة */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col" style={{ height: '420px' }}>
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-400" />
            محادثة مع الذكاء الاصطناعي
          </h3>
        </div>

        {/* الرسائل */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">ابدأ محادثة مع الذكاء الاصطناعي الكمي</p>
            </div>
          )}
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md rounded-xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-200'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 rounded-xl px-4 py-2.5">
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* حقل الإدخال */}
        <div className="p-4 border-t border-gray-700 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
            disabled={isChatLoading}
            dir="rtl"
          />
          <button
            onClick={handleSendMessage}
            disabled={isChatLoading || !chatInput.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            إرسال
          </button>
        </div>
      </div>

      {/* إحصائيات الاستخدام */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="text-gray-400 text-sm mb-3">إحصائيات المحادثة</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          {(() => {
            const stats = aiService.getUsageStats();
            return [
              { label: 'إجمالي الرسائل', value: stats.totalMessages },
              { label: 'رسائل المستخدم', value: stats.userMessages },
              { label: 'ردود الذكاء الاصطناعي', value: stats.aiMessages },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-blue-400">{s.value}</div>
                <div className="text-gray-500 text-xs mt-1">{s.label}</div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );

  // ==================== واجهة تبويب الأمان ====================

  const SecurityTab = () => {
    const securityChecks = [
      { label: 'تشفير AES-256', status: true },
      { label: 'مصادقة ثنائية', status: true },
      { label: 'بروتوكول BB84 الكمي', status: true },
      { label: 'جدار الحماية النشط', status: true },
      { label: 'فحص SSL/TLS', status: true },
      { label: 'حماية من هجمات Quantum', status: true },
    ];

    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            فحوصات الأمان
          </h2>
          <div className="space-y-3">
            {securityChecks.map((check) => (
              <div key={check.label} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
                <span className="text-gray-300 text-sm">{check.label}</span>
                <div className="flex items-center gap-1.5 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>مفعّل</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-3">مستوى الأمان</h3>
            <div className="relative pt-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-green-400 font-semibold">98.7%</span>
                <span className="text-gray-400">مستوى عالٍ</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full" style={{ width: '98.7%' }} />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-semibold mb-3">التهديدات المكتشفة</h3>
            <div className="text-4xl font-bold text-green-400 mb-1">0</div>
            <p className="text-gray-400 text-sm">لم تُرصد أي تهديدات نشطة</p>
          </div>
        </div>
      </div>
    );
  };

  // ==================== التخطيط الرئيسي ====================

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'quantum', label: 'الكم', icon: <Atom className="w-4 h-4" /> },
    { id: 'ai', label: 'الذكاء الاصطناعي', icon: <Brain className="w-4 h-4" /> },
    { id: 'security', label: 'الأمان', icon: <Shield className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-900 text-white" dir="rtl">
      {/* الرأس */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Atom className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">النظام الكمي المتقدم</h1>
              <p className="text-gray-400 text-xs">Top1 Quantum AI — عرض شامل</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>النظام يعمل</span>
          </div>
        </div>
      </header>

      {/* شريط التبويبات */}
      <div className="bg-gray-800/50 border-b border-gray-700 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'quantum' && <QuantumTab />}
        {activeTab === 'ai' && <AITab />}
        {activeTab === 'security' && <SecurityTab />}
      </main>

      {/* التذييل */}
      <footer className="border-t border-gray-700 px-6 py-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-xs">
          Top1 Quantum AI System v2.0.0 — جميع الحقوق محفوظة
        </div>
      </footer>
    </div>
  );
};

export default QuantumSystemDemo;
