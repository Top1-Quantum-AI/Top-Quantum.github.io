import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Atom, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import AuthPage from './pages/AuthPage';
import AdvancedQuantumDashboard from './AdvancedQuantumDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OnboardingTour from './components/OnboardingTour';

// ─── System Status Interface ─────────────────────────────────
interface SystemStatus {
  quantum: boolean;
  ai: boolean;
  security: boolean;
  network: boolean;
  database: boolean;
}

// ─── Loading Screen ──────────────────────────────────────────
const LoadingScreen: React.FC<{ progress: number; status: string }> = ({ progress, status }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
    <div className="text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 mx-auto">
          <Atom className="w-full h-full text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute inset-0 w-24 h-24 mx-auto">
          <div className="w-full h-full border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">النظام الكمي المتقدم</h1>
      <p className="text-xl text-blue-300 mb-8">Advanced Quantum AI System</p>
      <div className="w-80 mx-auto mb-6">
        <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>{progress}%</span>
          <span>جاري التحميل...</span>
        </div>
      </div>
      <div className="text-blue-300 text-lg mb-4">{status}</div>
      <div className="flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-gray-400">يرجى الانتظار...</span>
      </div>
    </div>
  </div>
);

// ─── System Status Check ─────────────────────────────────────
const SystemStatusCheck: React.FC<{
  status: SystemStatus;
  onComplete: () => void;
}> = ({ status, onComplete }) => {
  const statusItems = [
    { key: 'quantum', label: 'الحوسبة الكمية', icon: <Atom className="w-5 h-5" /> },
    { key: 'ai', label: 'الذكاء الاصطناعي', icon: <CheckCircle className="w-5 h-5" /> },
    { key: 'security', label: 'نظام الأمان', icon: <CheckCircle className="w-5 h-5" /> },
    { key: 'network', label: 'الشبكة', icon: <CheckCircle className="w-5 h-5" /> },
    { key: 'database', label: 'قاعدة البيانات', icon: <CheckCircle className="w-5 h-5" /> },
  ];

  const allReady = Object.values(status).every(Boolean);

  useEffect(() => {
    if (allReady) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
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
          {statusItems.map(item => {
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
            <p className="text-gray-400 text-sm">سيتم تشغيل النظام خلال ثوانٍ...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Dashboard Wrapper (loading + onboarding + dashboard) ────
const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('جاري تهيئة النظام...');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    quantum: false, ai: false, security: false, network: false, database: false,
  });
  const [showStatusCheck, setShowStatusCheck] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initializeSystem = async (): Promise<void> => {
      const steps = [
        { progress: 15, status: 'تحميل المكتبات الأساسية...', delay: 400 },
        { progress: 35, status: 'تهيئة المعالجات الكمية...', delay: 600 },
        { progress: 55, status: 'تحميل نماذج الذكاء الاصطناعي...', delay: 500 },
        { progress: 75, status: 'تفعيل أنظمة الأمان...', delay: 400 },
        { progress: 90, status: 'الاتصال بالشبكة...', delay: 300 },
        { progress: 100, status: 'اكتمل التحميل!', delay: 300 },
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
        setProgress(step.progress);
        setStatus(step.status);
      }

      setLoading(false);
      setShowStatusCheck(true);

      const checks = [
        { key: 'quantum', delay: 400 },
        { key: 'ai', delay: 500 },
        { key: 'security', delay: 300 },
        { key: 'network', delay: 400 },
        { key: 'database', delay: 300 },
      ];

      for (const check of checks) {
        await new Promise(resolve => setTimeout(resolve, check.delay));
        setSystemStatus(prev => ({ ...prev, [check.key]: true }));
      }
    };

    initializeSystem().catch(console.error);
  }, []);

  const handleSystemCheckComplete = useCallback(() => {
    setShowStatusCheck(false);
    const hasSeenOnboarding = localStorage.getItem('quantum_onboarding_seen');
    if (hasSeenOnboarding == null) {
      setShowOnboarding(true);
    } else {
      setAppReady(true);
    }
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem('quantum_onboarding_seen', 'true');
    setShowOnboarding(false);
    setAppReady(true);
  }, []);

  if (loading) return <LoadingScreen progress={progress} status={status} />;
  if (showStatusCheck) return <SystemStatusCheck status={systemStatus} onComplete={handleSystemCheckComplete} />;

  return (
    <>
      {showOnboarding && <OnboardingTour onComplete={handleOnboardingComplete} />}
      {appReady && <AdvancedQuantumDashboard />}
    </>
  );
};

// ─── Demo Page (direct dashboard access) ─────────────────────
const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <AdvancedQuantumDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      <div className="text-center max-w-lg mx-auto p-6">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
          <Atom className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-3">العرض التجريبي</h1>
        <p className="text-gray-400 mb-8">
          استكشف جميع ميزات النظام الكمي المتقدم بدون تسجيل. البيانات المعروضة هي محاكاة حية.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setShowDashboard(true)}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all"
          >
            ابدأ العرض التجريبي
          </button>
          <button
            onClick={() => navigate('/register')}
            className="w-full py-3.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-medium transition-colors"
          >
            أنشئ حسابًا مجانيًا بدلاً من ذلك
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Error Boundary ──────────────────────────────────────────
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
            <p className="text-gray-300 mb-6">حدث خطأ غير متوقع في النظام. يرجى المحاولة مرة أخرى.</p>
            <div className="bg-gray-900/50 rounded-lg p-4 mb-6 text-left">
              <code className="text-red-300 text-sm break-all">{error.message}</code>
            </div>
            <button onClick={onRetry} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

// ═══════════════════════════════════════════════════════════
// ─── MAIN APP ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════
const App: React.FC = () => {
  const [error] = useState<Error | null>(null);
  const location = useLocation();

  const handleRetry = () => {
    window.location.reload();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ErrorBoundary error={error} onRetry={handleRetry}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/demo" element={<DemoPage />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;