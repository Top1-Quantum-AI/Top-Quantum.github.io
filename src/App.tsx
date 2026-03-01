import React, { useState, useEffect } from 'react';
import AdvancedSecurityDashboard from './components/AdvancedSecurityDashboard';
import InvestorPitch from './components/InvestorPitch';
import { Atom, Loader2, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

// واجهة حالة النظام
interface SystemStatus {
  quantum: boolean;
  ai: boolean;
  security: boolean;
  network: boolean;
  database: boolean;
}

// مكون شاشة التحميل
const LoadingScreen: React.FC<{ progress: number; status: string }> = ({ progress, status }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto">
            <Atom className="w-full h-full text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto">
            <div className="w-full h-full border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          النظام الكمي المتقدم
        </h1>
        
        <p className="text-xl text-blue-300 mb-8">
          Advanced Quantum AI System
        </p>
        
        <div className="w-80 mx-auto mb-6">
          <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>{progress}%</span>
            <span>جاري التحميل...</span>
          </div>
        </div>
        
        <div className="text-blue-300 text-lg mb-4">
          {status}
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-gray-400">يرجى الانتظار...</span>
        </div>
      </div>
    </div>
  );
};

// مكون فحص حالة النظام
const SystemStatusCheck: React.FC<{ 
  status: SystemStatus; 
  onComplete: () => void; 
}> = ({ status, onComplete }) => {
  const statusItems = [
    { key: 'quantum', label: 'الحوسبة الكمية', icon: <Atom className="w-5 h-5" /> },
    { key: 'ai', label: 'الذكاء الاصطناعي', icon: <CheckCircle className="w-5 h-5" /> },
    { key: 'security', label: 'نظام الأمان', icon: <CheckCircle className="w-5 h-5" /> },
    { key: 'network', label: 'الشبكة', icon: <CheckCircle className="w-5 h-5" /> },
    { key: 'database', label: 'قاعدة البيانات', icon: <CheckCircle className="w-5 h-5" /> }
  ];

  const allReady = Object.values(status).every(Boolean);

  useEffect(() => {
    if (allReady) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [allReady, onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Atom className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">فحص حالة النظام</h2>
          <p className="text-gray-400">جاري التحقق من جميع المكونات...</p>
        </div>
        
        <div className="space-y-4">
          {statusItems.map((item) => {
            const isReady = status[item.key as keyof SystemStatus];
            return (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-white">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isReady ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 text-sm">جاهز</span>
                    </>
                  ) : (
                    <>
                      <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
                      <span className="text-yellow-400 text-sm">جاري التحميل</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {allReady && (
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">جميع الأنظمة جاهزة!</span>
            </div>
            <p className="text-gray-400 text-sm">سيتم تشغيل التطبيق خلال ثوانٍ...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// مكون معالجة الأخطاء
const ErrorBoundary: React.FC<{ 
  children: React.ReactNode; 
  error?: Error | null;
  onRetry: () => void;
}> = ({ children, error, onRetry }) => {
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/50 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">خطأ في النظام</h2>
            <p className="text-gray-300 mb-6">
              حدث خطأ غير متوقع في النظام. يرجى المحاولة مرة أخرى.
            </p>
            <div className="bg-gray-900/50 rounded-lg p-4 mb-6 text-left">
              <code className="text-red-300 text-sm break-all">
                {error.message}
              </code>
            </div>
            <button
              onClick={onRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// التطبيق الرئيسي
const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('جاري تهيئة النظام...');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    quantum: false,
    ai: false,
    security: false,
    network: false,
    database: false
  });
  const [showStatusCheck, setShowStatusCheck] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [appReady, setAppReady] = useState(false);
  const [showInvestorPitch, setShowInvestorPitch] = useState(false);

  // محاكاة تحميل النظام
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        const steps = [
          { progress: 10, status: 'تحميل المكتبات الأساسية...', delay: 500 },
          { progress: 25, status: 'تهيئة المعالجات الكمية...', delay: 800 },
          { progress: 40, status: 'تحميل نماذج الذكاء الاصطناعي...', delay: 1000 },
          { progress: 55, status: 'تفعيل أنظمة الأمان...', delay: 600 },
          { progress: 70, status: 'الاتصال بقاعدة البيانات...', delay: 400 },
          { progress: 85, status: 'تحميل واجهة المستخدم...', delay: 300 },
          { progress: 100, status: 'اكتمل التحميل!', delay: 500 }
        ];

        for (const step of steps) {
          await new Promise(resolve => setTimeout(resolve, step.delay));
          setProgress(step.progress);
          setStatus(step.status);
        }

        setLoading(false);
        setShowStatusCheck(true);

        // فحص حالة الأنظمة
        const systemChecks = [
          { key: 'quantum', delay: 500 },
          { key: 'ai', delay: 800 },
          { key: 'security', delay: 300 },
          { key: 'network', delay: 600 },
          { key: 'database', delay: 400 }
        ];

        for (const check of systemChecks) {
          await new Promise(resolve => setTimeout(resolve, check.delay));
          setSystemStatus(prev => ({
            ...prev,
            [check.key]: true
          }));
        }

      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    initializeSystem();
  }, []);

  // إعادة تشغيل النظام
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setProgress(0);
    setStatus('جاري إعادة تشغيل النظام...');
    setSystemStatus({
      quantum: false,
      ai: false,
      security: false,
      network: false,
      database: false
    });
    setShowStatusCheck(false);
    setAppReady(false);
    
    // إعادة تشغيل عملية التحميل
    window.location.reload();
  };

  // اكتمال فحص النظام
  const handleSystemCheckComplete = () => {
    setShowStatusCheck(false);
    setAppReady(true);
  };

  return (
    <ErrorBoundary error={error} onRetry={handleRetry}>
      {loading && (
        <LoadingScreen progress={progress} status={status} />
      )}
      
      {showStatusCheck && (
        <SystemStatusCheck 
          status={systemStatus} 
          onComplete={handleSystemCheckComplete}
        />
      )}
      
      {appReady && showInvestorPitch && (
        <div>
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={() => setShowInvestorPitch(false)}
              className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg border border-gray-600 transition-colors"
            >
              ← العودة للنظام
            </button>
          </div>
          <InvestorPitch />
        </div>
      )}

      {appReady && !showInvestorPitch && (
        <div className="relative">
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={() => setShowInvestorPitch(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm px-4 py-2 rounded-lg shadow-lg shadow-blue-500/25 transition-all"
              data-testid="investor-pitch-button"
            >
              <TrendingUp className="w-4 h-4" />
              ملف الاستثمار
            </button>
          </div>
          <AdvancedQuantumDashboard />
        </div>
      )}
    </ErrorBoundary>
  );
};

export default App;

// معلومات التطبيق للتصدير
export const AppInfo = {
  name: 'Advanced Quantum AI System',
  version: '2.0.0',
  description: 'نظام متقدم للحوسبة الكمية والذكاء الاصطناعي مع واجهة مستخدم شاملة',
  author: 'Quantum Development Team',
  features: [
    'لوحة تحكم متقدمة للحوسبة الكمية',
    'إدارة عوامل الذكاء الاصطناعي',
    'نظام أمان متطور مع التشفير الكمي',
    'مراقبة الأداء في الوقت الفعلي',
    'واجهة مستخدم تفاعلية ومتجاوبة',
    'دعم الوضع المظلم والفاتح',
    'إشعارات ذكية وتنبيهات',
    'تحليلات متقدمة ورسوم بيانية',
    'إعدادات قابلة للتخصيص',
    'دعم متعدد اللغات (العربية والإنجليزية)'
  ],
  technologies: [
    'React 18',
    'TypeScript',
    'Tailwind CSS',
    'Lucide Icons',
    'Quantum Computing Libraries',
    'AI/ML Integration',
    'Advanced Security Protocols'
  ]
};