import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Palette,
  Shield,
  Cpu,
  Brain,
  Bell,
  Eye,
  Lock,
  Zap,
  Moon,
  Sun,
  Monitor,
  Save,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface SettingsState {
  theme: 'light' | 'dark' | 'auto';
  language: 'ar' | 'en' | 'fr' | 'es';
  quantumMode: 'basic' | 'advanced' | 'expert';
  aiAssistance: boolean;
  securityLevel: 'low' | 'medium' | 'high' | 'maximum';
  notifications: {
    system: boolean;
    quantum: boolean;
    security: boolean;
    ai: boolean;
  };
  performance: {
    animations: boolean;
    autoSave: boolean;
    caching: boolean;
    compression: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReports: boolean;
    dataCollection: boolean;
  };
  advanced: {
    debugMode: boolean;
    experimentalFeatures: boolean;
    developerMode: boolean;
  };
}

const defaultSettings: SettingsState = {
  theme: 'auto',
  language: 'ar',
  quantumMode: 'basic',
  aiAssistance: true,
  securityLevel: 'high',
  notifications: {
    system: true,
    quantum: true,
    security: true,
    ai: false
  },
  performance: {
    animations: true,
    autoSave: true,
    caching: true,
    compression: false
  },
  privacy: {
    analytics: false,
    crashReports: true,
    dataCollection: false
  },
  advanced: {
    debugMode: false,
    experimentalFeatures: false,
    developerMode: false
  }
};

const mergeSettings = (overrides: Partial<SettingsState>): SettingsState => ({
  ...defaultSettings,
  ...overrides,
  notifications: {
    ...defaultSettings.notifications,
    ...overrides.notifications
  },
  performance: {
    ...defaultSettings.performance,
    ...overrides.performance
  },
  privacy: {
    ...defaultSettings.privacy,
    ...overrides.privacy
  },
  advanced: {
    ...defaultSettings.advanced,
    ...overrides.advanced
  }
});

const AdvancedSettings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // تحميل الإعدادات من التخزين المحلي
  useEffect(() => {
    const savedSettings = localStorage.getItem('quantumSettings');
    if (savedSettings) {
      try {
        setSettings(mergeSettings(JSON.parse(savedSettings) as Partial<SettingsState>));
      } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error);
      }
    }
  }, []);

  // حفظ الإعدادات
  const saveSettings = async () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('quantumSettings', JSON.stringify(settings));
      // محاكاة حفظ في الخادم
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('saved');
      setHasChanges(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // إعادة تعيين الإعدادات
  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  // تصدير الإعدادات
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quantum-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // استيراد الإعدادات
  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedText = e.target?.result;
          if (typeof importedText !== 'string') {
            throw new Error('Invalid settings file');
          }
          const importedSettings = JSON.parse(importedText) as Partial<SettingsState>;
          setSettings(mergeSettings(importedSettings));
          setHasChanges(true);
        } catch (error) {
          console.error('خطأ في استيراد الإعدادات:', error);
          setSaveStatus('error');
        }
      };
      reader.readAsText(file);
    }
  };

  const updateSetting = (path: string, value: unknown) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current: Record<string, unknown> = newSettings as Record<string, unknown>;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key !== undefined) {
          current = current[key] as Record<string, unknown>;
        }
      }
      
      const lastKey = keys[keys.length - 1];
      if (lastKey !== undefined) {
        current[lastKey] = value;
      }
      setHasChanges(true);
      return newSettings;
    });
  };

  const tabs = [
    { id: 'general', label: 'عام', icon: Settings },
    { id: 'appearance', label: 'المظهر', icon: Palette },
    { id: 'quantum', label: 'الكم', icon: Cpu },
    { id: 'ai', label: 'الذكاء الاصطناعي', icon: Brain },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'performance', label: 'الأداء', icon: Zap },
    { id: 'privacy', label: 'الخصوصية', icon: Eye },
    { id: 'advanced', label: 'متقدم', icon: Lock }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="settings-language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اللغة
              </label>
              <select
                id="settings-language"
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="settings-quantum-mode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                وضع الكم
              </label>
              <select
                id="settings-quantum-mode"
                value={settings.quantumMode}
                onChange={(e) => updateSetting('quantumMode', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="basic">أساسي</option>
                <option value="advanced">متقدم</option>
                <option value="expert">خبير</option>
              </select>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="settings-theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المظهر
              </label>
              <div id="settings-theme" className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'فاتح', icon: Sun },
                  { value: 'dark', label: 'داكن', icon: Moon },
                  { value: 'auto', label: 'تلقائي', icon: Monitor }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => updateSetting('theme', value)}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                      settings.theme === value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="settings-security-level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                مستوى الأمان
              </label>
              <select
                id="settings-security-level"
                value={settings.securityLevel}
                onChange={(e) => updateSetting('securityLevel', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="low">منخفض</option>
                <option value="medium">متوسط</option>
                <option value="high">عالي</option>
                <option value="maximum">أقصى</option>
              </select>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {key === 'system' ? 'النظام' :
                   key === 'quantum' ? 'الكم' :
                   key === 'security' ? 'الأمان' : 'الذكاء الاصطناعي'}
                </label>
                <button
                  onClick={() => updateSetting(`notifications.${key}`, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            {Object.entries(settings.performance).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {key === 'animations' ? 'الرسوم المتحركة' :
                   key === 'autoSave' ? 'الحفظ التلقائي' :
                   key === 'caching' ? 'التخزين المؤقت' : 'الضغط'}
                </label>
                <button
                  onClick={() => updateSetting(`performance.${key}`, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        );

      default:
        return <div>المحتوى غير متوفر</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">الإعدادات المتقدمة</h1>
          <p className="opacity-90">تخصيص النظام الكمي المتقدم</p>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-900 p-4">
            <nav className="space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg text-right transition-colors ${
                    activeTab === id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex space-x-3 space-x-reverse">
                <button
                  onClick={exportSettings}
                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>تصدير</span>
                </button>
                
                <label className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>استيراد</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={resetSettings}
                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة تعيين</span>
                </button>
              </div>

              <div className="flex items-center space-x-3 space-x-reverse">
                {hasChanges && (
                  <span className="text-sm text-amber-600 dark:text-amber-400 flex items-center space-x-1 space-x-reverse">
                    <AlertTriangle className="w-4 h-4" />
                    <span>تغييرات غير محفوظة</span>
                  </span>
                )}
                
                <button
                  onClick={saveSettings}
                  disabled={!hasChanges || saveStatus === 'saving'}
                  className={`flex items-center space-x-2 space-x-reverse px-6 py-2 rounded-lg font-medium transition-all ${
                    hasChanges
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {saveStatus === 'saving' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : saveStatus === 'saved' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>
                    {saveStatus === 'saving' ? 'جاري الحفظ...' :
                     saveStatus === 'saved' ? 'تم الحفظ' : 'حفظ'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
export type { SettingsState };
