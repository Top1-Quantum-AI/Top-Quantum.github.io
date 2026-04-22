import { type LucideIcon } from 'lucide-react';

export interface ProcessingStates {
  isEncrypting: boolean;
  isDecrypting: boolean;
  isRunningQuantum: boolean;
  isSearching: boolean;
  isLearning: boolean;
  isProcessingAI: boolean;
  isAnalyzing: boolean;
}

export interface SecureLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  module: string;
  timestamp: number;
  userId?: string;
}

export interface UnifiedQuantumState {
  superposition: number;
  entanglement: number;
  coherence: number;
  decoherence: number;
  fidelity: number;
  purity: number;
  aiAgents: number;
  neuralNetworks: number;
  learningRate: number;
  accuracy: number;
  processingPower: number;
  securityLevel: number;
  encryptionStrength: number;
  quantumResistance: number;
  dataProcessed: number;
  insightsGenerated: number;
  predictiveAccuracy: number;
  errorsDetected: number;
  errorsResolved: number;
  systemStability: number;
  activeAgents: number;
  agentEfficiency: number;
  collaborationIndex: number;
  diagnosticAccuracy: number;
  systemHealth: number;
  performanceIndex: number;
}

export interface QuantumModule {
  id: string;
  name: string;
  nameAr: string;
  icon: LucideIcon;
  status: 'active' | 'inactive' | 'processing' | 'error';
  efficiency: number;
  quantumAdvantage: number;
  description: string;
  descriptionAr: string;
  researchTopic?: string;
}

export interface SystemMetrics {
  totalOperations: number;
  quantumSpeedup: number;
  energyEfficiency: number;
  scientificBreakthroughs: number;
  revolutionaryIndex: number;
  cosmicResonance: number;
}

export interface SmartTheme {
  mode: 'light' | 'dark' | 'quantum' | 'neon';
  background: 'gradient' | 'particles' | 'neural' | 'cosmic';
  animationLevel: 'minimal' | 'moderate' | 'intense';
  colorScheme: 'blue' | 'purple' | 'cyan' | 'rainbow';
}

export interface CommandAction {
  id: string;
  label: string;
  labelAr: string;
  icon: LucideIcon;
  category: 'theme' | 'navigation' | 'quantum' | 'ai' | 'security';
  action: () => void;
  shortcut?: string;
}

export interface ExponentialMemory {
  agentData: Array<{
    timestamp: number;
    accuracy: number;
    loss: number;
    learningRate: number;
    memoryCapacity: number;
    quantumCoherence: number;
  }>;
  simulationHistory: Array<{
    type: string;
    startTime: number;
    endTime: number;
    finalAccuracy: number;
    epochs: number;
    parameters: Record<string, unknown>;
    realMetrics: {
      fidelity: number;
      gateError: number;
      readoutError: number;
      coherenceTime: number;
    };
  }>;
  quantumStates: Array<{
    timestamp: number;
    coherence: number;
    entanglement: number;
    superposition: number;
    decoherence: number;
    temperature: number;
  }>;
}
