/**
 * Real-time Analytics Engine
 * Tracks system metrics, generates time-series data, and provides statistical analysis.
 */

// ─── Types ──────────────────────────────────────────────────────

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

export interface MetricSnapshot {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  latency: number;
  throughput: number;
  errorRate: number;
  activeConnections: number;
  requestsPerSecond: number;
  quantumUtilization: number;
  aiModelLoad: number;
  securityScore: number;
}

export interface AnalyticsReport {
  current: MetricSnapshot;
  history: {
    cpu: TimeSeriesPoint[];
    memory: TimeSeriesPoint[];
    network: TimeSeriesPoint[];
    latency: TimeSeriesPoint[];
    throughput: TimeSeriesPoint[];
    errorRate: TimeSeriesPoint[];
    quantumUtilization: TimeSeriesPoint[];
    securityScore: TimeSeriesPoint[];
  };
  stats: {
    cpuAvg: number;
    memoryAvg: number;
    networkAvg: number;
    latencyP50: number;
    latencyP95: number;
    latencyP99: number;
    errorRateAvg: number;
    throughputTotal: number;
    uptime: number;
    anomalyCount: number;
  };
  anomalies: Anomaly[];
  predictions: Prediction[];
}

export interface Anomaly {
  id: string;
  metric: string;
  timestamp: number;
  value: number;
  expected: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface Prediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeHorizon: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
  source: string;
  message: string;
  details?: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'quantum-processor' | 'ai-cluster' | 'security-node' | 'gateway' | 'storage' | 'edge';
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  x: number;
  y: number;
  metrics: {
    latency: number;
    bandwidth: number;
    packetLoss: number;
    uptime: number;
  };
  connections: string[];
}

// ─── Simulation Helpers ─────────────────────────────────────────

/** Generates realistic metric fluctuation using sine waves + noise */
const oscillate = (
  base: number,
  amplitude: number,
  t: number,
  period: number,
  noise = 0.05,
): number => {
  const wave = base + amplitude * Math.sin((2 * Math.PI * t) / period);
  const n = (Math.random() - 0.5) * 2 * noise * base;
  return Math.max(0, Math.min(100, wave + n));
};

/** Random walk with mean reversion */
const meanRevert = (current: number, target: number, speed: number, volatility: number): number => {
  const drift = (target - current) * speed;
  const diffusion = (Math.random() - 0.5) * 2 * volatility;
  return Math.max(0, Math.min(100, current + drift + diffusion));
};

// ─── Analytics Engine Class ─────────────────────────────────────

export class AnalyticsEngine {
  private readonly history: Map<string, TimeSeriesPoint[]> = new Map();
  private readonly maxHistory = 200;
  private tickCount = 0;
  private readonly startTime = Date.now();
  private lastSnapshot: MetricSnapshot | null = null;
  private readonly anomalies: Anomaly[] = [];
  private logs: LogEntry[] = [];
  private networkNodes: NetworkNode[] = [];

  constructor() {
    this.initializeHistory();
    this.initializeNetwork();
    this.generateInitialLogs();
  }

  private initializeHistory(): void {
    const metrics = [
      'cpu', 'memory', 'network', 'latency',
      'throughput', 'errorRate', 'quantumUtilization', 'securityScore',
    ];
    for (const m of metrics) {
      this.history.set(m, []);
    }
  }

  private initializeNetwork(): void {
    this.networkNodes = [
      {
        id: 'qp-1', name: 'معالج كمي Alpha', type: 'quantum-processor',
        status: 'online', x: 200, y: 100,
        metrics: { latency: 0.5, bandwidth: 1000, packetLoss: 0, uptime: 99.99 },
        connections: ['gw-1', 'ai-1', 'sec-1'],
      },
      {
        id: 'qp-2', name: 'معالج كمي Beta', type: 'quantum-processor',
        status: 'online', x: 200, y: 300,
        metrics: { latency: 0.8, bandwidth: 800, packetLoss: 0.01, uptime: 99.95 },
        connections: ['gw-1', 'ai-2'],
      },
      {
        id: 'ai-1', name: 'مجموعة AI-1', type: 'ai-cluster',
        status: 'online', x: 400, y: 50,
        metrics: { latency: 2.1, bandwidth: 5000, packetLoss: 0, uptime: 99.97 },
        connections: ['qp-1', 'gw-1', 'st-1'],
      },
      {
        id: 'ai-2', name: 'مجموعة AI-2', type: 'ai-cluster',
        status: 'online', x: 400, y: 350,
        metrics: { latency: 1.8, bandwidth: 5000, packetLoss: 0, uptime: 99.98 },
        connections: ['qp-2', 'gw-1', 'st-1'],
      },
      {
        id: 'sec-1', name: 'عقدة أمنية', type: 'security-node',
        status: 'online', x: 400, y: 200,
        metrics: { latency: 0.3, bandwidth: 2000, packetLoss: 0, uptime: 99.999 },
        connections: ['qp-1', 'gw-1', 'edge-1'],
      },
      {
        id: 'gw-1', name: 'بوابة رئيسية', type: 'gateway',
        status: 'online', x: 600, y: 200,
        metrics: { latency: 1.2, bandwidth: 10000, packetLoss: 0.001, uptime: 99.99 },
        connections: ['qp-1', 'qp-2', 'ai-1', 'ai-2', 'sec-1', 'st-1', 'edge-1'],
      },
      {
        id: 'st-1', name: 'مخزن بيانات', type: 'storage',
        status: 'online', x: 600, y: 400,
        metrics: { latency: 3.5, bandwidth: 8000, packetLoss: 0, uptime: 99.95 },
        connections: ['ai-1', 'ai-2', 'gw-1'],
      },
      {
        id: 'edge-1', name: 'عقدة حافة', type: 'edge',
        status: 'online', x: 800, y: 200,
        metrics: { latency: 15, bandwidth: 1000, packetLoss: 0.05, uptime: 99.5 },
        connections: ['gw-1', 'sec-1'],
      },
    ];
  }

