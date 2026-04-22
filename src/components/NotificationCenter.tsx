import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Check,
  Trash2,
  Shield,
  Zap,
  AlertTriangle,
  Info,
  Clock,
  ChevronDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════
// ─── NOTIFICATION CENTER ─────────────────────────────────
// ═══════════════════════════════════════════════════════════

export type NotificationType = 'security' | 'system' | 'quantum' | 'billing' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
}

const STORAGE_KEY = 'quantum_notifications';

const TYPE_CONFIG: Record<NotificationType, { icon: LucideIcon; color: string; label: string }> = {
  security: { icon: Shield, color: 'text-red-400 bg-red-500/10', label: 'أمان' },
  system: { icon: Zap, color: 'text-blue-400 bg-blue-500/10', label: 'النظام' },
  quantum: { icon: AlertTriangle, color: 'text-purple-400 bg-purple-500/10', label: 'كمّي' },
  billing: { icon: Clock, color: 'text-yellow-400 bg-yellow-500/10', label: 'فواتير' },
  info: { icon: Info, color: 'text-cyan-400 bg-cyan-500/10', label: 'معلومات' },
};

function loadNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppNotification[];
  } catch {
    /* ignore */
  }
  return getDefaultNotifications();
}

function saveNotifications(items: AppNotification[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getDefaultNotifications(): AppNotification[] {
  const now = Date.now();
  return [
    {
      id: 'n1',
      type: 'security',
      title: 'تحديث أمني',
      message: 'تم تفعيل المصادقة الثنائية بنجاح. حسابك محمي الآن بطبقة أمان إضافية.',
      timestamp: new Date(now - 1000 * 60 * 30).toISOString(),
      read: false,
      archived: false,
    },
    {
      id: 'n2',
      type: 'quantum',
      title: 'محاكاة كمّية مكتملة',
      message: 'اكتملت محاكاة الدائرة الكمّية بنجاح. دقة 99.7% مع 1024 لقطة.',
      timestamp: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
      read: false,
      archived: false,
    },
    {
      id: 'n3',
      type: 'system',
      title: 'ترقية النظام',
      message: 'تم تحديث النظام إلى الإصدار 2.5.0 مع تحسينات في الأداء والاستقرار.',
      timestamp: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
      read: true,
      archived: false,
    },
    {
      id: 'n4',
      type: 'billing',
      title: 'تذكير الاشتراك',
      message: 'اشتراكك سينتهي خلال 7 أيام. قم بالتجديد للحفاظ على وصولك.',
      timestamp: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
      read: true,
      archived: false,
    },
    {
      id: 'n5',
      type: 'info',
      title: 'ميزة جديدة',
      message: 'تم إضافة لوحة تحكم المسؤول مع إدارة المستخدمين وسجلات التدقيق.',
      timestamp: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
      read: true,
      archived: false,
    },
  ];
}

export function addNotification(type: NotificationType, title: string, message: string): void {
  const items = loadNotifications();
  items.unshift({
    id: crypto.randomUUID(),
    type,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    archived: false,
  });
  saveNotifications(items);
}

export function getUnreadCount(): number {
  return loadNotifications().filter(n => !n.read && !n.archived).length;
}

// ─── Panel Component ────────────────────────────────────

interface NotificationCenterProps {
  onClose: () => void;
}

type FilterTab = 'all' | 'unread' | 'archived';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ساعة`;
  const days = Math.floor(hrs / 24);
  return `${days} يوم`;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const [items, setItems] = useState<AppNotification[]>(loadNotifications);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    saveNotifications(items);
  }, [items]);

  const markRead = useCallback((id: string) => {
    setItems(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const archive = useCallback((id: string) => {
    setItems(prev => prev.map(n => (n.id === id ? { ...n, archived: true, read: true } : n)));
  }, []);

  const deleteNotif = useCallback((id: string) => {
    setItems(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearArchived = useCallback(() => {
    setItems(prev => prev.filter(n => !n.archived));
  }, []);

  const filtered = items.filter(n => {
    if (filter === 'unread') return !n.read && !n.archived;
    if (filter === 'archived') return n.archived;
    return !n.archived;
  });

  const unreadCount = items.filter(n => !n.read && !n.archived).length;
  const archivedCount = items.filter(n => n.archived).length;

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: 'all', label: 'الكل' },
    { key: 'unread', label: 'غير مقروء', count: unreadCount },
    { key: 'archived', label: 'الأرشيف', count: archivedCount },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className='bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col'
      >
        {/* Header */}
        <div className='flex items-center justify-between p-5 border-b border-gray-800'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-500/10 rounded-xl relative'>
              <Bell className='w-5 h-5 text-blue-400' />
              {unreadCount > 0 && (
                <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold'>
                  {unreadCount}
                </span>
              )}
            </div>
            <h2 className='text-lg font-bold'>الإشعارات</h2>
          </div>
          <div className='flex items-center gap-2'>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className='px-2.5 py-1 text-[11px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors'
              >
                قراءة الكل
              </button>
            )}
            <button
              onClick={onClose}
              className='p-2 hover:bg-gray-800 rounded-lg transition-colors'
            >
              <X className='w-5 h-5 text-gray-400' />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex gap-1 p-3 border-b border-gray-800/50'>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className='mr-1 px-1.5 py-0.5 bg-gray-700 rounded-full text-[10px]'>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        <div className='flex-1 overflow-y-auto'>
          {filtered.length === 0 ? (
            <div className='text-center py-12 text-gray-500 text-sm'>
              {filter === 'unread'
                ? 'لا توجد إشعارات غير مقروءة'
                : filter === 'archived'
                  ? 'الأرشيف فارغ'
                  : 'لا توجد إشعارات'}
            </div>
          ) : (
            <div className='divide-y divide-gray-800/50'>
              {filtered.map(notif => {
                const cfg = TYPE_CONFIG[notif.type];
                const IconComponent = cfg.icon;
                const isExpanded = expandedId === notif.id;
                return (
                  <motion.div
                    key={notif.id}
                    layout
                    className={`px-5 py-4 hover:bg-gray-800/30 transition-colors cursor-pointer ${
                      !notif.read ? 'bg-blue-500/5' : ''
                    }`}
                    onClick={() => {
                      setExpandedId(isExpanded ? null : notif.id);
                      if (!notif.read) markRead(notif.id);
                    }}
                  >
                    <div className='flex items-start gap-3'>
                      <div className={`p-1.5 rounded-lg mt-0.5 ${cfg.color}`}>
                        <IconComponent className='w-3.5 h-3.5' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2'>
                          <p
                            className={`text-sm font-medium truncate ${!notif.read ? 'text-white' : 'text-gray-300'}`}
                          >
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <div className='w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0' />
                          )}
                        </div>
                        <p className='text-[11px] text-gray-500 mt-0.5'>
                          {cfg.label} • {timeAgo(notif.timestamp)}
                        </p>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className='overflow-hidden'
                            >
                              <p className='text-xs text-gray-400 mt-2 leading-relaxed'>
                                {notif.message}
                              </p>
                              <div className='flex items-center gap-2 mt-3'>
                                {!notif.archived && (
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      archive(notif.id);
                                    }}
                                    className='flex items-center gap-1 px-2 py-1 text-[10px] bg-gray-800 hover:bg-gray-700 rounded-md transition-colors text-gray-400'
                                  >
                                    <Check className='w-3 h-3' />
                                    أرشفة
                                  </button>
                                )}
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    deleteNotif(notif.id);
                                  }}
                                  className='flex items-center gap-1 px-2 py-1 text-[10px] bg-gray-800 hover:bg-red-500/20 rounded-md transition-colors text-gray-400 hover:text-red-400'
                                >
                                  <Trash2 className='w-3 h-3' />
                                  حذف
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {filter === 'archived' && archivedCount > 0 && (
          <div className='p-3 border-t border-gray-800 text-center'>
            <button
              onClick={clearArchived}
              className='text-xs text-red-400 hover:text-red-300 transition-colors'
            >
              مسح الأرشيف ({archivedCount})
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── Bell Button (for TopBar) ──────────────────────────

export const NotificationBell: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const count = getUnreadCount();
  return (
    <button
      onClick={onClick}
      className='relative p-2 hover:bg-gray-700/50 rounded-lg transition-colors'
      title='الإشعارات'
    >
      <Bell className='w-5 h-5 text-gray-400' />
      {count > 0 && (
        <span className='absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white'>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
};

export default NotificationCenter;
