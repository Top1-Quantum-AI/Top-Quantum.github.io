/**
 * Quantum Simulator Tests
 */
import {
  simulateCircuit,
  algorithms,
  type GateOp,
  type AlgorithmName,
} from '../src/services/quantumSimulator';

describe('quantumSimulator', () => {
  describe('simulateCircuit', () => {
    it('should simulate a single qubit with no gates', () => {
      const result = simulateCircuit(1, [], 100);
      expect(result.numQubits).toBe(1);
      expect(result.stateVector).toHaveLength(2);
      // |0⟩ state: probability [1, 0]
      expect(result.probabilities[0]).toBeCloseTo(1, 5);
      expect(result.probabilities[1]).toBeCloseTo(0, 5);
      expect(result.gateCount).toBe(0);
    });

    it('should apply Hadamard gate to create superposition', () => {
      const gates: GateOp[] = [{ gate: 'H', targets: [0] }];
      const result = simulateCircuit(1, gates, 1024);
      // After H: equal superposition
      expect(result.probabilities[0]).toBeCloseTo(0.5, 1);
      expect(result.probabilities[1]).toBeCloseTo(0.5, 1);
      expect(result.gateCount).toBe(1);
    });

    it('should apply X gate (NOT)', () => {
      const gates: GateOp[] = [{ gate: 'X', targets: [0] }];
      const result = simulateCircuit(1, gates, 100);
      // |0⟩ → |1⟩
      expect(result.probabilities[0]).toBeCloseTo(0, 5);
      expect(result.probabilities[1]).toBeCloseTo(1, 5);
    });

    it('should apply CNOT gate for entanglement', () => {
      const gates: GateOp[] = [
        { gate: 'H', targets: [0] },
        { gate: 'CNOT', targets: [1], controls: [0] },
      ];
      const result = simulateCircuit(2, gates, 1024);
      // Bell state: |00⟩ + |11⟩ / sqrt(2)
      expect(result.numQubits).toBe(2);
      expect(result.probabilities[0]).toBeCloseTo(0.5, 1); // |00⟩
      expect(result.probabilities[3]).toBeCloseTo(0.5, 1); // |11⟩
      expect(result.probabilities[1]).toBeCloseTo(0, 1);   // |01⟩
      expect(result.probabilities[2]).toBeCloseTo(0, 1);   // |10⟩
    });

    it('should produce correct measurement statistics', () => {
      const gates: GateOp[] = [{ gate: 'H', targets: [0] }];
      const result = simulateCircuit(1, gates, 10000);
      const total = Object.values(result.measurements).reduce((s, v) => s + v, 0);
      expect(total).toBe(10000);
      // Each outcome ~50%
      const m0 = result.measurements['0'] ?? 0;
      const m1 = result.measurements['1'] ?? 0;
      expect(m0).toBeGreaterThan(4000);
      expect(m1).toBeGreaterThan(4000);
    });

    it('should throw error for invalid qubit count', () => {
      expect(() => simulateCircuit(0, [])).toThrow();
      expect(() => simulateCircuit(21, [])).toThrow();
    });

    it('should handle noise', () => {
      const gates: GateOp[] = [{ gate: 'H', targets: [0] }];
      const result = simulateCircuit(1, gates, 100, 0.1);
      // Should still complete without error
      expect(result.fidelity).toBeLessThanOrEqual(1);
      expect(result.fidelity).toBeGreaterThan(0);
    });

    it('should track circuit depth correctly', () => {
      const gates: GateOp[] = [
        { gate: 'H', targets: [0] },
        { gate: 'X', targets: [1] },
        { gate: 'CNOT', targets: [1], controls: [0] },
      ];
      const result = simulateCircuit(2, gates, 100);
      expect(result.circuitDepth).toBe(2); // H+X parallel, then CNOT
    });

    it('should calculate execution time', () => {
      const result = simulateCircuit(2, [{ gate: 'H', targets: [0] }], 100);
      expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should generate Bloch sphere coordinates', () => {
      const result = simulateCircuit(1, [{ gate: 'H', targets: [0] }], 100);
      expect(result.blochSpheres).toHaveLength(1);
      expect(result.blochSpheres[0]).toHaveProperty('theta');
      expect(result.blochSpheres[0]).toHaveProperty('phi');
    });

    it('should apply SWAP gate correctly', () => {
      // Put qubit 0 in |1⟩, qubit 1 in |0⟩, then swap
      const gates: GateOp[] = [
        { gate: 'X', targets: [0] },
        { gate: 'SWAP', targets: [0, 1] },
      ];
      const result = simulateCircuit(2, gates, 100);
      // After swap: qubit 0 = |0⟩, qubit 1 = |1⟩ → state |10⟩ = index 2
      expect(result.probabilities[2]).toBeCloseTo(1, 1);
    });
  });

  describe('algorithms', () => {
    it('should have predefined algorithms', () => {
      const algoNames = Object.keys(algorithms);
      expect(algoNames.length).toBeGreaterThanOrEqual(3);
      expect(algoNames).toContain('bellState');
    });

    it('should run bellState algorithm', () => {
      const algo = algorithms.bellState();
      const result = simulateCircuit(algo.qubits, algo.gates, 1024);
      expect(result.numQubits).toBe(algo.qubits);
      // Bell state: should have ~50% |00⟩ and ~50% |11⟩
      expect(result.probabilities[0]).toBeCloseTo(0.5, 1);
    });

    it('should run all algorithms without error', () => {
      for (const name of Object.keys(algorithms) as AlgorithmName[]) {
        const algoFn = algorithms[name] as (...args: number[]) => { qubits: number; gates: GateOp[] };
        const algo = algoFn();
        expect(() => simulateCircuit(algo.qubits, algo.gates, 100)).not.toThrow();
      }
    });

    it('each algorithm should have valid qubit count and gates', () => {
      for (const name of Object.keys(algorithms) as AlgorithmName[]) {
        const algoFn = algorithms[name] as (...args: number[]) => { qubits: number; gates: GateOp[] };
        const algo = algoFn();
        expect(algo.qubits).toBeGreaterThanOrEqual(1);
        expect(algo.qubits).toBeLessThanOrEqual(20);
        expect(Array.isArray(algo.gates)).toBe(true);
        expect(algo.gates.length).toBeGreaterThan(0);
      }
    });
  });
});