  private generateInitialLogs(): void {
    const messages: Array<{ level: LogEntry['level']; msg: string; src: string }> = [
      { level: 'info', msg: 'تم بدء تشغيل النظام الكمي بنجاح', src: 'quantum-core' },
      { level: 'info', msg: 'تحميل نماذج الذكاء الاصطناعي...', src: 'ai-engine' },
      { level: 'info', msg: 'فحص الأمان الدوري مكتمل - لا توجد تهديدات', src: 'security' },
      { level: 'warn', msg: 'ارتفاع مؤقت في استخدام الذاكرة', src: 'system' },
      { level: 'info', msg: 'اتصال جديد من عقدة الحافة', src: 'network' },
      { level: 'info', msg: 'معايرة المعالج الكمي Alpha مكتملة', src: 'quantum-core' },
      { level: 'debug', msg: 'تحديث حالة الكيوبتات - 127 كيوبت نشط', src: 'quantum-core' },
      { level: 'info', msg: 'نموذج NLP-Advanced جاهز للاستخدام (دقة 96.8%)', src: 'ai-engine' },
      { level: 'info', msg: 'تجديد شهادات TLS بنجاح', src: 'security' },
      { level: 'warn', msg: 'زمن استجابة الشبكة مرتفع قليلاً: 15ms', src: 'network' },
    ];

    const now = Date.now();
    this.logs = messages.map((m, i) => ({
      id: `log-init-${i}`,
      timestamp: now - (messages.length - i) * 5000,
      level: m.level,
      source: m.src,
      message: m.msg,
    }));
  }

  /** Generate next tick of metrics */
  tick(): AnalyticsReport {
    this.tickCount++;
    const now = Date.now();
    const t = this.tickCount;

    const prev = this.lastSnapshot;

    const snapshot: MetricSnapshot = {
      cpu: meanRevert(prev?.cpu ?? 45, 42, 0.1, 3),
      memory: meanRevert(prev?.memory ?? 62, 60, 0.05, 1.5),
      disk: meanRevert(prev?.disk ?? 35, 34, 0.02, 0.5),
      network: oscillate(55, 15, t, 30, 0.08),
      latency: meanRevert(prev?.latency ?? 8, 7, 0.15, 2),
      throughput: oscillate(850, 200, t, 45, 0.1),
      errorRate: Math.max(0, meanRevert(prev?.errorRate ?? 0.5, 0.3, 0.1, 0.2)),
      activeConnections: Math.floor(oscillate(450, 100, t, 60, 0.05)),
      requestsPerSecond: Math.floor(oscillate(1200, 300, t, 40, 0.08)),
      quantumUtilization: oscillate(72, 12, t, 25, 0.06),
      aiModelLoad: oscillate(65, 10, t, 35, 0.05),
      securityScore: meanRevert(prev?.securityScore ?? 97, 97.5, 0.02, 0.3),
    };

    this.lastSnapshot = snapshot;

    // Record history
    const metrics: Array<[string, number]> = [
      ['cpu', snapshot.cpu],
      ['memory', snapshot.memory],
      ['network', snapshot.network],
      ['latency', snapshot.latency],
      ['throughput', snapshot.throughput],
      ['errorRate', snapshot.errorRate],
      ['quantumUtilization', snapshot.quantumUtilization],
      ['securityScore', snapshot.securityScore],
    ];

    for (const [key, value] of metrics) {
      const arr = this.history.get(key) ?? [];
      arr.push({ timestamp: now, value });
      if (arr.length > this.maxHistory) arr.shift();
      this.history.set(key, arr);
    }

    // Detect anomalies
    this.detectAnomalies(snapshot, now);

    // Generate occasional logs
    if (t % 3 === 0) {
      this.generateLog(snapshot, now);
    }

    // Update network nodes
    this.updateNetworkNodes(snapshot);

    return this.getReport();
  }

