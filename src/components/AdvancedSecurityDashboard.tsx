import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Server,
  Database,
  FileText,
  Settings,
  TrendingUp,
  TrendingDown,
  Zap,
  Bug,
  Target,
  Crosshair,
  Radar,
  Scan,
  Binary,
  Hexagon
} from 'lucide-react';

interface SecurityThreat {
  id: string;
  type: 'malware' | 'phishing' | 'ddos' | 'intrusion' | 'data_breach' | 'ransomware' | 'quantum_attack';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'mitigated' | 'investigating' | 'resolved';
  source: string;
  target: string;
  timestamp: Date;
  description: string;
  affectedSystems: string[];
  mitigationSteps: string[];
  quantumResistant: boolean;
}

interface SecurityMetrics {
  threatsBlocked: number;
  activeThreats: number;
  systemsProtected: number;
  encryptionStrength: number;
  quantumReadiness: number;
  uptime: number;
  lastScan: Date;
  vulnerabilities: number;
}

interface AccessLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: Date;
  ip: string;
  location: string;
  device: string;
  status: 'success' | 'failed' | 'blocked';
  riskScore: number;
}

interface SecuritySystem {
  id: string;
  name: string;
  type: 'firewall' | 'antivirus' | 'ids' | 'encryption' | 'quantum_crypto' | 'ai_defense';
  status: 'active' | 'inactive' | 'updating' | 'error';
  lastUpdate: Date;
  version: string;
  effectiveness: number;
  quantumReady: boolean;
}

interface VulnerabilityAssessment {
  id: string;
  system: string;
  vulnerability: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cvss: number;
  discovered: Date;
  status: 'open' | 'patching' | 'patched' | 'accepted_risk';
  quantumThreat: boolean;
}

interface QuantumSecurityMetrics {
  keyDistribution: number;
  entanglementSecurity: number;
  quantumRandomness: number;
  postQuantumCrypto: number;
  quantumKeyManagement: number;
}

interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'infrastructure' | 'policy' | 'training' | 'technology' | 'quantum';
  impact: string;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  cost: 'low' | 'medium' | 'high';
  roi: number;
  implementationSteps: string[];
  relatedThreats: string[];
  quantumRelevant: boolean;
}

interface SecurityAnalysis {
  id: string;
  type: 'trend' | 'pattern' | 'anomaly' | 'prediction' | 'risk_assessment';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  confidence: number;
  timeframe: string;
  affectedSystems: string[];
  metrics: { [key: string]: number };
  recommendations: string[];
  quantumImplications: string[];
}

interface RiskAssessment {
  overallRisk: number;
  riskFactors: {
    name: string;
    score: number;
    weight: number;
    description: string;
  }[];
  quantumRisk: number;
  complianceScore: number;
  businessImpact: {
    financial: number;
    operational: number;
    reputational: number;
  };
}

