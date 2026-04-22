import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BarChart3, Shield, Activity,
  Search, ChevronLeft, ChevronRight,
  Crown, Zap, Star, ArrowLeft,
  CheckCircle, XCircle, AlertTriangle,
  Eye, UserX, Edit3, RefreshCw,
  FileText, Globe, Clock, TrendingUp,
  LogOut,
} from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  adminGetStats, adminGetUsers, adminUpdateUser,
  adminDeactivateUser, adminGetAuditLogs,
  checkBackendAvailable, apiLogout,
  type AdminStats, type ApiUser, type AuditLogEntry,
  type PaginatedUsers,
} from '../services/apiClient';
import { getCurrentUser, logoutUser } from '../services/subscriptionService';

// ═══════════════════════════════════════════════════════════
// ─── ADMIN DASHBOARD ──────────────────────────────────────
// ═══════════════════════════════════════════════════════════

type Tab = 'overview' | 'users' | 'audit';

// ─── Demo data for offline/no-backend mode ────────────────

const DEMO_STATS: AdminStats = {
  users: { total: 247, active: 231, verified: 198, recentSignups: 34 },
  plans: { free: 180, professional: 52, enterprise: 15 },
  api: { totalRequests: 1_284_920, totalTokens: 48_201_300 },
};

const DEMO_USERS: ApiUser[] = Array.from({ length: 12 }, (_, i) => ({
  id: `demo-${i}`,
  username: `user_${i + 1}`,
  email: `user${i + 1}@example.com`,
  profile: {
    firstName: ['أحمد', 'فاطمة', 'محمد', 'سارة', 'خالد', 'نورة'][i % 6] ?? '',
    lastName: ['العلي', 'السعيد', 'القحطاني', 'المالكي', 'الحربي', 'الشمري'][i % 6] ?? '',
    avatar: null, bio: '', language: 'ar', timezone: 'Asia/Riyadh',
  },
  role: i === 0 ? 'admin' : i < 3 ? 'premium' : 'user',
  isActive: i !== 7,
  isEmailVerified: i < 9,
  subscription: {
    plan: i < 2 ? 'enterprise' : i < 5 ? 'premium' : 'free',
    status: 'active', startDate: '2026-01-01', endDate: null, autoRenew: true,
  },
  apiUsage: {
    dailyRequests: Math.floor(Math.random() * 80),
    dailyTokens: Math.floor(Math.random() * 5000),
    limits: { dailyRequests: 100, dailyTokens: 10000 },
  },
  quantumPreferences: {},
  createdAt: new Date(Date.now() - Math.random() * 90 * 86400000).toISOString(),
  lastLogin: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
}));

const DEMO_LOGS: AuditLogEntry[] = Array.from({ length: 20 }, (_, i) => ({
  userId: `demo-${i % 5}`,
  username: `user_${(i % 5) + 1}`,
  email: `user${(i % 5) + 1}@example.com`,
  role: i % 5 === 0 ? 'admin' : 'user',
  ip: `192.168.1.${100 + i}`,
  userAgent: 'Mozilla/5.0',
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  success: i !== 3 && i !== 11,
}));