  private detectAnomalies(snapshot: MetricSnapshot, now: number): void {
    const checks: Array<{
      metric: string;
      value: number;
      threshold: number;
      above: boolean;
      severity: Anomaly['severity'];
      desc: string;
    }> = [
      { metric: 'cpu', value: snapshot.cpu, threshold: 85, above: true, severity: 'high', desc: 'استخدام المعالج مرتفع بشكل غير طبيعي' },
      { metric: 'memory', value: snapshot.memory, threshold: 90, above: true, severity: 'critical', desc: 'الذاكرة قريبة من الحد الأقصى' },
      { metric: 'latency', value: snapshot.latency, threshold: 20, above: true, severity: 'medium', desc: 'زمن الاستجابة مرتفع' },
      { metric: 'errorRate', value: snapshot.errorRate, threshold: 2, above: true, severity: 'high', desc: 'معدل الأخطاء مرتفع' },
      { metric: 'securityScore', value: snapshot.securityScore, threshold: 90, above: false, severity: 'critical', desc: 'انخفاض درجة الأمان' },
    ];

    for (const check of checks) {
      const triggered = check.above ? check.value > check.threshold : check.value < check.threshold;
      if (triggered) {
        this.anomalies.push({
          id: `anomaly-${now}-${check.metric}`,
          metric: check.metric,
          timestamp: now,
          value: check.value,
          expected: check.threshold,
          deviation: Math.abs(check.value - check.threshold),
          severity: check.severity,
          description: check.desc,
        });
        if (this.anomalies.length > 50) this.anomalies.shift();
      }
    }
  }

