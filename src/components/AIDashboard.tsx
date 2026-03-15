import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Cpu,
  Activity,
  Target,
  Layers,
  Eye,
  MessageSquare,
  Settings,
  Play,
  Pause,
  CheckCircle,
  Sparkles,
  Rocket,
  Database,
  Zap,
  Server,
  BarChart3,
  PieChart
} from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  type: 'nlp' | 'cv' | 'ml' | 'dl' | 'rl';
  status: 'training' | 'ready' | 'deployed' | 'error';
  accuracy: number;
  performance: {
    speed: number;
    memory: number;
    cpu: number;
    gpu: number;
  };
  metrics: {
    precision: number;
    recall: number;
    f1Score: number;
    loss: number;
  };
  lastUpdated: string;
}

interface AITask {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'generation' | 'detection' | 'translation';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  estimatedTime: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface AIStats {
  totalModels: number;
  activeModels: number;
  totalTasks: number;
  completedTasks: number;
  averageAccuracy: number;
  resourceUsage: {
    cpu: number;
    memory: number;
    gpu: number;
    storage: number;
  };
}

const AIDashboard: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [stats, setStats] = useState<AIStats>({
    totalModels: 0,
    activeModels: 0,
    totalTasks: 0,
    completedTasks: 0,
    averageAccuracy: 0,
    resourceUsage: { cpu: 0, memory: 0, gpu: 0, storage: 0 }
  });
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'models' | 'tasks' | 'analytics'>('overview');
  const [isTraining, setIsTraining] = useState(false);