// ─── Component ──────────────────────────────────────────

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<PaginatedUsers | null>(null);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editPlan, setEditPlan] = useState('');

  const localUser = getCurrentUser();

  // Check admin access
  useEffect(() => {
    if (localUser == null) {
      navigate('/login');
    }
  }, [localUser, navigate]);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    const online = await checkBackendAvailable();
    setBackendOnline(online);

    if (online) {
      try {
        const [s, u, l] = await Promise.all([
          adminGetStats(),
          adminGetUsers({ page: currentPage, limit: 20, search: searchQuery, role: filterRole, plan: filterPlan }),
          adminGetAuditLogs(50),
        ]);
        setStats(s);
        setUsers(u);
        setLogs(l);
      } catch {
        // If admin API fails (not admin role), use demo
        setStats(DEMO_STATS);
        setUsers({ users: DEMO_USERS, pagination: { page: 1, limit: 20, total: 12, pages: 1 } });
        setLogs(DEMO_LOGS);
      }
    } else {
      setStats(DEMO_STATS);
      setUsers({ users: DEMO_USERS, pagination: { page: 1, limit: 20, total: 12, pages: 1 } });
      setLogs(DEMO_LOGS);
    }
    setLoading(false);
  }, [currentPage, searchQuery, filterRole, filterPlan]);

  useEffect(() => { void loadData(); }, [loadData]);

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    if (backendOnline) {
      try {
        await adminUpdateUser(editingUser.id, { role: editRole, plan: editPlan });
      } catch { /* demo fallback */ }
    }
    setEditingUser(null);
    void loadData();
  };

  const handleDeactivateUser = async (user: ApiUser) => {
    if (backendOnline) {
      try {
        await adminDeactivateUser(user.id);
      } catch { /* demo fallback */ }
    }
    void loadData();
  };

  const handleLogout = () => {
    if (backendOnline) void apiLogout();
    logoutUser();
    navigate('/');
  };

  const planIcon = (plan: string) => {
    if (plan === 'enterprise') return <Crown className="w-3.5 h-3.5 text-purple-400" />;
    if (plan === 'premium' || plan === 'professional') return <Star className="w-3.5 h-3.5 text-blue-400" />;
    return <Zap className="w-3.5 h-3.5 text-gray-400" />;
  };

  const roleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      premium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      user: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styles[role] ?? styles['user']}`}>
        {role === 'admin' ? 'مدير' : role === 'premium' ? 'متميز' : 'مستخدم'}
      </span>
    );
  };

  if (loading && stats == null) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">جاري تحميل لوحة الإدارة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Bar */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="العودة للوحة التحكم">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">لوحة الإدارة</h1>
                <p className="text-[10px] text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            {!backendOnline && (
              <span className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-[10px] text-yellow-400 font-medium">
                وضع العرض — البيانات تجريبية
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { void loadData(); }} className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="تحديث">
              <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              خروج
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {([
            { id: 'overview' as Tab, label: 'نظرة عامة', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'users' as Tab, label: 'المستخدمون', icon: <Users className="w-4 h-4" /> },
            { id: 'audit' as Tab, label: 'سجلات التدقيق', icon: <FileText className="w-4 h-4" /> },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* ─── Overview Tab ──────────────────── */}
        {tab === 'overview' && stats != null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'إجمالي المستخدمين', value: stats.users.total, icon: <Users className="w-5 h-5" />, color: 'blue', sub: `${stats.users.active} نشط` },
                { label: 'تسجيلات جديدة (30 يوم)', value: stats.users.recentSignups, icon: <TrendingUp className="w-5 h-5" />, color: 'green', sub: `${stats.users.verified} مُوثق` },
                { label: 'طلبات API', value: stats.api.totalRequests.toLocaleString(), icon: <Activity className="w-5 h-5" />, color: 'purple', sub: `${(stats.api.totalTokens / 1_000_000).toFixed(1)}M tokens` },
                { label: 'الخطط المدفوعة', value: stats.plans.professional + stats.plans.enterprise, icon: <Crown className="w-5 h-5" />, color: 'yellow', sub: `${stats.plans.enterprise} مؤسسات` },
              ].map((card, i) => (
                <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">{card.label}</span>
                    <div className={`p-2 rounded-lg bg-${card.color}-500/10`}>{card.icon}</div>
                  </div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Plan Distribution */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                توزيع الخطط
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'مجاني', count: stats.plans.free, color: 'bg-gray-500', pct: stats.users.total > 0 ? Math.round((stats.plans.free / stats.users.total) * 100) : 0 },
                  { label: 'احترافي', count: stats.plans.professional, color: 'bg-blue-500', pct: stats.users.total > 0 ? Math.round((stats.plans.professional / stats.users.total) * 100) : 0 },
                  { label: 'مؤسسات', count: stats.plans.enterprise, color: 'bg-purple-500', pct: stats.users.total > 0 ? Math.round((stats.plans.enterprise / stats.users.total) * 100) : 0 },
                ].map((plan, i) => (
                  <div key={i} className="text-center">
                    <div className="mx-auto w-20 h-20 rounded-full border-4 border-gray-800 flex items-center justify-center mb-2 relative">
                      <span className="text-lg font-bold">{plan.pct}%</span>
                      <svg className="absolute inset-0 -rotate-90 w-full h-full">
                        <circle cx="40" cy="40" r="36"
                          fill="none" strokeWidth="4" className="stroke-gray-800"
                        />
                        <circle cx="40" cy="40" r="36"
                          fill="none" strokeWidth="4"
                          className={plan.color.replace('bg-', 'stroke-')}
                          strokeDasharray={`${plan.pct * 2.26} 226`}
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">{plan.label}</p>
                    <p className="text-xs text-gray-500">{plan.count} مستخدم</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" />
                آخر النشاطات
              </h3>
              <div className="space-y-2">
                {logs.slice(0, 8).map((log, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-800/50 text-sm">
                    <div className="flex items-center gap-3">
                      {log.success ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-gray-300">{log.username}</span>
                      <span className="text-gray-600">{log.success ? 'تسجيل دخول ناجح' : 'محاولة فاشلة'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{log.ip}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString('ar-SA')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Users Tab ──────────────────── */}
        {tab === 'users' && users != null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Search & Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="بحث بالاسم أو البريد..."
                  className="w-full pr-10 pl-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <select
                value={filterRole}
                onChange={e => { setFilterRole(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">كل الأدوار</option>
                <option value="admin">مدير</option>
                <option value="premium">متميز</option>
                <option value="user">مستخدم</option>
              </select>
              <select
                value={filterPlan}
                onChange={e => { setFilterPlan(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">كل الخطط</option>
                <option value="free">مجاني</option>
                <option value="premium">احترافي</option>
                <option value="enterprise">مؤسسات</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500 text-xs">
                      <th className="text-right py-3 px-4 font-medium">المستخدم</th>
                      <th className="text-right py-3 px-4 font-medium">الدور</th>
                      <th className="text-right py-3 px-4 font-medium">الخطة</th>
                      <th className="text-right py-3 px-4 font-medium">الحالة</th>
                      <th className="text-right py-3 px-4 font-medium">آخر دخول</th>
                      <th className="text-right py-3 px-4 font-medium">API اليوم</th>
                      <th className="text-right py-3 px-4 font-medium">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.users.map(user => (
                      <tr key={user.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                              {(user.profile.firstName?.[0] ?? user.username[0] ?? '').toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-200">{user.profile.firstName} {user.profile.lastName}</p>
                              <p className="text-xs text-gray-500" dir="ltr">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{roleBadge(user.role)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {planIcon(user.subscription.plan)}
                            <span className="text-xs text-gray-300">{user.subscription.plan}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {user.isActive ? (
                            <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle className="w-3.5 h-3.5" /> نشط</span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-400 text-xs"><XCircle className="w-3.5 h-3.5" /> معطل</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ar-SA') : '—'}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-400">
                          {user.apiUsage.dailyRequests}/{user.apiUsage.limits.dailyRequests}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => { setEditingUser(user); setEditRole(user.role); setEditPlan(user.subscription.plan); }}
                              className="p-1.5 hover:bg-gray-700 rounded-md transition-colors" title="تعديل"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                            <button
                              onClick={() => { setEditingUser(user); }}
                              className="p-1.5 hover:bg-gray-700 rounded-md transition-colors" title="عرض"
                            >
                              <Eye className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                            {user.isActive && user.role !== 'admin' && (
                              <button
                                onClick={() => { void handleDeactivateUser(user); }}
                                className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors" title="تعطيل"
                              >
                                <UserX className="w-3.5 h-3.5 text-red-400" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {users.pagination.pages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
                  <p className="text-xs text-gray-500">
                    {users.pagination.total} مستخدم — صفحة {users.pagination.page} من {users.pagination.pages}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 hover:bg-gray-800 rounded disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(users.pagination.pages, p + 1))}
                      disabled={currentPage === users.pagination.pages}
                      className="p-1.5 hover:bg-gray-800 rounded disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── Audit Tab ──────────────────── */}
        {tab === 'audit' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-yellow-400" />
                  سجل تسجيلات الدخول
                </h3>
                <span className="text-xs text-gray-500">{logs.length} سجل</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500 text-xs">
                      <th className="text-right py-3 px-4 font-medium">الحالة</th>
                      <th className="text-right py-3 px-4 font-medium">المستخدم</th>
                      <th className="text-right py-3 px-4 font-medium">الدور</th>
                      <th className="text-right py-3 px-4 font-medium">IP</th>
                      <th className="text-right py-3 px-4 font-medium">الوقت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, i) => (
                      <tr key={i} className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 px-4">
                          {log.success ? (
                            <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle className="w-3.5 h-3.5" /> ناجح</span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-400 text-xs"><AlertTriangle className="w-3.5 h-3.5" /> فاشل</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-300">{log.username}</span>
                          <span className="text-xs text-gray-600 mr-2" dir="ltr">{log.email}</span>
                        </td>
                        <td className="py-3 px-4">{roleBadge(log.role)}</td>
                        <td className="py-3 px-4 text-xs text-gray-500 font-mono" dir="ltr">{log.ip}</td>
                        <td className="py-3 px-4 text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString('ar-SA')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ─── Edit User Modal ─────────────── */}
      <AnimatePresence>
        {editingUser != null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setEditingUser(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">تعديل المستخدم</h3>
                <button onClick={() => setEditingUser(null)} className="p-1 hover:bg-gray-800 rounded-lg">
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                  {(editingUser.profile.firstName?.[0] ?? editingUser.username[0] ?? '').toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{editingUser.profile.firstName} {editingUser.profile.lastName}</p>
                  <p className="text-xs text-gray-500" dir="ltr">{editingUser.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الدور</label>
                <select
                  value={editRole}
                  onChange={e => setEditRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="user">مستخدم</option>
                  <option value="premium">متميز</option>
                  <option value="admin">مدير</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الخطة</label>
                <select
                  value={editPlan}
                  onChange={e => setEditPlan(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="free">مجاني</option>
                  <option value="premium">احترافي</option>
                  <option value="enterprise">مؤسسات</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { void handleUpdateUser(); }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-colors"
                >
                  حفظ التغييرات
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
