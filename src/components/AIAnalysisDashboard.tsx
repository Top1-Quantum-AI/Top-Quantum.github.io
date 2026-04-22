import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Send,
  Loader2,
  Sparkles,
  FileSearch,
  Shield,
  Atom,
  BarChart3,
  AlertCircle,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

import {
  sendChatMessage,
  analyzeSystemData,
  analyzeSecurityThreats,
  analyzeQuantumPerformance,
  isApiKeyConfigured,
  type ChatMessage,
} from '../services/groqService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isAnalysis?: boolean;
}

interface AIAnalysisDashboardProps {
  systemMetrics?: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    uptime: string;
    activeConnections: number;
  } | null;
  quantumStates?: Array<{
    id: string;
    name: string;
    status: string;
    qubits: number;
    coherenceTime: number;
    fidelity: number;
    gateErrors: number;
    temperature: number;
  }>;
  securityMetrics?: {
    encryptionLevel: string;
    threatLevel: string;
    activeThreats: number;
    blockedAttacks: number;
    quantumResistance: number;
  } | null;
}

const AIAnalysisDashboard: React.FC<AIAnalysisDashboardProps> = ({
  systemMetrics,
  quantumStates,
  securityMetrics,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'مرحباً! أنا المحلل الذكي للنظام الكمي المتقدم 🧠\n\nيمكنني مساعدتك في:\n- **تحليل أداء النظام** بالكامل\n- **تحليل التهديدات الأمنية** والمخاطر\n- **تحليل المعالجات الكمية** وأدائها\n- **الإجابة على أسئلتك** حول النظام\n\nاستخدم الأزرار أدناه للتحليل السريع، أو اكتب سؤالك مباشرة.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const apiConfigured = isApiKeyConfigured();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', content: string, isAnalysis = false): string => {
    const id = Date.now().toString();
    setMessages(prev => [...prev, { id, role, content, timestamp: new Date(), isAnalysis }]);
    return id;
  };

  const handleSend = async (): Promise<void> => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    setInputValue('');
    addMessage('user', text);
    setIsLoading(true);

    try {
      const chatHistory: ChatMessage[] = messages
        .filter(m => m.id !== '1')
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));
      chatHistory.push({ role: 'user', content: text });

      const response = await sendChatMessage(chatHistory);
      addMessage('assistant', response);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      addMessage('assistant', `❌ **خطأ:** ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemAnalysis = async (): Promise<void> => {
    if (isLoading) return;
    setActiveAnalysis('system');
    addMessage('user', '🔍 تحليل شامل لأداء النظام');
    setIsLoading(true);

    try {
      const data = {
        systemMetrics: systemMetrics ?? { cpu: 0, memory: 0, disk: 0, network: 0 },
        quantumProcessors: quantumStates ?? [],
        security: securityMetrics ?? {},
        timestamp: new Date().toISOString(),
      };
      const response = await analyzeSystemData(data);
      addMessage('assistant', response, true);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'خطأ في التحليل';
      addMessage('assistant', `❌ **خطأ في تحليل النظام:** ${errMsg}`);
    } finally {
      setIsLoading(false);
      setActiveAnalysis(null);
    }
  };

  const handleSecurityAnalysis = async (): Promise<void> => {
    if (isLoading) return;
    setActiveAnalysis('security');
    addMessage('user', '🛡️ تحليل أمني شامل');
    setIsLoading(true);

    try {
      const threats = [
        {
          type: 'الهجمات المحجوبة',
          count: securityMetrics?.blockedAttacks ?? 0,
          threatLevel: securityMetrics?.threatLevel ?? 'unknown',
          encryption: securityMetrics?.encryptionLevel ?? 'N/A',
          quantumResistance: securityMetrics?.quantumResistance ?? 0,
          activeThreats: securityMetrics?.activeThreats ?? 0,
        },
      ];
      const response = await analyzeSecurityThreats(threats);
      addMessage('assistant', response, true);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'خطأ في التحليل';
      addMessage('assistant', `❌ **خطأ في التحليل الأمني:** ${errMsg}`);
    } finally {
      setIsLoading(false);
      setActiveAnalysis(null);
    }
  };

  const handleQuantumAnalysis = async (): Promise<void> => {
    if (isLoading) return;
    setActiveAnalysis('quantum');
    addMessage('user', '⚛️ تحليل أداء المعالجات الكمية');
    setIsLoading(true);

    try {
      const qData = (quantumStates ?? []).map(q => ({
        name: q.name,
        status: q.status,
        qubits: q.qubits,
        coherenceTime: q.coherenceTime,
        fidelity: q.fidelity,
        gateErrors: q.gateErrors,
        temperature: q.temperature,
      }));
      const response = await analyzeQuantumPerformance(qData);
      addMessage('assistant', response, true);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'خطأ في التحليل';
      addMessage('assistant', `❌ **خطأ في التحليل الكمي:** ${errMsg}`);
    } finally {
      setIsLoading(false);
      setActiveAnalysis(null);
    }
  };

  const handleCopy = async (text: string, id: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = (): void => {
    setMessages([messages[0] as Message]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatContent = (content: string): React.ReactNode => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className='text-blue-300 font-semibold'>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  if (!apiConfigured) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/30 max-w-md'>
          <AlertCircle className='w-16 h-16 text-yellow-400 mx-auto mb-4' />
          <h3 className='text-xl font-bold text-white mb-3'>مفتاح API غير مُعدّ</h3>
          <p className='text-gray-300 mb-4'>
            لتفعيل التحليل بالذكاء الاصطناعي، أضف مفتاح Groq API في ملف{' '}
            <code className='bg-gray-700 px-2 py-1 rounded text-blue-300'>.env</code>
          </p>
          <div className='bg-gray-900/80 rounded-lg p-4 text-left direction-ltr'>
            <code className='text-green-400 text-sm'>VITE_OPENAI_API_KEY=gsk_your_key_here</code>
          </div>
          <p className='text-gray-400 text-sm mt-4'>
            احصل على مفتاح مجاني من <span className='text-blue-400'>console.groq.com</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* أزرار التحليل السريع */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSystemAnalysis}
          disabled={isLoading}
          className='flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600/20 to-blue-500/10 border border-blue-500/30 rounded-xl hover:border-blue-400/50 transition-all disabled:opacity-50'
        >
          <div className='w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center'>
            <BarChart3
              className={`w-6 h-6 text-blue-400 ${activeAnalysis === 'system' ? 'animate-pulse' : ''}`}
            />
          </div>
          <div className='text-right'>
            <h4 className='font-semibold text-white'>تحليل النظام</h4>
            <p className='text-sm text-gray-400'>تحليل شامل للأداء</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSecurityAnalysis}
          disabled={isLoading}
          className='flex items-center gap-3 p-4 bg-gradient-to-r from-green-600/20 to-green-500/10 border border-green-500/30 rounded-xl hover:border-green-400/50 transition-all disabled:opacity-50'
        >
          <div className='w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center'>
            <Shield
              className={`w-6 h-6 text-green-400 ${activeAnalysis === 'security' ? 'animate-pulse' : ''}`}
            />
          </div>
          <div className='text-right'>
            <h4 className='font-semibold text-white'>تحليل الأمان</h4>
            <p className='text-sm text-gray-400'>فحص التهديدات والمخاطر</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleQuantumAnalysis}
          disabled={isLoading}
          className='flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600/20 to-purple-500/10 border border-purple-500/30 rounded-xl hover:border-purple-400/50 transition-all disabled:opacity-50'
        >
          <div className='w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center'>
            <Atom
              className={`w-6 h-6 text-purple-400 ${activeAnalysis === 'quantum' ? 'animate-pulse' : ''}`}
            />
          </div>
          <div className='text-right'>
            <h4 className='font-semibold text-white'>تحليل كمي</h4>
            <p className='text-sm text-gray-400'>أداء المعالجات الكمية</p>
          </div>
        </motion.button>
      </div>

      {/* منطقة المحادثة */}
      <div
        className='bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 flex flex-col'
        style={{ height: '500px' }}
      >
        {/* رأس المحادثة */}
        <div className='flex items-center justify-between p-4 border-b border-gray-700'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
              <Brain className='w-5 h-5 text-white' />
            </div>
            <div>
              <h3 className='font-semibold text-white'>المحلل الذكي</h3>
              <div className='flex items-center gap-2'>
                <div
                  className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}
                />
                <span className='text-xs text-gray-400'>
                  {isLoading ? 'جاري التحليل...' : 'جاهز للتحليل'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className='p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white'
            title='مسح المحادثة'
          >
            <Trash2 className='w-5 h-5' />
          </button>
        </div>

        {/* الرسائل */}
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          <AnimatePresence>
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className='w-4 h-4 text-white' />
                  ) : (
                    <Bot className='w-4 h-4 text-white' />
                  )}
                </div>

                <div
                  className={`max-w-[80%] rounded-xl p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600/20 border border-blue-500/30'
                      : message.isAnalysis
                        ? 'bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-purple-500/20'
                        : 'bg-gray-700/50 border border-gray-600/30'
                  }`}
                >
                  {message.isAnalysis && (
                    <div className='flex items-center gap-2 mb-2 text-purple-400 text-xs'>
                      <FileSearch className='w-3 h-3' />
                      <span>تقرير تحليلي</span>
                    </div>
                  )}
                  <div className='text-sm leading-relaxed whitespace-pre-wrap'>
                    {formatContent(message.content)}
                  </div>
                  <div className='flex items-center justify-between mt-2'>
                    <span className='text-xs text-gray-500'>
                      {message.timestamp.toLocaleTimeString('ar-SA')}
                    </span>
                    {message.role === 'assistant' && message.id !== '1' && (
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className='text-gray-500 hover:text-gray-300 transition-colors'
                        title='نسخ'
                      >
                        {copiedId === message.id ? (
                          <Check className='w-4 h-4 text-green-400' />
                        ) : (
                          <Copy className='w-4 h-4' />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex gap-3'>
              <div className='w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center'>
                <Bot className='w-4 h-4 text-white' />
              </div>
              <div className='bg-gray-700/50 border border-gray-600/30 rounded-xl p-4'>
                <div className='flex items-center gap-3'>
                  <Loader2 className='w-5 h-5 animate-spin text-blue-400' />
                  <span className='text-sm text-gray-300'>جاري التحليل بالذكاء الاصطناعي...</span>
                  <Sparkles className='w-4 h-4 text-yellow-400 animate-pulse' />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* حقل الإدخال */}
        <div className='p-4 border-t border-gray-700'>
          <div className='flex gap-3 items-end'>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='اكتب سؤالك أو طلب التحليل...'
              rows={1}
              className='flex-1 bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-sm'
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className='p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <Loader2 className='w-5 h-5 animate-spin text-white' />
              ) : (
                <Send className='w-5 h-5 text-white' />
              )}
            </motion.button>
          </div>
          <p className='text-xs text-gray-500 mt-2 text-center'>
            مدعوم بـ Groq AI • نموذج Llama 3.3 70B
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisDashboard;
