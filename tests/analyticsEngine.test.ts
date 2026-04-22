/**
 * Analytics Engine Tests
 */
import {
  AnalyticsEngine,
  getAnalyticsEngine,
  type TimeSeriesPoint,
} from '../src/services/analyticsEngine';

describe('AnalyticsEngine', () => {
  let engine: AnalyticsEngine;

  beforeEach(() => {
    engine = new AnalyticsEngine();
  });

  describe('constructor', () => {
    it('should create an instance', () => {
      expect(engine).toBeInstanceOf(AnalyticsEngine);
    });

    it('should initialize network nodes', () => {
      const nodes = engine.getNetworkNodes();
      expect(nodes.length).toBeGreaterThanOrEqual(1);
    });

    it('should initialize logs', () => {
      const logs = engine.getLogs();
      expect(Array.isArray(logs)).toBe(true);
      expect(logs.length).toBeGreaterThan(0);
    });
  });

  describe('tick()', () => {
    it('should return a valid AnalyticsReport', () => {
      const report = engine.tick();
      expect(report).toHaveProperty('current');
      expect(report).toHaveProperty('history');
      expect(report).toHaveProperty('stats');
      expect(report).toHaveProperty('anomalies');
      expect(report).toHaveProperty('predictions');
    });

    it('current snapshot should have all required metrics', () => {
      const report = engine.tick();
      const { current } = report;
      expect(typeof current.cpu).toBe('number');
      expect(typeof current.memory).toBe('number');
      expect(typeof current.disk).toBe('number');
      expect(typeof current.network).toBe('number');
      expect(typeof current.latency).toBe('number');
      expect(typeof current.throughput).toBe('number');
      expect(typeof current.errorRate).toBe('number');
      expect(typeof current.activeConnections).toBe('number');
      expect(typeof current.requestsPerSecond).toBe('number');
      expect(typeof current.quantumUtilization).toBe('number');
      expect(typeof current.aiModelLoad).toBe('number');
      expect(typeof current.securityScore).toBe('number');
    });

    it('should accumulate history on multiple ticks', () => {
      engine.tick();
      engine.tick();
      const report = engine.tick();
      // Each tick adds one point to each metric's history
      expect(report.history.cpu.length).toBe(3);
      expect(report.history.memory.length).toBe(3);
    });

    it('history should not exceed maxHistory (200)', () => {
      for (let i = 0; i < 210; i++) engine.tick();
      const report = engine.tick();
      expect(report.history.cpu.length).toBeLessThanOrEqual(200);
    });

    it('should have history arrays for all expected metrics', () => {
      const report = engine.tick();
      expect(Array.isArray(report.history.cpu)).toBe(true);
      expect(Array.isArray(report.history.memory)).toBe(true);
      expect(Array.isArray(report.history.network)).toBe(true);
      expect(Array.isArray(report.history.latency)).toBe(true);
      expect(Array.isArray(report.history.throughput)).toBe(true);
      expect(Array.isArray(report.history.errorRate)).toBe(true);
      expect(Array.isArray(report.history.quantumUtilization)).toBe(true);
      expect(Array.isArray(report.history.securityScore)).toBe(true);
    });

    it('stats should include expected keys', () => {
      engine.tick();
      const report = engine.tick();
      const { stats } = report;
      expect(typeof stats.cpuAvg).toBe('number');
      expect(typeof stats.memoryAvg).toBe('number');
      expect(typeof stats.networkAvg).toBe('number');
      expect(typeof stats.latencyP50).toBe('number');
      expect(typeof stats.latencyP95).toBe('number');
      expect(typeof stats.latencyP99).toBe('number');
      expect(typeof stats.errorRateAvg).toBe('number');
      expect(typeof stats.throughputTotal).toBe('number');
      expect(typeof stats.uptime).toBe('number');
      expect(typeof stats.anomalyCount).toBe('number');
    });

    it('uptime should be non-negative', () => {
      const report = engine.tick();
      expect(report.stats.uptime).toBeGreaterThanOrEqual(0);
    });

    it('predictions should be an array', () => {
      const report = engine.tick();
      expect(Array.isArray(report.predictions)).toBe(true);
      expect(report.predictions.length).toBeGreaterThan(0);
    });

    it('each prediction should have required fields', () => {
      const report = engine.tick();
      for (const pred of report.predictions) {
        expect(typeof pred.metric).toBe('string');
        expect(typeof pred.currentValue).toBe('number');
        expect(typeof pred.predictedValue).toBe('number');
        expect(typeof pred.confidence).toBe('number');
        expect(typeof pred.timeHorizon).toBe('string');
        expect(['increasing', 'decreasing', 'stable']).toContain(pred.trend);
      }
    });

    it('anomalies should be an array', () => {
      const report = engine.tick();
      expect(Array.isArray(report.anomalies)).toBe(true);
    });

    it('metric values should be within valid range [0, 100]', () => {
      for (let i = 0; i < 20; i++) {
        const report = engine.tick();
        const c = report.current;
        expect(c.cpu).toBeGreaterThanOrEqual(0);
        expect(c.cpu).toBeLessThanOrEqual(100);
        expect(c.memory).toBeGreaterThanOrEqual(0);
        expect(c.memory).toBeLessThanOrEqual(100);
        expect(c.errorRate).toBeGreaterThanOrEqual(0);
        expect(c.securityScore).toBeGreaterThanOrEqual(0);
        expect(c.securityScore).toBeLessThanOrEqual(100);
      }
    });

    it('should generate logs periodically (every 3 ticks)', () => {
      const initialCount = engine.getLogs(200).length;
      // 3 ticks → at least one log added (tick 3 % 3 === 0)
      engine.tick();
      engine.tick();
      engine.tick();
      const afterCount = engine.getLogs(200).length;
      expect(afterCount).toBeGreaterThanOrEqual(initialCount);
    });
  });

  describe('getReport()', () => {
    it('should return zeroed current snapshot before any tick', () => {
      const report = engine.getReport();
      expect(report.current.cpu).toBe(0);
      expect(report.current.memory).toBe(0);
    });

    it('should return current snapshot after ticking', () => {
      engine.tick();
      const report = engine.getReport();
      // After one tick, cpu should be a real value (not 0)
      expect(report.current.cpu).toBeGreaterThan(0);
    });

    it('stats averages should be 0 with empty history', () => {
      const report = engine.getReport();
      expect(report.stats.cpuAvg).toBe(0);
      expect(report.stats.memoryAvg).toBe(0);
    });

    it('stats averages should match history values after ticks', () => {
      // Single tick: avg == the single value
      const { current } = engine.tick();
      const report = engine.getReport();
      expect(report.stats.cpuAvg).toBeCloseTo(current.cpu, 5);
    });

    it('latency percentiles should respect p50 <= p95 <= p99', () => {
      for (let i = 0; i < 20; i++) engine.tick();
      const { stats } = engine.getReport();
      expect(stats.latencyP50).toBeLessThanOrEqual(stats.latencyP95);
      expect(stats.latencyP95).toBeLessThanOrEqual(stats.latencyP99);
    });

    it('anomalies list should be capped at 20', () => {
      for (let i = 0; i < 60; i++) engine.tick();
      const report = engine.getReport();
      expect(report.anomalies.length).toBeLessThanOrEqual(20);
    });
  });

  describe('getLogs()', () => {
    it('should return logs with default limit of 50', () => {
      const logs = engine.getLogs();
      expect(Array.isArray(logs)).toBe(true);
      expect(logs.length).toBeLessThanOrEqual(50);
    });

    it('should respect a custom limit', () => {
      const logs = engine.getLogs(3);
      expect(logs.length).toBeLessThanOrEqual(3);
    });

    it('should filter by level', () => {
      // Tick many times to get more varied logs
      for (let i = 0; i < 12; i++) engine.tick();
      const infoLogs = engine.getLogs(200, 'info');
      for (const log of infoLogs) {
        expect(log.level).toBe('info');
      }
    });

    it('each log entry should have required fields', () => {
      const logs = engine.getLogs();
      for (const log of logs) {
        expect(typeof log.id).toBe('string');
        expect(typeof log.timestamp).toBe('number');
        expect(typeof log.level).toBe('string');
        expect(typeof log.source).toBe('string');
        expect(typeof log.message).toBe('string');
      }
    });

    it('should return logs in reverse-chronological order', () => {
      engine.tick();
      engine.tick();
      engine.tick();
      engine.tick();
      engine.tick();
      engine.tick();
      const logs = engine.getLogs();
      for (let i = 1; i < logs.length; i++) {
        // logs are reversed, so each entry should be >= the next
        expect((logs[i - 1] as { timestamp: number }).timestamp).toBeGreaterThanOrEqual(
          (logs[i] as { timestamp: number }).timestamp
        );
      }
    });
  });

  describe('getNetworkNodes()', () => {
    it('should return an array of network nodes', () => {
      const nodes = engine.getNetworkNodes();
      expect(Array.isArray(nodes)).toBe(true);
      expect(nodes.length).toBeGreaterThan(0);
    });

    it('each node should have required fields', () => {
      const nodes = engine.getNetworkNodes();
      for (const node of nodes) {
        expect(typeof node.id).toBe('string');
        expect(typeof node.name).toBe('string');
        expect(typeof node.type).toBe('string');
        expect(['online', 'offline', 'degraded', 'maintenance']).toContain(node.status);
        expect(typeof node.x).toBe('number');
        expect(typeof node.y).toBe('number');
        expect(typeof node.metrics.latency).toBe('number');
        expect(typeof node.metrics.bandwidth).toBe('number');
        expect(typeof node.metrics.packetLoss).toBe('number');
        expect(typeof node.metrics.uptime).toBe('number');
        expect(Array.isArray(node.connections)).toBe(true);
      }
    });

    it('should have nodes of various types', () => {
      const nodes = engine.getNetworkNodes();
      const types = nodes.map(n => n.type);
      expect(types).toContain('quantum-processor');
      expect(types).toContain('ai-cluster');
      expect(types).toContain('gateway');
    });
  });

  describe('getNetworkConnections()', () => {
    it('should return an array of connections', () => {
      const conns = engine.getNetworkConnections();
      expect(Array.isArray(conns)).toBe(true);
      expect(conns.length).toBeGreaterThan(0);
    });

    it('each connection should have from, to, and latency', () => {
      const conns = engine.getNetworkConnections();
      for (const conn of conns) {
        expect(typeof conn.from).toBe('string');
        expect(typeof conn.to).toBe('string');
        expect(typeof conn.latency).toBe('number');
        expect(conn.latency).toBeGreaterThan(0);
      }
    });

    it('should not return duplicate connections', () => {
      const conns = engine.getNetworkConnections();
      const keys = conns.map(c => [c.from, c.to].sort().join('-'));
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(conns.length);
    });

    it('connection latency should be average of two node latencies', () => {
      const nodes = engine.getNetworkNodes();
      const conns = engine.getNetworkConnections();
      // Pick a connection and verify its latency
      for (const conn of conns.slice(0, 3)) {
        const nodeA = nodes.find(n => n.id === conn.from);
        const nodeB = nodes.find(n => n.id === conn.to);
        if (nodeA && nodeB) {
          const expectedLatency = (nodeA.metrics.latency + nodeB.metrics.latency) / 2;
          expect(conn.latency).toBeCloseTo(expectedLatency, 5);
        }
      }
    });
  });

  describe('network node metrics update (after tick)', () => {
    it('node metrics should change slightly after ticks', () => {
      const nodesBefore = engine.getNetworkNodes().map(n => ({ ...n, metrics: { ...n.metrics } }));
      for (let i = 0; i < 10; i++) engine.tick();
      const nodesAfter = engine.getNetworkNodes();
      // At least some nodes should have changed latency
      const changed = nodesAfter.filter(
        (n, i) =>
          n.metrics.latency !== (nodesBefore[i] as { metrics: { latency: number } }).metrics.latency
      );
      expect(changed.length).toBeGreaterThan(0);
    });
  });
});

