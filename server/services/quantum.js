/**
 * Quantum Service - خدمة الحوسبة الكمية
 * Quantum computing simulation and algorithms implementation
 * محاكاة الحوسبة الكمية وتنفيذ الخوارزميات الكمية
 */

import { Complex } from 'complex.js';
import { EventEmitter } from 'events';

/**
 * Quantum State Class
 * فئة الحالة الكمية
 */
class QuantumState {
  constructor(numQubits) {
    this.numQubits = numQubits;
    this.numStates = Math.pow(2, numQubits);
    this.amplitudes = new Array(this.numStates).fill(null).map(() => new Complex(0, 0));

    // Initialize to |0...0⟩ state
    this.amplitudes[0] = new Complex(1, 0);
  }

  /**
   * Get probability of measuring a specific state
   * الحصول على احتمالية قياس حالة معينة
   */
  getProbability(state) {
    if (state >= this.numStates) {
      throw new Error(`State ${state} is out of range for ${this.numQubits} qubits`);
    }
    return Math.pow(this.amplitudes[state].abs(), 2);
  }

  /**
   * Get all probabilities
   * الحصول على جميع الاحتماليات
   */
  getAllProbabilities() {
    return this.amplitudes.map(amp => Math.pow(amp.abs(), 2));
  }

  /**
   * Normalize the quantum state
   * تطبيع الحالة الكمية
   */
  normalize() {
    const norm = Math.sqrt(
      this.amplitudes.reduce((sum, amp) => {
        return sum + Math.pow(amp.abs(), 2);
      }, 0)
    );

    if (norm > 0) {
      this.amplitudes = this.amplitudes.map(amp => amp.div(norm));
    }
  }

  /**
   * Clone the quantum state
   * استنساخ الحالة الكمية
   */
  clone() {
    const newState = new QuantumState(this.numQubits);
    newState.amplitudes = this.amplitudes.map(amp => new Complex(amp.re, amp.im));
    return newState;
  }

  /**
   * Get state vector as array
   * الحصول على متجه الحالة كمصفوفة
   */
  getStateVector() {
    return this.amplitudes.map(amp => ({ real: amp.re, imag: amp.im }));
  }

  /**
   * Set state from vector
   * تعيين الحالة من متجه
   */
  setStateVector(vector) {
    if (vector.length !== this.numStates) {
      throw new Error('Vector length must match number of states');
    }

    this.amplitudes = vector.map(v => new Complex(v.real || 0, v.imag || 0));
    this.normalize();
  }

  // Added: return amplitudes as plain objects (for API responses)
  getAmplitudes() {
    return this.amplitudes.map(amp => ({ real: amp.re, imag: amp.im }));
  }

  // Added: check normalization within tolerance
  isNormalized(epsilon = 1e-9) {
    const normSq = this.amplitudes.reduce((sum, amp) => sum + Math.pow(amp.abs(), 2), 0);
    return Math.abs(1 - normSq) < epsilon;
  }

  // Added: import state from serialized object
  import(stateData) {
    const vector = Array.isArray(stateData)
      ? stateData
      : stateData && stateData.amplitudes
        ? stateData.amplitudes
        : null;
    if (!vector) {
      throw new Error('Invalid state format for import');
    }
    this.setStateVector(vector);
  }

  // Added: apply a provided 2-qubit gate
  applyTwoQubitGate(gate, controlQubit, targetQubit) {
    if (!gate || typeof gate.apply !== 'function' || gate.numQubits !== 2) {
      throw new Error('applyTwoQubitGate requires a 2-qubit QuantumGate');
    }
    if (controlQubit === targetQubit) {
      throw new Error('Control and target qubits must be different');
    }
    if (
      controlQubit < 0 ||
      controlQubit >= this.numQubits ||
      targetQubit < 0 ||
      targetQubit >= this.numQubits
    ) {
      throw new Error('Qubit index out of range');
    }
    gate.apply(this, [controlQubit, targetQubit]);
  }

  // Added: estimate entanglement entropy for the first qubit by default
  getEntanglementEntropy(subsystemQubits = [0]) {
    if (!Array.isArray(subsystemQubits)) subsystemQubits = [subsystemQubits];
    const subsystemSize = subsystemQubits.length;
    const subsystemStates = Math.pow(2, subsystemSize);

    // Helper to extract bits for given qubits
    const extractTargetBits = (stateIndex, targetQubits, totalQubits) => {
      let result = 0;
      for (let i = 0; i < targetQubits.length; i++) {
        const bit = (stateIndex >> (totalQubits - 1 - targetQubits[i])) & 1;
        result |= bit << (targetQubits.length - 1 - i);
      }
      return result;
    };

    // Helper to check environment match
    const environmentStatesMatch = (i, j, targetQubits, totalQubits) => {
      const env = [];
      for (let q = 0; q < totalQubits; q++) if (!targetQubits.includes(q)) env.push(q);
      const envI = extractTargetBits(i, env, totalQubits);
      const envJ = extractTargetBits(j, env, totalQubits);
      return envI === envJ;
    };

    // Reduced density matrix (complex entries)
    const rho = new Array(subsystemStates)
      .fill(null)
      .map(() => new Array(subsystemStates).fill(null).map(() => new Complex(0, 0)));
    for (let i = 0; i < this.numStates; i++) {
      for (let j = 0; j < this.numStates; j++) {
        const iSub = extractTargetBits(i, subsystemQubits, this.numQubits);
        const jSub = extractTargetBits(j, subsystemQubits, this.numQubits);
        if (environmentStatesMatch(i, j, subsystemQubits, this.numQubits)) {
          rho[iSub][jSub] = rho[iSub][jSub].add(
            this.amplitudes[i].mul(this.amplitudes[j].conjugate())
          );
        }
      }
    }

    // Eigenvalues (handle 2x2 exactly, else diagonal approximation)
    let eigenvalues;
    if (rho.length === 2) {
      const a = rho[0][0].re,
        b = rho[0][1].re,
        c = rho[1][0].re,
        d = rho[1][1].re;
      const tr = a + d;
      const det = a * d - b * c;
      const disc = tr * tr - 4 * det;
      if (disc >= 0) {
        const s = Math.sqrt(disc);
        eigenvalues = [(tr + s) / 2, (tr - s) / 2];
      } else {
        eigenvalues = [Math.max(0, a), Math.max(0, d)];
      }
    } else {
      eigenvalues = rho.map((row, i) => Math.max(0, row[i].re));
    }

    // Von Neumann entropy S = -Tr(ρ log2 ρ)
    let S = 0;
    for (const lam of eigenvalues) {
      if (lam > 1e-12) S -= lam * Math.log2(lam);
    }
    return S;
  }

  // Added: export state as structured data for API and persistence
  export() {
    return {
      numQubits: this.numQubits,
      amplitudes: this.getAmplitudes(),
      probabilities: this.getAllProbabilities(),
      timestamp: new Date().toISOString(),
    };
  }

  // Added: instance-level getProbabilities wrapper for API usage
  getProbabilities() {
    return this.getAllProbabilities();
  }

  // Added: instance-level measure method wrapper
  measure(targetQubits = null) {
    const probabilities = this.getAllProbabilities();
    const random = Math.random();
    let cumulativeProbability = 0;
    let measuredState = 0;

    // Find the measured state based on probabilities
    for (let i = 0; i < probabilities.length; i++) {
      cumulativeProbability += probabilities[i];
      if (random <= cumulativeProbability) {
        measuredState = i;
        break;
      }
    }

    // If specific qubits are targeted, extract their values
    let result;
    if (targetQubits !== null) {
      if (!Array.isArray(targetQubits)) {
        targetQubits = [targetQubits];
      }

      result = targetQubits.map(qubit => {
        return (measuredState >> (this.numQubits - 1 - qubit)) & 1;
      });

      if (result.length === 1) {
        result = result[0];
      }
    } else {
      // Return binary array for all qubits
      result = [];
      for (let i = 0; i < this.numQubits; i++) {
        result.push((measuredState >> (this.numQubits - 1 - i)) & 1);
      }
    }

    // Collapse the state after measurement
    const newAmplitudes = new Array(this.numStates).fill(null).map(() => new Complex(0, 0));
    newAmplitudes[measuredState] = new Complex(1, 0);
    this.amplitudes = newAmplitudes;

    return result;
  }

  // Added: instance-level applyGate method
  applyGate(gate, targetQubit) {
    if (!gate || typeof gate.apply !== 'function') {
      throw new Error('applyGate requires a QuantumGate object');
    }
    if (targetQubit < 0 || targetQubit >= this.numQubits) {
      throw new Error('Target qubit index out of range');
    }
    gate.apply(this, [targetQubit]);
  }
}

/**
 * Quantum Gate Class
 * فئة البوابة الكمية
 */
class QuantumGate {
  constructor(name, matrix, numQubits = 1) {
    this.name = name;
    this.matrix = matrix;
    this.numQubits = numQubits;
  }

  /**
   * Apply gate to quantum state
   * تطبيق البوابة على الحالة الكمية
   */
  apply(state, targetQubits) {
    if (targetQubits.length !== this.numQubits) {
      throw new Error(`Gate ${this.name} requires ${this.numQubits} qubits`);
    }

    const newAmplitudes = new Array(state.numStates).fill(null).map(() => new Complex(0, 0));

    for (let i = 0; i < state.numStates; i++) {
      const inputState = this.extractTargetBits(i, targetQubits, state.numQubits);

      for (let j = 0; j < this.matrix.length; j++) {
        const outputState = this.insertTargetBits(i, j, targetQubits, state.numQubits);
        const matrixElement = this.matrix[j][inputState];

        if (matrixElement && !matrixElement.equals(0)) {
          newAmplitudes[outputState] = newAmplitudes[outputState].add(
            state.amplitudes[i].mul(matrixElement)
          );
        }
      }
    }

    state.amplitudes = newAmplitudes;
  }

  /**
   * Extract target bits from state index
   * استخراج البتات المستهدفة من فهرس الحالة
   */
  extractTargetBits(stateIndex, targetQubits, totalQubits) {
    let result = 0;
    for (let i = 0; i < targetQubits.length; i++) {
      const bit = (stateIndex >> (totalQubits - 1 - targetQubits[i])) & 1;
      result |= bit << (targetQubits.length - 1 - i);
    }
    return result;
  }

  /**
   * Insert target bits into state index
   * إدراج البتات المستهدفة في فهرس الحالة
   */
  insertTargetBits(originalIndex, newBits, targetQubits, totalQubits) {
    let result = originalIndex;

    for (let i = 0; i < targetQubits.length; i++) {
      const bitPos = totalQubits - 1 - targetQubits[i];
      const newBit = (newBits >> (targetQubits.length - 1 - i)) & 1;

      // Clear the bit
      result &= ~(1 << bitPos);
      // Set the new bit
      result |= newBit << bitPos;
    }

    return result;
  }
}

/**
 * Quantum Service Main Class
 * الفئة الرئيسية لخدمة الحوسبة الكمية
 */
class QuantumService extends EventEmitter {
  constructor() {
    super();
    this.gates = new Map();
    this.circuits = new Map();
    this.simulationHistory = [];

    // Initialize standard gates
    this.initializeStandardGates();

    console.log('✅ Quantum Service initialized');
    console.log('✅ تم تهيئة خدمة الحوسبة الكمية');
  }

  /**
   * Initialize standard quantum gates
   * تهيئة البوابات الكمية القياسية
   */
  initializeStandardGates() {
    // Pauli-X Gate (NOT)
    const pauliX = new QuantumGate('X', [
      [new Complex(0, 0), new Complex(1, 0)],
      [new Complex(1, 0), new Complex(0, 0)],
    ]);
    this.gates.set('X', pauliX);

    // Pauli-Y Gate
    const pauliY = new QuantumGate('Y', [
      [new Complex(0, 0), new Complex(0, -1)],
      [new Complex(0, 1), new Complex(0, 0)],
    ]);
    this.gates.set('Y', pauliY);

    // Pauli-Z Gate
    const pauliZ = new QuantumGate('Z', [
      [new Complex(1, 0), new Complex(0, 0)],
      [new Complex(0, 0), new Complex(-1, 0)],
    ]);
    this.gates.set('Z', pauliZ);

    // Hadamard Gate
    const hadamard = new QuantumGate('H', [
      [new Complex(1 / Math.sqrt(2), 0), new Complex(1 / Math.sqrt(2), 0)],
      [new Complex(1 / Math.sqrt(2), 0), new Complex(-1 / Math.sqrt(2), 0)],
    ]);
    this.gates.set('H', hadamard);

    // Phase Gate (S)
    const phase = new QuantumGate('S', [
      [new Complex(1, 0), new Complex(0, 0)],
      [new Complex(0, 0), new Complex(0, 1)],
    ]);
    this.gates.set('S', phase);

    // T Gate
    const tGate = new QuantumGate('T', [
      [new Complex(1, 0), new Complex(0, 0)],
      [new Complex(0, 0), new Complex(1 / Math.sqrt(2), 1 / Math.sqrt(2))],
    ]);
    this.gates.set('T', tGate);

    // CNOT Gate (2-qubit)
    const cnot = new QuantumGate(
      'CNOT',
      [
        [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(1, 0)],
        [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0)],
      ],
      2
    );
    this.gates.set('CNOT', cnot);

