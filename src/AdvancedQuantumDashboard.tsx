import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Atom,
  Brain,
  Shield,
  Settings,
  BarChart3,
  Zap,
  Lock,
  Cpu,
  Network,
  Eye,
  AlertTriangle,
  TrendingUp,
  Server,
  Monitor,
  FileText,
  Play,
  RefreshCw,
  User,
  Menu,
  X,
  Circle,
  HardDrive,
  Wifi,
  Clock,
  Database,
  Globe,
  Terminal,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  XCircle,
  CheckCircle,
  AlertOctagon,
  LogOut,
  Crown,
  CreditCard,
  Download,
  Key,
} from 'lucide-react';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import AIAnalysisDashboard from './components/AIAnalysisDashboard';
import ApiKeysDashboard from './components/ApiKeysDashboard';
import NotificationCenter, {
  NotificationBell,
  addNotification,
} from './components/NotificationCenter';
import OpenMythosDashboard from './components/OpenMythosDashboard';
import SubscriptionDashboard from './components/SubscriptionDashboard';
import {
  getAnalyticsEngine,
  type AnalyticsReport,
  type LogEntry,
  type NetworkNode,
} from './services/analyticsEngine';
import {
  simulateCircuit,
  algorithms,
  type AlgorithmName,
  type GateOp,
  type GateName,
  type SimulationResult,
} from './services/quantumSimulator';
import { exportDashboardSnapshot } from './services/reportExporter';
import {
  getCurrentUser,
  logoutUser,
  trackSimulation,
  getUsagePercentages,
  getCurrentLimits,
  PLANS,
  getTrialDaysRemaining,
  hasFeature,
} from './services/subscriptionService';

// ─── SparkLine ──────────────────────────────────────────────────

const SparkLine: React.FC<{
  data: Array<{ value: number }>;
  color?: string;
  height?: number;
  width?: number;
}> = ({ data, color = '#3b82f6', height = 40, width = 120 }) => {
  if (data.length < 2) return <div style={{ width, height }} />;
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className='overflow-visible'>
      <polyline fill='none' stroke={color} strokeWidth='2' points={points} />
      <circle
        cx={width}
        cy={height - (((values[values.length - 1] ?? 0) - min) / range) * (height - 4) - 2}
        r='3'
        fill={color}
      />
    </svg>
  );
};

// ─── Time Series Chart ──────────────────────────────────────────

