/**
 * Subscription Service Tests
 */
import {
  createUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  changePlan,
  trackSimulation,
  trackAiQuery,
  getCurrentLimits,
  getUsagePercentages,
  hasFeature,
  getTrialDaysRemaining,
  PLANS,
} from '../src/services/subscriptionService';

describe('subscriptionService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('createUser', () => {
    it('should create a user with free plan by default', () => {
      const user = createUser('أحمد', 'ahmed@test.com', 'شركة تست');
      expect(user.name).toBe('أحمد');
      expect(user.email).toBe('ahmed@test.com');
      expect(user.company).toBe('شركة تست');
      expect(user.subscription.planId).toBe('free');
      expect(user.subscription.status).toBe('active');
      expect(user.subscription.trialEndsAt).toBeNull();
      expect(user.id).toBeTruthy();
    });

    it('should create a user with professional plan and trial status', () => {
      const user = createUser('سارة', 'sara@test.com', 'شركة', 'professional');
      expect(user.subscription.planId).toBe('professional');
      expect(user.subscription.status).toBe('trial');
      expect(user.subscription.trialEndsAt).not.toBeNull();
    });

    it('should persist user to localStorage', () => {
      createUser('تست', 'test@test.com', 'شركة');
      const stored = getCurrentUser();
      expect(stored).not.toBeNull();
      expect(stored?.email).toBe('test@test.com');
    });

    it('should initialize usage counters at zero', () => {
      const user = createUser('تست', 'test@test.com', 'شركة');
      expect(user.subscription.usage.simulationsThisMonth).toBe(0);
      expect(user.subscription.usage.aiQueriesThisMonth).toBe(0);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user exists', () => {
      expect(getCurrentUser()).toBeNull();
    });

    it('should return user after creation', () => {
      createUser('تست', 'test@test.com', 'شركة');
      const user = getCurrentUser();
      expect(user?.name).toBe('تست');
    });

    it('should return null for corrupted localStorage data', () => {
      localStorage.setItem('quantum_user_profile', '{invalid json}');
      expect(getCurrentUser()).toBeNull();
    });
  });

  describe('loginUser', () => {
    it('should return user if email matches', () => {
      createUser('تست', 'test@test.com', 'شركة');
      const result = loginUser('test@test.com');
      expect(result).not.toBeNull();
      expect(result?.email).toBe('test@test.com');
    });

    it('should return null if email does not match', () => {
      createUser('تست', 'test@test.com', 'شركة');
      const result = loginUser('other@test.com');
      expect(result).toBeNull();
    });

    it('should return null if no user exists', () => {
      expect(loginUser('test@test.com')).toBeNull();
    });
  });

  describe('logoutUser', () => {
    it('should remove user from localStorage', () => {
      createUser('تست', 'test@test.com', 'شركة');
      expect(getCurrentUser()).not.toBeNull();
      logoutUser();
      expect(getCurrentUser()).toBeNull();
    });

    it('should also clear onboarding flag', () => {
      localStorage.setItem('quantum_onboarding_seen', 'true');
      logoutUser();
      expect(localStorage.getItem('quantum_onboarding_seen')).toBeNull();
    });
  });

  describe('changePlan', () => {
    it('should upgrade from free to professional', () => {
      createUser('تست', 'test@test.com', 'شركة');
      const updated = changePlan('professional', 'monthly');
      expect(updated).not.toBeNull();
      expect(updated?.subscription.planId).toBe('professional');
      expect(updated?.subscription.billingCycle).toBe('monthly');
      expect(updated?.subscription.status).toBe('trial');
    });

    it('should downgrade to free with active status', () => {
      createUser('تست', 'test@test.com', 'شركة', 'professional');
      const updated = changePlan('free', 'annual');
      expect(updated?.subscription.planId).toBe('free');
      expect(updated?.subscription.status).toBe('active');
      expect(updated?.subscription.trialEndsAt).toBeNull();
    });

    it('should return null if no user exists', () => {
      expect(changePlan('professional', 'monthly')).toBeNull();
    });
  });

  describe('trackSimulation', () => {
    it('should track simulation and increment counter', () => {
      createUser('تست', 'test@test.com', 'شركة');
      const result = trackSimulation();
      expect(result).toBe(true);
      const user = getCurrentUser();
      expect(user?.subscription.usage.simulationsThisMonth).toBe(1);
    });

    it('should return false when limit is reached', () => {
      createUser('تست', 'test@test.com', 'شركة'); // free plan
      const limit = PLANS.free.limits.maxSimulationsPerMonth;
      for (let i = 0; i < limit; i++) {
        trackSimulation();
      }
      expect(trackSimulation()).toBe(false);
    });

    it('should return false if no user exists', () => {
      expect(trackSimulation()).toBe(false);
    });
  });

  describe('trackAiQuery', () => {
    it('should track AI query and increment counter', () => {
      createUser('تست', 'test@test.com', 'شركة');
      expect(trackAiQuery()).toBe(true);
      const user = getCurrentUser();
      expect(user?.subscription.usage.aiQueriesThisMonth).toBe(1);
    });

    it('should return false if no user exists', () => {
      expect(trackAiQuery()).toBe(false);
    });
  });

  describe('getCurrentLimits', () => {
    it('should return free plan limits when no user', () => {
      const limits = getCurrentLimits();
      expect(limits.maxQubits).toBe(PLANS.free.limits.maxQubits);
    });

    it('should return correct plan limits for professional user', () => {
      createUser('تست', 'test@test.com', 'شركة', 'professional');
      const limits = getCurrentLimits();
      expect(limits.maxQubits).toBe(PLANS.professional.limits.maxQubits);
      expect(limits.hasPdfExport).toBe(true);
    });
  });

  describe('getUsagePercentages', () => {
    it('should return zero when no user', () => {
      const pct = getUsagePercentages();
      expect(pct.simulations).toBe(0);
      expect(pct.aiQueries).toBe(0);
    });

    it('should calculate correct percentages', () => {
      createUser('تست', 'test@test.com', 'شركة');
      trackSimulation();
      const pct = getUsagePercentages();
      expect(pct.simulations).toBeGreaterThan(0);
    });
  });

  describe('hasFeature', () => {
    it('should return false for API access on free plan', () => {
      createUser('تست', 'test@test.com', 'شركة');
      expect(hasFeature('hasApiAccess')).toBe(false);
    });

    it('should return true for API access on professional plan', () => {
      createUser('تست', 'test@test.com', 'شركة', 'professional');
      expect(hasFeature('hasApiAccess')).toBe(true);
    });

    it('should return true for PDF export on professional plan', () => {
      createUser('تست', 'test@test.com', 'شركة', 'professional');
      expect(hasFeature('hasPdfExport')).toBe(true);
    });

    it('should return false for PDF export on free plan', () => {
      createUser('تست', 'test@test.com', 'شركة');
      expect(hasFeature('hasPdfExport')).toBe(false);
    });
  });

  describe('getTrialDaysRemaining', () => {
    it('should return null for free plan', () => {
      createUser('تست', 'test@test.com', 'شركة');
      expect(getTrialDaysRemaining()).toBeNull();
    });

    it('should return a number for trial plan', () => {
      createUser('تست', 'test@test.com', 'شركة', 'professional');
      const days = getTrialDaysRemaining();
      expect(days).not.toBeNull();
      expect(typeof days).toBe('number');
      expect(days).toBeGreaterThanOrEqual(13); // 14-day trial, just created
    });
  });

  describe('PLANS', () => {
    it('should have three plans defined', () => {
      expect(Object.keys(PLANS)).toHaveLength(3);
      expect(PLANS.free).toBeDefined();
      expect(PLANS.professional).toBeDefined();
      expect(PLANS.enterprise).toBeDefined();
    });

    it('should have increasing prices', () => {
      expect(PLANS.free.priceMonthly).toBe(0);
      expect(PLANS.professional.priceMonthly).toBeGreaterThan(0);
      expect(PLANS.enterprise.priceMonthly).toBeGreaterThan(PLANS.professional.priceMonthly);
    });

    it('should have increasing qubit limits', () => {
      expect(PLANS.professional.limits.maxQubits).toBeGreaterThan(PLANS.free.limits.maxQubits);
    });
  });
});
