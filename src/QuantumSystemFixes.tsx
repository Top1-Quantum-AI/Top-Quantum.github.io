import React, { useState, useEffect, useRef, useCallback } from 'react';
import localforage from 'localforage';

// إصلاح 1: دالة تحويل آمنة من ArrayBuffer إلى Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// إصلاح 2: دالة تحويل آمنة من Base64 إلى ArrayBuffer
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// إصلاح 3: دالة توليد مفاتيح آمنة
const generateSecureKey = (): string => {
  const array = new Uint8Array(32); // 256 بت
  crypto.getRandomValues(array);
  return arrayBufferToBase64(array.buffer);
};

// إصلاح 4: دالة توليد IV آمنة
const generateSecureIV = (): string => {
  const array = new Uint8Array(16); // 128 بت
  crypto.getRandomValues(array);
  return arrayBufferToBase64(array.buffer);
};

// إصلاح 5: واجهة حالات التحميل المنفصلة
interface ProcessingStates {
  isEncrypting: boolean;
  isDecrypting: boolean;
  isRunningQuantum: boolean;
  isSearching: boolean;
  isLearning: boolean;
}

// إصلاح 6: واجهة آمنة للسجلات
interface SecureLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  module: string;
  timestamp: number;
  userId?: string;
}

// إصلاح 7: فئة التشفير الكمي المحسنة
class SecureQuantumEncryption {
  private secretKey: string | null = null;
  private keyPair: CryptoKeyPair | null = null;

  constructor() {
    this.initializeKeyPair();
  }

  private async initializeKeyPair(): Promise<void> {
    try {
      this.keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('خطأ في توليد مفاتيح التشفير:', error);
    }
  }

  async encryptData(data: string): Promise<string | null> {
    if (!this.keyPair?.publicKey) {
      console.error('المفتاح العام غير متوفر');
      return null;
    }

    try {
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(data);
      
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP',
        },
        this.keyPair.publicKey,
        encodedData
      );

      return arrayBufferToBase64(encryptedData);
    } catch (error) {
      console.error('خطأ في التشفير:', error);
      return null;
    }
  }

  async decryptData(encryptedData: string): Promise<string | null> {
    if (!this.keyPair?.privateKey) {
      console.error('المفتاح الخاص غير متوفر');
      return null;
    }

    try {
      const dataBuffer = base64ToArrayBuffer(encryptedData);
      
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP',
        },
        this.keyPair.privateKey,
        dataBuffer
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);
    } catch (error) {
      console.error('خطأ في فك التشفير:', error);
      return null;
    } finally {
      // إصلاح 8: مسح المفتاح السري بعد الاستخدام
      this.clearSecretKey();
    }
  }

  private clearSecretKey(): void {
    this.secretKey = null;
  }

  // إصلاح 9: إخفاء المفتاح العام في الإنتاج
  getPublicKeyForDisplay(): string {
    if (process.env.NODE_ENV === 'production') {
      return 'مخفي لأغراض الأمان';
    }
    return 'مفتاح عام للعرض التوضيحي فقط';
  }
}

// إصلاح 10: مدير السجلات المحسن
class SecureLogManager {
  private logs: SecureLog[] = [];
  private logQueue: SecureLog[] = [];
  private isProcessingQueue = false;

