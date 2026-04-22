import React from 'react';

import type { QuantumModule } from '../../types/quantumTypes';

interface QuantumSidebarProps {
  quantumModules: QuantumModule[];
  activeModule: string;
  setActiveModule: (id: string) => void;
  researchData: Record<string, unknown>;
  performResearch: (topic: string, moduleId: string) => void;
}

const QuantumSidebar: React.FC<QuantumSidebarProps> = ({
  quantumModules,
  activeModule,
  setActiveModule,
  researchData,
  performResearch,
}) => {
  return (
    <nav className='w-80 bg-gray-800/30 backdrop-blur-sm border-r border-gray-700 h-screen overflow-y-auto'>
      <div className='p-6'>
        <h2 className='text-lg font-semibold mb-4 text-gray-300'>وحدات النظام</h2>
        <div className='space-y-2'>
          {quantumModules.map(module => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => {
                  setActiveModule(module.id);
                  if (module.researchTopic) {
                    performResearch(module.researchTopic, module.id);
                  }
                }}
                className={`w-full text-right p-4 rounded-lg quantum-button quantum-card ${
                  activeModule === module.id
                    ? 'bg-purple-600/50 border border-purple-500 quantum-entangled'
                    : 'bg-gray-700/30 hover:bg-gray-700/50'
                } ${
                  module.id === 'quantum-ai-hybrid'
                    ? 'ai-processing'
                    : module.id === 'quantum-security'
                      ? 'quantum-security'
                      : module.id === 'quantum-analytics'
                        ? 'advanced-analytics'
                        : module.id === 'quantum-error-handler'
                          ? 'error-correction'
                          : module.id === 'quantum-agents'
                            ? 'intelligent-agents'
                            : module.id === 'workflow-diagnostic'
                              ? 'advanced-diagnostics'
                              : module.id === 'revolution-engine'
                                ? 'revolution-mode'
                                : ''
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                    <Icon className='w-5 h-5' />
                    <div>
                      <div className='font-medium'>{module.nameAr}</div>
                      <div className='text-xs text-gray-400'>{module.name}</div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        module.status === 'active'
                          ? 'bg-green-400'
                          : module.status === 'processing'
                            ? 'bg-yellow-400'
                            : module.status === 'error'
                              ? 'bg-red-400'
                              : 'bg-gray-400'
                      }`}
                    />
                    <div className='text-xs text-gray-400 mt-1'>
                      {(module.efficiency * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                {Boolean(researchData[module.id]) && (
                  <div className='mt-2 text-xs text-green-400'>
                    ✓ تم البحث:{' '}
                    {(researchData[module.id] as { results?: unknown[] } | undefined)?.results
                      ?.length ?? 0}{' '}
                    نتائج
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default QuantumSidebar;
