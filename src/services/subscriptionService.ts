// ═══════════════════════════════════════════════════════════
// ─── SUBSCRIPTION & PLAN MANAGEMENT SERVICE ───────────────
// ═══════════════════════════════════════════════════════════

export type PlanId = 'free' | 'professional' | 'enterprise';

export interface PlanLimits {
  maxQubits: number;
  maxSimulationsPerMonth: number;
  maxAlgorithms: number;
  maxAiQueriesPerMonth: number;
  hasPostQuantumSecurity: boolean;
  hasPdfExport: boolean;
  hasApiAccess: boolean;
  hasCustomCircuits: boolean;
  hasAuditLogs: boolean;
  auditLogRetentionDays: number;
  hasSso: boolean;
  hasDedicatedSupport: boolean;
  hasWhiteLabel: boolean;
  hasCustomModels: boolean;
  slaUptime: number;
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  nameEn: string;
  priceMonthly: number;
  priceAnnual: number;
  color: string;
  icon: string;
  description: string;
  limits: PlanLimits;
}

export interface UserSubscription {
  planId: PlanId;
  startDate: string;
  endDate: string;
  billingCycle: 'monthly' | 'annual';
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  trialEndsAt: string | null;
  usage: PlanUsage;
}

export interface PlanUsage {
  simulationsThisMonth: number;
  aiQueriesThisMonth: number;
  lastResetDate: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  createdAt: string;
  subscription: UserSubscription;
}

// ─── Plan Definitions ────────────────────────────────────────
export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'المجاني',
    nameEn: 'Free',
    priceMonthly: 0,
    priceAnnual: 0,
    color: '#6b7280',
    icon: '⚡',
    description: 'مثالي للتجربة والتعلم',
    limits: {
      maxQubits: 5,
      maxSimulationsPerMonth: 100,
      maxAlgorithms: 3,
      maxAiQueriesPerMonth: 50,
      hasPostQuantumSecurity: false,
      hasPdfExport: false,
      hasApiAccess: false,
      hasCustomCircuits: false,
      hasAuditLogs: false,
      auditLogRetentionDays: 0,
      hasSso: false,
      hasDedicatedSupport: false,
      hasWhiteLabel: false,
      hasCustomModels: false,
      slaUptime: 99.0,
    },
  },
  professional: {
    id: 'professional',
    name: 'الاحترافي',
    nameEn: 'Professional',
    priceMonthly: 127,
    priceAnnual: 97,
    color: '#3b82f6',
    icon: '🚀',
    description: 'للمطورين والفرق الصغيرة',
    limits: {
      maxQubits: 20,
      maxSimulationsPerMonth: 10000,
      maxAlgorithms: 8,
      maxAiQueriesPerMonth: 5000,
      hasPostQuantumSecurity: true,
      hasPdfExport: true,
      hasApiAccess: true,
      hasCustomCircuits: true,
      hasAuditLogs: true,
      auditLogRetentionDays: 30,
      hasSso: false,
      hasDedicatedSupport: false,
      hasWhiteLabel: false,
      hasCustomModels: false,
      slaUptime: 99.9,
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'المؤسسات',
    nameEn: 'Enterprise',
    priceMonthly: 647,
    priceAnnual: 497,
    color: '#8b5cf6',
    icon: '🏢',
    description: 'للشركات الكبيرة والمؤسسات',
    limits: {
      maxQubits: 128,
      maxSimulationsPerMonth: Infinity,
      maxAlgorithms: Infinity,
      maxAiQueriesPerMonth: Infinity,
      hasPostQuantumSecurity: true,
      hasPdfExport: true,
      hasApiAccess: true,
      hasCustomCircuits: true,
      hasAuditLogs: true,
      auditLogRetentionDays: 365,
      hasSso: true,
      hasDedicatedSupport: true,
      hasWhiteLabel: true,
      hasCustomModels: true,
      slaUptime: 99.99,
    },
  },
};

// ─── Storage Keys ────────────────────────────────────────────
const STORAGE_KEY = 'quantum_user_profile';

