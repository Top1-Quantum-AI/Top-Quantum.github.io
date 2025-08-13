import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Users,
  Server,
  Globe,
  Wifi,
  Database,
  FileText,
  Settings,
  Zap,
  Target,
  Scan,
  Bug,
  UserCheck,
  UserX,
  Bell,
  BellOff,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Fingerprint,
  Smartphone,
  Laptop,
  HardDrive,
  Cloud,
  Network
} from 'lucide-react';

interface SecurityThreat {
  id: string;
  type: 'malware' | 'phishing' | 'ddos' | 'intrusion' | 'data_breach' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'investigating' | 'mitigated' | 'resolved';
  source: string;
  target: string;
  description: string;
  timestamp: string;
  affectedSystems: string[];
  mitigationSteps: string[];
}

interface SecurityMetrics {
  threatsDetected: number;
  threatsBlocked: number;
  vulnerabilitiesFound: number;
  securityScore: number;
  uptime: number;
  lastScan: string;
  activeConnections: number;
  failedLogins: number;
}

interface AccessLog {
  id: string;
  user: string;
  action: 'login' | 'logout' | 'access_denied' | 'permission_granted' | 'data_access';
  resource: string;
  ip: string;
  timestamp: string;
  success: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

interface SystemStatus {
  firewall: 'active' | 'inactive' | 'updating';
  antivirus: 'active' | 'inactive' | 'scanning';
  encryption: 'enabled' | 'disabled' | 'partial';
  backup: 'completed' | 'running' | 'failed' | 'scheduled';
  monitoring: 'active' | 'inactive' | 'limited';
  vpn: 'connected' | 'disconnected' | 'connecting';
}

const SecurityDashboard: React.FC = () => {
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threatsDetected: 0,
    threatsBlocked: 0,
    vulnerabilitiesFound: 0,
    securityScore: 0,
    uptime: 0,
    lastScan: '',
    activeConnections: 0,
    failedLogins: 0
  });
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    firewall: 'active',
    antivirus: 'active',
    encryption: 'enabled',
    backup: 'completed',
    monitoring: 'active',
    vpn: 'connected'
  });
  const [selectedThreat, setSelectedThreat] = useState<SecurityThreat | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'threats' | 'logs' | 'systems'>('overview');
  const [isScanning, setIsScanning] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // محاكاة بيانات الأمان
  useEffect(() => {
    const generateThreats = (): SecurityThreat[] => {
      const threatTypes: Array<'malware' | 'phishing' | 'ddos' | 'intrusion' | 'data_breach' | 'suspicious_activity'> = 
        ['malware', 'phishing', 'ddos', 'intrusion', 'data_breach', 'suspicious_activity'];
      const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
      const statuses: Array<'detected' | 'investigating' | 'mitigated' | 'resolved'> = 
        ['detected', 'investigating', 'mitigated', 'resolved'];
      
      return Array.from({ length: 15 }, (_, i) => {
        const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        
        return {
          id: `threat-${i + 1}`,
          type,
          severity,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          source: `192.168.1.${Math.floor(Math.random() * 255)}`,
          target: `server-${Math.floor(Math.random() * 10) + 1}`,
          description: getThreatDescription(type, severity),
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
          affectedSystems: [`نظام ${Math.floor(Math.random() * 5) + 1}`, `خادم ${Math.floor(Math.random() * 3) + 1}`],
          mitigationSteps: getMitigationSteps(type)
        };
      });
    };

    const generateAccessLogs = (): AccessLog[] => {
      const actions: Array<'login' | 'logout' | 'access_denied' | 'permission_granted' | 'data_access'> = 
        ['login', 'logout', 'access_denied', 'permission_granted', 'data_access'];
      const users = ['أحمد محمد', 'فاطمة علي', 'محمد حسن', 'نور الدين', 'سارة أحمد', 'عبدالله محمد'];
      const resources = ['قاعدة البيانات', 'ملفات النظام', 'إعدادات الأمان', 'تقارير المالية', 'بيانات العملاء'];
      const riskLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
      
      return Array.from({ length: 50 }, (_, i) => {
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        return {
          id: `log-${i + 1}`,
          user: users[Math.floor(Math.random() * users.length)],
          action,
          resource: resources[Math.floor(Math.random() * resources.length)],
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
          success: action !== 'access_denied' ? Math.random() > 0.2 : false,
          riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)]
        };
      });
    };

    const initialThreats = generateThreats();
    const initialLogs = generateAccessLogs();
    
    setThreats(initialThreats);
    setAccessLogs(initialLogs);

    // حساب المقاييس
    const calculateMetrics = (threats: SecurityThreat[], logs: AccessLog[]): SecurityMetrics => {
      const detectedThreats = threats.filter(t => t.status === 'detected').length;
      const blockedThreats = threats.filter(t => t.status === 'mitigated' || t.status === 'resolved').length;
      const criticalThreats = threats.filter(t => t.severity === 'critical').length;
      const failedLogins = logs.filter(l => l.action === 'access_denied').length;
      
      return {
        threatsDetected: detectedThreats,
        threatsBlocked: blockedThreats,
        vulnerabilitiesFound: Math.floor(Math.random() * 20) + 5,
        securityScore: Math.max(60, 100 - (criticalThreats * 10) - (detectedThreats * 5)),
        uptime: 99.8 - Math.random() * 0.5,
        lastScan: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        activeConnections: Math.floor(Math.random() * 100) + 50,
        failedLogins
      };
    };

    setMetrics(calculateMetrics(initialThreats, initialLogs));

    // تحديث البيانات كل 5 ثوانٍ
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeConnections: Math.max(10, prev.activeConnections + (Math.random() - 0.5) * 10),
        securityScore: Math.max(50, Math.min(100, prev.securityScore + (Math.random() - 0.5) * 2))
      }));
      
      // محاكاة تهديدات جديدة أحياناً
      if (Math.random() < 0.1) {
        const newThreat = generateThreats()[0];
        setThreats(prev => [newThreat, ...prev.slice(0, 14)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getThreatDescription = (type: string, severity: string): string => {
    const descriptions = {
      malware: 'تم اكتشاف برمجية خبيثة تحاول الوصول للنظام',
      phishing: 'محاولة تصيد إلكتروني لسرقة بيانات المستخدمين',
      ddos: 'هجوم حجب الخدمة الموزع على الخوادم',
      intrusion: 'محاولة اختراق غير مصرح بها للنظام',
      data_breach: 'محاولة الوصول غير المصرح به للبيانات الحساسة',
      suspicious_activity: 'نشاط مشبوه تم رصده في النظام'
    };
    
    return descriptions[type as keyof typeof descriptions] || 'تهديد أمني غير محدد';
  };

  const getMitigationSteps = (type: string): string[] => {
    const steps = {
      malware: ['عزل النظام المصاب', 'تشغيل فحص شامل', 'تحديث قواعد مكافحة الفيروسات'],
      phishing: ['حظر الرابط المشبوه', 'تحديث فلاتر البريد', 'تنبيه المستخدمين'],
      ddos: ['تفعيل حماية DDoS', 'توزيع الحمولة', 'حظر عناوين IP المشبوهة'],
      intrusion: ['تغيير كلمات المرور', 'مراجعة صلاحيات الوصول', 'تعزيز جدار الحماية'],
      data_breach: ['عزل البيانات المتأثرة', 'مراجعة سجلات الوصول', 'تشفير البيانات الحساسة'],
      suspicious_activity: ['مراقبة النشاط', 'تحليل السجلات', 'تعزيز المراقبة']
    };
    
    return steps[type as keyof typeof steps] || ['اتخاذ إجراءات احترازية'];
  };

  const getThreatTypeIcon = (type: string) => {
    switch (type) {
      case 'malware': return <Bug className="w-5 h-5" />;
      case 'phishing': return <Target className="w-5 h-5" />;
      case 'ddos': return <Zap className="w-5 h-5" />;
      case 'intrusion': return <UserX className="w-5 h-5" />;
      case 'data_breach': return <Database className="w-5 h-5" />;
      case 'suspicious_activity': return <Eye className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getThreatTypeName = (type: string) => {
    switch (type) {
      case 'malware': return 'برمجية خبيثة';
      case 'phishing': return 'تصيد إلكتروني';
      case 'ddos': return 'هجوم DDoS';
      case 'intrusion': return 'اختراق';
      case 'data_breach': return 'تسريب بيانات';
      case 'suspicious_activity': return 'نشاط مشبوه';
      default: return 'غير محدد';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical': return 'حرج';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return severity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'investigating': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'mitigated': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'resolved': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'detected': return 'مكتشف';
      case 'investigating': return 'قيد التحقيق';
      case 'mitigated': return 'تم التخفيف';
      case 'resolved': return 'تم الحل';
      default: return status;
    }
  };

  const getSystemStatusIcon = (status: string, system: string) => {
    if (status === 'active' || status === 'enabled' || status === 'completed' || status === 'connected') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (status === 'inactive' || status === 'disabled' || status === 'failed' || status === 'disconnected') {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else {
      return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getSystemStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'updating': return 'جاري التحديث';
      case 'enabled': return 'مفعل';
      case 'disabled': return 'معطل';
      case 'partial': return 'جزئي';
      case 'completed': return 'مكتمل';
      case 'running': return 'قيد التشغيل';
      case 'failed': return 'فشل';
      case 'scheduled': return 'مجدول';
      case 'limited': return 'محدود';
      case 'connected': return 'متصل';
      case 'disconnected': return 'منقطع';
      case 'connecting': return 'جاري الاتصال';
      case 'scanning': return 'جاري الفحص';
      default: return status;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Security Score */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">نقاط الأمان</h3>
          <div className={`text-2xl font-bold ${
            metrics.securityScore >= 90 ? 'text-green-500' :
            metrics.securityScore >= 70 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {metrics.securityScore.toFixed(0)}/100
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
          <div
            className={`h-4 rounded-full transition-all ${
              metrics.securityScore >= 90 ? 'bg-green-500' :
              metrics.securityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${metrics.securityScore}%` }}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-600 dark:text-gray-400">التهديدات المحظورة</div>
            <div className="font-semibold text-green-600">{metrics.threatsBlocked}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 dark:text-gray-400">التهديدات المكتشفة</div>
            <div className="font-semibold text-red-600">{metrics.threatsDetected}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 dark:text-gray-400">الثغرات الأمنية</div>
            <div className="font-semibold text-orange-600">{metrics.vulnerabilitiesFound}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 dark:text-gray-400">وقت التشغيل</div>
            <div className="font-semibold text-blue-600">{metrics.uptime.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">حالة الأنظمة الأمنية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'firewall', label: 'جدار الحماية', icon: Shield },
            { key: 'antivirus', label: 'مكافح الفيروسات', icon: ShieldCheck },
            { key: 'encryption', label: 'التشفير', icon: Lock },
            { key: 'backup', label: 'النسخ الاحتياطي', icon: HardDrive },
            { key: 'monitoring', label: 'المراقبة', icon: Activity },
            { key: 'vpn', label: 'الشبكة الافتراضية', icon: Network }
          ].map(({ key, label, icon: Icon }) => {
            const status = systemStatus[key as keyof SystemStatus];
            return (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  {getSystemStatusIcon(status, key)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {getSystemStatusText(status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Threats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">التهديدات الأخيرة</h3>
        <div className="space-y-3">
          {threats.slice(0, 5).map(threat => (
            <div key={threat.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 space-x-reverse">
                {getThreatTypeIcon(threat.type)}
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {getThreatTypeName(threat.type)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {threat.source} → {threat.target}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                  {getSeverityText(threat.severity)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(threat.status)}`}>
                  {getStatusText(threat.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Connections */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">الاتصالات النشطة</h3>
          <span className="text-2xl font-bold text-blue-600">{metrics.activeConnections}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-green-600 font-semibold text-lg">
              {Math.floor(metrics.activeConnections * 0.8)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">اتصالات آمنة</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-yellow-600 font-semibold text-lg">
              {Math.floor(metrics.activeConnections * 0.15)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">قيد المراجعة</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-red-600 font-semibold text-lg">
              {Math.floor(metrics.activeConnections * 0.05)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">مشبوهة</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderThreats = () => (
    <div className="space-y-4">
      {threats.map(threat => (
        <motion.div
          key={threat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => setSelectedThreat(threat)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              {getThreatTypeIcon(threat.type)}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {getThreatTypeName(threat.type)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{threat.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                {getSeverityText(threat.severity)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(threat.status)}`}>
                {getStatusText(threat.status)}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">المصدر: </span>
              <span className="font-medium">{threat.source}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">الهدف: </span>
              <span className="font-medium">{threat.target}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">الوقت: </span>
              <span className="font-medium">{new Date(threat.timestamp).toLocaleString('ar')}</span>
            </div>
          </div>
          
          {threat.affectedSystems.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">الأنظمة المتأثرة: </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {threat.affectedSystems.map((system, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {system}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-3">
      {accessLogs.slice(0, 20).map(log => (
        <div key={log.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className={`w-3 h-3 rounded-full ${
                log.success ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{log.user}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {log.action === 'login' ? 'تسجيل دخول' :
                   log.action === 'logout' ? 'تسجيل خروج' :
                   log.action === 'access_denied' ? 'رفض الوصول' :
                   log.action === 'permission_granted' ? 'منح صلاحية' : 'الوصول للبيانات'}
                  {' → '}{log.resource}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">{log.ip}</div>
              <div className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleString('ar')}
              </div>
              <div className={`text-xs font-medium ${
                log.riskLevel === 'high' ? 'text-red-600' :
                log.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {log.riskLevel === 'high' ? 'خطر عالي' :
                 log.riskLevel === 'medium' ? 'خطر متوسط' : 'خطر منخفض'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSystems = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { key: 'firewall', label: 'جدار الحماية', icon: Shield, description: 'حماية الشبكة من التهديدات الخارجية' },
        { key: 'antivirus', label: 'مكافح الفيروسات', icon: ShieldCheck, description: 'فحص وإزالة البرمجيات الخبيثة' },
        { key: 'encryption', label: 'التشفير', icon: Lock, description: 'تشفير البيانات الحساسة' },
        { key: 'backup', label: 'النسخ الاحتياطي', icon: HardDrive, description: 'حفظ نسخ احتياطية من البيانات' },
        { key: 'monitoring', label: 'المراقبة', icon: Activity, description: 'مراقبة النشاط والتهديدات' },
        { key: 'vpn', label: 'الشبكة الافتراضية', icon: Network, description: 'اتصال آمن ومشفر' }
      ].map(({ key, label, icon: Icon, description }) => {
        const status = systemStatus[key as keyof SystemStatus];
        return (
          <div key={key} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Icon className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{label}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                </div>
              </div>
              {getSystemStatusIcon(status, key)}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">الحالة:</span>
              <span className={`font-medium ${
                status === 'active' || status === 'enabled' || status === 'completed' || status === 'connected'
                  ? 'text-green-600' : status === 'inactive' || status === 'disabled' || status === 'failed' || status === 'disconnected'
                  ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {getSystemStatusText(status)}
              </span>
            </div>
            
            <div className="mt-4 flex space-x-2 space-x-reverse">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                إعدادات
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
                تفاصيل
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center space-x-2 space-x-reverse">
              <Shield className="w-8 h-8" />
              <span>لوحة تحكم الأمان</span>
            </h1>
            <p className="opacity-90">مراقبة وإدارة الأمان السيبراني والحماية</p>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => setIsScanning(!isScanning)}
              disabled={isScanning}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                isScanning ? 'bg-white/20 cursor-not-allowed' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <Scan className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'جاري الفحص...' : 'فحص شامل'}</span>
            </button>
            
            <button
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                alertsEnabled ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {alertsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
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
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">التهديدات المحظورة</p>
              <p className="text-2xl font-bold text-green-600">{metrics.threatsBlocked}</p>
            </div>
            <ShieldCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">التهديدات النشطة</p>
              <p className="text-2xl font-bold text-red-600">{metrics.threatsDetected}</p>
            </div>
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">محاولات الدخول الفاشلة</p>
              <p className="text-2xl font-bold text-orange-600">{metrics.failedLogins}</p>
            </div>
            <UserX className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">الاتصالات النشطة</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.activeConnections}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 space-x-reverse px-6">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
              { id: 'threats', label: 'التهديدات', icon: ShieldAlert },
              { id: 'logs', label: 'سجلات الوصول', icon: FileText },
              { id: 'systems', label: 'الأنظمة', icon: Server }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`flex items-center space-x-2 space-x-reverse py-4 border-b-2 font-medium text-sm transition-colors ${
                  viewMode === id
                    ? 'border-red-500 text-red-600 dark:text-red-400'
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
          {viewMode === 'threats' && renderThreats()}
          {viewMode === 'logs' && renderLogs()}
          {viewMode === 'systems' && renderSystems()}
        </div>
      </div>

      {/* Threat Details Modal */}
      <AnimatePresence>
        {selectedThreat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedThreat(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {getThreatTypeName(selectedThreat.type)}
                </h2>
                <button
                  onClick={() => setSelectedThreat(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">الوصف</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedThreat.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">المصدر</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedThreat.source}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">الهدف</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedThreat.target}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">الأنظمة المتأثرة</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedThreat.affectedSystems.map((system, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                        {system}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">خطوات التخفيف</h3>
                  <ul className="space-y-1">
                    {selectedThreat.mitigationSteps.map((step, index) => (
                      <li key={index} className="flex items-center space-x-2 space-x-reverse text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecurityDashboard;
export type { SecurityThreat, SecurityMetrics, AccessLog, SystemStatus };