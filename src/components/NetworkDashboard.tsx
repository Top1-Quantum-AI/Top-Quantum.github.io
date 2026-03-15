import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  Activity,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
  BarChart3,
  Globe
} from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  type: 'quantum' | 'classical' | 'hybrid';
  status: 'online' | 'offline' | 'maintenance' | 'error';
  location: { x: number; y: number };
  connections: string[];
  metrics: {
    latency: number;
    bandwidth: number;
    uptime: number;
    security: number;
  };
}

interface NetworkStats {
  totalNodes: number;
  activeConnections: number;
  dataTransfer: {
    upload: number;
    download: number;
  };
  security: {
    threats: number;
    blocked: number;
  };
  performance: {
    avgLatency: number;
    totalBandwidth: number;
  };
}

const NetworkDashboard: React.FC = () => {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [stats, setStats] = useState<NetworkStats>({
    totalNodes: 0,
    activeConnections: 0,
    dataTransfer: { upload: 0, download: 0 },
    security: { threats: 0, blocked: 0 },
    performance: { avgLatency: 0, totalBandwidth: 0 }
  });
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [viewMode, setViewMode] = useState<'topology' | 'metrics' | 'security'>('topology');

  // محاكاة بيانات الشبكة
  useEffect(() => {
    const generateNodes = (): NetworkNode[] => {
      const nodeTypes: Array<'quantum' | 'classical' | 'hybrid'> = ['quantum', 'classical', 'hybrid'];
      const statuses: Array<'online' | 'offline' | 'maintenance' | 'error'> = ['online', 'offline', 'maintenance', 'error'];
      
      return Array.from({ length: 12 }, (_, i) => ({
        id: `node-${i + 1}`,
        name: `عقدة ${i + 1}`,
        type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)] ?? 'classical',
        status: i < 8 ? 'online' : (statuses[Math.floor(Math.random() * statuses.length)] ?? 'online'),
        location: {
          x: 100 + (i % 4) * 150,
          y: 100 + Math.floor(i / 4) * 120
        },
        connections: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
          `node-${Math.floor(Math.random() * 12) + 1}`
        ).filter(id => id !== `node-${i + 1}`),
        metrics: {
          latency: Math.floor(Math.random() * 100) + 10,
          bandwidth: Math.floor(Math.random() * 1000) + 100,
          uptime: Math.floor(Math.random() * 100) + 90,
          security: Math.floor(Math.random() * 100) + 80
        }
      }));
    };

    const initialNodes = generateNodes();
    setNodes(initialNodes);

    // حساب الإحصائيات
    const calculateStats = (nodes: NetworkNode[]): NetworkStats => {
      const onlineNodes = nodes.filter(n => n.status === 'online');
      return {
        totalNodes: nodes.length,
        activeConnections: onlineNodes.reduce((sum, node) => sum + node.connections.length, 0),
        dataTransfer: {
          upload: Math.floor(Math.random() * 1000) + 500,
          download: Math.floor(Math.random() * 2000) + 1000
        },
        security: {
          threats: Math.floor(Math.random() * 10),
          blocked: Math.floor(Math.random() * 50) + 20
        },
        performance: {
          avgLatency: onlineNodes.reduce((sum, node) => sum + node.metrics.latency, 0) / onlineNodes.length || 0,
          totalBandwidth: onlineNodes.reduce((sum, node) => sum + node.metrics.bandwidth, 0)
        }
      };
    };

    setStats(calculateStats(initialNodes));

    // تحديث البيانات كل 5 ثوانٍ
    const interval = setInterval(() => {
      if (isMonitoring) {
        setNodes(prev => prev.map(node => ({
          ...node,
          metrics: {
            ...node.metrics,
            latency: Math.max(10, node.metrics.latency + (Math.random() - 0.5) * 10),
            bandwidth: Math.max(100, node.metrics.bandwidth + (Math.random() - 0.5) * 50)
          }
        })));
        
        setStats(prev => ({
          ...prev,
          dataTransfer: {
            upload: Math.max(0, prev.dataTransfer.upload + (Math.random() - 0.5) * 100),
            download: Math.max(0, prev.dataTransfer.download + (Math.random() - 0.5) * 200)
          }
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getNodeColor = (node: NetworkNode) => {
    switch (node.status) {
      case 'online': return node.type === 'quantum' ? '#10b981' : node.type === 'classical' ? '#3b82f6' : '#8b5cf6';
      case 'offline': return '#6b7280';
      case 'maintenance': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'offline': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'maintenance': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderTopologyView = () => (
    <div className="relative bg-gray-900 rounded-xl p-6 h-96 overflow-hidden">
      <svg className="w-full h-full">
        {/* رسم الاتصالات */}
        {nodes.map(node => 
          node.connections.map(connId => {
            const targetNode = nodes.find(n => n.id === connId);
            if (!targetNode) return null;
            
            return (
              <line
                key={`${node.id}-${connId}`}
                x1={node.location.x}
                y1={node.location.y}
                x2={targetNode.location.x}
                y2={targetNode.location.y}
                stroke="#374151"
                strokeWidth="2"
                opacity="0.6"
              />
            );
          })
        )}
        
        {/* رسم العقد */}
        {nodes.map(node => (
          <g key={node.id}>
            <circle
              cx={node.location.x}
              cy={node.location.y}
              r="20"
              fill={getNodeColor(node)}
              stroke="#1f2937"
              strokeWidth="3"
              className="cursor-pointer transition-all hover:r-25"
              onClick={() => setSelectedNode(node)}
            />
            <text
              x={node.location.x}
              y={node.location.y + 35}
              textAnchor="middle"
              className="fill-white text-xs font-medium"
            >
              {node.name}
            </text>
          </g>
        ))}
      </svg>
      
      {/* معلومات العقدة المحددة */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg min-w-64"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">{selectedNode.name}</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">الحالة:</span>
              <div className="flex items-center space-x-1 space-x-reverse">
                {getStatusIcon(selectedNode.status)}
                <span>{selectedNode.status === 'online' ? 'متصل' : 
                       selectedNode.status === 'offline' ? 'غير متصل' :
                       selectedNode.status === 'maintenance' ? 'صيانة' : 'خطأ'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">النوع:</span>
              <span className="capitalize">
                {selectedNode.type === 'quantum' ? 'كمي' :
                 selectedNode.type === 'classical' ? 'كلاسيكي' : 'مختلط'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">زمن الاستجابة:</span>
              <span>{selectedNode.metrics.latency.toFixed(1)} ms</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">عرض النطاق:</span>
              <span>{selectedNode.metrics.bandwidth.toFixed(0)} Mbps</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">وقت التشغيل:</span>
              <span>{selectedNode.metrics.uptime.toFixed(1)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderMetricsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nodes.filter(n => n.status === 'online').map(node => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">{node.name}</h3>
            <div className={`w-3 h-3 rounded-full ${
              node.type === 'quantum' ? 'bg-green-500' :
              node.type === 'classical' ? 'bg-blue-500' : 'bg-purple-500'
            }`} />
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">زمن الاستجابة</span>
                <span className="font-medium">{node.metrics.latency.toFixed(1)} ms</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (100 - node.metrics.latency) * 2)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">عرض النطاق</span>
                <span className="font-medium">{node.metrics.bandwidth.toFixed(0)} Mbps</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, node.metrics.bandwidth / 10)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">الأمان</span>
                <span className="font-medium">{node.metrics.security.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${node.metrics.security}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderSecurityView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">التهديدات المكتشفة</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.security.threats}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">التهديدات المحجوبة</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.security.blocked}</p>
            </div>
            <Shield className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">الاتصالات الآمنة</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {nodes.filter(n => n.status === 'online' && n.metrics.security > 80).length}
              </p>
            </div>
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">تحت المراقبة</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                {nodes.filter(n => n.status === 'maintenance').length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">سجل الأمان</h3>
        <div className="space-y-3">
          {[
            { time: '14:32', type: 'blocked', message: 'تم حجب محاولة اختراق من IP: 192.168.1.100' },
            { time: '14:28', type: 'warning', message: 'نشاط مشبوه في العقدة الكمية 3' },
            { time: '14:25', type: 'info', message: 'تم تحديث بروتوكولات الأمان' },
            { time: '14:20', type: 'blocked', message: 'تم حجب هجوم DDoS' }
          ].map((log, index) => (
            <div key={index} className="flex items-center space-x-3 space-x-reverse p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                log.type === 'blocked' ? 'bg-red-500' :
                log.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} />
              <span className="text-sm text-gray-500 dark:text-gray-400 min-w-12">{log.time}</span>
              <span className="text-sm text-gray-900 dark:text-white">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">لوحة تحكم الشبكة</h1>
            <p className="opacity-90">مراقبة وإدارة الشبكة الكمية المتقدمة</p>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                isMonitoring ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {isMonitoring ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{isMonitoring ? 'إيقاف المراقبة' : 'تشغيل المراقبة'}</span>
            </button>
            
            <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5" />
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
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">إجمالي العقد</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalNodes}</p>
            </div>
            <Server className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">الاتصالات النشطة</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeConnections}</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">متوسط زمن الاستجابة</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.performance.avgLatency.toFixed(1)} ms
              </p>
            </div>
            <Zap className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">إجمالي عرض النطاق</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(stats.performance.totalBandwidth / 1000).toFixed(1)} Gbps
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 space-x-reverse px-6">
            {[
              { id: 'topology', label: 'طوبولوجيا الشبكة', icon: Globe },
              { id: 'metrics', label: 'المقاييس', icon: BarChart3 },
              { id: 'security', label: 'الأمان', icon: Shield }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
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
          {viewMode === 'topology' && renderTopologyView()}
          {viewMode === 'metrics' && renderMetricsView()}
          {viewMode === 'security' && renderSecurityView()}
        </div>
      </div>
    </div>
  );
};

export default NetworkDashboard;
export type { NetworkNode, NetworkStats };