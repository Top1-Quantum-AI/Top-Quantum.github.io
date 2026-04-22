import { Command, Sun, Moon, Palette } from 'lucide-react';
import React from 'react';

import type { SystemMetrics, SmartTheme } from '../../types/quantumTypes';

interface QuantumHeaderProps {
  systemMetrics: SystemMetrics;
  isSystemActive: boolean;
  setIsSystemActive: (v: boolean) => void;
  smartTheme: SmartTheme;
  setSmartTheme: React.Dispatch<React.SetStateAction<SmartTheme>>;
  activateRevolutionMode: () => void;
  setIsCommandPaletteOpen: (v: boolean) => void;
}

const QuantumHeader: React.FC<QuantumHeaderProps> = ({
  systemMetrics,
  isSystemActive,
  setIsSystemActive,
  smartTheme,
  setSmartTheme,
  activateRevolutionMode,
  setIsCommandPaletteOpen,
}) => {
  return (
    <header className="relative z-10 bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="text-3xl">🌌</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                النظام الكمي الثوري
              </h1>
              <p className="text-sm text-gray-400">Revolutionary Quantum System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* أزرار التحكم في الثيم */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors backdrop-blur-sm border border-gray-600/30"
                title="لوحة الأوامر (Ctrl+K)"
              >
                <Command className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSmartTheme(prev => ({ ...prev, mode: prev.mode === 'dark' ? 'light' : 'dark' }))}
                className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors backdrop-blur-sm border border-gray-600/30"
                title="تبديل الثيم (Ctrl+T)"
              >
                {smartTheme.mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setSmartTheme(prev => ({ ...prev, background: prev.background === 'particles' ? 'neural' : 'particles' }))}
                className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors backdrop-blur-sm border border-gray-600/30"
                title="تبديل الخلفية"
              >
                <Palette className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-300">مؤشر الثورة العلمية</div>
              <div className="text-lg font-bold text-yellow-400">
                {(systemMetrics.revolutionaryIndex * 100).toFixed(1)}%
              </div>
            </div>
            
            <button
              onClick={() => setIsSystemActive(!isSystemActive)}
              className={`px-4 py-2 rounded-lg font-semibold quantum-button ${
                isSystemActive
                  ? 'bg-green-600 hover:bg-green-700 status-active'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isSystemActive ? '🟢 نشط' : '⚪ غير نشط'}
            </button>
            
            <button
              onClick={activateRevolutionMode}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg font-semibold quantum-button revolution-mode"
            >
              <span className="glow-text">⚡ تفعيل الثورة العلمية</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default QuantumHeader;
