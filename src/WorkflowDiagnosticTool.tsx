import { RotateCcw, Cpu, Database, FileText, Search } from 'lucide-react';
import { useState } from 'react';

const WorkflowDiagnosticTool = () => {
  // حالة تسجيل الدخول
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const correctUsername = import.meta.env.VITE_ADMIN_USERNAME ?? '';
  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? '';

  const [systemState, setSystemState] = useState('analyzing');
  const [agents, setAgents] = useState([
    { id: 'readfile', name: 'ReadFile', status: 'terminated', health: 0, artifacts: 0 },
    {
      id: 'answersmall',
      name: 'AnswerQuestionSmallCsv',
      status: 'terminated',
      health: 0,
      artifacts: 0,
    },
    { id: 'answercsv', name: 'AnswerQuestionCsv', status: 'terminated', health: 0, artifacts: 0 },
    { id: 'sortcsv', name: 'SortCsv', status: 'terminated', health: 0, artifacts: 0 },
    { id: 'writefile', name: 'WriteFile', status: 'terminated', health: 0, artifacts: 0 },
    { id: 'synthesize', name: 'SynthesizeInfo', status: 'terminated', health: 0, artifacts: 0 },
    { id: 'threesum', name: 'ThreeSum', status: 'terminated', health: 0, artifacts: 0 },
    { id: 'password', name: 'PasswordGenerator', status: 'terminated', health: 0, artifacts: 0 },
    { id: 'organizer', name: 'FileOrganizer', status: 'terminated', health: 0, artifacts: 0 },
    { id: 'search', name: 'Search', status: 'terminated', health: 0, artifacts: 0 },
    { id: 'basic', name: 'BasicRetrieval', status: 'terminated', health: 0, artifacts: 0 },
    { id: 'revenue', name: 'RevenueRetrieval', status: 'terminated', health: 0, artifacts: 0 },
  ]);

  const [quantumMetrics, setQuantumMetrics] = useState({
    coherence: 0,
    entanglement: 0,
    superposition: 0,
    planckConstant: 6.626e-34,
  });

  const getAgentIcon = (name: string) => {
    if (name.includes('File')) return <FileText className='w-4 h-4' />;
    if (name.includes('Search') || name.includes('Retrieval'))
      return <Search className='w-4 h-4' />;
    if (name.includes('Csv') || name.includes('Sort')) return <Database className='w-4 h-4' />;
    return <Cpu className='w-4 h-4' />;
  };

  const quantumReboot = async () => {
    setSystemState('rebooting');

    // محاكاة إعادة التشغيل الكمي
    for (let i = 0; i < agents.length; i++) {
      setTimeout(() => {
        setAgents(prev =>
          prev.map((agent, idx) =>
            idx === i
              ? {
                  ...agent,
                  status: 'initializing',
                  health: Math.random() * 100,
                  artifacts: Math.floor(Math.random() * 5),
                }
              : agent
          )
        );
      }, i * 200);
    }

    // تحديث المقاييس الكمية
    setTimeout(
      () => {
        setQuantumMetrics({
          coherence: 95 + Math.random() * 5,
          entanglement: 88 + Math.random() * 12,
          superposition: 76 + Math.random() * 24,
          planckConstant: 6.626e-34,
        });
        setSystemState('running');
      },
      agents.length * 200 + 1000
    );
  };

  const diagnosticAnalysis = () => {
    const terminatedCount = agents.filter(a => a.status === 'terminated').length;
    const avgHealth = agents.reduce((sum, a) => sum + a.health, 0) / agents.length;

    return {
      terminatedAgents: terminatedCount,
      systemHealth: avgHealth,
      recommendation: terminatedCount > 6 ? 'quantum_reboot' : 'selective_restart',
    };
  };

  // دالة تسجيل الدخول
  const handleLogin = () => {
    if (loginUsername === correctUsername && loginPassword === correctPassword) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('اسم المستخدم أو كلمة السر غير صحيح');
    }
  };

  const analysis = diagnosticAnalysis();

  // إذا لم يتم تسجيل الدخول، عرض شاشة تسجيل الدخول
  if (!isLoggedIn) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-6'>
        <div className='bg-gray-800/50 backdrop-blur rounded-lg p-8 border border-gray-700 w-full max-w-md'>
          <h2 className='text-2xl font-bold text-white text-center mb-6'>تسجيل الدخول</h2>
          <div className='space-y-4'>
            <div>
              <label className='block text-gray-300 text-sm font-medium mb-2'>اسم المستخدم</label>
              <input
                type='text'
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500'
                placeholder='أدخل اسم المستخدم'
              />
            </div>
            <div>
              <label className='block text-gray-300 text-sm font-medium mb-2'>كلمة السر</label>
              <input
                type='password'
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500'
                placeholder='أدخل كلمة السر'
                onKeyPress={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            {loginError && <div className='text-red-400 text-sm text-center'>{loginError}</div>}
            <button
              onClick={handleLogin}
              className='w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200'
            >
              دخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 text-white'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
            نظام التشخيص الكمي للـ Workflow
          </h1>
          <p className='text-gray-300 text-lg'>تحليل رياضي مستوحى من نظريات ماكس بلانك</p>
        </div>

        {/* Quantum Metrics Dashboard */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700'>
            <h3 className='text-blue-400 font-semibold mb-2'>التماسك الكمي</h3>
            <div className='text-2xl font-bold'>{quantumMetrics.coherence.toFixed(1)}%</div>
            <div className='w-full bg-gray-700 rounded-full h-2 mt-2'>
              <div
                className='bg-blue-500 h-2 rounded-full transition-all duration-1000'
                style={{ width: `${quantumMetrics.coherence}%` }}
              />
            </div>
          </div>

          <div className='bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700'>
            <h3 className='text-purple-400 font-semibold mb-2'>التشابك</h3>
            <div className='text-2xl font-bold'>{quantumMetrics.entanglement.toFixed(1)}%</div>
            <div className='w-full bg-gray-700 rounded-full h-2 mt-2'>
              <div
                className='bg-purple-500 h-2 rounded-full transition-all duration-1000'
                style={{ width: `${quantumMetrics.entanglement}%` }}
              />
            </div>
          </div>

          <div className='bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700'>
            <h3 className='text-green-400 font-semibold mb-2'>التراكب</h3>
            <div className='text-2xl font-bold'>{quantumMetrics.superposition.toFixed(1)}%</div>
            <div className='w-full bg-gray-700 rounded-full h-2 mt-2'>
              <div
                className='bg-green-500 h-2 rounded-full transition-all duration-1000'
                style={{ width: `${quantumMetrics.superposition}%` }}
              />
            </div>
          </div>

          <div className='bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700'>
            <h3 className='text-yellow-400 font-semibold mb-2'>ثابت بلانك</h3>
            <div className='text-lg font-mono'>
              {quantumMetrics.planckConstant.toExponential(3)}
            </div>
            <div className='text-sm text-gray-400 mt-1'>J⋅s</div>
          </div>
        </div>

        {/* System Status */}
        <div className='bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700 mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-bold'>حالة النظام</h2>
            <div
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                systemState === 'running'
                  ? 'bg-green-500/20 text-green-400'
                  : systemState === 'rebooting'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
              }`}
            >
              {systemState === 'running'
                ? 'يعمل'
                : systemState === 'rebooting'
                  ? 'إعادة تشغيل'
                  : 'تحليل'}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-red-400'>{analysis.terminatedAgents}</div>
              <div className='text-gray-400'>وكلاء متوقفون</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-blue-400'>
                {analysis.systemHealth.toFixed(1)}%
              </div>
              <div className='text-gray-400'>صحة النظام</div>
            </div>
            <div className='text-center'>
              <button
                onClick={quantumReboot}
                disabled={systemState === 'rebooting'}
                className='bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 mx-auto'
              >
                <RotateCcw
                  className={`w-4 h-4 ${systemState === 'rebooting' ? 'animate-spin' : ''}`}
                />
                إعادة تشغيل كمي
              </button>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {agents.map(agent => (
            <div
              key={agent.id}
              className='bg-gray-800/50 backdrop-blur rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-200'
            >
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-2'>
                  {getAgentIcon(agent.name)}
                  <span className='font-semibold text-sm'>{agent.name}</span>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    agent.status === 'running'
                      ? 'bg-green-500'
                      : agent.status === 'initializing'
                        ? 'bg-yellow-500 animate-pulse'
                        : 'bg-red-500'
                  }`}
                />
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-400'>الصحة:</span>
                  <span
                    className={`font-semibold ${
                      agent.health > 70
                        ? 'text-green-400'
                        : agent.health > 30
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }`}
                  >
                    {agent.health.toFixed(0)}%
                  </span>
                </div>

                <div className='w-full bg-gray-700 rounded-full h-1.5'>
                  <div
                    className={`h-1.5 rounded-full transition-all duration-1000 ${
                      agent.health > 70
                        ? 'bg-green-500'
                        : agent.health > 30
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${agent.health}%` }}
                  />
                </div>

                <div className='flex justify-between text-sm'>
                  <span className='text-gray-400'>المخرجات:</span>
                  <span className='text-blue-400 font-semibold'>{agent.artifacts}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quantum Analysis */}
        <div className='mt-8 bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700'>
          <h3 className='text-xl font-bold mb-4 text-center'>التحليل الكمي المتقدم</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h4 className='text-lg font-semibold mb-2 text-blue-400'>معادلة بلانك للطاقة</h4>
              <div className='bg-gray-900/50 p-4 rounded-lg font-mono text-center'>E = h × ν</div>
              <p className='text-sm text-gray-400 mt-2'>
                حيث E = الطاقة، h = ثابت بلانك، ν = التردد
              </p>
            </div>

            <div>
              <h4 className='text-lg font-semibold mb-2 text-purple-400'>مبدأ عدم اليقين</h4>
              <div className='bg-gray-900/50 p-4 rounded-lg font-mono text-center'>
                Δx × Δp ≥ ℏ/2
              </div>
              <p className='text-sm text-gray-400 mt-2'>العلاقة بين عدم اليقين في الموضع والزخم</p>
            </div>
          </div>

          <div className='mt-6 text-center'>
            <p className='text-gray-300'>
              "الطاقة الكمية تأتي في حزم منفصلة تُسمى الكوانتا" - ماكس بلانك
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDiagnosticTool;