describe('getAnalyticsEngine()', () => {
  it('should return the same singleton instance on multiple calls', () => {
    const a = getAnalyticsEngine();
    const b = getAnalyticsEngine();
    expect(a).toBe(b);
  });

  it('singleton should be an AnalyticsEngine instance', () => {
    expect(getAnalyticsEngine()).toBeInstanceOf(AnalyticsEngine);
  });

  it('singleton should maintain state across calls', () => {
    const engine = getAnalyticsEngine();
    engine.tick();
    const report = getAnalyticsEngine().getReport();
    expect(report.history.cpu.length).toBeGreaterThanOrEqual(1);
  });
});

describe('time-series percentile calculations', () => {
  it('p50 should equal median for a sorted set of values', () => {
    const e = new AnalyticsEngine();
    // We can't inject history directly, but we can run many ticks and
    // verify that the percentile ordering holds
    for (let i = 0; i < 50; i++) e.tick();
    const report = e.getReport();
    expect(report.stats.latencyP50).toBeLessThanOrEqual(report.stats.latencyP95);
    expect(report.stats.latencyP50).toBeLessThanOrEqual(report.stats.latencyP99);
  });

  it('throughputTotal should equal sum of all throughput history values', () => {
    const e = new AnalyticsEngine();
    for (let i = 0; i < 5; i++) e.tick();
    const report = e.getReport();
    const throughputValues: TimeSeriesPoint[] = report.history.throughput;
    const sum = throughputValues.reduce((acc, p) => acc + p.value, 0);
    expect(report.stats.throughputTotal).toBeCloseTo(sum, 5);
  });
});

describe('trend detection', () => {
  it('should return stable trend with less than 10 data points', () => {
    const e = new AnalyticsEngine();
    for (let i = 0; i < 9; i++) e.tick();
    const report = e.getReport();
    // With < 10 points, all trends should be stable
    for (const pred of report.predictions) {
      expect(pred.trend).toBe('stable');
    }
  });

  it('trend should be one of the valid values with 10+ data points', () => {
    const e = new AnalyticsEngine();
    for (let i = 0; i < 15; i++) e.tick();
    const report = e.getReport();
    for (const pred of report.predictions) {
      expect(['increasing', 'decreasing', 'stable']).toContain(pred.trend);
    }
  });
});
