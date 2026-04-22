import { Search } from 'lucide-react';
import React from 'react';

import type { CommandAction } from '../../types/quantumTypes';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commandQuery: string;
  setCommandQuery: (v: string) => void;
  filteredCommands: CommandAction[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commandQuery,
  setCommandQuery,
  filteredCommands,
}) => {
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20'>
      <div className='bg-gray-800/95 backdrop-blur-lg rounded-2xl border border-gray-600/50 w-full max-w-2xl mx-4 shadow-2xl'>
        {/* رأس لوحة الأوامر */}
        <div className='p-4 border-b border-gray-600/30'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-200'>لوحة الأوامر الذكية</h3>
            <button
              onClick={onClose}
              className='p-1 hover:bg-gray-700/50 rounded-lg transition-colors'
            >
              <span className='text-gray-400'>✕</span>
            </button>
          </div>
          <div className='mt-3 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              value={commandQuery}
              onChange={e => setCommandQuery(e.target.value)}
              placeholder='ابحث عن الأوامر...'
              className='w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none'
            />
          </div>
        </div>

        {/* قائمة الأوامر */}
        <div className='max-h-96 overflow-y-auto'>
          {filteredCommands.length === 0 ? (
            <div className='p-8 text-center text-gray-400'>لا توجد أوامر مطابقة للبحث</div>
          ) : (
            <div className='p-2'>
              {['theme', 'navigation', 'quantum', 'ai', 'security'].map(category => {
                const categoryCommands = filteredCommands.filter(cmd => cmd.category === category);
                if (categoryCommands.length === 0) return null;

                const categoryNames = {
                  theme: 'الثيم والمظهر',
                  navigation: 'التنقل',
                  quantum: 'النظام الكمي',
                  ai: 'الذكاء الاصطناعي',
                  security: 'الأمان',
                };

                return (
                  <div key={category} className='mb-4'>
                    <div className='px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                      {categoryNames[category as keyof typeof categoryNames]}
                    </div>
                    {categoryCommands.map(command => {
                      const Icon = command.icon;
                      return (
                        <button
                          key={command.id}
                          onClick={() => {
                            command.action();
                            onClose();
                            setCommandQuery('');
                          }}
                          className='w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2 hover:bg-gray-700/50 rounded-lg transition-colors text-left'
                        >
                          <Icon className='w-4 h-4 text-gray-400' />
                          <div className='flex-1'>
                            <div className='text-sm font-medium text-gray-200'>
                              {command.labelAr}
                            </div>
                            <div className='text-xs text-gray-400'>{command.label}</div>
                          </div>
                          {command.shortcut && (
                            <div className='text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded'>
                              {command.shortcut}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* تلميحات الاختصارات */}
        <div className='p-3 border-t border-gray-600/30 bg-gray-800/50'>
          <div className='flex items-center justify-between text-xs text-gray-500'>
            <span>استخدم الأسهم للتنقل، Enter للتنفيذ</span>
            <span>Ctrl+K لفتح/إغلاق اللوحة</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
