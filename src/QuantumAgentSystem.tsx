import React, { useState, useEffect, useRef } from 'react';

// نظام الوكلاء الكمي المتقدم - Quantum Agent System
// مبني على مبادئ ماكس بلانك ونظرية الكم

interface QuantumAgent {
  id: string;
  name: string;
  type: 'controller' | 'corrector' | 'modifier' | 'monitor';
  status: 'active' | 'idle' | 'error' | 'quantum_superposition';
  energy: number; // طاقة الوكيل حسب معادلة بلانك E=hν
  coherence: number; // التماسك الكمي
  entanglement: number; // التشابك الكمي
  tasks: string[];
  performance: number;
  quantumState: 'ground' | 'excited' | 'superposition' | 'entangled';
}

interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  systemEfficiency: number;
  quantumCoherence: number;
  errorRate: number;
  planckConstant: number;
  uncertaintyPrinciple: number;
}

const QuantumAgentSystem: React.FC = () => {
  // حالة تسجيل الدخول
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const correctUsername = '511';
  const correctPassword = '511';

  const [agents, setAgents] = useState<QuantumAgent[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalAgents: 0,
    activeAgents: 0,
    systemEfficiency: 0,
    quantumCoherence: 0,
    errorRate: 0,
    planckConstant: 6.62607015e-34,
    uncertaintyPrinciple: 1.054571817e-34
  });

  // دالة تسجيل الدخول
  const handleLogin = () => {
    if (loginUsername === correctUsername && loginPassword === correctPassword) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('اسم المستخدم أو كلمة السر غير صحيح');
    }
  };
  const [isSystemActive, setIsSystemActive] = useState(false);
  const [quantumField, setQuantumField] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // إنشاء الوكلاء الكميين
  const createQuantumAgents = () => {
    const newAgents: QuantumAgent[] = [
      {
        id: 'agent-001',
        name: 'وكيل التحكم الرئيسي',
        type: 'controller',
        status: 'active',
        energy: Math.random() * 100,
        coherence: 0.95,
        entanglement: 0.8,
        tasks: ['إدارة النظام', 'مراقبة الأداء', 'التحكم في العمليات'],
        performance: 98.5,
        quantumState: 'excited'
      },
      {
        id: 'agent-002',
        name: 'وكيل تصحيح الأخطاء',
        type: 'corrector',
        status: 'active',
        energy: Math.random() * 100,
        coherence: 0.92,
        entanglement: 0.75,
        tasks: ['كشف الأخطاء', 'تصحيح البيانات', 'استعادة النظام'],
        performance: 96.2,
        quantumState: 'superposition'
      },
      {
        id: 'agent-003',
        name: 'وكيل التعديل والتحسين',
        type: 'modifier',
        status: 'active',
        energy: Math.random() * 100,
        coherence: 0.88,
        entanglement: 0.82,
        tasks: ['تحسين الأداء', 'تعديل المعاملات', 'تطوير النظام'],
        performance: 94.7,
        quantumState: 'entangled'
      },
      {
        id: 'agent-004',
        name: 'وكيل المراقبة الكمية',
        type: 'monitor',
        status: 'active',
        energy: Math.random() * 100,
        coherence: 0.90,
        entanglement: 0.78,
        tasks: ['مراقبة الحالة الكمية', 'تحليل البيانات', 'إنذار مبكر'],
        performance: 97.1,
        quantumState: 'ground'
      }
    ];
    setAgents(newAgents);
  };

  // تحديث المقاييس الكمية
  const updateQuantumMetrics = () => {
    if (agents.length === 0) return;

    const activeAgents = agents.filter(agent => agent.status === 'active').length;
    const avgCoherence = agents.reduce((sum, agent) => sum + agent.coherence, 0) / agents.length;
    const avgPerformance = agents.reduce((sum, agent) => sum + agent.performance, 0) / agents.length;
    const errorRate = Math.max(0, 100 - avgPerformance) / 100;

    setSystemMetrics({
      totalAgents: agents.length,
      activeAgents,
      systemEfficiency: avgPerformance,
      quantumCoherence: avgCoherence,
      errorRate,
      planckConstant: 6.62607015e-34,
      uncertaintyPrinciple: 1.054571817e-34 / 2
    });
  };

  // محاكاة العمليات الكمية
  const simulateQuantumOperations = () => {
    setAgents(prevAgents => 
      prevAgents.map(agent => ({
        ...agent,
        energy: Math.max(0, agent.energy + (Math.random() - 0.5) * 10),
        coherence: Math.min(1, Math.max(0, agent.coherence + (Math.random() - 0.5) * 0.05)),
        entanglement: Math.min(1, Math.max(0, agent.entanglement + (Math.random() - 0.5) * 0.03)),
        performance: Math.min(100, Math.max(0, agent.performance + (Math.random() - 0.5) * 2)),
        status: Math.random() > 0.95 ? 'quantum_superposition' : 'active'
      }))
    );
    setQuantumField(prev => (prev + 1) % 360);
  };

  // تشغيل النظام
  const activateSystem = () => {
    if (!isSystemActive) {
      createQuantumAgents();
      setIsSystemActive(true);
      intervalRef.current = setInterval(() => {
        simulateQuantumOperations();
      }, 1000);
    }
  };

  // إيقاف النظام
  const deactivateSystem = () => {
    setIsSystemActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAgents([]);
  };

  // إعادة تشغيل كمي
  const quantumReboot = () => {
    deactivateSystem();
    setTimeout(() => {
      activateSystem();
    }, 1000);
  };

  // تصحيح وكيل معين
  const correctAgent = (agentId: string) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === agentId 
          ? { 
              ...agent, 
              status: 'active',
              performance: Math.min(100, agent.performance + 5),
              coherence: Math.min(1, agent.coherence + 0.1),
              quantumState: 'excited'
            }
          : agent
      )
    );
  };

  useEffect(() => {
    updateQuantumMetrics();
  }, [agents]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'idle': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'quantum_superposition': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getQuantumStateColor = (state: string) => {
    switch (state) {
      case 'ground': return 'bg-blue-500';
      case 'excited': return 'bg-red-500';
      case 'superposition': return 'bg-purple-500';
      case 'entangled': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // إذا لم يتم تسجيل الدخول، عرض شاشة تسجيل الدخول
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex items-center justify-center">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            تسجيل الدخول إلى النظام الكمي
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                اسم المستخدم
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="أدخل اسم المستخدم"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                كلمة السر
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="أدخل كلمة السر"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            {loginError && (
              <div className="text-red-400 text-sm text-center">
                {loginError}
              </div>
            )}
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            نظام الوكلاء الكمي المتقدم
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            نظام ذكي للتحكم والتصحيح والتعديل مبني على مبادئ ماكس بلانك الكمية
          </p>
          
          {/* أزرار التحكم */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={activateSystem}
              disabled={isSystemActive}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              تشغيل النظام
            </button>
            <button
              onClick={deactivateSystem}
              disabled={!isSystemActive}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              إيقاف النظام
            </button>
            <button
              onClick={quantumReboot}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              إعادة تشغيل كمي
            </button>
          </div>
        </div>

        {/* المقاييس الكمية */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">إجمالي الوكلاء</h3>
            <p className="text-2xl font-bold text-blue-400">{systemMetrics.totalAgents}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">الوكلاء النشطون</h3>
            <p className="text-2xl font-bold text-green-400">{systemMetrics.activeAgents}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">كفاءة النظام</h3>
            <p className="text-2xl font-bold text-yellow-400">{systemMetrics.systemEfficiency.toFixed(1)}%</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">التماسك الكمي</h3>
            <p className="text-2xl font-bold text-purple-400">{(systemMetrics.quantumCoherence * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">معدل الأخطاء</h3>
            <p className="text-2xl font-bold text-red-400">{(systemMetrics.errorRate * 100).toFixed(2)}%</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">ثابت بلانك</h3>
            <p className="text-sm font-bold text-cyan-400">{systemMetrics.planckConstant.toExponential(2)}</p>
          </div>
        </div>

        {/* قائمة الوكلاء */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
                  <p className="text-sm text-gray-400">ID: {agent.id}</p>
                  <p className="text-sm text-gray-400">النوع: {agent.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getQuantumStateColor(agent.quantumState)}`}></div>
                  <span className={`text-sm font-semibold ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>
              </div>

              {/* مقاييس الوكيل */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400">الطاقة</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${agent.energy}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-400 mt-1">{agent.energy.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">الأداء</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${agent.performance}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-400 mt-1">{agent.performance.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">التماسك</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${agent.coherence * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-purple-400 mt-1">{(agent.coherence * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">التشابك</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${agent.entanglement * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-yellow-400 mt-1">{(agent.entanglement * 100).toFixed(1)}%</p>
                </div>
              </div>

              {/* المهام */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-300 mb-2">المهام:</p>
                <ul className="text-xs text-gray-400 space-y-1">
                  {agent.tasks.map((task, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              {/* زر التصحيح */}
              <button
                onClick={() => correctAgent(agent.id)}
                className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-semibold transition-colors"
              >
                تصحيح وتحسين الوكيل
              </button>
            </div>
          ))}
        </div>

        {/* معلومات النظام */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">معلومات النظام الكمي</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-2">المبادئ الكمية المطبقة:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• معادلة بلانك للطاقة: E = hν</li>
                <li>• مبدأ عدم اليقين لهايزنبرغ: Δx·Δp ≥ ℏ/2</li>
                <li>• التشابك الكمي للوكلاء</li>
                <li>• التراكب الكمي للحالات</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-400 mb-2">وظائف النظام:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• التحكم الذكي في العمليات</li>
                <li>• تصحيح الأخطاء تلقائياً</li>
                <li>• تعديل وتحسين الأداء</li>
                <li>• مراقبة مستمرة للنظام</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumAgentSystem;