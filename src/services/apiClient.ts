// ═══════════════════════════════════════════════════════════
// ─── API CLIENT SERVICE ───────────────────────────────────
// Connects frontend to the real backend API
// ═══════════════════════════════════════════════════════════

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ─── Types ──────────────────────────────────────────────

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string | null;
    bio: string;
    language: string;
    timezone: string;
  };
  role: 'user' | 'premium' | 'admin';
  isActive: boolean;
  isEmailVerified: boolean;
  subscription: {
    plan: string;
    status: string;
    startDate: string;
    endDate: string | null;
    autoRenew: boolean;
  };
  apiUsage: {
    dailyRequests: number;
    dailyTokens: number;
    limits: { dailyRequests: number; dailyTokens: number };
  };
  quantumPreferences: Record<string, unknown>;
  createdAt: string;
  lastLogin: string | null;
}

export interface AdminStats {
  users: { total: number; active: number; verified: number; recentSignups: number };
  plans: { free: number; professional: number; enterprise: number };
  api: { totalRequests: number; totalTokens: number };
}

export interface AuditLogEntry {
  userId: string;
  username: string;
  email: string;
  role: string;
  ip: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
}

export interface PaginatedUsers {
  users: ApiUser[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errorEn?: string;
  token?: string;
}

// ─── Token Management ───────────────────────────────────

let authToken: string | null = null;

function getToken(): string | null {
  if (authToken) return authToken;
  const stored = localStorage.getItem('quantum_auth_token');
  if (stored) authToken = stored;
  return authToken;
}

function setToken(token: string): void {
  authToken = token;
  localStorage.setItem('quantum_auth_token', token);
}

export function clearToken(): void {
  authToken = null;
  localStorage.removeItem('quantum_auth_token');
  localStorage.removeItem('quantum_user_profile');
}

// ─── Fetch Wrapper ──────────────────────────────────────

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (res.status === 401) {
    clearToken();
  }

  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok) {
    throw new ApiError(json.error ?? json.errorEn ?? `HTTP ${res.status}`, res.status, json);
  }
  return json;
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// ─── Auth Endpoints ─────────────────────────────────────

export async function apiRegister(data: {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  language?: string;
}): Promise<{ user: ApiUser; token: string }> {
  const res = await apiFetch<{ user: ApiUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (res.token) setToken(res.token);
  return { user: res.data!.user, token: res.token ?? '' };
}

export async function apiLogin(
  identifier: string,
  password: string
): Promise<{ user: ApiUser; token: string }> {
  const res = await apiFetch<{ user: ApiUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
  if (res.token) setToken(res.token);
  return { user: res.data!.user, token: res.token ?? '' };
}

export async function apiLogout(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    clearToken();
  }
}

export async function apiGetMe(): Promise<ApiUser> {
  const res = await apiFetch<{ user: ApiUser }>('/auth/me');
  return res.data!.user;
}

// ─── User Profile ───────────────────────────────────────

export async function apiGetProfile(): Promise<ApiUser> {
  const res = await apiFetch<{ user: ApiUser }>('/user/profile');
  return res.data!.user;
}

export async function apiUpdateProfile(data: Record<string, unknown>): Promise<ApiUser> {
  const res = await apiFetch<{ user: ApiUser }>('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.data!.user;
}

// ─── Admin Endpoints ────────────────────────────────────

export async function adminGetStats(): Promise<AdminStats> {
  const res = await apiFetch<AdminStats>('/admin/stats');
  return res.data!;
}

export async function adminGetUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  plan?: string;
}): Promise<PaginatedUsers> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.search) qs.set('search', params.search);
  if (params?.role) qs.set('role', params.role);
  if (params?.plan) qs.set('plan', params.plan);
  const q = qs.toString();
  const res = await apiFetch<PaginatedUsers>(`/admin/users${q ? `?${q}` : ''}`);
  return res.data!;
}

export async function adminGetUser(id: string): Promise<ApiUser> {
  const res = await apiFetch<{ user: ApiUser }>(`/admin/users/${encodeURIComponent(id)}`);
  return res.data!.user;
}

export async function adminUpdateUser(
  id: string,
  data: { role?: string; isActive?: boolean; plan?: string }
): Promise<ApiUser> {
  const res = await apiFetch<{ user: ApiUser }>(`/admin/users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.data!.user;
}

export async function adminDeactivateUser(id: string): Promise<void> {
  await apiFetch(`/admin/users/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function adminGetAuditLogs(limit = 50): Promise<AuditLogEntry[]> {
  const res = await apiFetch<{ logs: AuditLogEntry[] }>(`/admin/audit-logs?limit=${limit}`);
  return res.data!.logs;
}

// ─── Connection Check ───────────────────────────────────

export async function checkBackendAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE.replace('/api', '')}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
