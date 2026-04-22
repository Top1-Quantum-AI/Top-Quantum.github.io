/**
 * apiClient Service Tests
 * Tests token management, ApiError class, and API endpoint functions.
 */
import {
  clearToken,
  isAuthenticated,
  ApiError,
  apiLogin,
  apiRegister,
  apiLogout,
  apiGetMe,
  apiGetProfile,
  apiUpdateProfile,
  adminGetStats,
  adminGetUsers,
  adminGetUser,
  adminUpdateUser,
  adminDeactivateUser,
  adminGetAuditLogs,
  checkBackendAvailable,
  type ApiUser,
  type AdminStats,
  type AuditLogEntry,
} from '../src/services/apiClient';

// ─── Helpers ──────────────────────────────────────────────────

interface FetchMock { fetch: jest.Mock }

function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }): void {
  (globalThis as unknown as FetchMock).fetch = jest.fn().mockResolvedValue(response as Response);
}

function mockFetchOk<T>(data: T, extra?: Partial<{ token: string }>): void {
  mockFetch({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ success: true, data, ...extra }),
  });
}

function mockFetchError(status: number, errorMsg: string): void {
  mockFetch({
    ok: false,
    status,
    json: () => Promise.resolve({ success: false, error: errorMsg }),
  });
}

const sampleUser: ApiUser = {
  id: 'user-1',
  username: 'testuser',
  email: 'test@example.com',
  profile: {
    firstName: 'Test',
    lastName: 'User',
    avatar: null,
    bio: '',
    language: 'ar',
    timezone: 'UTC',
  },
  role: 'user',
  isActive: true,
  isEmailVerified: true,
  subscription: {
    plan: 'free',
    status: 'active',
    startDate: '2024-01-01',
    endDate: null,
    autoRenew: false,
  },
  apiUsage: {
    dailyRequests: 0,
    dailyTokens: 0,
    limits: { dailyRequests: 100, dailyTokens: 10000 },
  },
  quantumPreferences: {},
  createdAt: '2024-01-01T00:00:00Z',
  lastLogin: null,
};

// ─── Token Management ──────────────────────────────────────

describe('apiClient – Token Management', () => {
  beforeEach(() => {
    localStorage.clear();
    clearToken();
    (globalThis as unknown as FetchMock).fetch = jest.fn();
  });

  describe('clearToken()', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('quantum_auth_token', 'test-token');
      clearToken();
      expect(localStorage.getItem('quantum_auth_token')).toBeNull();
    });

    it('should remove user profile from localStorage', () => {
      localStorage.setItem('quantum_user_profile', '{"id":"1"}');
      clearToken();
      expect(localStorage.getItem('quantum_user_profile')).toBeNull();
    });
  });

  describe('isAuthenticated()', () => {
    it('should return false when no token exists', () => {
      clearToken();
      expect(isAuthenticated()).toBe(false);
    });

    it('should return true when token is stored in localStorage', () => {
      localStorage.setItem('quantum_auth_token', 'valid-token');
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false after clearToken()', () => {
      localStorage.setItem('quantum_auth_token', 'token');
      clearToken();
      expect(isAuthenticated()).toBe(false);
    });
  });
});

// ─── ApiError Class ────────────────────────────────────────

describe('ApiError', () => {
  it('should be an instance of Error', () => {
    const err = new ApiError('test error', 404, { error: 'not found' });
    expect(err).toBeInstanceOf(Error);
  });

  it('should have correct name', () => {
    const err = new ApiError('msg', 500, {});
    expect(err.name).toBe('ApiError');
  });

  it('should store status code', () => {
    const err = new ApiError('msg', 401, {});
    expect(err.status).toBe(401);
  });

  it('should store body', () => {
    const body = { error: 'Unauthorized', detail: 'Token expired' };
    const err = new ApiError('msg', 401, body);
    expect(err.body).toEqual(body);
  });

  it('should have correct message', () => {
    const err = new ApiError('Custom error message', 403, {});
    expect(err.message).toBe('Custom error message');
  });
});

// ─── Auth Endpoints ────────────────────────────────────────

