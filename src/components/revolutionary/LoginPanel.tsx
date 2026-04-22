import React from 'react';

interface LoginPanelProps {
  loginUsername: string;
  setLoginUsername: (v: string) => void;
  loginPassword: string;
  setLoginPassword: (v: string) => void;
  loginError: string;
  onLogin: () => void;
}

const LoginPanel: React.FC<LoginPanelProps> = ({
  loginUsername,
  setLoginUsername,
  loginPassword,
  setLoginPassword,
  loginError,
  onLogin,
}) => {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      {/* خلفية كمية متحركة */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/50 to-blue-900/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,0,150,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,255,255,0.2),transparent_50%)]" />
      </div>
      
      {/* جسيمات كمية متحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`,
              transform: `scale(${0.5 + Math.random() * 1.5})`,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 10px currentColor'
            }}
          />
        ))}
      </div>
      
      {/* شبكة كمية متحركة */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="quantumGrid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="url(#quantumGradient)" strokeWidth="0.1"/>
            </pattern>
            <linearGradient id="quantumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0.5"/>
              <stop offset="50%" stopColor="#ff00ff" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#ffff00" stopOpacity="0.5"/>
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#quantumGrid)"/>
        </svg>
      </div>
      
      {/* حاوي تسجيل الدخول الرئيسي */}
      <div className="relative z-10 w-full max-w-lg">
        {/* هالة كمية متوهجة */}
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-xl animate-pulse" />
        
        {/* الحاوي الرئيسي */}
        <div className="relative bg-black/80 backdrop-blur-2xl rounded-3xl p-10 border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* تأثير الضوء المتحرك */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-pink-400 to-transparent animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent animate-pulse" style={{animationDelay: '3s'}} />
          
          {/* العنوان الرئيسي */}
          <div className="text-center mb-10">
            {/* أيقونة كمية متحركة */}
            <div className="relative mb-6">
              <div className="text-8xl animate-spin" style={{animationDuration: '20s'}}>⚛️</div>
              <div className="absolute inset-0 text-8xl animate-ping opacity-30">💫</div>
              <div className="absolute inset-0 text-8xl animate-pulse opacity-50" style={{animationDelay: '1s'}}>🌌</div>
            </div>
            
            {/* العنوان مع تأثير الكتابة */}
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              النظام الكمي الثوري
            </h1>
            <h2 className="text-xl text-gray-300 mb-2 font-light tracking-wide">
              Revolutionary Quantum System
            </h2>
            <div className="text-sm text-gray-500 font-mono">
              🔐 نظام الدخول الآمن المتقدم
            </div>
          </div>
          
          {/* نموذج تسجيل الدخول */}
          <div className="space-y-8">
            {/* حقل اسم المستخدم */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-300 mb-3 group-hover:text-cyan-400 transition-colors">
                🧑‍💻 اسم المستخدم
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-900/50 border-2 border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                  placeholder="أدخل اسم المستخدم الكمي"
                  onKeyPress={(e) => e.key === 'Enter' && onLogin()}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 opacity-50">
                  ⚡
                </div>
              </div>
            </div>
            
            {/* حقل كلمة السر */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-300 mb-3 group-hover:text-purple-400 transition-colors">
                🔑 كلمة السر الكمية
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-900/50 border-2 border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 backdrop-blur-sm"
                  placeholder="أدخل كلمة السر الآمنة"
                  onKeyPress={(e) => e.key === 'Enter' && onLogin()}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 opacity-50">
                  🛡️
                </div>
              </div>
            </div>
            
            {/* رسالة الخطأ */}
            {loginError && (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl blur" />
                <div className="relative text-red-400 text-sm text-center bg-red-900/30 p-4 rounded-2xl border border-red-500/30 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="animate-bounce">⚠️</span>
                    <span>{loginError}</span>
                    <span className="animate-bounce" style={{animationDelay: '0.5s'}}>⚠️</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* زر تسجيل الدخول */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity" />
              <button
                onClick={onLogin}
                className="relative w-full px-8 py-5 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-500 hover:via-purple-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="animate-pulse">🚀</span>
                  <span>دخول النظام الثوري</span>
                  <span className="animate-pulse" style={{animationDelay: '0.5s'}}>⚡</span>
                </div>
              </button>
            </div>
            
            {/* معلومات إضافية */}
             <div className="text-center space-y-3">
               <div className="text-xs text-gray-500 font-mono">
                 🔬 نظام الأمان الكمي المتقدم
               </div>
               <div className="text-xs text-gray-600">
                 تشفير كمي • حماية متعددة الطبقات • ذكاء اصطناعي
               </div>
               
               {/* اسم المخترع بتصميم إبداعي */}
               <div className="relative mt-6 p-4 bg-gradient-to-r from-gray-900/50 via-purple-900/30 to-gray-900/50 rounded-2xl border border-gray-700/30">
                 <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl blur opacity-50 animate-pulse" />
                 <div className="relative">
                   <div className="text-xs text-gray-400 mb-2 font-mono tracking-wider">
                     🧬 QUANTUM INVENTOR
                   </div>
                   <div className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                     عبدالعزيز بن سلطان العتيبي
                   </div>
                   <div className="text-sm text-gray-300 font-light mt-1 tracking-wide">
                     Abdulaziz bin Sultan Al-Otaibi
                   </div>
                   <div className="flex justify-center items-center mt-3 space-x-2">
                     <span className="text-yellow-400 animate-spin" style={{animationDuration: '3s'}}>⚛️</span>
                     <span className="text-xs text-gray-500 font-mono">QUANTUM ARCHITECT</span>
                     <span className="text-cyan-400 animate-pulse">🔬</span>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* تأثيرات إضافية */}
      <div className="absolute bottom-10 left-10 text-6xl animate-bounce opacity-30" style={{animationDuration: '3s'}}>🌟</div>
      <div className="absolute top-10 right-10 text-4xl animate-spin opacity-20" style={{animationDuration: '15s'}}>🔮</div>
      <div className="absolute top-1/2 left-10 text-3xl animate-pulse opacity-25">💎</div>
      <div className="absolute bottom-1/3 right-20 text-5xl animate-bounce opacity-20" style={{animationDuration: '4s', animationDelay: '1s'}}>✨</div>
    </div>
  );
};

export default LoginPanel;
