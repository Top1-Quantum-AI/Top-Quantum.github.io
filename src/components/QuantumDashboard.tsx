import { motion, AnimatePresence } from 'framer-motion';
import {
  Atom,
  Activity,
  BarChart3,
  Cpu,
  Settings,
  CheckCircle,
  Clock,
  Target,
  FlaskConical,
  Eye,
  EyeOff,
  Key,
  Search,
  Waves,
  Code,
  Gauge,
  GitBranch
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface QuantumCircuit {
  id: string;
  name: string;
  qubits: number;
  gates: number;
  depth: number;
  fidelity: number;
  executionTime: number;
  status: 'idle' | 'running' | 'completed' | 'error';
  algorithm: 'shor' | 'grover' | 'vqe' | 'qaoa' | 'qft' | 'custom';
  results?: QuantumResult | undefined;
}

interface QuantumResult {
  measurements: { [key: string]: number };
  probability: number;
  entanglement: number;
  coherenceTime: number;
  errorRate: number;
}

interface QuantumProcessor {
  id: string;
  name: string;
  qubits: number;
  connectivity: string;
  gateTime: number;
  coherenceTime: number;
  errorRate: number;
  temperature: number;
  status: 'online' | 'offline' | 'maintenance' | 'calibrating';
  utilization: number;
}

interface QuantumMetrics {
  totalQubits: number;
  activeCircuits: number;
  completedJobs: number;
  averageFidelity: number;
  systemUptime: number;
  quantumVolume: number;
  entanglementRate: number;
  decoherenceTime: number;
}

interface QuantumExperiment {
  id: string;
  name: string;
  type: 'algorithm' | 'optimization' | 'simulation' | 'research';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  estimatedTime: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  researcher: string;
  description: string;
}

const QuantumDashboard: React.FC = () => {
  const [circuits, setCircuits] = useState<QuantumCircuit[]>([]);
  const [processors, setProcessors] = useState<QuantumProcessor[]>([]);
  const [metrics, setMetrics] = useState<QuantumMetrics>({
    totalQubits: 0,
    activeCircuits: 0,
    completedJobs: 0,
    averageFidelity: 0,
    systemUptime: 0,
    quantumVolume: 0,
    entanglementRate: 0,
    decoherenceTime: 0
  });
  const [experiments, setExperiments] = useState<QuantumExperiment[]>([]);
  const [selectedCircuit, setSelectedCircuit] = useState<QuantumCircuit | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'circuits' | 'processors' | 'experiments'>('overview');
  const [isQuantumMode, setIsQuantumMode] = useState(true);
  const [showQuantumVisualizer, setShowQuantumVisualizer] = useState(false);

  // محاكاة بيانات الحوسبة الكمية
  useEffect(() => {
    const generateCircuits = (): QuantumCircuit[] => {
      const algorithms: Array<'shor' | 'grover' | 'vqe' | 'qaoa' | 'qft' | 'custom'> = 
        ['shor', 'grover', 'vqe', 'qaoa', 'qft', 'custom'];
      const statuses: Array<'idle' | 'running' | 'completed' | 'error'> = 
        ['idle', 'running', 'completed', 'error'];
      
      return Array.from({ length: 12 }, (_, i) => {
        const qubits = Math.floor(Math.random() * 20) + 5;
        const gates = Math.floor(Math.random() * 100) + 10;
        
        return {
          id: `circuit-${i + 1}`,
          name: `دائرة كمية ${i + 1}`,
          qubits,
          gates,
          depth: Math.floor(gates / qubits) + Math.floor(Math.random() * 5),
          fidelity: Math.random() * 0.3 + 0.7,
          executionTime: Math.random() * 1000 + 100,
          status: statuses[Math.floor(Math.random() * statuses.length)] ?? 'idle',
          algorithm: algorithms[Math.floor(Math.random() * algorithms.length)] ?? 'custom',
          results: Math.random() > 0.5 ? {
            measurements: {
              '|00⟩': Math.random(),
              '|01⟩': Math.random(),
              '|10⟩': Math.random(),
              '|11⟩': Math.random()
            },
            probability: Math.random(),
            entanglement: Math.random(),
            coherenceTime: Math.random() * 100 + 10,
            errorRate: Math.random() * 0.1
          } : undefined
        };
      });
    };

    const generateProcessors = (): QuantumProcessor[] => {
      const connectivities = ['linear', 'grid', 'all-to-all', 'heavy-hex', 'falcon'];
      const statuses: Array<'online' | 'offline' | 'maintenance' | 'calibrating'> = 
        ['online', 'offline', 'maintenance', 'calibrating'];
      
      return Array.from({ length: 6 }, (_, i) => ({
        id: `processor-${i + 1}`,
        name: `معالج كمي ${i + 1}`,
        qubits: [5, 16, 27, 53, 127, 433][i] ?? Math.floor(Math.random() * 100) + 50,
        connectivity: connectivities[Math.floor(Math.random() * connectivities.length)] ?? 'linear',
        gateTime: Math.random() * 100 + 10,
        coherenceTime: Math.random() * 200 + 50,
        errorRate: Math.random() * 0.05 + 0.001,
        temperature: Math.random() * 0.02 + 0.01,
        status: i < 4 ? 'online' : (statuses[Math.floor(Math.random() * statuses.length)] ?? 'online'),
        utilization: Math.random() * 100
      }));
    };

    const generateExperiments = (): QuantumExperiment[] => {
      const types: Array<'algorithm' | 'optimization' | 'simulation' | 'research'> = 
        ['algorithm', 'optimization', 'simulation', 'research'];
      const statuses: Array<'pending' | 'running' | 'completed' | 'failed'> = 
        ['pending', 'running', 'completed', 'failed'];
      const priorities: Array<'low' | 'medium' | 'high' | 'critical'> = 
        ['low', 'medium', 'high', 'critical'];
      const researchers = ['د. أحمد محمد', 'د. فاطمة علي', 'د. محمد حسن', 'د. نور الدين', 'د. سارة أحمد'];
      
      return Array.from({ length: 20 }, (_, i) => ({
        id: `experiment-${i + 1}`,
        name: `تجربة كمية ${i + 1}`,
        type: types[Math.floor(Math.random() * types.length)] ?? 'algorithm',
        status: statuses[Math.floor(Math.random() * statuses.length)] ?? 'pending',
        progress: Math.floor(Math.random() * 100),
        estimatedTime: Math.floor(Math.random() * 240) + 30,
        priority: priorities[Math.floor(Math.random() * priorities.length)] ?? 'medium',
        researcher: researchers[Math.floor(Math.random() * researchers.length)] ?? 'باحث',
        description: getExperimentDescription(i)
      }));
    };

    const initialCircuits = generateCircuits();
    const initialProcessors = generateProcessors();
    const initialExperiments = generateExperiments();
    
    setCircuits(initialCircuits);
    setProcessors(initialProcessors);
    setExperiments(initialExperiments);

    // حساب المقاييس
    const calculateMetrics = (circuits: QuantumCircuit[], processors: QuantumProcessor[]): QuantumMetrics => {
      const activeCircuits = circuits.filter(c => c.status === 'running').length;
      const completedCircuits = circuits.filter(c => c.status === 'completed').length;
      const totalQubits = processors.reduce((sum, p) => sum + p.qubits, 0);
      const averageFidelity = circuits.reduce((sum, c) => sum + c.fidelity, 0) / circuits.length;
      
      return {
        totalQubits,
        activeCircuits,
        completedJobs: completedCircuits,
        averageFidelity,
        systemUptime: 99.5 + Math.random() * 0.4,
        quantumVolume: Math.floor(Math.random() * 1000) + 500,
        entanglementRate: Math.random() * 0.8 + 0.2,
        decoherenceTime: Math.random() * 150 + 50
      };
    };

    setMetrics(calculateMetrics(initialCircuits, initialProcessors));

    // تحديث البيانات كل 3 ثوانٍ
    const interval = setInterval(() => {
      setCircuits(prev => prev.map(circuit => ({
        ...circuit,
        fidelity: circuit.status === 'running' ? 
          Math.max(0.5, circuit.fidelity + (Math.random() - 0.5) * 0.1) : circuit.fidelity
      })));
      
      setProcessors(prev => prev.map(processor => ({
        ...processor,
        utilization: processor.status === 'online' ? 
          Math.max(0, Math.min(100, processor.utilization + (Math.random() - 0.5) * 10)) : 0,
        temperature: processor.status === 'online' ? 
          Math.max(0.01, processor.temperature + (Math.random() - 0.5) * 0.005) : processor.temperature
      })));
      
      setExperiments(prev => prev.map(exp => ({
        ...exp,
        progress: exp.status === 'running' ? 
          Math.min(100, exp.progress + Math.random() * 3) : exp.progress
      })));
      
      setMetrics(prev => ({
        ...prev,
        quantumVolume: Math.max(400, prev.quantumVolume + (Math.random() - 0.5) * 50),
        entanglementRate: Math.max(0.1, Math.min(1, prev.entanglementRate + (Math.random() - 0.5) * 0.1)),
        decoherenceTime: Math.max(30, prev.decoherenceTime + (Math.random() - 0.5) * 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getExperimentDescription = (index: number): string => {
    const descriptions = [
      'تحسين خوارزمية شور لتحليل الأعداد الكبيرة',
      'محاكاة الجزيئات باستخدام VQE',
      'تطبيق خوارزمية جروفر للبحث',
      'تحسين QAOA للمسائل التوافقية',
      'دراسة التشابك الكمي في الأنظمة المعقدة',
      'تطوير بروتوكولات تصحيح الأخطاء الكمية',
      'محاكاة الأنظمة الكمية المفتوحة',
      'تحسين دوائر الحوسبة الكمية',
      'دراسة الانتقال الطوري الكمي',
      'تطبيق التعلم الآلي الكمي'
    ];
    
    return descriptions[index % descriptions.length] ?? 'تجربة كمية';
  };

  const getAlgorithmName = (algorithm: string) => {
    switch (algorithm) {
      case 'shor': return 'خوارزمية شور';
      case 'grover': return 'خوارزمية جروفر';
      case 'vqe': return 'VQE';
      case 'qaoa': return 'QAOA';
      case 'qft': return 'تحويل فورييه الكمي';
      case 'custom': return 'مخصص';
      default: return algorithm;
    }
  };

  const getAlgorithmIcon = (algorithm: string) => {
    switch (algorithm) {
      case 'shor': return <Key className="w-5 h-5" />;
      case 'grover': return <Search className="w-5 h-5" />;
      case 'vqe': return <FlaskConical className="w-5 h-5" />;
      case 'qaoa': return <Target className="w-5 h-5" />;
      case 'qft': return <Waves className="w-5 h-5" />;
      case 'custom': return <Code className="w-5 h-5" />;
      default: return <Atom className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'error': case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'idle': case 'pending': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
      case 'online': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'offline': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'maintenance': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'calibrating': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'قيد التشغيل';
      case 'completed': return 'مكتمل';
      case 'error': return 'خطأ';
      case 'failed': return 'فشل';
      case 'idle': return 'خامل';
      case 'pending': return 'في الانتظار';
      case 'online': return 'متصل';
      case 'offline': return 'غير متصل';
      case 'maintenance': return 'صيانة';
      case 'calibrating': return 'معايرة';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const renderQuantumVisualizer = () => (
    <div className="bg-black rounded-xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
      <div className="relative z-10">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2 space-x-reverse">
          <Atom className="w-6 h-6" />
          <span>مصور الحالة الكمية</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Bloch Sphere */}
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-2 border-blue-400 rounded-full opacity-30" />
              <div className="absolute inset-4 border border-blue-300 rounded-full opacity-20" />
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              <div className="absolute top-2 left-1/2 text-blue-300 text-xs transform -translate-x-1/2">|0⟩</div>
              <div className="absolute bottom-2 left-1/2 text-blue-300 text-xs transform -translate-x-1/2">|1⟩</div>
            </div>
            <div className="text-blue-300 text-sm">كرة بلوخ</div>
          </div>
          
          {/* Quantum State */}
          <div className="text-center">
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-300">|00⟩</span>
                <div className="flex-1 mx-2 bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
                <span className="text-white">45%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-300">|01⟩</span>
                <div className="flex-1 mx-2 bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }} />
                </div>
                <span className="text-white">25%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-300">|10⟩</span>
                <div className="flex-1 mx-2 bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }} />
                </div>
                <span className="text-white">20%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-300">|11⟩</span>
                <div className="flex-1 mx-2 bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }} />
                </div>
                <span className="text-white">10%</span>
              </div>
            </div>
            <div className="text-blue-300 text-sm">توزيع الاحتمالات</div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">0.87</div>
            <div className="text-xs text-gray-400">الإخلاص</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">0.65</div>
            <div className="text-xs text-gray-400">التشابك</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">125μs</div>
            <div className="text-xs text-gray-400">زمن التماسك</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quantum Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'الحجم الكمي', value: metrics.quantumVolume, icon: Gauge, color: 'blue', unit: '' },
          { label: 'معدل التشابك', value: (metrics.entanglementRate * 100), icon: GitBranch, color: 'purple', unit: '%' },
          { label: 'زمن عدم التماسك', value: metrics.decoherenceTime, icon: Clock, color: 'orange', unit: 'μs' },
          { label: 'متوسط الإخلاص', value: (metrics.averageFidelity * 100), icon: Target, color: 'green', unit: '%' }
        ].map(({ label, value, icon: Icon, color, unit }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</h3>
              <Icon className={`w-5 h-5 text-${color}-500`} />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {value.toFixed(value < 10 ? 2 : 0)}{unit}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`bg-${color}-500 h-2 rounded-full transition-all`}
                  style={{ width: `${Math.min(100, (value / (unit === '%' ? 100 : value > 100 ? value * 1.2 : 100)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quantum Visualizer */}
      {showQuantumVisualizer && renderQuantumVisualizer()}

      {/* Active Processors */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">المعالجات الكمية النشطة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processors.filter(p => p.status === 'online').slice(0, 6).map(processor => (
            <div key={processor.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 dark:text-white">{processor.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(processor.status)}`}>
                  {getStatusText(processor.status)}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">الكيوبتات:</span>
                  <span className="font-semibold">{processor.qubits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">الاستخدام:</span>
                  <span className="font-semibold">{processor.utilization.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${processor.utilization}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Running Circuits */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">الدوائر قيد التشغيل</h3>
        <div className="space-y-3">
          {circuits.filter(c => c.status === 'running').slice(0, 5).map(circuit => (
            <div key={circuit.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                {getAlgorithmIcon(circuit.algorithm)}
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{circuit.name}</span>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {getAlgorithmName(circuit.algorithm)} • {circuit.qubits} كيوبت
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {(circuit.fidelity * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">الإخلاص</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCircuits = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {circuits.map(circuit => (
        <motion.div
          key={circuit.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => setSelectedCircuit(circuit)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              {getAlgorithmIcon(circuit.algorithm)}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{circuit.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{getAlgorithmName(circuit.algorithm)}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(circuit.status)}`}>
              {getStatusText(circuit.status)}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">الكيوبتات:</span>
                <span className="font-semibold ml-2">{circuit.qubits}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">البوابات:</span>
                <span className="font-semibold ml-2">{circuit.gates}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">العمق:</span>
                <span className="font-semibold ml-2">{circuit.depth}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">الإخلاص:</span>
                <span className="font-semibold ml-2">{(circuit.fidelity * 100).toFixed(1)}%</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">الأداء</span>
                <span className="font-medium">{circuit.executionTime.toFixed(0)}ms</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${circuit.fidelity * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderProcessors = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {processors.map(processor => (
        <div key={processor.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Cpu className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{processor.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{processor.qubits} كيوبت</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(processor.status)}`}>
              {getStatusText(processor.status)}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">الاتصال:</span>
                <span className="font-semibold ml-2">{processor.connectivity}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">زمن البوابة:</span>
                <span className="font-semibold ml-2">{processor.gateTime.toFixed(1)}ns</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">زمن التماسك:</span>
                <span className="font-semibold ml-2">{processor.coherenceTime.toFixed(0)}μs</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">معدل الخطأ:</span>
                <span className="font-semibold ml-2">{(processor.errorRate * 100).toFixed(3)}%</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">الاستخدام</span>
                <span className="font-medium">{processor.utilization.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${processor.utilization}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">درجة الحرارة</span>
                <span className="font-medium">{processor.temperature.toFixed(3)}K</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${(processor.temperature / 0.1) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderExperiments = () => (
    <div className="space-y-4">
      {experiments.map(experiment => (
        <div key={experiment.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className={`w-3 h-3 rounded-full ${
                experiment.status === 'running' ? 'bg-blue-500 animate-pulse' :
                experiment.status === 'completed' ? 'bg-green-500' :
                experiment.status === 'failed' ? 'bg-red-500' : 'bg-gray-400'
              }`}
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{experiment.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{experiment.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(experiment.priority)} bg-opacity-10`}>
                {experiment.priority === 'critical' ? 'حرج' :
                 experiment.priority === 'high' ? 'عالي' :
                 experiment.priority === 'medium' ? 'متوسط' : 'منخفض'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(experiment.status)}`}>
                {getStatusText(experiment.status)}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-600 dark:text-gray-400">النوع:</span>
              <span className="font-semibold ml-2">
                {experiment.type === 'algorithm' ? 'خوارزمية' :
                 experiment.type === 'optimization' ? 'تحسين' :
                 experiment.type === 'simulation' ? 'محاكاة' : 'بحث'}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">الباحث:</span>
              <span className="font-semibold ml-2">{experiment.researcher}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">الوقت المقدر:</span>
              <span className="font-semibold ml-2">{experiment.estimatedTime} دقيقة</span>
            </div>
          </div>
          
          {experiment.status === 'running' && (
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">التقدم</span>
                <span className="font-medium">{experiment.progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${experiment.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center space-x-2 space-x-reverse">
                <Atom className="w-8 h-8 animate-spin" />
                <span>لوحة تحكم الحوسبة الكمية</span>
              </h1>
              <p className="opacity-90">إدارة ومراقبة الأنظمة والدوائر الكمية</p>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => setShowQuantumVisualizer(!showQuantumVisualizer)}
                className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                  showQuantumVisualizer ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {showQuantumVisualizer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>المصور الكمي</span>
              </button>
              
              <button
                onClick={() => setIsQuantumMode(!isQuantumMode)}
                className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                  isQuantumMode ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Atom className={`w-4 h-4 ${isQuantumMode ? 'animate-spin' : ''}`} />
                <span>{isQuantumMode ? 'الوضع الكمي' : 'الوضع الكلاسيكي'}</span>
              </button>
              
              <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">إجمالي الكيوبتات</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.totalQubits}</p>
            </div>
            <Atom className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">الدوائر النشطة</p>
              <p className="text-2xl font-bold text-green-600">{metrics.activeCircuits}</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">المهام المكتملة</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.completedJobs}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">وقت التشغيل</p>
              <p className="text-2xl font-bold text-orange-600">{metrics.systemUptime.toFixed(1)}%</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 space-x-reverse px-6">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
              { id: 'circuits', label: 'الدوائر الكمية', icon: Atom },
              { id: 'processors', label: 'المعالجات', icon: Cpu },
              { id: 'experiments', label: 'التجارب', icon: FlaskConical }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as 'overview' | 'circuits' | 'processors' | 'experiments')}
                className={`flex items-center space-x-2 space-x-reverse py-4 border-b-2 font-medium text-sm transition-colors ${
                  viewMode === id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {viewMode === 'overview' && renderOverview()}
          {viewMode === 'circuits' && renderCircuits()}
          {viewMode === 'processors' && renderProcessors()}
          {viewMode === 'experiments' && renderExperiments()}
        </div>
      </div>

      {/* Circuit Details Modal */}
      <AnimatePresence>
        {selectedCircuit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCircuit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCircuit.name}</h2>
                <button
                  onClick={() => setSelectedCircuit(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">معلومات الدائرة</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">الخوارزمية:</span>
                        <span>{getAlgorithmName(selectedCircuit.algorithm)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">الكيوبتات:</span>
                        <span className="font-semibold">{selectedCircuit.qubits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">البوابات:</span>
                        <span className="font-semibold">{selectedCircuit.gates}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">العمق:</span>
                        <span className="font-semibold">{selectedCircuit.depth}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">الأداء</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">الإخلاص</span>
                          <span className="font-medium">{(selectedCircuit.fidelity * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${selectedCircuit.fidelity * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">وقت التنفيذ:</span>
                        <span className="font-medium">{selectedCircuit.executionTime.toFixed(0)}ms</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedCircuit.results && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">النتائج</h3>
                      <div className="space-y-2 text-sm">
                        {Object.entries(selectedCircuit.results.measurements).map(([state, prob]) => (
                          <div key={state} className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">{state}</span>
                            <span className="font-medium">{(prob * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuantumDashboard;
export type { QuantumCircuit, QuantumProcessor, QuantumMetrics, QuantumExperiment, QuantumResult };