// ─── Helper: generate ID ─────────────────────────────────────
function generateId(): string {
  const arr = new Uint8Array(12);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Get current user ────────────────────────────────────────
export function getCurrentUser(): UserProfile | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

// ─── Save user ───────────────────────────────────────────────
function saveUser(user: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

// ─── Create new user (register) ──────────────────────────────
export function createUser(
  name: string,
  email: string,
  company: string,
  planId: PlanId = 'free'
): UserProfile {
  const now = new Date();
  const endDate = new Date(now);
  endDate.setFullYear(endDate.getFullYear() + 1);

  const trialEnd = new Date(now);
  trialEnd.setDate(trialEnd.getDate() + 14);

  const user: UserProfile = {
    id: generateId(),
    name,
    email,
    company,
    createdAt: now.toISOString(),
    subscription: {
      planId,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      billingCycle: 'annual',
      status: planId === 'free' ? 'active' : 'trial',
      trialEndsAt: planId === 'free' ? null : trialEnd.toISOString(),
      usage: {
        simulationsThisMonth: 0,
        aiQueriesThisMonth: 0,
        lastResetDate: now.toISOString(),
      },
    },
  };

  saveUser(user);
  return user;
}

// ─── Login (simulate) ────────────────────────────────────────
export function loginUser(email: string): UserProfile | null {
  const user = getCurrentUser();
  if (user != null && user.email === email) {
    return user;
  }
  // In a real system this would call an API
  return null;
}

// ─── Logout ──────────────────────────────────────────────────
export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('quantum_onboarding_seen');
}

// ─── Upgrade / Change plan ───────────────────────────────────
export function changePlan(planId: PlanId, billingCycle: 'monthly' | 'annual'): UserProfile | null {
  const user = getCurrentUser();
  if (user == null) return null;

  const now = new Date();
  const endDate = new Date(now);
  if (billingCycle === 'annual') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  user.subscription.planId = planId;
  user.subscription.billingCycle = billingCycle;
  user.subscription.startDate = now.toISOString();
  user.subscription.endDate = endDate.toISOString();
  user.subscription.status = planId === 'free' ? 'active' : 'trial';
  user.subscription.trialEndsAt = planId === 'free'
    ? null
    : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  saveUser(user);
  return user;
}

// ─── Track usage ─────────────────────────────────────────────
export function trackSimulation(): boolean {
  const user = getCurrentUser();
  if (user == null) return false;

  const plan = PLANS[user.subscription.planId];
  if (plan == null) return false;

  // Reset monthly usage if needed
  const lastReset = new Date(user.subscription.usage.lastResetDate);
  const now = new Date();
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    user.subscription.usage.simulationsThisMonth = 0;
    user.subscription.usage.aiQueriesThisMonth = 0;
    user.subscription.usage.lastResetDate = now.toISOString();
  }

  if (user.subscription.usage.simulationsThisMonth >= plan.limits.maxSimulationsPerMonth) {
    return false; // limit reached
  }

  user.subscription.usage.simulationsThisMonth += 1;
  saveUser(user);
  return true;
}

export function trackAiQuery(): boolean {
  const user = getCurrentUser();
  if (user == null) return false;

  const plan = PLANS[user.subscription.planId];
  if (plan == null) return false;

  const lastReset = new Date(user.subscription.usage.lastResetDate);
  const now = new Date();
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    user.subscription.usage.simulationsThisMonth = 0;
    user.subscription.usage.aiQueriesThisMonth = 0;
    user.subscription.usage.lastResetDate = now.toISOString();
  }

  if (user.subscription.usage.aiQueriesThisMonth >= plan.limits.maxAiQueriesPerMonth) {
    return false;
  }

  user.subscription.usage.aiQueriesThisMonth += 1;
  saveUser(user);
  return true;
}

// ─── Get current plan limits ─────────────────────────────────
export function getCurrentLimits(): PlanLimits {
  const user = getCurrentUser();
  const planId = user?.subscription.planId ?? 'free';
  return PLANS[planId].limits;
}

// ─── Get usage percentage ────────────────────────────────────
export function getUsagePercentages(): { simulations: number; aiQueries: number } {
  const user = getCurrentUser();
  if (user == null) return { simulations: 0, aiQueries: 0 };

  const plan = PLANS[user.subscription.planId];
  if (plan == null) return { simulations: 0, aiQueries: 0 };

  const simPct = plan.limits.maxSimulationsPerMonth === Infinity
    ? 0
    : (user.subscription.usage.simulationsThisMonth / plan.limits.maxSimulationsPerMonth) * 100;

  const aiPct = plan.limits.maxAiQueriesPerMonth === Infinity
    ? 0
    : (user.subscription.usage.aiQueriesThisMonth / plan.limits.maxAiQueriesPerMonth) * 100;

  return { simulations: Math.min(simPct, 100), aiQueries: Math.min(aiPct, 100) };
}

// ─── Check if feature is available ───────────────────────────
export function hasFeature(feature: keyof PlanLimits): boolean {
  const limits = getCurrentLimits();
  const val = limits[feature];
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val > 0;
  return false;
}

// ─── Days remaining in trial ─────────────────────────────────
export function getTrialDaysRemaining(): number | null {
  const user = getCurrentUser();
  if (user?.subscription.trialEndsAt == null) return null;
  if (user.subscription.status !== 'trial') return null;

  const diff = new Date(user.subscription.trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