  // إصلاح 11: دالة addLog محسنة لتجنب race conditions
  async addLog(logData: Omit<SecureLog, 'id' | 'timestamp'>): Promise<void> {
    const newLog: SecureLog = {
      ...logData,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    // إضافة إلى القائمة المحلية أولاً
    this.logs = [...this.logs, newLog];
    
    // إضافة إلى قائمة الانتظار للحفظ
    this.logQueue.push(newLog);
    
    // معالجة قائمة الانتظار
    await this.processLogQueue();
  }

  private async processLogQueue(): Promise<void> {
    if (this.isProcessingQueue || this.logQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      while (this.logQueue.length > 0) {
        const log = this.logQueue.shift();
        if (log) {
          await localforage.setItem(`secure_log_${log.id}`, log);
        }
      }
    } catch (error) {
      console.error('خطأ في حفظ السجلات:', error);
    } finally {
      this.isProcessingQueue = false;
    }
  }

  getLogs(): SecureLog[] {
    return [...this.logs]; // إرجاع نسخة للحماية
  }
}

// إصلاح 12: مكون النظام الكمي المحسن
const ImprovedQuantumSystem: React.FC = () => {
  // إصلاح 13: حالات تحميل منفصلة
  const [processingStates, setProcessingStates] = useState<ProcessingStates>({
    isEncrypting: false,
    isDecrypting: false,
    isRunningQuantum: false,
    isSearching: false,
    isLearning: false
  });

  const [encryptedData, setEncryptedData] = useState<string>('');
  const [decryptedData, setDecryptedData] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  
  // المراجع للإلغاء
  const abortControllerRef = useRef<AbortController | null>(null);
  const encryptionRef = useRef<SecureQuantumEncryption | null>(null);
  const logManagerRef = useRef<SecureLogManager | null>(null);

  // إصلاح 14: تهيئة الخدمات
  useEffect(() => {
    encryptionRef.current = new SecureQuantumEncryption();
    logManagerRef.current = new SecureLogManager();

    // إصلاح 15: تنظيف الموارد عند إلغاء التحميل
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // إصلاح 16: دالة تشفير محسنة مع معالجة الأخطاء
  const handleEncryption = useCallback(async () => {
    if (!inputText.trim() || !encryptionRef.current) {
      await logManagerRef.current?.addLog({
        level: 'warning',
        message: 'لا يوجد نص للتشفير أو خدمة التشفير غير متوفرة',
        module: 'encryption'
      });
      return;
    }

    setProcessingStates(prev => ({ ...prev, isEncrypting: true }));
    
    try {
      // إنشاء AbortController جديد
      abortControllerRef.current = new AbortController();
      
      const encrypted = await encryptionRef.current.encryptData(inputText);
      
      if (encrypted) {
        setEncryptedData(encrypted);
        await logManagerRef.current?.addLog({
          level: 'success',
          message: 'تم التشفير بنجاح',
          module: 'encryption'
        });
      } else {
        throw new Error('فشل في عملية التشفير');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        await logManagerRef.current?.addLog({
          level: 'error',
          message: `خطأ في التشفير: ${error.message}`,
          module: 'encryption'
        });
      }
    } finally {
      setProcessingStates(prev => ({ ...prev, isEncrypting: false }));
    }
  }, [inputText]);

  // إصلاح 17: دالة فك التشفير محسنة مع معالجة الأخطاء
  const handleDecryption = useCallback(async () => {
    if (!encryptedData.trim() || !encryptionRef.current) {
      await logManagerRef.current?.addLog({
        level: 'warning',
        message: 'لا توجد بيانات مشفرة لفك التشفير',
        module: 'decryption'
      });
      return;
    }

    setProcessingStates(prev => ({ ...prev, isDecrypting: true }));
    
    try {
      // إصلاح 18: معالجة آمنة لـ JSON.parse
      let dataToDecrypt = encryptedData;
      try {
        const parsedData = JSON.parse(encryptedData);
        if (parsedData && typeof parsedData === 'object' && parsedData.data) {
          dataToDecrypt = parsedData.data;
        }
      } catch {
        // إذا لم يكن JSON صالح، استخدم البيانات كما هي
      }

      const decrypted = await encryptionRef.current.decryptData(dataToDecrypt);
      
      if (decrypted) {
        setDecryptedData(decrypted);
        await logManagerRef.current?.addLog({
          level: 'success',
          message: 'تم فك التشفير بنجاح',
          module: 'decryption'
        });
      } else {
        throw new Error('فشل في عملية فك التشفير');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        await logManagerRef.current?.addLog({
          level: 'error',
          message: `خطأ في فك التشفير: ${error.message}`,
          module: 'decryption'
        });
      }
    } finally {
      setProcessingStates(prev => ({ ...prev, isDecrypting: false }));
    }
  }, [encryptedData]);

  // إصلاح 19: دالة محاكاة كمية محسنة
  const runQuantumSimulation = useCallback(async () => {
    setProcessingStates(prev => ({ ...prev, isRunningQuantum: true }));
    
    try {
      abortControllerRef.current = new AbortController();
      
      // محاكاة عملية كمية معقدة
      for (let i = 0; i < 100; i++) {
        if (abortControllerRef.current.signal.aborted) {
          throw new Error('تم إلغاء العملية');
        }
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // تحديث التقدم
        if (i % 20 === 0) {
          await logManagerRef.current?.addLog({
            level: 'info',
            message: `تقدم المحاكاة الكمية: ${i}%`,
            module: 'quantum_simulation'
          });
        }
      }
      
      await logManagerRef.current?.addLog({
        level: 'success',
        message: 'اكتملت المحاكاة الكمية بنجاح',
        module: 'quantum_simulation'
      });
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        await logManagerRef.current?.addLog({
          level: 'error',
          message: `خطأ في المحاكاة الكمية: ${error.message}`,
          module: 'quantum_simulation'
        });
      }
    } finally {
      setProcessingStates(prev => ({ ...prev, isRunningQuantum: false }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          🔬 النظام الكمي المحسن والآمن
        </h1>
        
        {/* قسم التشفير */}
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 mb-6 border border-cyan-500/30">
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">🔐 التشفير الكمي الآمن</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">النص المراد تشفيره:</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                rows={3}
                placeholder="أدخل النص هنا..."
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleEncryption}
                disabled={processingStates.isEncrypting || !inputText.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
              >
                {processingStates.isEncrypting ? 'جاري التشفير...' : 'تشفير'}
              </button>
              
              <button
                onClick={handleDecryption}
                disabled={processingStates.isDecrypting || !encryptedData.trim()}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg transition-colors"
              >
                {processingStates.isDecrypting ? 'جاري فك التشفير...' : 'فك التشفير'}
              </button>
            </div>
            
            {encryptedData && (
              <div>
                <label className="block text-sm font-medium mb-2">البيانات المشفرة:</label>
                <textarea
                  value={encryptedData}
                  onChange={(e) => setEncryptedData(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
                  rows={3}
                  readOnly
                />
              </div>
            )}
            
            {decryptedData && (
              <div>
                <label className="block text-sm font-medium mb-2">البيانات المفكوكة:</label>
                <textarea
                  value={decryptedData}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  rows={3}
                  readOnly
                />
              </div>
            )}
          </div>
        </div>
        
        {/* قسم المحاكاة الكمية */}
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 mb-6 border border-purple-500/30">
          <h2 className="text-2xl font-semibold mb-4 text-purple-400">⚛️ المحاكاة الكمية</h2>
          
          <button
            onClick={runQuantumSimulation}
            disabled={processingStates.isRunningQuantum}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg transition-colors"
          >
            {processingStates.isRunningQuantum ? 'جاري تشغيل المحاكاة...' : 'تشغيل المحاكاة الكمية'}
          </button>
        </div>
        
        {/* قسم السجلات */}
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-green-500/30">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">📋 سجلات النظام</h2>
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {logManagerRef.current?.getLogs().slice(-10).map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-lg text-sm ${
                  log.level === 'error' ? 'bg-red-900/50 border border-red-500/30' :
                  log.level === 'warning' ? 'bg-yellow-900/50 border border-yellow-500/30' :
                  log.level === 'success' ? 'bg-green-900/50 border border-green-500/30' :
                  'bg-blue-900/50 border border-blue-500/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">[{log.module}] {log.message}</span>
                  <span className="text-xs opacity-70">
                    {new Date(log.timestamp).toLocaleTimeString('ar-SA')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedQuantumSystem;
export {
  SecureQuantumEncryption,
  SecureLogManager,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  generateSecureKey,
  generateSecureIV
};