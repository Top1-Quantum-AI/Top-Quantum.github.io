import { type LucideIcon } from 'lucide-react';

// واجهة حالات التحميل المنفصلة
export interface ProcessingStates {
  isEncrypting: boolean;
  isDecrypting: boolean;
  isRunningQuantum: boolean;
  isSearching: boolean;
  isLearning: boolean;
  isProcessingAI: boolean;
  isAnalyzing: boolean;
}

// واجهة السجلات الآمنة
export interface SecureLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  module: string;
  timestamp: number;
  userId?: string;
}

// واجهات النظام الموحد
export interface UnifiedQuantumState {
  // حالات الكم الأساسية
  superposition: number;
  entanglement: number;
  coherence: number;
  decoherence: number;
  fidelity: number;
  purity: number;

  // حالات الذكاء الاصطناعي
  aiAgents: number;
  neuralNetworks: number;
  learningRate: number;
  accuracy: number;
  processingPower: number;

  // حالات الأمان
  securityLevel: number;
  encryptionStrength: number;
  quantumResistance: number;

  // حالات التحليلات
  dataProcessed: number;
  insightsGenerated: number;
  predictiveAccuracy: number;

  // حالات معالجة الأخطاء
  errorsDetected: number;
  errorsResolved: number;
  systemStability: number;

  // حالات الوكلاء
  activeAgents: number;
  agentEfficiency: number;
  collaborationIndex: number;

  // حالات التشخيص
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

// واجهات التحكم الذكي في التصميم
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