  private generateLog(snapshot: MetricSnapshot, now: number): void {
    const possibleLogs: Array<{ level: LogEntry['level']; source: string; message: string }> = [
      { level: 'info', source: 'quantum-core', message: `حالة المعالج الكمي: ${snapshot.quantumUtilization.toFixed(1)}% استخدام` },
      { level: 'info', source: 'ai-engine', message: `تحميل نماذج AI: ${snapshot.aiModelLoad.toFixed(1)}%` },
      { level: 'debug', source: 'system', message: `CPU: ${snapshot.cpu.toFixed(1)}% | RAM: ${snapshot.memory.toFixed(1)}%` },
      { level: 'info', source: 'network', message: `${snapshot.activeConnections} اتصال نشط | ${snapshot.requestsPerSecond} طلب/ثانية` },
      { level: 'info', source: 'security', message: `درجة الأمان: ${snapshot.securityScore.toFixed(1)}% | معدل الخطأ: ${snapshot.errorRate.toFixed(2)}%` },
      { level: 'info', source: 'api-gateway', message: `الإنتاجية: ${snapshot.throughput.toFixed(0)} عملية/ثانية` },
    ];

    if (snapshot.cpu > 75) {
      possibleLogs.push({ level: 'warn', source: 'system', message: `تحذير: استخدام المعالج عالي (${snapshot.cpu.toFixed(1)}%)` });
    }
    if (snapshot.errorRate > 1.5) {
      possibleLogs.push({ level: 'error', source: 'system', message: `معدل أخطاء مرتفع: ${snapshot.errorRate.toFixed(2)}%` });
    }

    const entry = possibleLogs[Math.floor(Math.random() * possibleLogs.length)] as typeof possibleLogs[0];
    this.logs.push({
      id: `log-${now}`,
      timestamp: now,
      level: entry.level,
      source: entry.source,
      message: entry.message,
    });

    if (this.logs.length > 200) {
      this.logs = this.logs.slice(-150);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private updateNetworkNodes(_snapshot: MetricSnapshot): void {
    for (const node of this.networkNodes) {
      // Slightly fluctuate metrics
      node.metrics.latency = Math.max(0.1, node.metrics.latency + (Math.random() - 0.5) * 0.3);
      node.metrics.bandwidth = Math.max(100, node.metrics.bandwidth + (Math.random() - 0.5) * 50);
      node.metrics.packetLoss = Math.max(0, Math.min(1, node.metrics.packetLoss + (Math.random() - 0.5) * 0.005));

      // Occasionally switch status
      if (Math.random() < 0.002) {
        node.status = node.status === 'online' ? 'degraded' : 'online';
      }
    }
  }

  getReport(): AnalyticsReport {
    const current = this.lastSnapshot ?? {
      cpu: 0, memory: 0, disk: 0, network: 0, latency: 0,
      throughput: 0, errorRate: 0, activeConnections: 0,
      requestsPerSecond: 0, quantumUtilization: 0, aiModelLoad: 0, securityScore: 0,
    };

    const getArr = (key: string): TimeSeriesPoint[] => this.history.get(key) ?? [];
    const avg = (arr: TimeSeriesPoint[]): number =>
      arr.length > 0 ? arr.reduce((s, p) => s + p.value, 0) / arr.length : 0;

    const percentile = (arr: TimeSeriesPoint[], p: number): number => {
      if (arr.length === 0) return 0;
      const sorted = [...arr].sort((a, b) => a.value - b.value);
      const idx = Math.ceil((p / 100) * sorted.length) - 1;
      return (sorted[Math.max(0, idx)] as TimeSeriesPoint).value;
    };

    const trend = (arr: TimeSeriesPoint[]): 'increasing' | 'decreasing' | 'stable' => {
      if (arr.length < 10) return 'stable';
      const recent = arr.slice(-10);
      const first5Avg = recent.slice(0, 5).reduce((s, p) => s + p.value, 0) / 5;
      const last5Avg = recent.slice(-5).reduce((s, p) => s + p.value, 0) / 5;
      const diff = last5Avg - first5Avg;
      if (diff > 2) return 'increasing';
      if (diff < -2) return 'decreasing';
      return 'stable';
    };

    const cpuArr = getArr('cpu');
    const memArr = getArr('memory');
    const netArr = getArr('network');
    const latArr = getArr('latency');
    const thrArr = getArr('throughput');
    const errArr = getArr('errorRate');
    const quArr = getArr('quantumUtilization');
    const secArr = getArr('securityScore');

    const predictions: Prediction[] = [
      { metric: 'المعالج', currentValue: current.cpu, predictedValue: meanRevert(current.cpu, 42, 0.3, 0), confidence: 85, timeHorizon: '5 دقائق', trend: trend(cpuArr) },
      { metric: 'الذاكرة', currentValue: current.memory, predictedValue: meanRevert(current.memory, 60, 0.3, 0), confidence: 90, timeHorizon: '5 دقائق', trend: trend(memArr) },
      { metric: 'الشبكة', currentValue: current.network, predictedValue: meanRevert(current.network, 55, 0.3, 0), confidence: 75, timeHorizon: '5 دقائق', trend: trend(netArr) },
      { metric: 'الأمان', currentValue: current.securityScore, predictedValue: meanRevert(current.securityScore, 97.5, 0.1, 0), confidence: 92, timeHorizon: '10 دقائق', trend: trend(secArr) },
    ];

    return {
      current,
      history: {
        cpu: cpuArr,
        memory: memArr,
        network: netArr,
        latency: latArr,
        throughput: thrArr,
        errorRate: errArr,
        quantumUtilization: quArr,
        securityScore: secArr,
      },
      stats: {
        cpuAvg: avg(cpuArr),
        memoryAvg: avg(memArr),
        networkAvg: avg(netArr),
        latencyP50: percentile(latArr, 50),
        latencyP95: percentile(latArr, 95),
        latencyP99: percentile(latArr, 99),
        errorRateAvg: avg(errArr),
        throughputTotal: thrArr.reduce((s, p) => s + p.value, 0),
        uptime: (Date.now() - this.startTime) / 1000,
        anomalyCount: this.anomalies.length,
      },
      anomalies: this.anomalies.slice(-20),
      predictions,
    };
  }

  getLogs(limit = 50, level?: LogEntry['level']): LogEntry[] {
    let filtered = this.logs;
    if (level) {
      filtered = filtered.filter(l => l.level === level);
    }
    return filtered.slice(-limit).reverse();
  }

  getNetworkNodes(): NetworkNode[] {
    return this.networkNodes;
  }

  getNetworkConnections(): Array<{ from: string; to: string; latency: number }> {
    const connections: Array<{ from: string; to: string; latency: number }> = [];
    const seen = new Set<string>();

    for (const node of this.networkNodes) {
      for (const connId of node.connections) {
        const key = [node.id, connId].sort().join('-');
        if (!seen.has(key)) {
          seen.add(key);
          const target = this.networkNodes.find(n => n.id === connId);
          if (target) {
            connections.push({
              from: node.id,
              to: connId,
              latency: (node.metrics.latency + target.metrics.latency) / 2,
            });
          }
        }
      }
    }
    return connections;
  }
}

// Singleton instance
let engineInstance: AnalyticsEngine | null = null;

export const getAnalyticsEngine = (): AnalyticsEngine => {
  if (!engineInstance) {
    engineInstance = new AnalyticsEngine();
  }
  return engineInstance;
};