describe('apiClient – Auth', () => {
  beforeEach(() => {
    localStorage.clear();
    clearToken();
    (globalThis as unknown as FetchMock).fetch = jest.fn();
  });

  describe('apiLogin()', () => {
    it('should POST to /auth/login', async () => {
      mockFetchOk({ user: sampleUser }, { token: 'auth-token-123' });
      await apiLogin('test@example.com', 'password123');
      expect((globalThis as unknown as FetchMock).fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should return user and token on success', async () => {
      mockFetchOk({ user: sampleUser }, { token: 'token-abc' });
      const result = await apiLogin('test@example.com', 'password');
      expect(result.user).toEqual(sampleUser);
      expect(result.token).toBe('token-abc');
    });

    it('should store token in localStorage on success', async () => {
      mockFetchOk({ user: sampleUser }, { token: 'stored-token' });
      await apiLogin('test@example.com', 'password');
      expect(localStorage.getItem('quantum_auth_token')).toBe('stored-token');
    });

    it('should throw ApiError on failure', async () => {
      mockFetchError(401, 'بيانات الاعتماد غير صحيحة');
      await expect(apiLogin('bad@example.com', 'wrong')).rejects.toBeInstanceOf(ApiError);
    });

    it('should throw ApiError with correct status on 401', async () => {
      mockFetchError(401, 'Unauthorized');
      try {
        await apiLogin('x@x.com', 'y');
      } catch (e) {
        expect((e as ApiError).status).toBe(401);
      }
    });

    it('should clear token on 401', async () => {
      localStorage.setItem('quantum_auth_token', 'old-token');
      mockFetchError(401, 'Unauthorized');
      await expect(apiLogin('x@x.com', 'y')).rejects.toBeInstanceOf(ApiError);
      expect(localStorage.getItem('quantum_auth_token')).toBeNull();
    });
  });

  describe('apiRegister()', () => {
    it('should POST to /auth/register', async () => {
      mockFetchOk({ user: sampleUser }, { token: 'new-token' });
      await apiRegister({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      });
      expect((globalThis as unknown as FetchMock).fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should return user and token', async () => {
      mockFetchOk({ user: sampleUser }, { token: 'reg-token' });
      const result = await apiRegister({ username: 'u', email: 'e@e.com', password: 'p' });
      expect(result.user).toEqual(sampleUser);
      expect(result.token).toBe('reg-token');
    });

    it('should throw ApiError on 409 conflict', async () => {
      mockFetchError(409, 'Email already exists');
      await expect(
        apiRegister({ username: 'u', email: 'existing@e.com', password: 'p' })
      ).rejects.toBeInstanceOf(ApiError);
    });
  });

  describe('apiLogout()', () => {
    it('should POST to /auth/logout', async () => {
      mockFetchOk({});
      await apiLogout();
      expect((globalThis as unknown as FetchMock).fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should clear token even if request fails', async () => {
      localStorage.setItem('quantum_auth_token', 'some-token');
      (globalThis as unknown as FetchMock).fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      await expect(apiLogout()).rejects.toThrow('Network error');
      expect(localStorage.getItem('quantum_auth_token')).toBeNull();
    });
  });

  describe('apiGetMe()', () => {
    it('should GET /auth/me', async () => {
      mockFetchOk({ user: sampleUser });
      await apiGetMe();
      expect((globalThis as unknown as FetchMock).fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/me'),
        expect.any(Object)
      );
    });

    it('should return the current user', async () => {
      mockFetchOk({ user: sampleUser });
      const user = await apiGetMe();
      expect(user).toEqual(sampleUser);
    });
  });
});

// ─── User Profile ──────────────────────────────────────────

describe('apiClient – User Profile', () => {
  beforeEach(() => {
    localStorage.clear();
    clearToken();
    (globalThis as unknown as FetchMock).fetch = jest.fn();
  });

  describe('apiGetProfile()', () => {
    it('should GET /user/profile', async () => {
      mockFetchOk({ user: sampleUser });
      const user = await apiGetProfile();
      expect((globalThis as unknown as FetchMock).fetch).toHaveBeenCalledWith(
        expect.stringContaining('/user/profile'),
        expect.any(Object)
      );
      expect(user).toEqual(sampleUser);
    });
  });

  describe('apiUpdateProfile()', () => {
    it('should PUT /user/profile with data', async () => {
      const updatedUser = { ...sampleUser, profile: { ...sampleUser.profile, bio: 'New bio' } };
      mockFetchOk({ user: updatedUser });
      const result = await apiUpdateProfile({ bio: 'New bio' });
      expect((globalThis as unknown as FetchMock).fetch).toHaveBeenCalledWith(
        expect.stringContaining('/user/profile'),
        expect.objectContaining({ method: 'PUT' })
      );
      expect(result.profile.bio).toBe('New bio');
    });
  });
});

// ─── Admin Endpoints ───────────────────────────────────────

describe('apiClient – Admin', () => {
  beforeEach(() => {
    localStorage.clear();
    clearToken();
    (globalThis as unknown as FetchMock).fetch = jest.fn();
  });

  describe('adminGetStats()', () => {
    it('should GET /admin/stats', async () => {
      const stats: AdminStats = {
        users: { total: 100, active: 80, verified: 70, recentSignups: 5 },
        plans: { free: 60, professional: 30, enterprise: 10 },
        api: { totalRequests: 50000, totalTokens: 1000000 },
      };
      mockFetchOk(stats);
      const result = await adminGetStats();
      expect((globalThis as unknown as FetchMock).fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/stats'),
        expect.any(Object)
      );
      expect(result).toEqual(stats);
    });
  });

  describe('adminGetUsers()', () => {
    it('should GET /admin/users', async () => {
      mockFetchOk({ users: [sampleUser], pagination: { page: 1, limit: 10, total: 1, pages: 1 } });
      const result = await adminGetUsers();
      expect((globalThis as unknown as FetchMock).fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/users'),
        expect.any(Object)
      );
      expect(result.users).toHaveLength(1);
    });

    it('should append query params when provided', async () => {
      mockFetchOk({ users: [], pagination: { page: 2, limit: 5, total: 0, pages: 0 } });
      await adminGetUsers({ page: 2, limit: 5, search: 'test', role: 'admin', plan: 'pro' });
      const url = ((globalThis as unknown as FetchMock).fetch.mock.calls[0] as [string])[0];
      expect(url).toContain('page=2');
      expect(url).toContain('limit=5');
      expect(url).toContain('search=test');
    });

    it('should not append empty params', async () => {
      mockFetchOk({ users: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } });
      await adminGetUsers({});
      const url = ((globalThis as unknown as FetchMock).fetch.mock.calls[0] as [string])[0];
      expect(url).not.toContain('?');
    });
  });

  describe('adminGetUser()', () => {
    it('should GET /admin/users/:id', async () => {
      mockFetchOk({ user: sampleUser });
      await adminGetUser('user-1');
      expect((globalThis as unknown as FetchMock).fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/users/user-1'),
        expect.any(Object)
      );
    });

    it('should URL-encode user id', async () => {
      mockFetchOk({ user: sampleUser });
      await adminGetUser('user/special');
      const url = ((globalThis as unknown as FetchMock).fetch.mock.calls[0] as [string])[0];
      expect(url).toContain('user%2Fspecial');
    });
  });

  describe('adminUpdateUser()', () => {
    it('should PUT /admin/users/:id with data', async () => {
      const updatedUser = { ...sampleUser, role: 'admin' as const };
      mockFetchOk({ user: updatedUser });
      const result = await adminUpdateUser('user-1', { role: 'admin', isActive: true });
      expect((globalThis as unknown as FetchMock).fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/users/user-1'),
        expect.objectContaining({ method: 'PUT' })
      );
      expect(result.role).toBe('admin');
    });
  });

  describe('adminDeactivateUser()', () => {
    it('should DELETE /admin/users/:id', async () => {
      mockFetchOk({});
      await adminDeactivateUser('user-1');
      expect((globalThis as unknown as FetchMock).fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/users/user-1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('adminGetAuditLogs()', () => {
    it('should GET /admin/audit-logs', async () => {
      const logs: AuditLogEntry[] = [{
        userId: 'u1', username: 'user1', email: 'u@u.com',
        role: 'user', ip: '127.0.0.1', userAgent: 'test',
        timestamp: '2024-01-01T00:00:00Z', success: true,
      }];
      mockFetchOk({ logs });
      const result = await adminGetAuditLogs(10);
      expect((globalThis as unknown as FetchMock).fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/audit-logs?limit=10'),
        expect.any(Object)
      );
      expect(result).toEqual(logs);
    });

    it('should default to limit 50', async () => {
      mockFetchOk({ logs: [] });
      await adminGetAuditLogs();
      const url = ((globalThis as unknown as FetchMock).fetch.mock.calls[0] as [string])[0];
      expect(url).toContain('limit=50');
    });
  });
});

// ─── checkBackendAvailable ─────────────────────────────────

describe('checkBackendAvailable()', () => {
  beforeEach(() => {
    (globalThis as unknown as FetchMock).fetch = jest.fn();
  });

  it('should return true when health endpoint responds ok', async () => {
    (globalThis as unknown as FetchMock).fetch = jest.fn().mockResolvedValue({ ok: true } as Response);
    const result = await checkBackendAvailable();
    expect(result).toBe(true);
  });

  it('should return false when health endpoint responds not ok', async () => {
    (globalThis as unknown as FetchMock).fetch = jest.fn().mockResolvedValue({ ok: false } as Response);
    const result = await checkBackendAvailable();
    expect(result).toBe(false);
  });

  it('should return false when fetch throws (network error)', async () => {
    (globalThis as unknown as FetchMock).fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    const result = await checkBackendAvailable();
    expect(result).toBe(false);
  });
});