const AdvancedSecurityDashboard: React.FC = () => {
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threatsBlocked: 0,
    activeThreats: 0,
    systemsProtected: 0,
    encryptionStrength: 0,
    quantumReadiness: 0,
    uptime: 0,
    lastScan: new Date(),
    vulnerabilities: 0
  });
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [securitySystems, setSecuritySystems] = useState<SecuritySystem[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityAssessment[]>([]);
  const [quantumMetrics, setQuantumMetrics] = useState<QuantumSecurityMetrics>({
    keyDistribution: 0,
    entanglementSecurity: 0,
    quantumRandomness: 0,
    postQuantumCrypto: 0,
    quantumKeyManagement: 0
  });
  const [selectedThreat, setSelectedThreat] = useState<SecurityThreat | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'threats' | 'logs' | 'systems' | 'vulnerabilities' | 'quantum' | 'recommendations' | 'analysis' | 'risk'>('overview');
  const [isQuantumMode, setIsQuantumMode] = useState(true);
  const [scanInProgress, setScanInProgress] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendations, setRecommendations] = useState<SecurityRecommendation[]>([]);
  const [securityAnalyses, setSecurityAnalyses] = useState<SecurityAnalysis[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment>({
    overallRisk: 0,
    riskFactors: [],
    quantumRisk: 0,
    complianceScore: 0,
    businessImpact: { financial: 0, operational: 0, reputational: 0 }
  });

  // محاكاة بيانات الأمان
  useEffect(() => {
    const generateThreats = (): SecurityThreat[] => {
      const threatTypes: Array<'malware' | 'phishing' | 'ddos' | 'intrusion' | 'data_breach' | 'ransomware' | 'quantum_attack'> = 
        ['malware', 'phishing', 'ddos', 'intrusion', 'data_breach', 'ransomware', 'quantum_attack'];
      const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
      const statuses: Array<'active' | 'mitigated' | 'investigating' | 'resolved'> = 
        ['active', 'mitigated', 'investigating', 'resolved'];
      
      return Array.from({ length: 25 }, (_, i) => {
        const type = threatTypes[Math.floor(Math.random() * threatTypes.length)] ?? 'malware';
        const severity = severities[Math.floor(Math.random() * severities.length)] ?? 'low';
        const status = statuses[Math.floor(Math.random() * statuses.length)] ?? 'active';
        const targets = ['web-server-01', 'db-server-02', 'quantum-processor-01', 'ai-system-03'] as const;
        
        return {
          id: `threat-${i + 1}`,
          type,
          severity,
          status,
          source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          target: targets[Math.floor(Math.random() * targets.length)] ?? 'web-server-01',
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 7),
          description: getThreatDescription(type, severity),
          affectedSystems: getAffectedSystems(),
          mitigationSteps: getMitigationSteps(type),
          quantumResistant: type === 'quantum_attack' || Math.random() > 0.7
        };
      });
    };

    const generateAccessLogs = (): AccessLog[] => {
      const users = ['admin', 'user1', 'quantum_researcher', 'ai_engineer', 'security_analyst'];
      const actions = ['login', 'logout', 'file_access', 'system_config', 'data_export', 'quantum_circuit_run'];
      const resources = ['dashboard', 'quantum_lab', 'ai_models', 'security_center', 'database'];
      const devices = ['Desktop', 'Laptop', 'Mobile', 'Tablet', 'Quantum Terminal'];
      const locations = ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة'];
      const statuses: Array<'success' | 'failed' | 'blocked'> = ['success', 'failed', 'blocked'];
      
      return Array.from({ length: 100 }, (_, i) => ({
        id: `log-${i + 1}`,
        user: users[Math.floor(Math.random() * users.length)] ?? 'admin',
        action: actions[Math.floor(Math.random() * actions.length)] ?? 'login',
        resource: resources[Math.floor(Math.random() * resources.length)] ?? 'dashboard',
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 3),
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        location: locations[Math.floor(Math.random() * locations.length)] ?? 'الرياض',
        device: devices[Math.floor(Math.random() * devices.length)] ?? 'Desktop',
        status: statuses[Math.floor(Math.random() * statuses.length)] ?? 'success',
        riskScore: Math.floor(Math.random() * 100)
      }));
    };

    const generateSecuritySystems = (): SecuritySystem[] => {
      const systemTypes: Array<'firewall' | 'antivirus' | 'ids' | 'encryption' | 'quantum_crypto' | 'ai_defense'> = 
        ['firewall', 'antivirus', 'ids', 'encryption', 'quantum_crypto', 'ai_defense'];
      const statuses: Array<'active' | 'inactive' | 'updating' | 'error'> = ['active', 'inactive', 'updating', 'error'];
      
      return systemTypes.map((type, i) => ({
        id: `system-${i + 1}`,
        name: getSystemName(type),
        type,
        status: i < 4 ? 'active' as const : statuses[Math.floor(Math.random() * statuses.length)] ?? 'active',
        lastUpdate: new Date(Date.now() - Math.random() * 86400000 * 30),
        version: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        effectiveness: Math.random() * 30 + 70,
        quantumReady: type === 'quantum_crypto' || Math.random() > 0.5
      }));
    };

    const generateVulnerabilities = (): VulnerabilityAssessment[] => {
      const systems = ['Web Server', 'Database', 'Quantum Processor', 'AI System', 'Network Router'];
      const vulnerabilityTypes = [
        'SQL Injection', 'Cross-Site Scripting', 'Buffer Overflow', 'Privilege Escalation',
        'Quantum Vulnerability', 'AI Model Poisoning', 'Cryptographic Weakness'
      ];
      const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
      const statuses: Array<'open' | 'patching' | 'patched' | 'accepted_risk'> = 
        ['open', 'patching', 'patched', 'accepted_risk'];
      
      return Array.from({ length: 15 }, (_, i) => ({
        id: `vuln-${i + 1}`,
        system: systems[Math.floor(Math.random() * systems.length)] ?? 'Web Server',
        vulnerability: vulnerabilityTypes[Math.floor(Math.random() * vulnerabilityTypes.length)] ?? 'SQL Injection',
        severity: severities[Math.floor(Math.random() * severities.length)] ?? 'low',
        cvss: Math.random() * 10,
        discovered: new Date(Date.now() - Math.random() * 86400000 * 60),
        status: statuses[Math.floor(Math.random() * statuses.length)] ?? 'open',
        quantumThreat: Math.random() > 0.7
      }));
    };

    const initialThreats = generateThreats();
    const initialLogs = generateAccessLogs();
    const initialSystems = generateSecuritySystems();
    const initialVulnerabilities = generateVulnerabilities();
    
    setThreats(initialThreats);
    setAccessLogs(initialLogs);
    setSecuritySystems(initialSystems);
    setVulnerabilities(initialVulnerabilities);

    // حساب المقاييس
    const calculateMetrics = (threats: SecurityThreat[], systems: SecuritySystem[], vulns: VulnerabilityAssessment[]): SecurityMetrics => {
      const activeThreats = threats.filter(t => t.status === 'active').length;
      const blockedThreats = threats.filter(t => t.status === 'mitigated' || t.status === 'resolved').length;
      const activeSystems = systems.filter(s => s.status === 'active').length;
      const openVulns = vulns.filter(v => v.status === 'open').length;
      
      return {
        threatsBlocked: blockedThreats,
        activeThreats,
        systemsProtected: activeSystems,
        encryptionStrength: Math.random() * 20 + 80,
        quantumReadiness: Math.random() * 30 + 70,
        uptime: Math.random() * 2 + 98,
        lastScan: new Date(),
        vulnerabilities: openVulns
      };
    };

    setMetrics(calculateMetrics(initialThreats, initialSystems, initialVulnerabilities));

    // حساب مقاييس الأمان الكمي
    setQuantumMetrics({
      keyDistribution: Math.random() * 20 + 80,
      entanglementSecurity: Math.random() * 25 + 75,
      quantumRandomness: Math.random() * 15 + 85,
      postQuantumCrypto: Math.random() * 30 + 70,
      quantumKeyManagement: Math.random() * 20 + 80
    });

    // توليد التوصيات الأمنية
    const generateRecommendations = (): SecurityRecommendation[] => {
      return [
        {
          id: 'rec-1',
          title: 'تطبيق التشفير الكمي للبيانات الحساسة',
          description: 'تنفيذ نظام التشفير الكمي لحماية البيانات الحساسة من التهديدات المستقبلية للحوسبة الكمية',
          priority: 'critical',
          category: 'quantum',
          impact: 'حماية شاملة ضد التهديدات الكمية المستقبلية وتعزيز الأمان بنسبة 95%',
          effort: 'high',
          timeline: '6-12 شهر',
          cost: 'high',
          roi: 85,
          implementationSteps: [
            'تقييم البنية التحتية الحالية للتشفير',
            'اختيار خوارزميات التشفير الكمي المناسبة',
            'تطوير خطة التنفيذ التدريجي',
            'تدريب الفريق التقني على التقنيات الكمية',
            'تنفيذ نظام التشفير الكمي في البيئة التجريبية',
            'اختبار الأداء والأمان',
            'النشر التدريجي في البيئة الإنتاجية',
            'مراقبة الأداء والتحسين المستمر'
          ],
          relatedThreats: ['quantum_attack', 'data_breach'],
          quantumRelevant: true
        },
        {
          id: 'rec-2',
          title: 'تحديث أنظمة كشف التسلل بالذكاء الاصطناعي',
          description: 'تطوير نظام كشف التسلل باستخدام خوارزميات التعلم الآلي المتقدمة لتحسين دقة الكشف',
          priority: 'high',
          category: 'technology',
          impact: 'تحسين دقة كشف التهديدات بنسبة 40% وتقليل الإنذارات الكاذبة بنسبة 60%',
          effort: 'medium',
          timeline: '3-6 أشهر',
          cost: 'medium',
          roi: 75,
          implementationSteps: [
            'تحليل أنماط التهديدات الحالية',
            'تطوير نماذج التعلم الآلي المخصصة',
            'تدريب النماذج على البيانات التاريخية',
            'تكامل النظام مع البنية التحتية الحالية',
            'اختبار الأداء في البيئة المحاكاة',
            'النشر التدريجي مع المراقبة المستمرة'
          ],
          relatedThreats: ['intrusion', 'malware', 'ddos'],
          quantumRelevant: false
        },
        {
          id: 'rec-3',
          title: 'تطبيق سياسة الوصول صفر الثقة (Zero Trust)',
          description: 'تنفيذ نموذج الأمان صفر الثقة لتعزيز التحكم في الوصول والتحقق المستمر من الهوية',
          priority: 'high',
          category: 'policy',
          impact: 'تقليل مخاطر الوصول غير المصرح به بنسبة 80% وتحسين مراقبة الأنشطة',
          effort: 'high',
          timeline: '4-8 أشهر',
          cost: 'medium',
          roi: 90,
          implementationSteps: [
            'تحليل البنية التحتية الحالية للشبكة',
            'تصميم نموذج صفر الثقة المخصص',
            'تطبيق التحقق متعدد العوامل',
            'تنفيذ مراقبة الشبكة المستمرة',
            'تدريب المستخدمين على السياسات الجديدة',
            'النشر التدريجي مع التقييم المستمر'
          ],
          relatedThreats: ['intrusion', 'data_breach', 'phishing'],
          quantumRelevant: false
        },
        {
          id: 'rec-4',
          title: 'تعزيز برامج التوعية الأمنية للموظفين',
          description: 'تطوير برنامج تدريبي شامل للتوعية الأمنية يركز على التهديدات الحديثة والممارسات الآمنة',
          priority: 'medium',
          category: 'training',
          impact: 'تقليل الحوادث الأمنية الناتجة عن الأخطاء البشرية بنسبة 70%',
          effort: 'low',
          timeline: '2-4 أشهر',
          cost: 'low',
          roi: 95,
          implementationSteps: [
            'تقييم مستوى الوعي الأمني الحالي',
            'تطوير محتوى تدريبي تفاعلي',
            'تنفيذ اختبارات التصيد الاحتيالي المحاكاة',
            'إجراء ورش عمل دورية',
            'قياس فعالية البرنامج وتحسينه',
            'إنشاء نظام مكافآت للممارسات الآمنة'
          ],
          relatedThreats: ['phishing', 'malware', 'data_breach'],
          quantumRelevant: false
        },
        {
          id: 'rec-5',
          title: 'تطبيق نظام النسخ الاحتياطي الكمي',
          description: 'تنفيذ نظام نسخ احتياطي متقدم يستخدم التقنيات الكمية لضمان سلامة البيانات',
          priority: 'medium',
          category: 'quantum',
          impact: 'ضمان استرداد البيانات بنسبة 99.9% مع حماية كمية متقدمة',
          effort: 'medium',
          timeline: '3-5 أشهر',
          cost: 'medium',
          roi: 80,
          implementationSteps: [
            'تحليل متطلبات النسخ الاحتياطي',
            'اختيار تقنيات التخزين الكمي',
            'تصميم استراتيجية النسخ الاحتياطي',
            'تنفيذ النظام في البيئة التجريبية',
            'اختبار عمليات الاسترداد',
            'النشر الكامل مع المراقبة المستمرة'
          ],
          relatedThreats: ['ransomware', 'data_breach'],
          quantumRelevant: true
        }
      ];
    };

    // توليد التحليلات الأمنية
    const generateSecurityAnalyses = (): SecurityAnalysis[] => {
      return [
        {
          id: 'analysis-1',
          type: 'trend',
          title: 'اتجاه متزايد في هجمات التصيد الاحتيالي',
          description: 'تحليل يظهر زيادة بنسبة 45% في محاولات التصيد الاحتيالي خلال الشهر الماضي مع تركيز على الموظفين الجدد',
          severity: 'warning',
          confidence: 92,
          timeframe: '30 يوم',
          affectedSystems: ['البريد الإلكتروني', 'نظام إدارة الموارد البشرية', 'بوابة الموظفين'],
          metrics: {
            'محاولات التصيد': 1247,
            'معدل النجاح': 3.2,
            'الموظفون المتأثرون': 28,
            'الوقت المتوسط للكشف': 4.5
          },
          recommendations: [
            'تكثيف برامج التوعية للموظفين الجدد',
            'تطبيق فلاتر بريد إلكتروني أكثر تقدماً',
            'إجراء اختبارات تصيد احتيالي دورية'
          ],
          quantumImplications: []
        },
        {
          id: 'analysis-2',
          type: 'anomaly',
          title: 'نشاط غير طبيعي في حركة الشبكة الليلية',
          description: 'كشف نمط غير عادي في حركة البيانات خلال ساعات الليل مع زيادة 300% في نقل البيانات',
          severity: 'critical',
          confidence: 87,
          timeframe: '7 أيام',
          affectedSystems: ['خوادم قواعد البيانات', 'شبكة التخزين', 'نظام المراقبة'],
          metrics: {
            'حجم البيانات المنقولة (GB)': 2847,
            'عدد الاتصالات المشبوهة': 156,
            'معدل الزيادة': 312,
            'الخوادم المتأثرة': 8
          },
          recommendations: [
            'تحليل فوري لسجلات الشبكة',
            'تطبيق قيود إضافية على النقل الليلي',
            'فحص شامل للبرمجيات الخبيثة',
            'مراجعة صلاحيات الوصول للمستخدمين'
          ],
          quantumImplications: [
            'احتمالية محاولة سرقة مفاتيح التشفير الكمي',
            'ضرورة تعزيز حماية أنظمة التوزيع الكمي للمفاتيح'
          ]
        },
        {
          id: 'analysis-3',
          type: 'prediction',
          title: 'توقع زيادة هجمات برامج الفدية في الربع القادم',
          description: 'نموذج التنبؤ يشير إلى احتمالية زيادة 60% في هجمات برامج الفدية المستهدفة للقطاع المالي',
          severity: 'warning',
          confidence: 78,
          timeframe: '3 أشهر',
          affectedSystems: ['أنظمة الدفع', 'قواعد بيانات العملاء', 'خوادم التطبيقات'],
          metrics: {
            'احتمالية الهجوم': 68,
            'التأثير المتوقع': 85,
            'وقت الاستجابة المطلوب': 2.5,
            'التكلفة المتوقعة': 2500000
          },
          recommendations: [
            'تحديث استراتيجيات النسخ الاحتياطي',
            'تعزيز أنظمة كشف برامج الفدية',
            'إجراء تدريبات محاكاة للاستجابة للحوادث',
            'مراجعة بوليصات التأمين السيبراني'
          ],
          quantumImplications: [
            'استخدام التشفير الكمي لحماية النسخ الاحتياطية',
            'تطبيق مفاتيح كمية لتأمين عمليات الاسترداد'
          ]
        },
        {
          id: 'analysis-4',
          type: 'pattern',
          title: 'نمط متكرر في محاولات الوصول غير المصرح',
          description: 'تحديد نمط منتظم في محاولات الوصول غير المصرح به من مواقع جغرافية محددة',
          severity: 'warning',
          confidence: 94,
          timeframe: '14 يوم',
          affectedSystems: ['نظام إدارة الهوية', 'خوادم التطبيقات', 'قواعد البيانات الحساسة'],
          metrics: {
            'محاولات الوصول': 3421,
            'معدل النجاح': 0.8,
            'المواقع المشبوهة': 12,
            'الحسابات المستهدفة': 89
          },
          recommendations: [
            'تطبيق قيود جغرافية على الوصول',
            'تعزيز آليات كشف الأنماط المشبوهة',
            'مراجعة سياسات كلمات المرور',
            'تفعيل التنبيهات الفورية للمحاولات المشبوهة'
          ],
          quantumImplications: []
        }
      ];
    };

    // توليد تقييم المخاطر
    const generateRiskAssessment = (): RiskAssessment => {
      return {
        overallRisk: 67,
        quantumRisk: 34,
        complianceScore: 82,
        businessImpact: {
          financial: 72,
          operational: 58,
          reputational: 45
        },
        riskFactors: [
          {
            name: 'التهديدات السيبرانية المتقدمة',
            score: 78,
            weight: 25,
            description: 'زيادة في تعقد وتطور التهديدات السيبرانية مع استخدام تقنيات الذكاء الاصطناعي'
          },
          {
            name: 'نقص الخبرات الأمنية المتخصصة',
            score: 65,
            weight: 20,
            description: 'صعوبة في العثور على خبراء أمن سيبراني مؤهلين خاصة في مجال الأمان الكمي'
          },
          {
            name: 'التحديات التنظيمية والامتثال',
            score: 52,
            weight: 15,
            description: 'تعقيد متطلبات الامتثال للوائح الأمان السيبراني المحلية والدولية'
          },
          {
            name: 'البنية التحتية القديمة',
            score: 71,
            weight: 18,
            description: 'وجود أنظمة قديمة غير محدثة تشكل نقاط ضعف أمنية محتملة'
          },
          {
            name: 'العامل البشري والأخطاء',
            score: 59,
            weight: 12,
            description: 'مخاطر ناتجة عن الأخطاء البشرية ونقص الوعي الأمني لدى الموظفين'
          },
          {
            name: 'التهديدات الكمية المستقبلية',
            score: 42,
            weight: 10,
            description: 'المخاطر المحتملة من تطور الحوسبة الكمية وتأثيرها على أنظمة التشفير الحالية'
          }
        ]
      };
    };

    const initialRecommendations = generateRecommendations();
    const initialAnalyses = generateSecurityAnalyses();
    const initialRiskAssessment = generateRiskAssessment();
    
    setRecommendations(initialRecommendations);
    setSecurityAnalyses(initialAnalyses);
    setRiskAssessment(initialRiskAssessment);

    // تحديث البيانات كل 5 ثوانٍ
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 3),
        encryptionStrength: Math.max(75, Math.min(100, prev.encryptionStrength + (Math.random() - 0.5) * 2)),
        quantumReadiness: Math.max(60, Math.min(100, prev.quantumReadiness + (Math.random() - 0.5) * 3))
      }));
      
      setQuantumMetrics(prev => ({
        keyDistribution: Math.max(70, Math.min(100, prev.keyDistribution + (Math.random() - 0.5) * 2)),
        entanglementSecurity: Math.max(65, Math.min(100, prev.entanglementSecurity + (Math.random() - 0.5) * 3)),
        quantumRandomness: Math.max(80, Math.min(100, prev.quantumRandomness + (Math.random() - 0.5) * 1)),
        postQuantumCrypto: Math.max(60, Math.min(100, prev.postQuantumCrypto + (Math.random() - 0.5) * 2)),
        quantumKeyManagement: Math.max(70, Math.min(100, prev.quantumKeyManagement + (Math.random() - 0.5) * 2))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getThreatDescription = (type: string, _severity: string): string => {
    const descriptions = {
      malware: 'تم اكتشاف برمجية خبيثة تحاول الوصول إلى النظام',
      phishing: 'محاولة خداع للحصول على بيانات حساسة',
      ddos: 'هجوم حجب الخدمة الموزع على الخوادم',
      intrusion: 'محاولة اختراق غير مصرح بها للنظام',
      data_breach: 'تسريب محتمل للبيانات الحساسة',
      ransomware: 'برمجية فدية تحاول تشفير الملفات',
      quantum_attack: 'هجوم كمي متقدم يستهدف التشفير'
    };
    
    return descriptions[type as keyof typeof descriptions] || 'تهديد أمني غير محدد';
  };

  const getAffectedSystems = (): string[] => {
    const systems = ['Web Server', 'Database', 'Quantum Lab', 'AI System', 'Network'];
    const count = Math.floor(Math.random() * 3) + 1;
    return systems.slice(0, count);
  };

  const getMitigationSteps = (type: string): string[] => {
    const steps = {
      malware: ['عزل النظام المصاب', 'تشغيل فحص شامل', 'تحديث قواعد مكافحة الفيروسات'],
      phishing: ['حظر المرسل', 'تحديث فلاتر البريد', 'تدريب المستخدمين'],
      ddos: ['تفعيل الحماية من DDoS', 'توزيع الحمولة', 'حظر عناوين IP المشبوهة'],
      intrusion: ['تغيير كلمات المرور', 'مراجعة صلاحيات الوصول', 'تحديث أنظمة الأمان'],
      data_breach: ['عزل البيانات المتأثرة', 'إشعار المستخدمين', 'تحسين التشفير'],
      ransomware: ['عزل الأنظمة', 'استعادة من النسخ الاحتياطية', 'تحديث الحماية'],
      quantum_attack: ['تفعيل التشفير الكمي', 'تحديث المفاتيح', 'تطبيق الحماية الكمية']
    };
    
    return steps[type as keyof typeof steps] || ['اتخاذ إجراءات أمنية عامة'];
  };

  const getSystemName = (type: string): string => {
    const names = {
      firewall: 'جدار الحماية المتقدم',
      antivirus: 'مكافح الفيروسات الذكي',
      ids: 'نظام كشف التسلل',
      encryption: 'نظام التشفير المتقدم',
      quantum_crypto: 'التشفير الكمي',
      ai_defense: 'الدفاع بالذكاء الاصطناعي'
    };
    
    return names[type as keyof typeof names] || type;
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'malware': return <Bug className="w-5 h-5" />;
      case 'phishing': return <Target className="w-5 h-5" />;
      case 'ddos': return <Zap className="w-5 h-5" />;
      case 'intrusion': return <Crosshair className="w-5 h-5" />;
      case 'data_breach': return <Database className="w-5 h-5" />;
      case 'ransomware': return <Lock className="w-5 h-5" />;
      case 'quantum_attack': return <Hexagon className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getSystemIcon = (type: string) => {
    switch (type) {
      case 'firewall': return <Shield className="w-5 h-5" />;
      case 'antivirus': return <ShieldCheck className="w-5 h-5" />;
      case 'ids': return <Radar className="w-5 h-5" />;
      case 'encryption': return <Key className="w-5 h-5" />;
      case 'quantum_crypto': return <Hexagon className="w-5 h-5" />;
      case 'ai_defense': return <Binary className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'mitigated': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'investigating': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'resolved': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'success': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'failed': case 'blocked': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'inactive': case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'updating': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'open': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'patching': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'patched': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'accepted_risk': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'mitigated': return 'تم التخفيف';
      case 'investigating': return 'قيد التحقيق';
      case 'resolved': return 'تم الحل';
      case 'success': return 'نجح';
      case 'failed': return 'فشل';
      case 'blocked': return 'محظور';
      case 'inactive': return 'غير نشط';
      case 'updating': return 'قيد التحديث';
      case 'error': return 'خطأ';
      case 'open': return 'مفتوح';
      case 'patching': return 'قيد الإصلاح';
      case 'patched': return 'تم الإصلاح';
      case 'accepted_risk': return 'مخاطرة مقبولة';
      default: return status;
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

  const filteredThreats = threats.filter(threat => {
    const matchesSeverity = filterSeverity === 'all' || threat.severity === filterSeverity;
    const matchesSearch = searchTerm === '' || 
      threat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.source.includes(searchTerm) ||
      threat.target.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSeverity && matchesSearch;
  });

  const startSecurityScan = () => {
    setScanInProgress(true);
    setTimeout(() => {
      setScanInProgress(false);
      setMetrics(prev => ({
        ...prev,
        lastScan: new Date(),
        vulnerabilities: Math.max(0, prev.vulnerabilities - Math.floor(Math.random() * 3))
      }));
    }, 10000);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'التهديدات المحظورة', value: metrics.threatsBlocked, icon: ShieldCheck, color: 'green', trend: '+12%' },
          { label: 'التهديدات النشطة', value: metrics.activeThreats, icon: ShieldAlert, color: 'red', trend: '-5%' },
          { label: 'الأنظمة المحمية', value: metrics.systemsProtected, icon: Server, color: 'blue', trend: '+2%' },
          { label: 'نقاط الضعف', value: metrics.vulnerabilities, icon: AlertTriangle, color: 'orange', trend: '-8%' }
        ].map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</h3>
              <Icon className={`w-5 h-5 text-${color}-500`} />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
              <div className={`text-sm flex items-center ${
                trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.startsWith('+') ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Strength Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">قوة الأمان التقليدي</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">قوة التشفير</span>
                <span className="font-medium">{metrics.encryptionStrength.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${metrics.encryptionStrength}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">وقت التشغيل</span>
                <span className="font-medium">{metrics.uptime.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${metrics.uptime}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">الأمان الكمي</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">الجاهزية الكمية</span>
                <span className="font-medium">{metrics.quantumReadiness.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all"
                  style={{ width: `${metrics.quantumReadiness}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">توزيع المفاتيح الكمية</span>
                <span className="font-medium">{quantumMetrics.keyDistribution.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-indigo-500 h-3 rounded-full transition-all"
                  style={{ width: `${quantumMetrics.keyDistribution}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Threats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">التهديدات الأخيرة</h3>
          <button
            onClick={startSecurityScan}
            disabled={scanInProgress}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Scan className={`w-4 h-4 ${scanInProgress ? 'animate-spin' : ''}`} />
            <span>{scanInProgress ? 'جاري الفحص...' : 'فحص أمني'}</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {threats.filter(t => t.status === 'active').slice(0, 5).map(threat => (
            <div key={threat.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className={`p-2 rounded-lg ${getSeverityColor(threat.severity)}`}>
                  {getThreatIcon(threat.type)}
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{threat.description}</span>
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

      {/* Security Systems Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">حالة أنظمة الأمان</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securitySystems.filter(s => s.quantumReady).map(system => (
            <div key={system.id} className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <Hexagon className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">{system.name}</h4>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                الفعالية: {system.effectiveness.toFixed(1)}%
              </div>
              <div className="text-xs text-purple-600">
                الإصدار {system.version} - جاهز كمياً
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderThreats = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">التهديدات الأمنية</h2>
        <div className="flex items-center space-x-4 space-x-reverse">
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
          >
            <option value="all">جميع المستويات</option>
            <option value="critical">حرج</option>
            <option value="high">عالي</option>
            <option value="medium">متوسط</option>
            <option value="low">منخفض</option>
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="بحث..."
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
          />
        </div>
      </div>
      <div className="space-y-3">
        {filteredThreats.map(threat => (
          <div
            key={threat.id}
            onClick={() => setSelectedThreat(threat)}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className={`p-2 rounded-lg ${getSeverityColor(threat.severity)}`}>
                {getThreatIcon(threat.type)}
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">{threat.description}</span>
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
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">سجلات الوصول</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">المستخدم</th>
              <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">الإجراء</th>
              <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">المورد</th>
              <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">الموقع</th>
              <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">الحالة</th>
              <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">المخاطرة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {accessLogs.slice(0, 20).map(log => (
              <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 text-gray-900 dark:text-white">{log.user}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.action}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.resource}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.location}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                    {getStatusText(log.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full ${log.riskScore >= 70 ? 'bg-red-500' : log.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${log.riskScore}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{log.riskScore}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSystems = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">أنظمة الأمان</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securitySystems.map(system => (
          <div key={system.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className={`p-2 rounded-lg ${getStatusColor(system.status)}`}>
                  {getSystemIcon(system.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{system.name}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">v{system.version}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                {getStatusText(system.status)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">الفعالية</span>
                <span className="font-medium">{system.effectiveness.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${system.effectiveness}%` }} />
              </div>
            </div>
            {system.quantumReady && (
              <div className="mt-3 flex items-center text-xs text-purple-600">
                <Hexagon className="w-3 h-3 mr-1" />
                جاهز كمياً
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderVulnerabilities = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">تقييم الثغرات</h2>
      <div className="space-y-3">
        {vulnerabilities.map(vuln => (
          <div key={vuln.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{vuln.vulnerability}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">النظام: {vuln.system}</p>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                  {getSeverityText(vuln.severity)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vuln.status)}`}>
                  {getStatusText(vuln.status)}
                </span>
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                  CVSS: {vuln.cvss.toFixed(1)}
                </span>
              </div>
            </div>
            {vuln.quantumThreat && (
              <div className="mt-2 flex items-center text-xs text-purple-600">
                <Hexagon className="w-3 h-3 mr-1" />
                تهديد كمي
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuantumSecurity = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">الأمان الكمي</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'توزيع المفاتيح الكمية', value: quantumMetrics.keyDistribution },
          { label: 'أمان التشابك', value: quantumMetrics.entanglementSecurity },
          { label: 'العشوائية الكمية', value: quantumMetrics.quantumRandomness },
          { label: 'التشفير ما بعد الكمي', value: quantumMetrics.postQuantumCrypto },
          { label: 'إدارة المفاتيح الكمية', value: quantumMetrics.quantumKeyManagement },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</h3>
            <div className="text-2xl font-bold text-purple-600 mb-2">{value.toFixed(1)}%</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">التوصيات الأمنية</h2>
        <div className="flex space-x-2 space-x-reverse">
          {['all', 'critical', 'high', 'medium', 'low'].map(priority => (
            <button
              key={priority}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                priority === 'all'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : priority === 'critical'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : priority === 'high'
                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  : priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}
            >
              {priority === 'all' ? 'الكل' : priority === 'critical' ? 'حرج' : priority === 'high' ? 'عالي' : priority === 'medium' ? 'متوسط' : 'منخفض'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map(rec => (
          <div key={rec.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{rec.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{rec.description}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rec.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  rec.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {rec.priority === 'critical' ? 'حرج' : rec.priority === 'high' ? 'عالي' : rec.priority === 'medium' ? 'متوسط' : 'منخفض'}
                </span>
                {rec.quantumRelevant && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-xs font-medium">
                    كمي
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">الجهد:</span>
                <span className={`ml-2 font-medium ${
                  rec.effort === 'high' ? 'text-red-600' : rec.effort === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {rec.effort === 'high' ? 'عالي' : rec.effort === 'medium' ? 'متوسط' : 'منخفض'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">التكلفة:</span>
                <span className={`ml-2 font-medium ${
                  rec.cost === 'high' ? 'text-red-600' : rec.cost === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {rec.cost === 'high' ? 'عالية' : rec.cost === 'medium' ? 'متوسطة' : 'منخفضة'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">العائد:</span>
                <span className="ml-2 font-medium text-blue-600">{rec.roi}%</span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">التأثير:</span>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{rec.impact}</p>
            </div>

            <div className="mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">الجدول الزمني:</span>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{rec.timeline}</span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">خطوات التنفيذ:</h4>
              <ul className="space-y-1">
                {rec.implementationSteps.slice(0, 3).map((step, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
                {rec.implementationSteps.length > 3 && (
                  <li className="text-sm text-gray-500 dark:text-gray-400">... و {rec.implementationSteps.length - 3} خطوات أخرى</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">التحليلات الأمنية</h2>
        <div className="flex space-x-2 space-x-reverse">
          {['all', 'trend', 'pattern', 'anomaly', 'prediction'].map(type => (
            <button
              key={type}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {type === 'all' ? 'الكل' : type === 'trend' ? 'اتجاهات' : type === 'pattern' ? 'أنماط' : type === 'anomaly' ? 'شذوذ' : 'توقعات'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {securityAnalyses.map(analysis => (
          <div key={analysis.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{analysis.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    analysis.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    analysis.severity === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {analysis.severity === 'critical' ? 'حرج' : analysis.severity === 'warning' ? 'تحذير' : 'معلومات'}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{analysis.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">الثقة:</span>
                <span className="ml-2 font-medium text-green-600">{analysis.confidence}%</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">الإطار الزمني:</span>
                <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">{analysis.timeframe}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">المقاييس الرئيسية:</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(analysis.metrics).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{key}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">الأنظمة المتأثرة:</h4>
              <div className="flex flex-wrap gap-1">
                {analysis.affectedSystems.map(system => (
                  <span key={system} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                    {system}
                  </span>
                ))}
              </div>
            </div>

            {analysis.quantumImplications.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-semibold text-purple-600 mb-2 flex items-center">
                  <Hexagon className="w-4 h-4 mr-2" />
                  التأثيرات الكمية:
                </h4>
                <ul className="space-y-1">
                  {analysis.quantumImplications.map((implication, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">• {implication}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderRiskAssessment = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">تقييم المخاطر الشامل</h2>
        <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Scan className="w-4 h-4" />
          <span>تحديث التقييم</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">المخاطر الإجمالية</h3>
          <div className={`text-3xl font-bold mb-2 ${
            riskAssessment.overallRisk >= 80 ? 'text-red-600' :
            riskAssessment.overallRisk >= 60 ? 'text-orange-600' :
            riskAssessment.overallRisk >= 40 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {riskAssessment.overallRisk}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                riskAssessment.overallRisk >= 80 ? 'bg-red-500' :
                riskAssessment.overallRisk >= 60 ? 'bg-orange-500' :
                riskAssessment.overallRisk >= 40 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${riskAssessment.overallRisk}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">المخاطر الكمية</h3>
          <div className="text-3xl font-bold text-purple-600 mb-2">{riskAssessment.quantumRisk}</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${riskAssessment.quantumRisk}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">نقاط الامتثال</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">{riskAssessment.complianceScore}</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${riskAssessment.complianceScore}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">التأثير التجاري</h3>
          <div className="text-3xl font-bold text-indigo-600 mb-2">
            {Math.round((riskAssessment.businessImpact.financial + riskAssessment.businessImpact.operational + riskAssessment.businessImpact.reputational) / 3)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">متوسط التأثير</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">عوامل المخاطر</h3>
        <div className="space-y-4">
          {riskAssessment.riskFactors.map((factor, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{factor.name}</h4>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-sm text-gray-500 dark:text-gray-400">الوزن: {factor.weight}%</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    factor.score >= 80 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    factor.score >= 60 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                    factor.score >= 40 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {factor.score}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{factor.description}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    factor.score >= 80 ? 'bg-red-500' :
                    factor.score >= 60 ? 'bg-orange-500' :
                    factor.score >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-green-600" />
            التأثير المالي
          </h3>
          <div className="text-2xl font-bold text-green-600 mb-2">{riskAssessment.businessImpact.financial}%</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
            <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${riskAssessment.businessImpact.financial}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-600" />
            التأثير التشغيلي
          </h3>
          <div className="text-2xl font-bold text-blue-600 mb-2">{riskAssessment.businessImpact.operational}%</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
            <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${riskAssessment.businessImpact.operational}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-purple-600" />
            التأثير السمعي
          </h3>
          <div className="text-2xl font-bold text-purple-600 mb-2">{riskAssessment.businessImpact.reputational}%</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
            <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${riskAssessment.businessImpact.reputational}%` }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">لوحة الأمان المتقدمة</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">مراقبة وإدارة أمان النظام الكمي</p>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => setIsQuantumMode(!isQuantumMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isQuantumMode
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {isQuantumMode ? 'الوضع الكمي' : 'الوضع التقليدي'}
            </button>
            <button
              onClick={startSecurityScan}
              disabled={scanInProgress}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Scan className={`w-4 h-4 ${scanInProgress ? 'animate-spin' : ''}`} />
              <span>{scanInProgress ? 'جاري الفحص...' : 'فحص أمني'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 space-x-reverse bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-8">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: Shield },
            { id: 'threats', label: 'التهديدات', icon: ShieldAlert },
            { id: 'logs', label: 'السجلات', icon: FileText },
            { id: 'systems', label: 'الأنظمة', icon: Server },
            { id: 'vulnerabilities', label: 'الثغرات', icon: Bug },
            { id: 'quantum', label: 'الأمان الكمي', icon: Hexagon },
            { id: 'recommendations', label: 'التوصيات', icon: CheckCircle },
            { id: 'analysis', label: 'التحليلات', icon: TrendingUp },
            { id: 'risk', label: 'تقييم المخاطر', icon: AlertTriangle }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as typeof viewMode)}
                className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {viewMode === 'overview' && renderOverview()}
            {viewMode === 'threats' && renderThreats()}
            {viewMode === 'logs' && renderLogs()}
            {viewMode === 'systems' && renderSystems()}
            {viewMode === 'vulnerabilities' && renderVulnerabilities()}
            {viewMode === 'quantum' && renderQuantumSecurity()}
            {viewMode === 'recommendations' && renderRecommendations()}
            {viewMode === 'analysis' && renderAnalysis()}
            {viewMode === 'risk' && renderRiskAssessment()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Threat Details Modal */}
      <AnimatePresence>
        {selectedThreat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedThreat(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">تفاصيل التهديد</h2>
                <button
                  onClick={() => setSelectedThreat(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">الوصف</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedThreat.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">المصدر</h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedThreat.source}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">الهدف</h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedThreat.target}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">الأنظمة المتأثرة</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedThreat.affectedSystems.map(system => (
                      <span key={system} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        {system}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">خطوات التخفيف</h3>
                  <ul className="space-y-2">
                    {selectedThreat.mitigationSteps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-2 space-x-reverse">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedThreat.quantumResistant && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <Hexagon className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100">مقاوم للتهديدات الكمية</h3>
                    </div>
                    <p className="text-purple-700 dark:text-purple-300 text-sm">
                      هذا التهديد يستخدم تقنيات مقاومة للحوسبة الكمية ويتطلب دفاعات متقدمة.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSecurityDashboard;