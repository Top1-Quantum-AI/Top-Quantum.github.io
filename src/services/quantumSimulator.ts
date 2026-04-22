/**
 * Quantum Circuit Simulator
 * Real quantum gate simulation using state vectors and matrix math.
 * Supports single-qubit (H, X, Y, Z, T, S, Rx, Ry, Rz) and multi-qubit gates (CNOT, SWAP, Toffoli).
 */

// ─── Complex Numbers ────────────────────────────────────────────

interface Complex {
  re: number;
  im: number;
}

const cxMul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

const cxAdd = (a: Complex, b: Complex): Complex => ({
  re: a.re + b.re,
  im: a.im + b.im,
});

const cxMag2 = (a: Complex): number => a.re * a.re + a.im * a.im;

const cxScale = (a: Complex, s: number): Complex => ({ re: a.re * s, im: a.im * s });

// ─── Gate Matrices (2x2) ────────────────────────────────────────

type Gate2x2 = [[Complex, Complex], [Complex, Complex]];

// Gate identity matrix not used directly but kept for reference
// const I2: Gate2x2 = [[{re:1,im:0},{re:0,im:0}],[{re:0,im:0},{re:1,im:0}]];

const H: Gate2x2 = (() => {
  const s = 1 / Math.sqrt(2);
  return [
    [
      { re: s, im: 0 },
      { re: s, im: 0 },
    ],
    [
      { re: s, im: 0 },
      { re: -s, im: 0 },
    ],
  ];
})();

const X: Gate2x2 = [
  [
    { re: 0, im: 0 },
    { re: 1, im: 0 },
  ],
  [
    { re: 1, im: 0 },
    { re: 0, im: 0 },
  ],
];

const Y: Gate2x2 = [
  [
    { re: 0, im: 0 },
    { re: 0, im: 1 },
  ],
  [
    { re: 0, im: -1 },
    { re: 0, im: 0 },
  ],
];

const Z: Gate2x2 = [
  [
    { re: 1, im: 0 },
    { re: 0, im: 0 },
  ],
  [
    { re: 0, im: 0 },
    { re: -1, im: 0 },
  ],
];

const T: Gate2x2 = [
  [
    { re: 1, im: 0 },
    { re: 0, im: 0 },
  ],
  [
    { re: 0, im: 0 },
    { re: Math.cos(Math.PI / 4), im: Math.sin(Math.PI / 4) },
  ],
];

const S: Gate2x2 = [
  [
    { re: 1, im: 0 },
    { re: 0, im: 0 },
  ],
  [
    { re: 0, im: 0 },
    { re: 0, im: 1 },
  ],
];

const Rx = (theta: number): Gate2x2 => {
  const c = Math.cos(theta / 2);
  const s = Math.sin(theta / 2);
  return [
    [
      { re: c, im: 0 },
      { re: 0, im: -s },
    ],
    [
      { re: 0, im: -s },
      { re: c, im: 0 },
    ],
  ];
};

const Ry = (theta: number): Gate2x2 => {
  const c = Math.cos(theta / 2);
  const s = Math.sin(theta / 2);
  return [
    [
      { re: c, im: 0 },
      { re: -s, im: 0 },
    ],
    [
      { re: s, im: 0 },
      { re: c, im: 0 },
    ],
  ];
};

const Rz = (theta: number): Gate2x2 => [
  [
    { re: Math.cos(theta / 2), im: -Math.sin(theta / 2) },
    { re: 0, im: 0 },
  ],
  [
    { re: 0, im: 0 },
    { re: Math.cos(theta / 2), im: Math.sin(theta / 2) },
  ],
];

// ─── Gate Type ──────────────────────────────────────────────────

export type GateName =
  | 'H'
  | 'X'
  | 'Y'
  | 'Z'
  | 'T'
  | 'S'
  | 'Rx'
  | 'Ry'
  | 'Rz'
  | 'CNOT'
  | 'SWAP'
  | 'Toffoli'
  | 'Measure';

export interface GateOp {
  gate: GateName;
  targets: number[];
  controls?: number[];
  params?: number[];
}

// ─── State Vector Quantum Simulator ─────────────────────────────

export interface SimulationResult {
  numQubits: number;
  stateVector: Complex[];
  probabilities: number[];
  measurements: Record<string, number>;
  fidelity: number;
  circuitDepth: number;
  gateCount: number;
  executionTimeMs: number;
  blochSpheres: Array<{ qubit: number; theta: number; phi: number }>;
  entanglementMap: boolean[][];
}

const getGateMatrix = (name: GateName, params?: number[]): Gate2x2 | null => {
  switch (name) {
    case 'H':
      return H;
    case 'X':
      return X;
    case 'Y':
      return Y;
    case 'Z':
      return Z;
    case 'T':
      return T;
    case 'S':
      return S;
    case 'Rx':
      return Rx(params?.[0] ?? 0);
    case 'Ry':
      return Ry(params?.[0] ?? 0);
    case 'Rz':
      return Rz(params?.[0] ?? 0);
    default:
      return null;
  }
};

/** Apply a single-qubit gate to the state vector */
const applySingleQubitGate = (
  state: Complex[],
  _numQubits: number,
  target: number,
  gate: Gate2x2
): Complex[] => {
  const dim = state.length;
  const result: Complex[] = state.map(c => ({ ...c }));
  const step = 1 << target;

  for (let i = 0; i < dim; i++) {
    if ((i & step) !== 0) continue;
    const i0 = i;
    const i1 = i | step;
    const a = state[i0] as Complex;
    const b = state[i1] as Complex;
    result[i0] = cxAdd(cxMul(gate[0][0], a), cxMul(gate[0][1], b));
    result[i1] = cxAdd(cxMul(gate[1][0], a), cxMul(gate[1][1], b));
  }
  return result;
};

/** Apply CNOT gate */
const applyCNOT = (state: Complex[], control: number, target: number): Complex[] => {
  const dim = state.length;
  const result: Complex[] = state.map(c => ({ ...c }));
  const cBit = 1 << control;
  const tBit = 1 << target;

  for (let i = 0; i < dim; i++) {
    if ((i & cBit) !== 0 && (i & tBit) === 0) {
      const j = i | tBit;
      result[i] = state[j] as Complex;
      result[j] = state[i] as Complex;
    }
  }
  return result;
};

/** Apply SWAP gate */
const applySWAP = (state: Complex[], q1: number, q2: number): Complex[] => {
  const dim = state.length;
  const result: Complex[] = state.map(c => ({ ...c }));
  const b1 = 1 << q1;
  const b2 = 1 << q2;

  for (let i = 0; i < dim; i++) {
    const v1 = (i & b1) !== 0 ? 1 : 0;
    const v2 = (i & b2) !== 0 ? 1 : 0;
    if (v1 !== v2) {
      const j = i ^ b1 ^ b2;
      if (i < j) {
        result[i] = state[j] as Complex;
        result[j] = state[i] as Complex;
      }
    }
  }
  return result;
};

/** Apply Toffoli (CCX) gate */
const applyToffoli = (state: Complex[], c1: number, c2: number, target: number): Complex[] => {
  const dim = state.length;
  const result: Complex[] = state.map(c => ({ ...c }));
  const cb1 = 1 << c1;
  const cb2 = 1 << c2;
  const tBit = 1 << target;

  for (let i = 0; i < dim; i++) {
    if ((i & cb1) !== 0 && (i & cb2) !== 0 && (i & tBit) === 0) {
      const j = i | tBit;
      result[i] = state[j] as Complex;
      result[j] = state[i] as Complex;
    }
  }
  return result;
};

/** Measure all qubits, returns counts over numShots */
const measureAll = (
  state: Complex[],
  numQubits: number,
  numShots: number
): Record<string, number> => {
  const probs = state.map(c => cxMag2(c));
  const counts: Record<string, number> = {};

  for (let shot = 0; shot < numShots; shot++) {
    let r = Math.random();
    let outcome = 0;
    for (let i = 0; i < probs.length; i++) {
      r -= probs[i] as number;
      if (r <= 0) {
        outcome = i;
        break;
      }
    }
    const bits = outcome.toString(2).padStart(numQubits, '0');
    counts[bits] = (counts[bits] ?? 0) + 1;
  }
  return counts;
};

/** Compute reduced density matrix and Bloch sphere coordinates per qubit */
const computeBlochSpheres = (
  state: Complex[],
  numQubits: number
): Array<{ qubit: number; theta: number; phi: number }> => {
  const result: Array<{ qubit: number; theta: number; phi: number }> = [];

  for (let q = 0; q < numQubits; q++) {
    // Trace out everything except qubit q to get 2x2 reduced density matrix
    const rho: [[Complex, Complex], [Complex, Complex]] = [
      [
        { re: 0, im: 0 },
        { re: 0, im: 0 },
      ],
      [
        { re: 0, im: 0 },
        { re: 0, im: 0 },
      ],
    ];
    const bit = 1 << q;

    for (let i = 0; i < state.length; i++) {
      const rowBit = (i & bit) !== 0 ? 1 : 0;
      for (let j = 0; j < state.length; j++) {
        // Only combine states that differ only in qubit q
        if ((i ^ j) & ~bit) continue;
        const colBit = (j & bit) !== 0 ? 1 : 0;
        const si = state[i] as Complex;
        const sj = state[j] as Complex;
        const prod = cxMul(si, { re: sj.re, im: -sj.im });
        rho[rowBit][colBit] = cxAdd(rho[rowBit][colBit], prod);
      }
    }

    // Bloch vector from density matrix: x = 2*Re(rho01), y = 2*Im(rho01), z = rho00 - rho11
    const x = 2 * rho[0][1].re;
    const y = 2 * rho[0][1].im;
    const z = rho[0][0].re - rho[1][1].re;

    const r = Math.sqrt(x * x + y * y + z * z);
    const theta = r > 1e-10 ? Math.acos(Math.min(1, Math.max(-1, z / r))) : 0;
    const phi = Math.atan2(y, x);

    result.push({ qubit: q, theta, phi });
  }
  return result;
};

/** Compute entanglement map - simplified concurrence estimation */
const computeEntanglementMap = (state: Complex[], numQubits: number): boolean[][] => {
  const map: boolean[][] = Array.from({ length: numQubits }, () =>
    Array.from({ length: numQubits }, () => false)
  );

  for (let q1 = 0; q1 < numQubits; q1++) {
    for (let q2 = q1 + 1; q2 < numQubits; q2++) {
      // Check if qubits are entangled by comparing product-state overlap
      const b1 = 1 << q1;
      const b2 = 1 << q2;
      let p00 = 0,
        p01 = 0,
        p10 = 0,
        p11 = 0;

      for (let i = 0; i < state.length; i++) {
        const v1 = (i & b1) !== 0 ? 1 : 0;
        const v2 = (i & b2) !== 0 ? 1 : 0;
        const prob = cxMag2(state[i] as Complex);
        if (v1 === 0 && v2 === 0) p00 += prob;
        else if (v1 === 0 && v2 === 1) p01 += prob;
        else if (v1 === 1 && v2 === 0) p10 += prob;
        else p11 += prob;
      }

      // If not a product state, qubits are entangled
      const productTest = Math.abs(p00 * p11 - p01 * p10);
      const row1 = map[q1];
      const row2 = map[q2];
      if (row1 && row2) {
        row1[q2] = productTest > 0.01;
        row2[q1] = productTest > 0.01;
      }
    }
  }
  return map;
};

// ─── Main Simulation Function ───────────────────────────────────

export const simulateCircuit = (
  numQubits: number,
  gates: GateOp[],
  numShots = 1024,
  noiseLevel = 0
): SimulationResult => {
  const start = performance.now();

  if (numQubits < 1 || numQubits > 20) {
    throw new Error('عدد الكيوبتات يجب أن يكون بين 1 و 20');
  }

  const dim = 1 << numQubits;
  let state: Complex[] = Array.from({ length: dim }, (_, i) =>
    i === 0 ? { re: 1, im: 0 } : { re: 0, im: 0 }
  );

  let gateCount = 0;
  let depth = 0;
  const depthTracker = new Array<number>(numQubits).fill(0);

  for (const op of gates) {
    if (op.gate === 'Measure') continue;

    gateCount++;
    const allQubits = [...(op.controls ?? []), ...op.targets];
    const maxDepth = Math.max(...allQubits.map(q => depthTracker[q] ?? 0));

    for (const q of allQubits) {
      depthTracker[q] = maxDepth + 1;
    }
    depth = Math.max(depth, maxDepth + 1);

    if (op.gate === 'CNOT' && op.controls?.length === 1 && op.targets.length === 1) {
      state = applyCNOT(state, op.controls[0] as number, op.targets[0] as number);
    } else if (op.gate === 'SWAP' && op.targets.length === 2) {
      state = applySWAP(state, op.targets[0] as number, op.targets[1] as number);
    } else if (op.gate === 'Toffoli' && op.controls?.length === 2 && op.targets.length === 1) {
      state = applyToffoli(
        state,
        op.controls[0] as number,
        op.controls[1] as number,
        op.targets[0] as number
      );
    } else {
      const mat = getGateMatrix(op.gate, op.params);
      if (mat) {
        for (const t of op.targets) {
          state = applySingleQubitGate(state, numQubits, t, mat);
        }
      }
    }

    // Apply depolarizing noise
    if (noiseLevel > 0) {
      state = state.map(c => {
        const noise = (Math.random() - 0.5) * noiseLevel * 0.01;
        return { re: c.re + noise, im: c.im + noise };
      });
      // Re-normalize
      const norm = Math.sqrt(state.reduce((sum, c) => sum + cxMag2(c), 0));
      if (norm > 0) {
        state = state.map(c => cxScale(c, 1 / norm));
      }
    }
  }

  const probabilities = state.map(c => cxMag2(c));
  const measurements = measureAll(state, numQubits, numShots);
  const blochSpheres = computeBlochSpheres(state, numQubits);
  const entanglementMap = computeEntanglementMap(state, numQubits);

  // Fidelity: compare with ideal (no noise) - approximate by state purity
  const purity = probabilities.reduce((sum, p) => sum + p * p, 0);
  const fidelity = Math.min(1, Math.sqrt(purity) * 100);

  const executionTimeMs = performance.now() - start;

  return {
    numQubits,
    stateVector: state,
    probabilities,
    measurements,
    fidelity,
    circuitDepth: depth,
    gateCount,
    executionTimeMs,
    blochSpheres,
    entanglementMap,
  };
};

// ─── Pre-built Quantum Algorithms ───────────────────────────────

export const algorithms = {
  /** Bell State: Creates maximally entangled pair */
  bellState: (): { qubits: number; gates: GateOp[]; name: string; description: string } => ({
    name: 'حالة بيل',
    description: 'إنشاء زوج كيوبتات متشابكة كمياً (EPR pair)',
    qubits: 2,
    gates: [
      { gate: 'H', targets: [0] },
      { gate: 'CNOT', targets: [1], controls: [0] },
    ],
  }),

  /** GHZ State: N-qubit entanglement */
  ghzState: (n = 3): { qubits: number; gates: GateOp[]; name: string; description: string } => ({
    name: `حالة GHZ (${n} كيوبت)`,
    description: `تشابك كمي لـ ${n} كيوبتات في حالة GHZ`,
    qubits: n,
    gates: [
      { gate: 'H', targets: [0] },
      ...Array.from({ length: n - 1 }, (_, i) => ({
        gate: 'CNOT' as GateName,
        targets: [i + 1],
        controls: [i],
      })),
    ],
  }),

  /** Quantum Fourier Transform */
  qft: (n = 3): { qubits: number; gates: GateOp[]; name: string; description: string } => {
    const gates: GateOp[] = [];
    for (let i = 0; i < n; i++) {
      gates.push({ gate: 'H', targets: [i] });
      for (let j = i + 1; j < n; j++) {
        gates.push({
          gate: 'Rz',
          targets: [j],
          controls: [i],
          params: [Math.PI / (1 << (j - i))],
        });
      }
    }
    // Swap qubits
    for (let i = 0; i < Math.floor(n / 2); i++) {
      gates.push({ gate: 'SWAP', targets: [i, n - 1 - i] });
    }
    return {
      name: 'تحويل فورييه الكمي',
      description: `QFT على ${n} كيوبتات - أساس خوارزمية شور`,
      qubits: n,
      gates,
    };
  },

  /** Grover's Search (2 qubits, searching for |11⟩) */
  groverSearch: (): { qubits: number; gates: GateOp[]; name: string; description: string } => ({
    name: 'بحث جروفر',
    description: 'خوارزمية بحث كمية - البحث عن |11⟩ في 2 كيوبت',
    qubits: 2,
    gates: [
      // Initialize superposition
      { gate: 'H', targets: [0] },
      { gate: 'H', targets: [1] },
      // Oracle: mark |11⟩
      { gate: 'Z', targets: [0] },
      { gate: 'CNOT', targets: [1], controls: [0] },
      { gate: 'Z', targets: [1] },
      { gate: 'CNOT', targets: [1], controls: [0] },
      // Diffusion
      { gate: 'H', targets: [0] },
      { gate: 'H', targets: [1] },
      { gate: 'X', targets: [0] },
      { gate: 'X', targets: [1] },
      { gate: 'Z', targets: [0] },
      { gate: 'CNOT', targets: [1], controls: [0] },
      { gate: 'Z', targets: [1] },
      { gate: 'CNOT', targets: [1], controls: [0] },
      { gate: 'X', targets: [0] },
      { gate: 'X', targets: [1] },
      { gate: 'H', targets: [0] },
      { gate: 'H', targets: [1] },
    ],
  }),

  /** Quantum Teleportation */
  teleportation: (): { qubits: number; gates: GateOp[]; name: string; description: string } => ({
    name: 'النقل الآني الكمي',
    description: 'نقل حالة كمية من كيوبت لآخر باستخدام التشابك',
    qubits: 3,
    gates: [
      // Prepare state to teleport (arbitrary state on q0)
      { gate: 'Rx', targets: [0], params: [Math.PI / 3] },
      // Create Bell pair between q1 and q2
      { gate: 'H', targets: [1] },
      { gate: 'CNOT', targets: [2], controls: [1] },
      // Alice's operations
      { gate: 'CNOT', targets: [1], controls: [0] },
      { gate: 'H', targets: [0] },
      // Bob's corrections (classically controlled, simulated here)
      { gate: 'CNOT', targets: [2], controls: [1] },
      { gate: 'Z', targets: [2] },
    ],
  }),

  /** Deutsch-Jozsa Algorithm */
  deutschJozsa: (): { qubits: number; gates: GateOp[]; name: string; description: string } => ({
    name: 'خوارزمية دويتش-جوزا',
    description: 'تحديد ما إذا كانت الدالة ثابتة أم متوازنة',
    qubits: 3,
    gates: [
      // Initialize ancilla in |1⟩
      { gate: 'X', targets: [2] },
      // Apply Hadamard to all
      { gate: 'H', targets: [0] },
      { gate: 'H', targets: [1] },
      { gate: 'H', targets: [2] },
      // Oracle (balanced function)
      { gate: 'CNOT', targets: [2], controls: [0] },
      { gate: 'CNOT', targets: [2], controls: [1] },
      // Final Hadamard
      { gate: 'H', targets: [0] },
      { gate: 'H', targets: [1] },
    ],
  }),

  /** Quantum Random Number Generator */
  qrng: (bits = 4): { qubits: number; gates: GateOp[]; name: string; description: string } => ({
    name: `مولد أرقام عشوائية كمي (${bits} بت)`,
    description: 'توليد أرقام عشوائية حقيقية باستخدام التراكب الكمي',
    qubits: bits,
    gates: Array.from({ length: bits }, (_, i) => ({
      gate: 'H' as GateName,
      targets: [i],
    })),
  }),

  /** Quantum Phase Estimation (simplified) */
  phaseEstimation: (): { qubits: number; gates: GateOp[]; name: string; description: string } => ({
    name: 'تقدير الطور الكمي',
    description: 'تقدير القيمة الذاتية لعملية كمية - أساس العديد من الخوارزميات',
    qubits: 4,
    gates: [
      // Counting register in superposition
      { gate: 'H', targets: [0] },
      { gate: 'H', targets: [1] },
      { gate: 'H', targets: [2] },
      // Target qubit in eigenstate
      { gate: 'X', targets: [3] },
      // Controlled rotations
      { gate: 'Rz', targets: [3], controls: [0], params: [Math.PI] },
      { gate: 'Rz', targets: [3], controls: [1], params: [Math.PI / 2] },
      { gate: 'Rz', targets: [3], controls: [2], params: [Math.PI / 4] },
      // Inverse QFT on counting register
      { gate: 'SWAP', targets: [0, 2] },
      { gate: 'H', targets: [0] },
      { gate: 'Rz', targets: [1], params: [-Math.PI / 2] },
      { gate: 'H', targets: [1] },
      { gate: 'Rz', targets: [2], params: [-Math.PI / 4] },
      { gate: 'Rz', targets: [2], params: [-Math.PI / 2] },
      { gate: 'H', targets: [2] },
    ],
  }),
};

export type AlgorithmName = keyof typeof algorithms;