const TimeSeriesChart: React.FC<{
  data: Array<{ value: number }>;
  label: string;
  color: string;
  unit?: string;
  height?: number;
}> = ({ data, label, color, unit = '%', height = 160 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const values = data.map(d => d.value);
    const min = Math.min(...values) * 0.9;
    const max = Math.max(...values) * 1.1 || 1;
    const range = max - min;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, `${color}40`);
    gradient.addColorStop(1, `${color}00`);

    ctx.beginPath();
    values.forEach((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    values.forEach((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    const lastVal = values[values.length - 1] ?? 0;
    const lastY = h - ((lastVal - min) / range) * h;
    ctx.beginPath();
    ctx.arc(w, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [data, color]);

  const currentValue = data[data.length - 1]?.value ?? 0;

  return (
    <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50'>
      <div className='flex items-center justify-between mb-3'>
        <span className='text-sm text-gray-400'>{label}</span>
        <span className='text-lg font-bold' style={{ color }}>
          {currentValue.toFixed(1)}
          {unit}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={height}
        className='w-full'
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

// ─── Circular Gauge ─────────────────────────────────────────────

const CircularGauge: React.FC<{
  value: number;
  max?: number;
  label: string;
  color: string;
  size?: number;
  icon?: React.ReactNode;
}> = ({ value, max = 100, label, color, size = 120, icon }) => {
  const percentage = Math.min(100, (value / max) * 100);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className='flex flex-col items-center'>
      <div className='relative' style={{ width: size, height: size }}>
        <svg width={size} height={size} className='-rotate-90'>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='none'
            stroke='rgba(255,255,255,0.06)'
            strokeWidth='8'
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='none'
            stroke={color}
            strokeWidth='8'
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap='round'
            className='transition-all duration-700 ease-out'
          />
        </svg>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          {icon && <div className='mb-1 opacity-60'>{icon}</div>}
          <span className='text-xl font-bold' style={{ color }}>
            {value.toFixed(1)}%
          </span>
        </div>
      </div>
      <span className='text-xs text-gray-400 mt-2'>{label}</span>
    </div>
  );
};

// ─── Status Pill ────────────────────────────────────────────────

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    online: 'bg-green-500/20 text-green-400 border-green-500/30',
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    offline: 'bg-red-500/20 text-red-400 border-red-500/30',
    degraded: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    maintenance: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    running: 'bg-green-500/20 text-green-400 border-green-500/30',
    training: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs border ${styles[status] ?? 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}
    >
      {status}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════
// ────────── MAIN DASHBOARD ────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

const AdvancedQuantumDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);

  // Subscription
  const userProfile = getCurrentUser();
  const currentPlan = userProfile != null ? PLANS[userProfile.subscription.planId] : PLANS.free;
  const planLimits = getCurrentLimits();
  const usagePct = getUsagePercentages();
  const trialDays = getTrialDaysRemaining();

  // Analytics
  const engineRef = useRef(getAnalyticsEngine());
  const [report, setReport] = useState<AnalyticsReport | null>(null);

  // Quantum simulator
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmName>('bellState');
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [numShots, setNumShots] = useState(1024);
  const [customQubits, setCustomQubits] = useState(4);
  const [customGates, setCustomGates] = useState<GateOp[]>([]);
  const [showCustomCircuit, setShowCustomCircuit] = useState(false);

  // Logs
  const [logFilter, setLogFilter] = useState<LogEntry['level'] | 'all'>('all');

  // Network
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Real-time tick
  useEffect(() => {
    const r = engineRef.current.tick();
    setReport(r);
    const interval = setInterval(() => {
      const rep = engineRef.current.tick();
      setReport(rep);
      // Anomaly notifications
      if (rep.anomalies.length > 0) {
        const latest = rep.anomalies[rep.anomalies.length - 1];
        if (latest && Date.now() - latest.timestamp < 3000) {
          addNotification(
            latest.severity === 'critical' ? 'security' : 'system',
            'تنبيه النظام',
            latest.description
          );
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setReport(engineRef.current.tick());
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  // Quantum simulation
  const runSimulation = useCallback(() => {
    // Track usage against plan limits
    if (!trackSimulation()) {
      addNotification(
        'billing',
        'حد المحاكاة',
        'وصلت للحد الأقصى من عمليات المحاكاة هذا الشهر. قم بترقية خطتك.'
      );
      return;
    }

    setIsSimulating(true);
    setTimeout(() => {
      try {
        let qubits: number;
        let gates: GateOp[];
        if (showCustomCircuit) {
          qubits = Math.min(customQubits, planLimits.maxQubits);
          gates = customGates.length > 0 ? customGates : [{ gate: 'H' as GateName, targets: [0] }];
        } else {
          const algo = algorithms[selectedAlgorithm];
          const config =
            typeof algo === 'function'
              ? (algo as (n?: number) => { qubits: number; gates: GateOp[] })()
              : algo;
          qubits = Math.min(config.qubits, planLimits.maxQubits);
          gates = config.gates;
        }
        setSimResult(simulateCircuit(qubits, gates, numShots, noiseLevel));
      } catch (e) {
        console.error('Simulation error:', e);
      }
      setIsSimulating(false);
    }, 50);
  }, [
    selectedAlgorithm,
    noiseLevel,
    numShots,
    showCustomCircuit,
    customQubits,
    customGates,
    planLimits.maxQubits,
  ]);

  const addCustomGate = useCallback((gate: GateName, target: number, control?: number) => {
    setCustomGates(prev => [
      ...prev,
      { gate, targets: [target], ...(control !== undefined ? { controls: [control] } : {}) },
    ]);
  }, []);

  // Menu
  const menuItems = useMemo(
    () => [
      { id: 'overview', label: 'نظرة عامة', icon: <Monitor className='w-5 h-5' /> },
      { id: 'quantum', label: 'المحاكاة الكمية', icon: <Atom className='w-5 h-5' /> },
      { id: 'ai', label: 'الذكاء الاصطناعي', icon: <Brain className='w-5 h-5' /> },
      { id: 'mythos', label: 'OpenMythos', icon: <Cpu className='w-5 h-5' /> },
      { id: 'security', label: 'الأمان', icon: <Shield className='w-5 h-5' /> },
      { id: 'analytics', label: 'تحليل AI', icon: <BarChart3 className='w-5 h-5' /> },
      { id: 'system', label: 'مراقبة النظام', icon: <Server className='w-5 h-5' /> },
      { id: 'network', label: 'الشبكة', icon: <Network className='w-5 h-5' /> },
      { id: 'logs', label: 'السجلات', icon: <FileText className='w-5 h-5' /> },
      { id: 'settings', label: 'الإعدادات', icon: <Settings className='w-5 h-5' /> },
    ],
    []
  );

  // ─── Sidebar ───────────────────────────────────────────────

  const Sidebar = () => (
    <div
      className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 transition-all duration-300 flex flex-col`}
    >
      <div className='p-4 border-b border-gray-700/50'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20'>
            <Atom className='w-6 h-6 text-white' />
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className='font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                النظام الكمي
              </h1>
              <p className='text-xs text-gray-500'>الإصدار 3.0</p>
            </motion.div>
          )}
        </div>
      </div>
      <nav className='flex-1 p-3 overflow-y-auto'>
        <ul className='space-y-1'>
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                }`}
              >
                {item.icon}
                {sidebarOpen && <span className='text-sm'>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {sidebarOpen && report && (
        <div className='p-4 border-t border-gray-700/50'>
          <div className='grid grid-cols-2 gap-2 text-xs'>
            <div className='bg-gray-800/50 rounded-lg p-2 text-center'>
              <div className='text-green-400 font-bold'>{report.current.cpu.toFixed(0)}%</div>
              <div className='text-gray-500'>CPU</div>
            </div>
            <div className='bg-gray-800/50 rounded-lg p-2 text-center'>
              <div className='text-blue-400 font-bold'>{report.current.memory.toFixed(0)}%</div>
              <div className='text-gray-500'>RAM</div>
            </div>
          </div>
        </div>
      )}
      {/* Plan Badge */}
      {sidebarOpen && (
        <div className='px-3 pt-2 border-t border-gray-700/50'>
          <button
            onClick={() => setShowSubscription(true)}
            className='w-full p-2.5 rounded-lg border transition-all hover:brightness-110'
            style={{
              backgroundColor: `${currentPlan.color}10`,
              borderColor: `${currentPlan.color}30`,
            }}
          >
            <div className='flex items-center gap-2'>
              <Crown className='w-4 h-4' style={{ color: currentPlan.color }} />
              <div className='text-right flex-1'>
                <p className='text-xs font-semibold' style={{ color: currentPlan.color }}>
                  {currentPlan.name}
                </p>
                <p className='text-[10px] text-gray-500'>
                  {userProfile?.subscription.status === 'trial'
                    ? `تجريبي — ${trialDays ?? 0} يوم متبقي`
                    : currentPlan.priceAnnual === 0
                      ? 'مجاني'
                      : 'نشط'}
                </p>
              </div>
              <CreditCard className='w-3.5 h-3.5 text-gray-500' />
            </div>
            {/* Mini usage bar */}
            <div className='mt-2 space-y-1'>
              <div className='flex items-center justify-between text-[10px] text-gray-500'>
                <span>المحاكاة</span>
                <span>{usagePct.simulations.toFixed(0)}%</span>
              </div>
              <div className='h-1 bg-gray-700 rounded-full overflow-hidden'>
                <div
                  className='h-full rounded-full transition-all'
                  style={{
                    width: `${Math.max(usagePct.simulations, 2)}%`,
                    backgroundColor: usagePct.simulations > 90 ? '#ef4444' : currentPlan.color,
                  }}
                />
              </div>
            </div>
          </button>
        </div>
      )}
      <div className='p-3 border-t border-gray-700/50'>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className='w-full flex items-center justify-center p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-400'
        >
          {sidebarOpen ? <X className='w-4 h-4' /> : <Menu className='w-4 h-4' />}
        </button>
      </div>
    </div>
  );

  // ─── Top Bar ───────────────────────────────────────────────

  const pageTitle = menuItems.find(m => m.id === activeTab)?.label ?? '';

  const TopBar = () => (
    <div className='bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 px-6 py-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h2 className='text-xl font-bold'>{pageTitle}</h2>
          <div className='flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full'>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
            <span className='text-xs text-green-400'>متصل</span>
          </div>
          {report && (
            <span className='text-xs text-gray-500'>
              وقت التشغيل: {Math.floor(report.stats.uptime / 60)}د{' '}
              {Math.floor(report.stats.uptime % 60)}ث
            </span>
          )}
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className='w-4 h-4 text-gray-400' />
          </button>
          <NotificationBell onClick={() => setShowNotificationCenter(true)} />
          <button
            onClick={() => setShowApiKeys(true)}
            className='p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors'
            title='مفاتيح API'
          >
            <Key className='w-4 h-4 text-gray-400' />
          </button>
          {hasFeature('hasPdfExport') && (
            <button
              onClick={() => {
                void exportDashboardSnapshot();
              }}
              className='p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors flex items-center gap-1.5'
              title='تصدير PDF'
            >
              <Download className='w-4 h-4 text-gray-400' />
              <span className='text-xs text-gray-400 hidden xl:inline'>تصدير</span>
            </button>
          )}
          <button
            onClick={() => setShowSubscription(true)}
            className='p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors flex items-center gap-1.5'
            title='إدارة الاشتراك'
          >
            <User className='w-4 h-4 text-gray-400' />
            {userProfile != null && sidebarOpen && (
              <span className='text-xs text-gray-400 hidden xl:inline'>{userProfile.name}</span>
            )}
          </button>
          <button
            onClick={(): void => {
              void navigate('/admin');
            }}
            className='p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors flex items-center gap-1.5'
            title='لوحة الإدارة'
          >
            <Shield className='w-4 h-4 text-orange-400' />
            <span className='text-xs text-gray-400 hidden xl:inline'>إدارة</span>
          </button>
          <button
            onClick={(): void => {
              logoutUser();
              void navigate('/');
            }}
            className='flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-colors text-red-400 hover:text-red-300'
            title='تسجيل الخروج'
          >
            <LogOut className='w-4 h-4' />
            <span className='text-xs font-medium'>خروج</span>
          </button>
        </div>
      </div>
    </div>
  );

  // ═════════════════════════════════════════════════════════════
  // ────────── TAB RENDERERS ──────────────────────────────────
  // ═════════════════════════════════════════════════════════════

  // ─── Overview ──────────────────────────────────────────────

  const renderOverview = () => {
    if (!report) return null;
    const c = report.current;
    const trendIcon = (t: 'increasing' | 'decreasing' | 'stable') => {
      if (t === 'increasing') return <ArrowUpRight className='w-4 h-4 text-green-400' />;
      if (t === 'decreasing') return <ArrowDownRight className='w-4 h-4 text-red-400' />;
      return <Minus className='w-4 h-4 text-gray-400' />;
    };

    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[
            {
              label: 'الإنتاجية',
              value: `${c.throughput.toFixed(0)}`,
              unit: 'عملية/ث',
              color: '#3b82f6',
              icon: <Zap className='w-5 h-5' />,
              data: report.history.throughput,
            },
            {
              label: 'زمن الاستجابة',
              value: `${c.latency.toFixed(1)}`,
              unit: 'ms',
              color: '#10b981',
              icon: <Clock className='w-5 h-5' />,
              data: report.history.latency,
            },
            {
              label: 'الاتصالات النشطة',
              value: `${c.activeConnections}`,
              unit: '',
              color: '#8b5cf6',
              icon: <Globe className='w-5 h-5' />,
              data: [],
            },
            {
              label: 'درجة الأمان',
              value: `${c.securityScore.toFixed(1)}`,
              unit: '%',
              color: '#f59e0b',
              icon: <Shield className='w-5 h-5' />,
              data: report.history.securityScore,
            },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className='bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-gray-600/50 transition-all'
            >
              <div className='flex items-center justify-between mb-3'>
                <div className='p-2 rounded-lg' style={{ backgroundColor: `${kpi.color}20` }}>
                  <div style={{ color: kpi.color }}>{kpi.icon}</div>
                </div>
                {kpi.data.length > 0 && <SparkLine data={kpi.data.slice(-30)} color={kpi.color} />}
              </div>
              <div className='text-2xl font-bold'>
                {kpi.value}
                <span className='text-sm text-gray-400 mr-1'>{kpi.unit}</span>
              </div>
              <div className='text-sm text-gray-400 mt-1'>{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50'>
          <h3 className='text-lg font-semibold mb-6 flex items-center gap-2'>
            <Activity className='w-5 h-5 text-blue-400' />
            موارد النظام
          </h3>
          <div className='flex flex-wrap justify-around gap-6'>
            <CircularGauge
              value={c.cpu}
              label='المعالج'
              color='#3b82f6'
              icon={<Cpu className='w-4 h-4' />}
            />
            <CircularGauge
              value={c.memory}
              label='الذاكرة'
              color='#10b981'
              icon={<Database className='w-4 h-4' />}
            />
            <CircularGauge
              value={c.disk}
              label='التخزين'
              color='#f59e0b'
              icon={<HardDrive className='w-4 h-4' />}
            />
            <CircularGauge
              value={c.network}
              label='الشبكة'
              color='#8b5cf6'
              icon={<Wifi className='w-4 h-4' />}
            />
            <CircularGauge
              value={c.quantumUtilization}
              label='كمي'
              color='#ec4899'
              icon={<Atom className='w-4 h-4' />}
            />
            <CircularGauge
              value={c.aiModelLoad}
              label='AI'
              color='#06b6d4'
              icon={<Brain className='w-4 h-4' />}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <TimeSeriesChart data={report.history.cpu} label='استخدام المعالج' color='#3b82f6' />
          <TimeSeriesChart data={report.history.memory} label='استخدام الذاكرة' color='#10b981' />
          <TimeSeriesChart
            data={report.history.throughput}
            label='الإنتاجية'
            color='#f59e0b'
            unit=' ops/s'
          />
          <TimeSeriesChart
            data={report.history.quantumUtilization}
            label='الاستخدام الكمي'
            color='#ec4899'
          />
        </div>

        {report.predictions.length > 0 && (
          <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <TrendingUp className='w-5 h-5 text-purple-400' />
              التنبؤات
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {report.predictions.map((pred, i) => (
                <div key={i} className='bg-gray-700/30 rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium'>{pred.metric}</span>
                    {trendIcon(pred.trend)}
                  </div>
                  <div className='text-2xl font-bold'>{pred.predictedValue.toFixed(1)}%</div>
                  <div className='flex items-center justify-between mt-2 text-xs text-gray-400'>
                    <span>ثقة: {pred.confidence}%</span>
                    <span>{pred.timeHorizon}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Quantum Simulator ─────────────────────────────────────

  const renderQuantum = () => {
    const algoList: Array<{ key: AlgorithmName; name: string; icon: React.ReactNode }> = [
      { key: 'bellState', name: 'حالة بيل', icon: <Zap className='w-4 h-4' /> },
      { key: 'ghzState', name: 'حالة GHZ', icon: <Circle className='w-4 h-4' /> },
      { key: 'groverSearch', name: 'بحث جروفر', icon: <Eye className='w-4 h-4' /> },
      { key: 'qft', name: 'تحويل فورييه', icon: <Activity className='w-4 h-4' /> },
      { key: 'teleportation', name: 'النقل الآني', icon: <Globe className='w-4 h-4' /> },
      { key: 'deutschJozsa', name: 'دويتش-جوزا', icon: <Brain className='w-4 h-4' /> },
      { key: 'qrng', name: 'أرقام عشوائية', icon: <Atom className='w-4 h-4' /> },
      { key: 'phaseEstimation', name: 'تقدير الطور', icon: <BarChart3 className='w-4 h-4' /> },
    ];

    const selectedAlgo = algorithms[selectedAlgorithm];
    const algoInfo =
      typeof selectedAlgo === 'function'
        ? (
            selectedAlgo as (n?: number) => {
              name: string;
              description: string;
              qubits: number;
              gates: GateOp[];
            }
          )()
        : selectedAlgo;

    return (
      <div className='space-y-6'>
        {/* Algorithm Selector */}
        <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold flex items-center gap-2'>
              <Atom className='w-5 h-5 text-purple-400' />
              اختيار الخوارزمية الكمية
            </h3>
            <label className='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={showCustomCircuit}
                onChange={e => setShowCustomCircuit(e.target.checked)}
                className='rounded'
              />
              دائرة مخصصة
            </label>
          </div>

          {!showCustomCircuit ? (
            <>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                {algoList.map(algo => (
                  <button
                    key={algo.key}
                    onClick={() => setSelectedAlgorithm(algo.key)}
                    className={`p-3 rounded-lg border transition-all text-sm flex items-center gap-2 ${
                      selectedAlgorithm === algo.key
                        ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                        : 'bg-gray-700/30 border-gray-600/50 hover:border-gray-500 text-gray-300'
                    }`}
                  >
                    {algo.icon}
                    {algo.name}
                  </button>
                ))}
              </div>
              <div className='mt-4 p-3 bg-gray-700/30 rounded-lg'>
                <p className='text-sm text-gray-300 font-medium'>{algoInfo.name}</p>
                <p className='text-xs text-gray-400 mt-1'>{algoInfo.description}</p>
                <p className='text-xs text-gray-500 mt-1'>
                  {algoInfo.qubits} كيوبت • {algoInfo.gates.length} بوابة
                </p>
              </div>
            </>
          ) : (
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <div>
                  <label htmlFor='custom-qubits' className='text-sm text-gray-400 block mb-1'>
                    عدد الكيوبتات
                  </label>
                  <input
                    type='number'
                    min={1}
                    max={10}
                    id='custom-qubits'
                    value={customQubits}
                    onChange={e => setCustomQubits(Number(e.target.value))}
                    className='w-20 p-2 bg-gray-700 rounded border border-gray-600 text-sm'
                  />
                </div>
                <div className='flex-1'>
                  <p className='text-sm text-gray-400 block mb-1'>إضافة بوابة</p>
                  <div className='flex flex-wrap gap-2'>
                    {(['H', 'X', 'Y', 'Z', 'T', 'S'] as GateName[]).map(g => (
                      <button
                        key={g}
                        onClick={() => addCustomGate(g, 0)}
                        className='px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm border border-gray-600'
                      >
                        {g}
                      </button>
                    ))}
                    <button
                      onClick={() => addCustomGate('CNOT', 1, 0)}
                      className='px-3 py-1 bg-blue-700/50 hover:bg-blue-600/50 rounded text-sm border border-blue-600/50'
                    >
                      CNOT
                    </button>
                  </div>
                </div>
              </div>
              {customGates.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {customGates.map((g, i) => (
                    <span
                      key={i}
                      className='px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded text-xs text-purple-300'
                    >
                      {g.gate}({g.targets.join(',')}
                      {g.controls ? ` ctrl:${g.controls.join(',')}` : ''})
                    </span>
                  ))}
                  <button
                    onClick={() => setCustomGates([])}
                    className='px-2 py-1 text-xs text-red-400 hover:text-red-300'
                  >
                    مسح
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50'>
          <div className='flex flex-wrap items-center gap-6'>
            <div>
              <label htmlFor='noise-level' className='text-xs text-gray-400 block mb-1'>
                مستوى الضوضاء
              </label>
              <div className='flex items-center gap-2'>
                <input
                  type='range'
                  min={0}
                  max={20}
                  id='noise-level'
                  step={0.5}
                  value={noiseLevel}
                  onChange={e => setNoiseLevel(Number(e.target.value))}
                  className='w-32'
                />
                <span className='text-sm w-12'>{noiseLevel}%</span>
              </div>
            </div>
            <div>
              <label htmlFor='num-shots' className='text-xs text-gray-400 block mb-1'>
                عدد القياسات
              </label>
              <select
                id='num-shots'
                value={numShots}
                onChange={e => setNumShots(Number(e.target.value))}
                className='p-2 bg-gray-700 rounded border border-gray-600 text-sm'
              >
                <option value={256}>256</option>
                <option value={512}>512</option>
                <option value={1024}>1,024</option>
                <option value={4096}>4,096</option>
                <option value={8192}>8,192</option>
              </select>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runSimulation}
              disabled={isSimulating}
              className='px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-purple-500/20'
            >
              {isSimulating ? (
                <RefreshCw className='w-5 h-5 animate-spin' />
              ) : (
                <Play className='w-5 h-5' />
              )}
              {isSimulating ? 'جاري المحاكاة...' : 'تشغيل المحاكاة'}
            </motion.button>
          </div>
        </div>

        {/* Results */}
        {simResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-4'
          >
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {[
                {
                  label: 'الكيوبتات',
                  value: simResult.numQubits,
                  icon: <Atom className='w-4 h-4' />,
                },
                {
                  label: 'البوابات',
                  value: simResult.gateCount,
                  icon: <Cpu className='w-4 h-4' />,
                },
                {
                  label: 'العمق',
                  value: simResult.circuitDepth,
                  icon: <BarChart3 className='w-4 h-4' />,
                },
                {
                  label: 'الوقت',
                  value: `${simResult.executionTimeMs.toFixed(1)}ms`,
                  icon: <Clock className='w-4 h-4' />,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className='bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center'
                >
                  <div className='text-gray-400 mb-1 flex items-center justify-center gap-1 text-xs'>
                    {stat.icon} {stat.label}
                  </div>
                  <div className='text-2xl font-bold text-purple-300'>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Probability Distribution */}
            <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50'>
              <h4 className='text-sm font-semibold mb-4 flex items-center gap-2'>
                <BarChart3 className='w-4 h-4 text-blue-400' />
                توزيع الاحتمالات (القياسات)
              </h4>
              <div className='flex items-end gap-1 h-48'>
                {Object.entries(simResult.measurements)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 16)
                  .map(([state, count]) => {
                    const maxCount = Math.max(...Object.values(simResult.measurements));
                    const heightPct = (count / maxCount) * 100;
                    return (
                      <div key={state} className='flex-1 flex flex-col items-center gap-1 min-w-0'>
                        <span className='text-[10px] text-gray-400'>{count}</span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPct}%` }}
                          transition={{ duration: 0.6 }}
                          className='w-full bg-gradient-to-t from-blue-600 to-purple-500 rounded-t-sm min-h-[2px]'
                        />
                        <span className='text-[10px] text-gray-400 font-mono transform -rotate-45 origin-top-left mt-1'>
                          |{state}⟩
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Bloch Spheres */}
            <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50'>
              <h4 className='text-sm font-semibold mb-4 flex items-center gap-2'>
                <Globe className='w-4 h-4 text-green-400' />
                كرة بلوخ لكل كيوبت
              </h4>
              <div className='flex flex-wrap gap-6 justify-center'>
                {simResult.blochSpheres.map(bs => {
                  const sz = 100;
                  const cx = sz / 2;
                  const cy = sz / 2;
                  const r = sz / 2 - 8;
                  const bx = Math.sin(bs.theta) * Math.cos(bs.phi);
                  const bz = Math.cos(bs.theta);
                  const px = cx + bx * r * 0.8;
                  const py = cy - bz * r * 0.8;
                  return (
                    <div key={bs.qubit} className='flex flex-col items-center'>
                      <svg width={sz} height={sz}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={r}
                          fill='none'
                          stroke='rgba(255,255,255,0.1)'
                          strokeWidth='1'
                        />
                        <ellipse
                          cx={cx}
                          cy={cy}
                          rx={r}
                          ry={r * 0.3}
                          fill='none'
                          stroke='rgba(255,255,255,0.08)'
                          strokeWidth='1'
                        />
                        <line
                          x1={cx}
                          y1={cy - r}
                          x2={cx}
                          y2={cy + r}
                          stroke='rgba(255,255,255,0.1)'
                          strokeWidth='1'
                        />
                        <line
                          x1={cx - r}
                          y1={cy}
                          x2={cx + r}
                          y2={cy}
                          stroke='rgba(255,255,255,0.1)'
                          strokeWidth='1'
                        />
                        <text x={cx} y={cy - r - 2} textAnchor='middle' fill='#888' fontSize='8'>
                          |0⟩
                        </text>
                        <text x={cx} y={cy + r + 8} textAnchor='middle' fill='#888' fontSize='8'>
                          |1⟩
                        </text>
                        <line x1={cx} y1={cy} x2={px} y2={py} stroke='#8b5cf6' strokeWidth='2' />
                        <circle cx={px} cy={py} r='4' fill='#8b5cf6' />
                      </svg>
                      <span className='text-xs text-gray-400 mt-1'>Q{bs.qubit}</span>
                      <span className='text-[10px] text-gray-500'>
                        θ={bs.theta.toFixed(2)} φ={bs.phi.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Entanglement Map */}
            {simResult.numQubits > 1 && (
              <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50'>
                <h4 className='text-sm font-semibold mb-4 flex items-center gap-2'>
                  <Zap className='w-4 h-4 text-yellow-400' />
                  خريطة التشابك الكمي
                </h4>
                <div className='flex justify-center'>
                  <div
                    className='inline-grid gap-1'
                    style={{ gridTemplateColumns: `auto repeat(${simResult.numQubits}, 40px)` }}
                  >
                    <div />
                    {Array.from({ length: simResult.numQubits }, (_, i) => (
                      <div key={i} className='text-center text-xs text-gray-400 font-mono'>
                        Q{i}
                      </div>
                    ))}
                    {simResult.entanglementMap.map((row, i) => (
                      <React.Fragment key={i}>
                        <div className='text-xs text-gray-400 font-mono flex items-center pr-2'>
                          Q{i}
                        </div>
                        {row.map((entangled, j) => (
                          <div
                            key={j}
                            className={`w-10 h-10 rounded flex items-center justify-center text-xs ${
                              i === j
                                ? 'bg-purple-500/30 text-purple-300'
                                : entangled
                                  ? 'bg-yellow-500/30 text-yellow-300'
                                  : 'bg-gray-700/30 text-gray-600'
                            }`}
                          >
                            {i === j ? '—' : entangled ? '⚡' : '·'}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  };

  // ─── AI Tab ────────────────────────────────────────────────

  const renderAI = () => {
    if (!report) return null;
    const c = report.current;
    const models = [
      {
        name: 'NLP-Advanced',
        type: 'NLP',
        accuracy: 96.8,
        status: 'running',
        load: c.aiModelLoad,
        memory: 3.7,
        gpu: 78,
      },
      {
        name: 'Vision-Quantum',
        type: 'CV',
        accuracy: 94.2,
        status: 'running',
        load: c.aiModelLoad * 0.8,
        memory: 5.2,
        gpu: 85,
      },
      {
        name: 'Quantum-ML',
        type: 'QML',
        accuracy: 91.5,
        status: 'training',
        load: c.aiModelLoad * 1.1,
        memory: 4.1,
        gpu: 92,
      },
      {
        name: 'Reinforcement-Agent',
        type: 'RL',
        accuracy: 88.3,
        status: 'running',
        load: c.aiModelLoad * 0.6,
        memory: 2.8,
        gpu: 45,
      },
    ];

    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-gray-800/50 rounded-xl p-5 border border-gray-700/50'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 rounded-lg bg-cyan-500/20'>
                <Brain className='w-5 h-5 text-cyan-400' />
              </div>
              <div>
                <div className='text-2xl font-bold'>
                  {models.filter(m => m.status === 'running').length}/{models.length}
                </div>
                <div className='text-sm text-gray-400'>نماذج نشطة</div>
              </div>
            </div>
          </div>
          <div className='bg-gray-800/50 rounded-xl p-5 border border-gray-700/50'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 rounded-lg bg-green-500/20'>
                <Cpu className='w-5 h-5 text-green-400' />
              </div>
              <div>
                <div className='text-2xl font-bold'>
                  {(models.reduce((s, m) => s + m.gpu, 0) / models.length).toFixed(0)}%
                </div>
                <div className='text-sm text-gray-400'>متوسط GPU</div>
              </div>
            </div>
          </div>
          <div className='bg-gray-800/50 rounded-xl p-5 border border-gray-700/50'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 rounded-lg bg-purple-500/20'>
                <TrendingUp className='w-5 h-5 text-purple-400' />
              </div>
              <div>
                <div className='text-2xl font-bold'>
                  {(models.reduce((s, m) => s + m.accuracy, 0) / models.length).toFixed(1)}%
                </div>
                <div className='text-sm text-gray-400'>متوسط الدقة</div>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {models.map((model, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className='bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50'
            >
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      model.type === 'NLP'
                        ? 'bg-blue-500/20'
                        : model.type === 'CV'
                          ? 'bg-green-500/20'
                          : model.type === 'QML'
                            ? 'bg-purple-500/20'
                            : 'bg-orange-500/20'
                    }`}
                  >
                    <Brain
                      className={`w-5 h-5 ${
                        model.type === 'NLP'
                          ? 'text-blue-400'
                          : model.type === 'CV'
                            ? 'text-green-400'
                            : model.type === 'QML'
                              ? 'text-purple-400'
                              : 'text-orange-400'
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className='font-semibold'>{model.name}</h4>
                    <span className='text-xs text-gray-400'>{model.type}</span>
                  </div>
                </div>
                <StatusPill status={model.status} />
              </div>
              <div className='space-y-3'>
                {[
                  { label: 'الدقة', value: model.accuracy, color: '#10b981' },
                  { label: 'GPU', value: model.gpu, color: '#3b82f6' },
                  { label: 'التحميل', value: Math.min(100, model.load), color: '#f59e0b' },
                ].map((metric, j) => (
                  <div key={j}>
                    <div className='flex justify-between text-xs mb-1'>
                      <span className='text-gray-400'>{metric.label}</span>
                      <span style={{ color: metric.color }}>{metric.value.toFixed(1)}%</span>
                    </div>
                    <div className='w-full bg-gray-700/50 rounded-full h-1.5'>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1 }}
                        className='h-1.5 rounded-full'
                        style={{ backgroundColor: metric.color }}
                      />
                    </div>
                  </div>
                ))}
                <div className='flex justify-between text-xs text-gray-400 pt-1'>
                  <span>الذاكرة: {model.memory.toFixed(1)} GB</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <TimeSeriesChart
          data={report.history.quantumUtilization.map((_p, i) => ({
            value: 85 + Math.sin(i * 0.3) * 5 + (Math.random() - 0.5) * 2,
          }))}
          label='أداء AI الإجمالي'
          color='#06b6d4'
        />
      </div>
    );
  };

  // ─── Security Tab ──────────────────────────────────────────

  const renderSecurity = () => {
    if (!report) return null;
    const c = report.current;

    const threats = [
      {
        type: 'DDoS',
        severity: 'medium' as const,
        status: 'محجوب',
        count: 23,
        source: '185.x.x.x',
      },
      {
        type: 'SQL Injection',
        severity: 'high' as const,
        status: 'محجوب',
        count: 7,
        source: '45.x.x.x',
      },
      {
        type: 'Brute Force',
        severity: 'low' as const,
        status: 'محجوب',
        count: 156,
        source: 'متعدد',
      },
      {
        type: 'Quantum Attack',
        severity: 'critical' as const,
        status: 'تم الصد',
        count: 1,
        source: 'مجهول',
      },
      { type: 'XSS', severity: 'medium' as const, status: 'محجوب', count: 12, source: '92.x.x.x' },
    ];

    const severityColor = {
      low: 'text-green-400 bg-green-500/10 border-green-500/20',
      medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      critical: 'text-red-400 bg-red-500/10 border-red-500/20',
    };

    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 flex flex-col items-center'
          >
            <CircularGauge
              value={c.securityScore}
              label='درجة الأمان'
              color='#10b981'
              size={140}
              icon={<Shield className='w-5 h-5' />}
            />
          </motion.div>
          {[
            {
              label: 'هجمات محجوبة',
              value: '199',
              color: '#3b82f6',
              icon: <Lock className='w-5 h-5' />,
            },
            {
              label: 'تهديدات نشطة',
              value: '0',
              color: '#10b981',
              icon: <Eye className='w-5 h-5' />,
            },
            {
              label: 'مقاومة كمية',
              value: '99.9%',
              color: '#8b5cf6',
              icon: <Atom className='w-5 h-5' />,
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              className='bg-gray-800/50 rounded-xl p-5 border border-gray-700/50'
            >
              <div
                className='p-2 rounded-lg w-fit mb-3'
                style={{ backgroundColor: `${card.color}20` }}
              >
                <div style={{ color: card.color }}>{card.icon}</div>
              </div>
              <div className='text-2xl font-bold'>{card.value}</div>
              <div className='text-sm text-gray-400'>{card.label}</div>
            </motion.div>
          ))}
        </div>

        <TimeSeriesChart
          data={report.history.securityScore}
          label='درجة الأمان عبر الزمن'
          color='#10b981'
        />

        <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden'>
          <div className='p-4 border-b border-gray-700/50 flex items-center gap-2'>
            <AlertTriangle className='w-5 h-5 text-yellow-400' />
            <h3 className='font-semibold'>سجل التهديدات</h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-gray-700/30'>
                  <th className='text-right py-3 px-4 text-gray-400 font-medium'>النوع</th>
                  <th className='text-right py-3 px-4 text-gray-400 font-medium'>الخطورة</th>
                  <th className='text-right py-3 px-4 text-gray-400 font-medium'>الحالة</th>
                  <th className='text-right py-3 px-4 text-gray-400 font-medium'>العدد</th>
                  <th className='text-right py-3 px-4 text-gray-400 font-medium'>المصدر</th>
                </tr>
              </thead>
              <tbody>
                {threats.map((threat, i) => (
                  <tr
                    key={i}
                    className='border-t border-gray-700/30 hover:bg-gray-700/20 transition-colors'
                  >
                    <td className='py-3 px-4 font-medium'>{threat.type}</td>
                    <td className='py-3 px-4'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs border ${severityColor[threat.severity]}`}
                      >
                        {threat.severity}
                      </span>
                    </td>
                    <td className='py-3 px-4 text-green-400'>{threat.status}</td>
                    <td className='py-3 px-4'>{threat.count}</td>
                    <td className='py-3 px-4 font-mono text-xs text-gray-400'>{threat.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-gray-800/50 rounded-xl p-5 border border-gray-700/50'>
            <h4 className='font-semibold mb-4 flex items-center gap-2'>
              <Lock className='w-4 h-4 text-blue-400' /> بروتوكولات التشفير
            </h4>
            <div className='space-y-2'>
              {[
                { name: 'AES-256-GCM', strength: 100 },
                { name: 'RSA-4096', strength: 95 },
                { name: 'Kyber-1024 (Post-Quantum)', strength: 99 },
                { name: 'CRYSTALS-Dilithium', strength: 98 },
                { name: 'SPHINCS+', strength: 97 },
              ].map((proto, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between p-2 bg-gray-700/20 rounded-lg'
                >
                  <div className='flex items-center gap-2'>
                    <CheckCircle className='w-4 h-4 text-green-400' />
                    <span className='text-sm'>{proto.name}</span>
                  </div>
                  <span className='text-xs text-green-400'>{proto.strength}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className='bg-gray-800/50 rounded-xl p-5 border border-gray-700/50'>
            <h4 className='font-semibold mb-4 flex items-center gap-2'>
              <Shield className='w-4 h-4 text-green-400' /> طبقات الحماية
            </h4>
            <div className='space-y-2'>
              {[
                'جدار الحماية المتقدم',
                'كشف التسلل (IDS/IPS)',
                'المصادقة الكمية',
                'فحص الحزم العميق',
                'العزل الكمي',
              ].map((name, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between p-2 bg-gray-700/20 rounded-lg'
                >
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-green-400' />
                    <span className='text-sm'>{name}</span>
                  </div>
                  <span className='text-xs text-green-400'>فعال</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── System Monitor ────────────────────────────────────────

  const renderSystem = () => {
    if (!report) return null;
    const c = report.current;

    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[
            {
              label: 'المعالج (CPU)',
              value: c.cpu,
              color: '#3b82f6',
              icon: <Cpu className='w-5 h-5' />,
              data: report.history.cpu,
            },
            {
              label: 'الذاكرة (RAM)',
              value: c.memory,
              color: '#10b981',
              icon: <Database className='w-5 h-5' />,
              data: report.history.memory,
            },
            {
              label: 'التخزين',
              value: c.disk,
              color: '#f59e0b',
              icon: <HardDrive className='w-5 h-5' />,
              data: [],
            },
            {
              label: 'الشبكة',
              value: c.network,
              color: '#8b5cf6',
              icon: <Wifi className='w-5 h-5' />,
              data: report.history.network,
            },
            {
              label: 'الكمي',
              value: c.quantumUtilization,
              color: '#ec4899',
              icon: <Atom className='w-5 h-5' />,
              data: report.history.quantumUtilization,
            },
            {
              label: 'معدل الخطأ',
              value: c.errorRate,
              color: '#ef4444',
              icon: <AlertTriangle className='w-5 h-5' />,
              data: report.history.errorRate,
            },
          ].map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className='bg-gray-800/50 rounded-xl p-5 border border-gray-700/50'
            >
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-2'>
                  <div className='p-2 rounded-lg' style={{ backgroundColor: `${metric.color}20` }}>
                    <div style={{ color: metric.color }}>{metric.icon}</div>
                  </div>
                  <span className='text-sm'>{metric.label}</span>
                </div>
                <span className='text-xl font-bold' style={{ color: metric.color }}>
                  {metric.value.toFixed(1)}%
                </span>
              </div>
              <div className='w-full bg-gray-700/50 rounded-full h-2 mb-2'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, metric.value)}%` }}
                  transition={{ duration: 1 }}
                  className='h-2 rounded-full'
                  style={{ backgroundColor: metric.color }}
                />
              </div>
              {metric.data.length > 0 && (
                <SparkLine
                  data={metric.data.slice(-30)}
                  color={metric.color}
                  width={280}
                  height={30}
                />
              )}
            </motion.div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <TimeSeriesChart
            data={report.history.latency}
            label='زمن الاستجابة'
            color='#f59e0b'
            unit=' ms'
          />
          <TimeSeriesChart
            data={report.history.throughput}
            label='الإنتاجية'
            color='#3b82f6'
            unit=' ops/s'
          />
        </div>

        <div className='bg-gray-800/50 rounded-xl p-6 border border-gray-700/50'>
          <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
            <Clock className='w-5 h-5 text-yellow-400' /> إحصائيات زمن الاستجابة
          </h3>
          <div className='grid grid-cols-3 md:grid-cols-6 gap-4'>
            {[
              { label: 'P50', value: report.stats.latencyP50 },
              { label: 'P95', value: report.stats.latencyP95 },
              { label: 'P99', value: report.stats.latencyP99 },
              { label: 'CPU متوسط', value: report.stats.cpuAvg },
              { label: 'RAM متوسط', value: report.stats.memoryAvg },
              { label: 'الأخطاء', value: report.stats.errorRateAvg },
            ].map((stat, i) => (
              <div key={i} className='text-center p-3 bg-gray-700/30 rounded-lg'>
                <div className='text-xs text-gray-400 mb-1'>{stat.label}</div>
                <div className='text-lg font-bold'>{stat.value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {report.anomalies.length > 0 && (
          <div className='bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden'>
            <div className='p-4 border-b border-gray-700/50 flex items-center gap-2'>
              <AlertOctagon className='w-5 h-5 text-red-400' />
              <h3 className='font-semibold'>الشذوذات المكتشفة ({report.anomalies.length})</h3>
            </div>
            <div className='divide-y divide-gray-700/30 max-h-64 overflow-y-auto'>
              {report.anomalies
                .slice(-10)
                .reverse()
                .map(a => (
                  <div
                    key={a.id}
                    className='px-4 py-3 flex items-center justify-between hover:bg-gray-700/20'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          a.severity === 'critical'
                            ? 'bg-red-500'
                            : a.severity === 'high'
                              ? 'bg-orange-500'
                              : a.severity === 'medium'
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                        }`}
                      />
                      <span className='text-sm'>{a.description}</span>
                    </div>
                    <span className='text-xs text-gray-500'>
                      {new Date(a.timestamp).toLocaleTimeString('ar-SA')}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Network ───────────────────────────────────────────────

  const renderNetwork = () => {
    const nodes = engineRef.current.getNetworkNodes();
    const connections = engineRef.current.getNetworkConnections();
    const selected = nodes.find(n => n.id === selectedNode);

    const nodeColors: Record<NetworkNode['type'], string> = {
      'quantum-processor': '#8b5cf6',
      'ai-cluster': '#3b82f6',
      'security-node': '#10b981',
      gateway: '#f59e0b',
      storage: '#6b7280',
      edge: '#ec4899',
    };
    const nodeIcons: Record<NetworkNode['type'], string> = {
      'quantum-processor': '⚛️',
      'ai-cluster': '🧠',
      'security-node': '🛡️',
      gateway: '🌐',
      storage: '💾',
      edge: '📡',
    };

    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden'>
            <div className='p-4 border-b border-gray-700/50 flex items-center gap-2'>
              <Network className='w-5 h-5 text-blue-400' />
              <h3 className='font-semibold'>خريطة الشبكة</h3>
            </div>
            <div className='relative' style={{ height: '500px' }}>
              <svg width='100%' height='100%' viewBox='0 0 1000 500'>
                {connections.map((conn, i) => {
                  const from = nodes.find(n => n.id === conn.from);
                  const to = nodes.find(n => n.id === conn.to);
                  if (!from || !to) return null;
                  const opacity = Math.max(0.2, 1 - conn.latency / 20);
                  return (
                    <line
                      key={i}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={`rgba(100,150,255,${opacity})`}
                      strokeWidth='2'
                      strokeDasharray={conn.latency > 5 ? '5,5' : undefined}
                    />
                  );
                })}
                {nodes.map(node => {
                  const color = nodeColors[node.type];
                  const isSelected = selectedNode === node.id;
                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNode(isSelected ? null : node.id)}
                      className='cursor-pointer'
                    >
                      {node.status === 'online' && (
                        <circle cx={node.x} cy={node.y} r='30' fill={color} opacity='0.1'>
                          <animate
                            attributeName='r'
                            values='28;35;28'
                            dur='2s'
                            repeatCount='indefinite'
                          />
                        </circle>
                      )}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r='22'
                        fill={`${color}30`}
                        stroke={isSelected ? '#fff' : color}
                        strokeWidth={isSelected ? 3 : 2}
                      />
                      <circle
                        cx={node.x + 16}
                        cy={node.y - 16}
                        r='5'
                        fill={
                          node.status === 'online'
                            ? '#10b981'
                            : node.status === 'degraded'
                              ? '#f59e0b'
                              : '#ef4444'
                        }
                      />
                      <text x={node.x} y={node.y + 5} textAnchor='middle' fontSize='16'>
                        {nodeIcons[node.type]}
                      </text>
                      <text
                        x={node.x}
                        y={node.y + 40}
                        textAnchor='middle'
                        fill='#9ca3af'
                        fontSize='11'
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className='space-y-4'>
            {selected ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='bg-gray-800/50 rounded-xl p-5 border border-gray-700/50'
              >
                <div className='flex items-center gap-3 mb-4'>
                  <span className='text-2xl'>{nodeIcons[selected.type]}</span>
                  <div>
                    <h4 className='font-semibold'>{selected.name}</h4>
                    <StatusPill status={selected.status} />
                  </div>
                </div>
                <div className='space-y-3'>
                  {[
                    { label: 'زمن الاستجابة', value: `${selected.metrics.latency.toFixed(1)}ms` },
                    {
                      label: 'النطاق الترددي',
                      value: `${selected.metrics.bandwidth.toFixed(0)} Mbps`,
                    },
                    {
                      label: 'فقد الحزم',
                      value: `${(selected.metrics.packetLoss * 100).toFixed(3)}%`,
                    },
                    { label: 'وقت التشغيل', value: `${selected.metrics.uptime.toFixed(2)}%` },
                    { label: 'الاتصالات', value: `${selected.connections.length}` },
                  ].map((info, i) => (
                    <div key={i} className='flex justify-between text-sm'>
                      <span className='text-gray-400'>{info.label}</span>
                      <span className='font-medium'>{info.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className='bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 text-center text-gray-400'>
                <Network className='w-10 h-10 mx-auto mb-2 opacity-30' />
                <p className='text-sm'>اضغط على عقدة لعرض التفاصيل</p>
              </div>
            )}

            <div className='bg-gray-800/50 rounded-xl p-5 border border-gray-700/50'>
              <h4 className='font-semibold mb-3 text-sm'>حالة العقد</h4>
              <div className='space-y-2'>
                {nodes.map(node => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${selectedNode === node.id ? 'bg-gray-700/50' : 'hover:bg-gray-700/30'}`}
                  >
                    <div className='flex items-center gap-2'>
                      <span>{nodeIcons[node.type]}</span>
                      <span className='text-gray-300'>{node.name}</span>
                    </div>
                    <StatusPill status={node.status} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Logs ──────────────────────────────────────────────────

  const renderLogs = () => {
    const logs = engineRef.current.getLogs(100, logFilter === 'all' ? undefined : logFilter);
    const levelColors: Record<LogEntry['level'], string> = {
      debug: 'text-gray-400 bg-gray-500/10',
      info: 'text-blue-400 bg-blue-500/10',
      warn: 'text-yellow-400 bg-yellow-500/10',
      error: 'text-red-400 bg-red-500/10',
      critical: 'text-red-500 bg-red-500/20',
    };
    const levelIcons: Record<LogEntry['level'], React.ReactNode> = {
      debug: <Terminal className='w-3 h-3' />,
      info: <Info className='w-3 h-3' />,
      warn: <AlertTriangle className='w-3 h-3' />,
      error: <XCircle className='w-3 h-3' />,
      critical: <AlertOctagon className='w-3 h-3' />,
    };

    return (
      <div className='space-y-4'>
        <div className='bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 flex items-center gap-3 flex-wrap'>
          <Filter className='w-5 h-5 text-gray-400' />
          {(['all', 'debug', 'info', 'warn', 'error', 'critical'] as const).map(level => (
            <button
              key={level}
              onClick={() => setLogFilter(level)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                logFilter === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {level === 'all' ? 'الكل' : level.toUpperCase()}
            </button>
          ))}
          <span className='text-xs text-gray-500 mr-auto'>{logs.length} سجل</span>
        </div>

        <div className='bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden'>
          <div className='divide-y divide-gray-700/30 max-h-[600px] overflow-y-auto font-mono text-sm'>
            {logs.map(log => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className='px-4 py-2.5 hover:bg-gray-700/20 transition-colors flex items-start gap-3'
              >
                <span className='text-xs text-gray-500 flex-shrink-0 w-20 mt-0.5'>
                  {new Date(log.timestamp).toLocaleTimeString('ar-SA')}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 flex-shrink-0 ${levelColors[log.level]}`}
                >
                  {levelIcons[log.level]} {log.level}
                </span>
                <span className='text-xs text-purple-400 flex-shrink-0 w-24'>[{log.source}]</span>
                <span className='text-gray-200 flex-1'>{log.message}</span>
              </motion.div>
            ))}
            {logs.length === 0 && (
              <div className='p-8 text-center text-gray-500'>لا توجد سجلات بالمرشح المحدد</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── Settings ──────────────────────────────────────────────

  const renderSettings = () => (
    <div className='max-w-2xl mx-auto space-y-6'>
      <div className='bg-gray-800/50 rounded-xl p-6 border border-gray-700/50'>
        <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
          <Settings className='w-5 h-5 text-gray-400' /> إعدادات النظام
        </h3>
        <div className='space-y-4'>
          {[
            { label: 'الوضع المظلم', desc: 'تفعيل وضع العرض المظلم', checked: true },
            { label: 'الإشعارات', desc: 'تفعيل إشعارات النظام', checked: true },
            { label: 'التحديث التلقائي', desc: 'تحديث البيانات كل ثانيتين', checked: true },
            { label: 'الرسوم المتحركة', desc: 'تفعيل الانتقالات المتحركة', checked: true },
            { label: 'وضع المطور', desc: 'عرض بيانات التصحيح', checked: false },
          ].map((setting, i) => (
            <div
              key={i}
              className='flex items-center justify-between p-3 bg-gray-700/20 rounded-lg'
            >
              <div>
                <div className='text-sm font-medium'>{setting.label}</div>
                <div className='text-xs text-gray-400'>{setting.desc}</div>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  defaultChecked={setting.checked}
                  className='sr-only peer'
                  aria-label={setting.label}
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className='bg-gray-800/50 rounded-xl p-6 border border-gray-700/50'>
        <h3 className='text-lg font-semibold mb-4'>معلومات النظام</h3>
        <div className='space-y-2 text-sm'>
          {[
            { label: 'الإصدار', value: '3.0.0' },
            { label: 'المحرك', value: 'Quantum Hybrid Engine' },
            { label: 'المحاكي الكمي', value: 'State-Vector Simulator v1.0' },
            { label: 'محرك التحليلات', value: 'Real-Time Analytics Engine v1.0' },
            { label: 'AI API', value: 'Groq (Llama 3.3 70B)' },
          ].map((info, i) => (
            <div key={i} className='flex justify-between py-2 border-b border-gray-700/30'>
              <span className='text-gray-400'>{info.label}</span>
              <span>{info.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='bg-gray-800/50 rounded-xl p-6 border border-gray-700/50'>
        <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
          <Key className='w-5 h-5 text-blue-400' /> مفاتيح API
        </h3>
        <p className='text-sm text-gray-400 mb-4'>إدارة مفاتيح الوصول لواجهة البرمجة</p>
        <button
          onClick={() => setShowApiKeys(true)}
          className='px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors'
        >
          إدارة مفاتيح API
        </button>
      </div>
    </div>
  );

  // ─── Render Content ────────────────────────────────────────

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'quantum':
        return renderQuantum();
      case 'ai':
        return renderAI();
      case 'security':
        return renderSecurity();
      case 'analytics':
        return (
          <AIAnalysisDashboard
            systemMetrics={
              report?.current
                ? {
                    cpu: report.current.cpu,
                    memory: report.current.memory,
                    disk: report.current.disk,
                    network: report.current.network,
                    uptime: `${Math.floor(report.stats.uptime / 60)}m`,
                    activeConnections: report.current.activeConnections,
                  }
                : null
            }
            quantumStates={[
              {
                id: 'q1',
                name: 'Quantum Alpha',
                status: 'active',
                qubits: 127,
                coherenceTime: 100.5,
                fidelity: 99.2,
                gateErrors: 0.001,
                temperature: 0.015,
              },
              {
                id: 'q2',
                name: 'Quantum Beta',
                status: 'idle',
                qubits: 64,
                coherenceTime: 85.3,
                fidelity: 98.7,
                gateErrors: 0.002,
                temperature: 0.018,
              },
            ]}
            securityMetrics={
              report?.current
                ? {
                    encryptionLevel: 'AES-256 + Post-Quantum',
                    threatLevel: report.current.securityScore > 95 ? 'low' : 'medium',
                    activeThreats: 0,
                    blockedAttacks: 199,
                    quantumResistance: 99.9,
                  }
                : null
            }
          />
        );
      case 'mythos':
        return <OpenMythosDashboard />;
      case 'system':
        return renderSystem();
      case 'network':
        return renderNetwork();
      case 'logs':
        return renderLogs();
      case 'settings':
        return renderSettings();
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? 'dark bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}
      data-dashboard
    >
      {/* Trial Banner */}
      {trialDays != null && trialDays > 0 && trialDays <= 7 && (
        <div className='bg-gradient-to-r from-amber-600/90 to-orange-600/90 text-white text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2'>
          <Clock className='w-4 h-4' />
          <span>فترة التجربة تنتهي خلال {trialDays} يوم —</span>
          <button
            onClick={() => setShowSubscription(true)}
            className='underline font-bold hover:no-underline'
          >
            ترقّ الآن
          </button>
        </div>
      )}
      <div className='flex h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <TopBar />
          <main className='flex-1 overflow-auto p-6'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      {/* Subscription Dashboard Modal */}
      {showSubscription && <SubscriptionDashboard onClose={() => setShowSubscription(false)} />}
      {/* Notification Center Modal */}
      {showNotificationCenter && (
        <NotificationCenter onClose={() => setShowNotificationCenter(false)} />
      )}
      {/* API Keys Modal */}
      {showApiKeys && <ApiKeysDashboard onClose={() => setShowApiKeys(false)} />}
    </div>
  );
};

export default AdvancedQuantumDashboard;