  // محاكاة بيانات الذكاء الاصطناعي
  useEffect(() => {
    const generateModels = (): AIModel[] => {
      const modelTypes: Array<'nlp' | 'cv' | 'ml' | 'dl' | 'rl'> = ['nlp', 'cv', 'ml', 'dl', 'rl'];
      const statuses: Array<'training' | 'ready' | 'deployed' | 'error'> = ['training', 'ready', 'deployed', 'error'];
      
      return Array.from({ length: 8 }, (_, i) => ({
        id: `model-${i + 1}`,
        name: `نموذج الذكاء الاصطناعي ${i + 1}`,
        type: modelTypes[Math.floor(Math.random() * modelTypes.length)] ?? 'ml',
        status: i < 6 ? (statuses[Math.floor(Math.random() * 3)] ?? 'ready') : 'error',
        accuracy: Math.floor(Math.random() * 30) + 70,
        performance: {
          speed: Math.floor(Math.random() * 100) + 50,
          memory: Math.floor(Math.random() * 80) + 20,
          cpu: Math.floor(Math.random() * 90) + 10,
          gpu: Math.floor(Math.random() * 95) + 5
        },
        metrics: {
          precision: Math.random() * 0.3 + 0.7,
          recall: Math.random() * 0.3 + 0.7,
          f1Score: Math.random() * 0.3 + 0.7,
          loss: Math.random() * 0.5 + 0.1
        },
        lastUpdated: new Date(Date.now() - Math.random() * 86400000).toISOString()
      }));
    };

    const generateTasks = (): AITask[] => {
      const taskTypes: Array<'classification' | 'regression' | 'generation' | 'detection' | 'translation'> = 
        ['classification', 'regression', 'generation', 'detection', 'translation'];
      const statuses: Array<'pending' | 'running' | 'completed' | 'failed'> = 
        ['pending', 'running', 'completed', 'failed'];
      const priorities: Array<'low' | 'medium' | 'high' | 'critical'> = 
        ['low', 'medium', 'high', 'critical'];
      
      return Array.from({ length: 12 }, (_, i) => ({
        id: `task-${i + 1}`,
        name: `مهمة ${i + 1}`,
        type: taskTypes[Math.floor(Math.random() * taskTypes.length)] ?? 'classification',
        status: statuses[Math.floor(Math.random() * statuses.length)] ?? 'pending',
        progress: Math.floor(Math.random() * 100),
        estimatedTime: Math.floor(Math.random() * 120) + 10,
        priority: priorities[Math.floor(Math.random() * priorities.length)] ?? 'medium'
      }));
    };

    const initialModels = generateModels();
    const initialTasks = generateTasks();
    
    setModels(initialModels);
    setTasks(initialTasks);

    // حساب الإحصائيات
    const calculateStats = (models: AIModel[], tasks: AITask[]): AIStats => {
      const activeModels = models.filter(m => m.status === 'deployed' || m.status === 'ready');
      const completedTasks = tasks.filter(t => t.status === 'completed');
      
      return {
        totalModels: models.length,
        activeModels: activeModels.length,
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        averageAccuracy: activeModels.reduce((sum, model) => sum + model.accuracy, 0) / activeModels.length || 0,
        resourceUsage: {
          cpu: Math.floor(Math.random() * 40) + 30,
          memory: Math.floor(Math.random() * 50) + 40,
          gpu: Math.floor(Math.random() * 60) + 20,
          storage: Math.floor(Math.random() * 30) + 50
        }
      };
    };

    setStats(calculateStats(initialModels, initialTasks));

    // تحديث البيانات كل 3 ثوانٍ
    const interval = setInterval(() => {
      setModels(prev => prev.map(model => ({
        ...model,
        performance: {
          ...model.performance,
          speed: Math.max(10, model.performance.speed + (Math.random() - 0.5) * 10),
          cpu: Math.max(5, Math.min(100, model.performance.cpu + (Math.random() - 0.5) * 5))
        }
      })));
      
      setTasks(prev => prev.map(task => ({
        ...task,
        progress: task.status === 'running' ? 
          Math.min(100, task.progress + Math.random() * 5) : task.progress
      })));
      
      setStats(prev => ({
        ...prev,
        resourceUsage: {
          cpu: Math.max(10, Math.min(100, prev.resourceUsage.cpu + (Math.random() - 0.5) * 5)),
          memory: Math.max(10, Math.min(100, prev.resourceUsage.memory + (Math.random() - 0.5) * 3)),
          gpu: Math.max(5, Math.min(100, prev.resourceUsage.gpu + (Math.random() - 0.5) * 8)),
          storage: Math.max(20, Math.min(100, prev.resourceUsage.storage + (Math.random() - 0.5) * 2))
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'nlp': return <MessageSquare className="w-5 h-5" />;
      case 'cv': return <Eye className="w-5 h-5" />;
      case 'ml': return <Brain className="w-5 h-5" />;
      case 'dl': return <Layers className="w-5 h-5" />;
      case 'rl': return <Target className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const getModelTypeName = (type: string) => {
    switch (type) {
      case 'nlp': return 'معالجة اللغة';
      case 'cv': return 'رؤية حاسوبية';
      case 'ml': return 'تعلم آلة';
      case 'dl': return 'تعلم عميق';
      case 'rl': return 'تعلم معزز';
      default: return 'غير محدد';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'training': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'ready': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'deployed': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'running': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'pending': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'training': return 'تدريب';
      case 'ready': return 'جاهز';
      case 'deployed': return 'منشور';
      case 'error': return 'خطأ';
      case 'running': return 'قيد التشغيل';
      case 'completed': return 'مكتمل';
      case 'failed': return 'فشل';
      case 'pending': return 'في الانتظار';
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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Resource Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'المعالج', value: stats.resourceUsage.cpu, icon: Cpu, color: 'blue' },
          { label: 'الذاكرة', value: stats.resourceUsage.memory, icon: Database, color: 'green' },
          { label: 'كرت الرسوميات', value: stats.resourceUsage.gpu, icon: Zap, color: 'purple' },
          { label: 'التخزين', value: stats.resourceUsage.storage, icon: Server, color: 'orange' }
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</h3>
              <Icon className={`w-5 h-5 text-${color}-500`} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {value.toFixed(1)}%
                </span>
                <span className={`text-sm ${
                  value > 80 ? 'text-red-500' : value > 60 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {value > 80 ? 'عالي' : value > 60 ? 'متوسط' : 'منخفض'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`bg-${color}-500 h-2 rounded-full transition-all`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Models */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">النماذج النشطة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.filter(m => m.status === 'deployed' || m.status === 'ready').slice(0, 6).map(model => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedModel(model)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  {getModelTypeIcon(model.type)}
                  <span className="font-medium text-gray-900 dark:text-white">{model.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                  {getStatusText(model.status)}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {getModelTypeName(model.type)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">الدقة:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{model.accuracy}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Running Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">المهام قيد التشغيل</h3>
        <div className="space-y-3">
          {tasks.filter(t => t.status === 'running').slice(0, 5).map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="font-medium text-gray-900 dark:text-white">{task.name}</span>
                <span className={`text-sm ${getPriorityColor(task.priority)}`}>
                  {task.priority === 'critical' ? 'حرج' :
                   task.priority === 'high' ? 'عالي' :
                   task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                </span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 min-w-12">{task.progress.toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderModels = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {models.map(model => (
        <motion.div
          key={model.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => setSelectedModel(model)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              {getModelTypeIcon(model.type)}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{model.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{getModelTypeName(model.type)}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
              {getStatusText(model.status)}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">الدقة</span>
              <span className="font-semibold text-gray-900 dark:text-white">{model.accuracy}%</span>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">الأداء</span>
                <span className="font-medium">{model.performance.speed.toFixed(0)} ops/s</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, model.performance.speed)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">استخدام المعالج</span>
                <span className="font-medium">{model.performance.cpu.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${model.performance.cpu}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>آخر تحديث</span>
              <span>{new Date(model.lastUpdated).toLocaleDateString('ar')}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-4">
      {tasks.map(task => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className={`w-3 h-3 rounded-full ${
                task.status === 'running' ? 'bg-blue-500 animate-pulse' :
                task.status === 'completed' ? 'bg-green-500' :
                task.status === 'failed' ? 'bg-red-500' : 'bg-gray-400'
              }`} />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{task.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {task.type === 'classification' ? 'تصنيف' :
                   task.type === 'regression' ? 'انحدار' :
                   task.type === 'generation' ? 'توليد' :
                   task.type === 'detection' ? 'كشف' : 'ترجمة'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)} bg-opacity-10`}>
                {task.priority === 'critical' ? 'حرج' :
                 task.priority === 'high' ? 'عالي' :
                 task.priority === 'medium' ? 'متوسط' : 'منخفض'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {getStatusText(task.status)}
              </span>
            </div>
          </div>
          
          {task.status === 'running' && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">التقدم</span>
                <span className="font-medium">{task.progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <span>الوقت المتبقي: {task.estimatedTime} دقيقة</span>
                <span>معدل الإنجاز: {(task.progress / 100 * 60 / task.estimatedTime).toFixed(1)}%/دقيقة</span>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center space-x-2 space-x-reverse">
              <Brain className="w-8 h-8" />
              <span>لوحة تحكم الذكاء الاصطناعي</span>
            </h1>
            <p className="opacity-90">إدارة ومراقبة نماذج الذكاء الاصطناعي والمهام</p>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => setIsTraining(!isTraining)}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                isTraining ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {isTraining ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isTraining ? 'إيقاف التدريب' : 'بدء التدريب'}</span>
            </button>
            
            <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">إجمالي النماذج</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalModels}</p>
            </div>
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">النماذج النشطة</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeModels}</p>
            </div>
            <Rocket className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">المهام المكتملة</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedTasks}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">متوسط الدقة</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.averageAccuracy.toFixed(1)}%
              </p>
            </div>
            <Target className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 space-x-reverse px-6">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
              { id: 'models', label: 'النماذج', icon: Brain },
              { id: 'tasks', label: 'المهام', icon: Activity },
              { id: 'analytics', label: 'التحليلات', icon: PieChart }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as 'overview' | 'models' | 'tasks' | 'analytics')}
                className={`flex items-center space-x-2 space-x-reverse py-4 border-b-2 font-medium text-sm transition-colors ${
                  viewMode === id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
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
          {viewMode === 'models' && renderModels()}
          {viewMode === 'tasks' && renderTasks()}
          {viewMode === 'analytics' && (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">التحليلات المتقدمة</h3>
              <p className="text-gray-600 dark:text-gray-400">قريباً - تحليلات متقدمة لأداء النماذج</p>
            </div>
          )}
        </div>
      </div>

      {/* Model Details Modal */}
      <AnimatePresence>
        {selectedModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedModel(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedModel.name}</h2>
                <button
                  onClick={() => setSelectedModel(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">معلومات عامة</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">النوع:</span>
                        <span>{getModelTypeName(selectedModel.type)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">الحالة:</span>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedModel.status)}`}>
                          {getStatusText(selectedModel.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">الدقة:</span>
                        <span className="font-semibold">{selectedModel.accuracy}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">المقاييس</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">الدقة:</span>
                        <span>{selectedModel.metrics.precision.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">الاستدعاء:</span>
                        <span>{selectedModel.metrics.recall.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">F1 Score:</span>
                        <span>{selectedModel.metrics.f1Score.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">الخسارة:</span>
                        <span>{selectedModel.metrics.loss.toFixed(3)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">الأداء</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'السرعة', value: selectedModel.performance.speed, unit: 'ops/s', color: 'blue' },
                        { label: 'الذاكرة', value: selectedModel.performance.memory, unit: '%', color: 'green' },
                        { label: 'المعالج', value: selectedModel.performance.cpu, unit: '%', color: 'yellow' },
                        { label: 'كرت الرسوميات', value: selectedModel.performance.gpu, unit: '%', color: 'purple' }
                      ].map(({ label, value, unit, color }) => (
                        <div key={label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">{label}</span>
                            <span className="font-medium">{value.toFixed(1)} {unit}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`bg-${color}-500 h-2 rounded-full`}
                              style={{ width: `${Math.min(100, value)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIDashboard;
export type { AIModel, AITask, AIStats };