    // Identity Gate
    const identity = new QuantumGate('I', [
      [new Complex(1, 0), new Complex(0, 0)],
      [new Complex(0, 0), new Complex(1, 0)],
    ]);
    this.gates.set('I', identity);
  }

  /**
   * Create a new quantum state
   * إنشاء حالة كمية جديدة
   */
  createQuantumState(numQubits) {
    if (numQubits < 1 || numQubits > 20) {
      throw new Error('Number of qubits must be between 1 and 20');
    }

    return new QuantumState(numQubits);
  }

  /**
   * Apply a quantum gate to a state
   * تطبيق بوابة كمية على حالة
   */
  applyGate(state, gateName, targetQubits) {
    const gate = this.gates.get(gateName.toUpperCase());
    if (!gate) {
      throw new Error(`Unknown gate: ${gateName}`);
    }

    // Validate target qubits
    if (!Array.isArray(targetQubits)) {
      targetQubits = [targetQubits];
    }

    for (const qubit of targetQubits) {
      if (qubit < 0 || qubit >= state.numQubits) {
        throw new Error(`Qubit ${qubit} is out of range`);
      }
    }

    gate.apply(state, targetQubits);

    this.emit('gateApplied', {
      gate: gateName,
      targetQubits,
      timestamp: new Date().toISOString(),
    });

    return state;
  }

  /**
   * Measure a quantum state
   * قياس حالة كمية
   */
  measure(state, targetQubits = null) {
    const probabilities = state.getAllProbabilities();
    const random = Math.random();
    let cumulativeProbability = 0;
    let measuredState = 0;

    // Find the measured state based on probabilities
    for (let i = 0; i < probabilities.length; i++) {
      cumulativeProbability += probabilities[i];
      if (random <= cumulativeProbability) {
        measuredState = i;
        break;
      }
    }

    // If specific qubits are targeted, extract their values
    let result;
    if (targetQubits !== null) {
      if (!Array.isArray(targetQubits)) {
        targetQubits = [targetQubits];
      }

      result = targetQubits.map(qubit => {
        return (measuredState >> (state.numQubits - 1 - qubit)) & 1;
      });

      if (result.length === 1) {
        result = result[0];
      }
    } else {
      result = measuredState;
    }

    // Collapse the state after measurement
    const newAmplitudes = new Array(state.numStates).fill(null).map(() => new Complex(0, 0));
    newAmplitudes[measuredState] = new Complex(1, 0);
    state.amplitudes = newAmplitudes;

    this.emit('measurement', {
      result,
      measuredState,
      probabilities,
      timestamp: new Date().toISOString(),
    });

    return result;
  }

  /**
   * Get measurement probabilities without collapsing the state
   * الحصول على احتماليات القياس دون انهيار الحالة
   */
  getProbabilities(state, targetQubits = null) {
    if (targetQubits === null) {
      return state.getAllProbabilities();
    }

    if (!Array.isArray(targetQubits)) {
      targetQubits = [targetQubits];
    }

    const numTargetStates = Math.pow(2, targetQubits.length);
    const probabilities = new Array(numTargetStates).fill(0);

    for (let i = 0; i < state.numStates; i++) {
      const targetState = this.extractTargetBits(i, targetQubits, state.numQubits);
      probabilities[targetState] += state.getProbability(i);
    }

    return probabilities;
  }

  /**
   * Extract target bits (helper method)
   * استخراج البتات المستهدفة (طريقة مساعدة)
   */
  extractTargetBits(stateIndex, targetQubits, totalQubits) {
    let result = 0;
    for (let i = 0; i < targetQubits.length; i++) {
      const bit = (stateIndex >> (totalQubits - 1 - targetQubits[i])) & 1;
      result |= bit << (targetQubits.length - 1 - i);
    }
    return result;
  }

  /**
   * Create quantum superposition
   * إنشاء تراكب كمي
   */
  createSuperposition(numQubits, amplitudes = null) {
    const state = this.createQuantumState(numQubits);

    if (amplitudes) {
      if (amplitudes.length !== state.numStates) {
        throw new Error('Amplitudes array length must match number of states');
      }

      state.amplitudes = amplitudes.map(amp => {
        if (typeof amp === 'number') {
          return new Complex(amp, 0);
        } else if (amp.real !== undefined || amp.imag !== undefined) {
          return new Complex(amp.real || 0, amp.imag || 0);
        } else {
          return new Complex(amp, 0);
        }
      });

      state.normalize();
    } else {
      // Create equal superposition
      const amplitude = new Complex(1 / Math.sqrt(state.numStates), 0);
      state.amplitudes = state.amplitudes.map(() => amplitude);
    }

    return state;
  }

  /**
   * Implement Grover's Algorithm
   * تنفيذ خوارزمية جروفر
   */
  groversAlgorithm(numQubits, targetState) {
    if (targetState >= Math.pow(2, numQubits)) {
      throw new Error('Target state is out of range');
    }

    const state = this.createQuantumState(numQubits);
    const steps = [];

    // Step 1: Create superposition
    for (let i = 0; i < numQubits; i++) {
      this.applyGate(state, 'H', i);
    }
    steps.push({ step: 'superposition', state: state.clone() });

    // Calculate optimal number of iterations
    const N = Math.pow(2, numQubits);
    const optimalIterations = Math.floor((Math.PI / 4) * Math.sqrt(N));

    // Grover iterations
    for (let iter = 0; iter < optimalIterations; iter++) {
      // Oracle: flip the phase of target state
      state.amplitudes[targetState] = state.amplitudes[targetState].mul(-1);

      // Diffusion operator
      // Apply H to all qubits
      for (let i = 0; i < numQubits; i++) {
        this.applyGate(state, 'H', i);
      }

      // Flip phase of |0...0⟩ state
      state.amplitudes[0] = state.amplitudes[0].mul(-1);

      // Apply H to all qubits again
      for (let i = 0; i < numQubits; i++) {
        this.applyGate(state, 'H', i);
      }

      steps.push({ step: `iteration_${iter + 1}`, state: state.clone() });
    }

    const result = {
      algorithm: 'Grover',
      numQubits,
      targetState,
      iterations: optimalIterations,
      finalState: state,
      steps,
      successProbability: state.getProbability(targetState),
      timestamp: new Date().toISOString(),
    };

    this.simulationHistory.push(result);
    this.emit('algorithmCompleted', result);

    return result;
  }

  /**
   * Implement Quantum Fourier Transform
   * تنفيذ تحويل فورييه الكمي
   */
  quantumFourierTransform(state) {
    const n = state.numQubits;
    const steps = [];

    for (let i = 0; i < n; i++) {
      // Apply Hadamard gate
      this.applyGate(state, 'H', i);

      // Apply controlled phase gates
      for (let j = i + 1; j < n; j++) {
        const angle = Math.PI / Math.pow(2, j - i);
        this.applyControlledPhase(state, i, j, angle);
      }

      steps.push({ step: `qft_step_${i}`, state: state.clone() });
    }

    // Reverse the order of qubits
    this.reverseQubits(state);
    steps.push({ step: 'reverse_qubits', state: state.clone() });

    const result = {
      algorithm: 'QFT',
      numQubits: n,
      finalState: state,
      steps,
      timestamp: new Date().toISOString(),
    };

    this.simulationHistory.push(result);
    this.emit('algorithmCompleted', result);

    return result;
  }

  /**
   * Apply controlled phase gate
   * تطبيق بوابة الطور المتحكم بها
   */
  applyControlledPhase(state, controlQubit, targetQubit, angle) {
    const phaseMatrix = [
      [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
      [new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0)],
      [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0)],
      [
        new Complex(0, 0),
        new Complex(0, 0),
        new Complex(0, 0),
        new Complex(Math.cos(angle), Math.sin(angle)),
      ],
    ];

    const gate = new QuantumGate('CPhase', phaseMatrix, 2);
    gate.apply(state, [controlQubit, targetQubit]);
  }

  /**
   * Reverse qubit order
   * عكس ترتيب الكيوبتات
   */
  reverseQubits(state) {
    const n = state.numQubits;
    const newAmplitudes = new Array(state.numStates).fill(null).map(() => new Complex(0, 0));

    for (let i = 0; i < state.numStates; i++) {
      let reversedIndex = 0;
      for (let j = 0; j < n; j++) {
        const bit = (i >> j) & 1;
        reversedIndex |= bit << (n - 1 - j);
      }
      newAmplitudes[reversedIndex] = state.amplitudes[i];
    }

    state.amplitudes = newAmplitudes;
  }

  /**
   * Calculate quantum entanglement entropy
   * حساب إنتروبيا التشابك الكمي
   */
  calculateEntanglementEntropy(state, subsystemQubits) {
    if (!Array.isArray(subsystemQubits)) {
      subsystemQubits = [subsystemQubits];
    }

    const subsystemSize = subsystemQubits.length;
    const subsystemStates = Math.pow(2, subsystemSize);

    // Calculate reduced density matrix
    const reducedDensityMatrix = new Array(subsystemStates)
      .fill(null)
      .map(() => new Array(subsystemStates).fill(null).map(() => new Complex(0, 0)));

    for (let i = 0; i < state.numStates; i++) {
      for (let j = 0; j < state.numStates; j++) {
        const iSubsystem = this.extractTargetBits(i, subsystemQubits, state.numQubits);
        const jSubsystem = this.extractTargetBits(j, subsystemQubits, state.numQubits);

        if (this.environmentStatesMatch(i, j, subsystemQubits, state.numQubits)) {
          reducedDensityMatrix[iSubsystem][jSubsystem] = reducedDensityMatrix[iSubsystem][
            jSubsystem
          ].add(state.amplitudes[i].mul(state.amplitudes[j].conjugate()));
        }
      }
    }

    // Calculate eigenvalues and entropy
    const eigenvalues = this.calculateEigenvalues(reducedDensityMatrix);
    let entropy = 0;

    for (const eigenvalue of eigenvalues) {
      if (eigenvalue > 1e-10) {
        entropy -= eigenvalue * Math.log2(eigenvalue);
      }
    }

    return entropy;
  }

  /**
   * Check if environment states match
   * فحص تطابق حالات البيئة
   */
  environmentStatesMatch(state1, state2, subsystemQubits, totalQubits) {
    const environmentQubits = [];
    for (let i = 0; i < totalQubits; i++) {
      if (!subsystemQubits.includes(i)) {
        environmentQubits.push(i);
      }
    }

    const env1 = this.extractTargetBits(state1, environmentQubits, totalQubits);
    const env2 = this.extractTargetBits(state2, environmentQubits, totalQubits);

    return env1 === env2;
  }

  /**
   * Calculate eigenvalues (simplified for 2x2 matrices)
   * حساب القيم الذاتية (مبسط للمصفوفات 2x2)
   */
  calculateEigenvalues(matrix) {
    if (matrix.length === 2 && matrix[0].length === 2) {
      const a = matrix[0][0].re;
      const b = matrix[0][1].re;
      const c = matrix[1][0].re;
      const d = matrix[1][1].re;

      const trace = a + d;
      const det = a * d - b * c;
      const discriminant = trace * trace - 4 * det;

      if (discriminant >= 0) {
        const sqrt_disc = Math.sqrt(discriminant);
        return [(trace + sqrt_disc) / 2, (trace - sqrt_disc) / 2];
      }
    }

    // For larger matrices, return diagonal elements as approximation
    return matrix.map((row, i) => Math.max(0, row[i].re));
  }

  /**
   * Get simulation statistics
   * الحصول على إحصائيات المحاكاة
   */
  getSimulationStats() {
    return {
      totalSimulations: this.simulationHistory.length,
      algorithms: {
        grover: this.simulationHistory.filter(s => s.algorithm === 'Grover').length,
        qft: this.simulationHistory.filter(s => s.algorithm === 'QFT').length,
      },
      averageQubits:
        this.simulationHistory.length > 0
          ? this.simulationHistory.reduce((sum, s) => sum + s.numQubits, 0) /
            this.simulationHistory.length
          : 0,
      recentSimulations: this.simulationHistory.slice(-10),
    };
  }

  /**
   * Clear simulation history
   * مسح تاريخ المحاكاة
   */
  clearHistory() {
    this.simulationHistory = [];
    this.emit('historyCleared');
  }

  /**
   * Export quantum state
   * تصدير الحالة الكمية
   */
  exportState(state) {
    return {
      numQubits: state.numQubits,
      amplitudes: state.getStateVector(),
      probabilities: state.getAllProbabilities(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Import quantum state
   * استيراد الحالة الكمية
   */
  importState(stateData) {
    const state = this.createQuantumState(stateData.numQubits);
    state.setStateVector(stateData.amplitudes);
    return state;
  }

  /**
   * Save user quantum state (mock implementation - requires database)
   * حفظ الحالة الكمية للمستخدم (تنفيذ وهمي - يتطلب قاعدة بيانات)
   */
  async saveUserState(userId, stateData) {
    // In a real implementation, this would save to database
    // في التنفيذ الحقيقي، سيتم الحفظ في قاعدة البيانات
    const stateId = `state_${userId}_${Date.now()}`;
    console.log(`Saving quantum state ${stateId} for user ${userId}`);
    return stateId;
  }

  /**
   * Get user quantum state (mock implementation)
   * الحصول على الحالة الكمية للمستخدم (تنفيذ وهمي)
   */
  async getUserState(userId, stateId) {
    // Mock implementation - would retrieve from database
    // تنفيذ وهمي - سيتم الاسترجاع من قاعدة البيانات
    console.log(`Retrieving quantum state ${stateId} for user ${userId}`);
    return {
      id: stateId,
      userId,
      name: 'Mock Quantum State',
      numQubits: 3,
      state: {
        amplitudes: [
          { real: 1 / Math.sqrt(2), imag: 0 },
          { real: 0, imag: 0 },
          { real: 0, imag: 0 },
          { real: 0, imag: 0 },
          { real: 1 / Math.sqrt(2), imag: 0 },
          { real: 0, imag: 0 },
          { real: 0, imag: 0 },
          { real: 0, imag: 0 },
        ],
      },
      createdAt: new Date(),
      lastModified: new Date(),
    };
  }

  /**
   * Get all user quantum states (mock implementation)
   * الحصول على جميع الحالات الكمية للمستخدم (تنفيذ وهمي)
   */
  async getUserStates(userId, options = {}) {
    const { page = 1, limit = 10 } = options;
    // Mock implementation
    console.log(`Retrieving quantum states for user ${userId}`);
    return {
      data: [
        {
          id: `state_${userId}_1`,
          name: 'Bell State',
          numQubits: 2,
          createdAt: new Date(),
        },
        {
          id: `state_${userId}_2`,
          name: 'GHZ State',
          numQubits: 3,
          createdAt: new Date(),
        },
      ],
      page,
      totalPages: 1,
      total: 2,
      hasNext: false,
      hasPrev: false,
    };
  }

  /**
   * Update user quantum state (mock implementation)
   * تحديث الحالة الكمية للمستخدم (تنفيذ وهمي)
   */
  async updateUserState(userId, stateId, updates) {
    console.log(`Updating quantum state ${stateId} for user ${userId}`);
    return true;
  }

  /**
   * Delete user quantum state (mock implementation)
   * حذف الحالة الكمية للمستخدم (تنفيذ وهمي)
   */
  async deleteUserState(userId, stateId) {
    console.log(`Deleting quantum state ${stateId} for user ${userId}`);
    return true;
  }

  /**
   * Run Grover's Algorithm wrapper
   * مُحوّل لتشغيل خوارزمية جروفر
   */
  async runGroverAlgorithm(numQubits, targetState) {
    return this.groversAlgorithm(numQubits, targetState);
  }

  /**
   * Run Quantum Fourier Transform wrapper
   * مُحوّل لتشغيل تحويل فورييه الكمي
   */
  async runQuantumFourierTransform(numQubits) {
    const state = this.createQuantumState(numQubits);
    return this.quantumFourierTransform(state);
  }

  /**
   * Run Shor's Algorithm (mock implementation)
   * تشغيل خوارزمية شور (تنفيذ وهمي)
   */
  async runShorAlgorithm(numberToFactor) {
    console.log(`Running Shor's algorithm to factor ${numberToFactor}`);
    // Simplified mock implementation
    const factors = [];
    for (let i = 2; i < numberToFactor; i++) {
      if (numberToFactor % i === 0) {
        factors.push(i);
        factors.push(numberToFactor / i);
        break;
      }
    }

    return {
      algorithm: 'Shor',
      input: numberToFactor,
      factors: factors.length > 0 ? factors : [1, numberToFactor],
      success: factors.length > 0,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Run Variational Quantum Eigensolver (mock implementation)
   * تشغيل محلل القيم الذاتية الكمي المتغير (تنفيذ وهمي)
   */
  async runVQE(numQubits, hamiltonian) {
    console.log(`Running VQE with ${numQubits} qubits`);

    return {
      algorithm: 'VQE',
      numQubits,
      groundStateEnergy: -1.5 * Math.random(),
      iterations: Math.floor(Math.random() * 100) + 50,
      convergence: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Save algorithm result (mock implementation)
   * حفظ نتيجة الخوارزمية (تنفيذ وهمي)
   */
  async saveAlgorithmResult(userId, resultData) {
    const resultId = `result_${userId}_${Date.now()}`;
    console.log(`Saving algorithm result ${resultId} for user ${userId}`);
    return resultId;
  }

  /**
   * Get available quantum algorithms
   * الحصول على الخوارزميات الكمية المتاحة
   */
  getAvailableAlgorithms() {
    return [
      {
        name: 'Grover Search',
        key: 'grover',
        description: 'Quantum search algorithm for unstructured databases',
        descriptionAr: 'خوارزمية البحث الكمي للقواعد البيانات غير المنظمة',
        complexity: 'O(√N)',
        minQubits: 2,
        maxQubits: 8,
        requiresSubscription: 'basic',
      },
      {
        name: 'Quantum Fourier Transform',
        key: 'qft',
        description: 'Quantum version of discrete Fourier transform',
        descriptionAr: 'النسخة الكمية من تحويل فورييه المتقطع',
        complexity: 'O(n²)',
        minQubits: 2,
        maxQubits: 10,
        requiresSubscription: 'basic',
      },
      {
        name: "Shor's Factorization",
        key: 'shor',
        description: 'Quantum algorithm for integer factorization',
        descriptionAr: 'خوارزمية كمية لتحليل الأعداد الصحيحة',
        complexity: 'O((log n)³)',
        minQubits: 4,
        maxQubits: 12,
        requiresSubscription: 'premium',
      },
      {
        name: 'Variational Quantum Eigensolver',
        key: 'vqe',
        description: 'Hybrid quantum-classical algorithm for finding ground states',
        descriptionAr: 'خوارزمية هجينة كمية-تقليدية لإيجاد الحالات الأساسية',
        complexity: 'O(poly(n))',
        minQubits: 2,
        maxQubits: 8,
        requiresSubscription: 'premium',
      },
    ];
  }

  /**
   * Get health status of quantum service
   * الحصول على حالة صحة الخدمة الكمية
   */
  async getHealthStatus() {
    return {
      status: 'healthy',
      services: {
        quantumSimulator: 'operational',
        gates: this.gates.size,
        circuits: this.circuits.size,
      },
      metrics: {
        totalSimulations: this.simulationHistory.length,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      },
    };
  }

  /**
   * Create quantum gate wrapper
   * مُحوّل لإنشاء البوابة الكمية
   */
  createGate(gateType) {
    const gate = this.gates.get(gateType.toUpperCase());
    if (!gate) {
      throw new Error(`Unknown gate type: ${gateType}`);
    }
    return gate;
  }

  /**
   * Create rotation gate
   * إنشاء بوابة دوران
   */
  createRotationGate(gateType, angle) {
    switch (gateType) {
      case 'RX':
        return new QuantumGate('RX', [
          [new Complex(Math.cos(angle / 2), 0), new Complex(0, -Math.sin(angle / 2))],
          [new Complex(0, -Math.sin(angle / 2)), new Complex(Math.cos(angle / 2), 0)],
        ]);
      case 'RY':
        return new QuantumGate('RY', [
          [new Complex(Math.cos(angle / 2), 0), new Complex(-Math.sin(angle / 2), 0)],
          [new Complex(Math.sin(angle / 2), 0), new Complex(Math.cos(angle / 2), 0)],
        ]);
      case 'RZ':
        return new QuantumGate('RZ', [
          [new Complex(Math.cos(angle / 2), -Math.sin(angle / 2)), new Complex(0, 0)],
          [new Complex(0, 0), new Complex(Math.cos(angle / 2), Math.sin(angle / 2))],
        ]);
      default:
        throw new Error(`Unknown rotation gate: ${gateType}`);
    }
  }

  /**
   * Create custom gate
   * إنشاء بوابة مخصصة
   */
  createCustomGate(matrix) {
    if (!Array.isArray(matrix) || matrix.length === 0) {
      throw new Error('Invalid matrix for custom gate');
    }

    const complexMatrix = matrix.map(row =>
      row.map(element => {
        if (typeof element === 'number') {
          return new Complex(element, 0);
        } else if (element.real !== undefined || element.imag !== undefined) {
          return new Complex(element.real || 0, element.imag || 0);
        }
        return new Complex(0, 0);
      })
    );

    return new QuantumGate('CUSTOM', complexMatrix);
  }
}

export { QuantumService, QuantumState, QuantumGate };
