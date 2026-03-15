import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key, Copy, Plus, Trash2, Eye, EyeOff,
  CheckCircle, Shield, Clock, AlertTriangle, X,
} from 'lucide-react';
import { getCurrentUser, hasFeature } from '../services/subscriptionService';

// ═══════════════════════════════════════════════════════════
// ─── API KEYS DASHBOARD ──────────────────────────────────
// ═══════════════════════════════════════════════════════════

interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  createdAt: string;
  lastUsed: string | null;
  requests: number;
  status: 'active' | 'revoked';
}

const STORAGE_KEY = 'quantum_api_keys';

function loadKeys(): ApiKey[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ApiKey[];
  } catch { /* ignore */ }
  return [];
}

function saveKeys(keys: ApiKey[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const segments = [8, 4, 4, 4, 12];
  return 'qai_' + segments.map(len =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  ).join('-');
}

interface ApiKeysDashboardProps {
  onClose: () => void;
}

const ApiKeysDashboard: React.FC<ApiKeysDashboardProps> = ({ onClose }) => {
  const user = getCurrentUser();
  const [keys, setKeys] = useState<ApiKey[]>(loadKeys);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newlyCreated, setNewlyCreated] = useState<string | null>(null);

  const apiAccess = hasFeature('hasApiAccess');

  const createKey = useCallback(() => {
    if (!newKeyName.trim()) return;
    const key = generateApiKey();
    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name: newKeyName.trim(),
      key,
      prefix: key.slice(0, 12) + '...',
      createdAt: new Date().toISOString(),
      lastUsed: null,
      requests: 0,
      status: 'active',
    };
    const updated = [...keys, newKey];
    setKeys(updated);
    saveKeys(updated);
    setNewKeyName('');
    setShowCreate(false);
    setNewlyCreated(newKey.id);
    setRevealedKeys(prev => new Set(prev).add(newKey.id));
    setTimeout(() => setNewlyCreated(null), 5000);
  }, [newKeyName, keys]);

  const revokeKey = useCallback((id: string) => {
    const updated = keys.map(k => k.id === id ? { ...k, status: 'revoked' as const } : k);
    setKeys(updated);
    saveKeys(updated);
  }, [keys]);

  const deleteKey = useCallback((id: string) => {
    const updated = keys.filter(k => k.id !== id);
    setKeys(updated);
    saveKeys(updated);
  }, [keys]);

  const copyKey = useCallback(async (id: string, key: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const toggleReveal = useCallback((id: string) => {
    setRevealedKeys(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const activeKeys = keys.filter(k => k.status === 'active');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Key className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">مفاتيح API</h2>
              <p className="text-xs text-gray-500">إدارة مفاتيح الوصول للواجهة البرمجية</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {!apiAccess ? (
            <div className="text-center py-10">
              <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">الوصول لـ API غير متاح</h3>
              <p className="text-gray-400 text-sm mb-4">
                مفاتيح API متاحة فقط في الخطة الاحترافية والمؤسسات
              </p>
              <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-medium">
                ترقّ للحصول على وصول API
              </span>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-400">{activeKeys.length}</p>
                  <p className="text-xs text-gray-500 mt-1">مفاتيح نشطة</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {keys.reduce((sum, k) => sum + k.requests, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">طلبات إجمالية</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-purple-400">
                    {user?.subscription.planId === 'enterprise' ? '∞' : '10,000'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">حد يومي</p>
                </div>
              </div>

              {/* Create Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-300">المفاتيح ({keys.length})</h3>
                <button
                  onClick={() => setShowCreate(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  مفتاح جديد
                </button>
              </div>

              {/* Create Form */}
              <AnimatePresence>
                {showCreate && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3">
                      <label className="block text-sm font-medium">اسم المفتاح</label>
                      <input
                        value={newKeyName}
                        onChange={e => setNewKeyName(e.target.value)}
                        placeholder="مثال: Production API, Mobile App..."
                        className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                        onKeyDown={e => { if (e.key === 'Enter') createKey(); }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={createKey}
                          disabled={!newKeyName.trim()}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
                        >
                          إنشاء
                        </button>
                        <button
                          onClick={() => { setShowCreate(false); setNewKeyName(''); }}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Newly Created Warning */}
              {newlyCreated && (
                <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-400">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>تم إنشاء المفتاح بنجاح. انسخه الآن — لن تتمكن من رؤيته مرة أخرى.</span>
                </div>
              )}

              {/* Keys List */}
              <div className="space-y-3">
                {keys.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    لا توجد مفاتيح API. أنشئ مفتاحاً جديداً للبدء.
                  </div>
                ) : (
                  keys.map(apiKey => (
                    <div
                      key={apiKey.id}
                      className={`bg-gray-800/50 border rounded-xl p-4 transition-colors ${
                        apiKey.status === 'revoked'
                          ? 'border-red-500/20 opacity-60'
                          : newlyCreated === apiKey.id
                            ? 'border-green-500/50'
                            : 'border-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-sm">{apiKey.name}</span>
                          {apiKey.status === 'active' ? (
                            <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded-full font-medium">نشط</span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 text-[10px] rounded-full font-medium">ملغى</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {apiKey.status === 'active' && (
                            <>
                              <button
                                onClick={() => toggleReveal(apiKey.id)}
                                className="p-1.5 hover:bg-gray-700 rounded-md transition-colors"
                                title={revealedKeys.has(apiKey.id) ? 'إخفاء' : 'إظهار'}
                              >
                                {revealedKeys.has(apiKey.id) ? (
                                  <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5 text-gray-400" />
                                )}
                              </button>
                              <button
                                onClick={() => { void copyKey(apiKey.id, apiKey.key); }}
                                className="p-1.5 hover:bg-gray-700 rounded-md transition-colors"
                                title="نسخ"
                              >
                                {copiedId === apiKey.id ? (
                                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                                )}
                              </button>
                              <button
                                onClick={() => revokeKey(apiKey.id)}
                                className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors"
                                title="إلغاء"
                              >
                                <Shield className="w-3.5 h-3.5 text-red-400" />
                              </button>
                            </>
                          )}
                          {apiKey.status === 'revoked' && (
                            <button
                              onClick={() => deleteKey(apiKey.id)}
                              className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="font-mono text-xs bg-gray-900/50 rounded-lg px-3 py-2 text-gray-400 mb-3" dir="ltr">
                        {revealedKeys.has(apiKey.id) ? apiKey.key : apiKey.prefix + '•'.repeat(30)}
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          أُنشئ: {new Date(apiKey.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                        <span>
                          {apiKey.requests.toLocaleString()} طلب
                        </span>
                        {apiKey.lastUsed && (
                          <span>آخر استخدام: {new Date(apiKey.lastUsed).toLocaleDateString('ar-SA')}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Usage Guide */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  دليل الاستخدام
                </h4>
                <div className="space-y-2 text-xs text-gray-400">
                  <p>أضف المفتاح في ترويسة الطلب:</p>
                  <code className="block bg-gray-900 rounded-lg px-3 py-2 text-green-400 font-mono" dir="ltr">
                    Authorization: Bearer qai_xxxx-xxxx-xxxx
                  </code>
                  <p className="mt-2">نقطة الوصول الأساسية:</p>
                  <code className="block bg-gray-900 rounded-lg px-3 py-2 text-blue-400 font-mono" dir="ltr">
                    POST /api/quantum/simulate
                  </code>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ApiKeysDashboard;
