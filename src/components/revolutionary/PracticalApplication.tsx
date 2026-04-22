import React from 'react';

interface PracticalApplicationProps {
  printToPDF: (cardTitle: string, cardData?: Record<string, unknown>) => void;
}

const PracticalApplication: React.FC<PracticalApplicationProps> = ({ printToPDF }) => {
  return (
    <div className='space-y-6'>
      <div className='text-center mb-8'>
        <h2 className='text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent'>
          🎯 التطبيق الكمي العملي
        </h2>
        <p className='text-gray-300 text-lg'>
          تطبيقات الحوسبة الكمية في العالم الحقيقي والحلول العملية
        </p>
      </div>

      {/* شريط البحث والتنقل التفاعلي */}
      <div className='quantum-card hologram bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6'>
        <div className='flex flex-col md:flex-row gap-4 mb-6'>
          <div className='flex-1'>
            <div className='relative'>
              <input
                type='text'
                placeholder='🔍 ابحث في التطبيقات الكمية...'
                className='w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20'
              />
              <div className='absolute right-3 top-3 text-cyan-400'>
                <span className='animate-pulse'>⚡</span>
              </div>
            </div>
          </div>
          <div className='flex gap-2'>
            <button className='px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-all duration-300 glow-text'>
              🔬 محاكاة
            </button>
            <button className='px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-600/30 transition-all duration-300 glow-text'>
              📊 تحليل
            </button>
            <button className='px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-all duration-300 glow-text'>
              🚀 تشغيل
            </button>
          </div>
        </div>

        {/* التنقل السريع */}
        <div className='flex flex-wrap gap-2 mb-4'>
          {[
            'التشفير الكمي',
            'محاكاة الجزيئات',
            'تحسين الطاقة',
            'الخوارزميات',
            'التطبيقات الصناعية',
          ].map((category, index) => (
            <button
              key={index}
              className='px-3 py-1 text-sm bg-gray-700/50 border border-gray-600 rounded-full text-gray-300 hover:bg-cyan-600/20 hover:border-cyan-500/50 hover:text-cyan-300 transition-all duration-300'
              onClick={() => {
                const element = document.getElementById(`section-${index}`);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* التطبيقات العملية الرئيسية */}
      <div id='section-0' className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        <div className='quantum-card quantum-energy bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-300'>
              <span className='text-2xl animate-pulse'>🔐</span>
            </div>
            <div className='text-green-400 text-sm font-bold animate-pulse'>نشط</div>
          </div>
          <h3 className='text-lg font-bold text-blue-300 mb-2 glow-text'>التشفير الكمي</h3>
          <p className='text-gray-300 text-sm mb-4'>
            حماية البيانات باستخدام مبادئ الفيزياء الكمية
          </p>
          <div className='space-y-2 text-xs mb-4'>
            <div className='flex justify-between'>
              <span className='text-gray-400'>قوة التشفير:</span>
              <span className='text-cyan-400 glow-text'>2048-bit Quantum</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>مقاومة الكسر:</span>
              <span className='text-green-400 glow-text'>∞ سنة</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>معدل التشفير:</span>
              <span className='text-blue-400 glow-text'>
                {Math.floor(Math.random() * 1000 + 500)} MB/s
              </span>
            </div>
          </div>
          <div className='flex gap-2'>
            <button className='flex-1 px-3 py-1 bg-blue-600/30 border border-blue-500/50 rounded text-xs text-blue-300 hover:bg-blue-600/50 transition-all duration-300'>
              🔬 محاكاة
            </button>
            <button className='flex-1 px-3 py-1 bg-cyan-600/30 border border-cyan-500/50 rounded text-xs text-cyan-300 hover:bg-cyan-600/50 transition-all duration-300'>
              📊 تحليل
            </button>
            <button
              onClick={() => printToPDF('التشفير الكمي')}
              className='px-2 py-1 bg-gray-600/30 border border-gray-500/50 rounded text-xs text-gray-300 hover:bg-gray-600/50 transition-all duration-300'
            >
              📄 PDF
            </button>
          </div>
        </div>

        <div
          id='section-1'
          className='quantum-card quantum-security bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group'
        >
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-300'>
              <span className='text-2xl animate-spin' style={{ animationDuration: '3s' }}>
                🧬
              </span>
            </div>
            <div className='text-green-400 text-sm font-bold animate-pulse'>نشط</div>
          </div>
          <h3 className='text-lg font-bold text-purple-300 mb-2 glow-text'>محاكاة الجزيئات</h3>
          <p className='text-gray-300 text-sm mb-4'>تطوير الأدوية والمواد الجديدة</p>
          <div className='space-y-2 text-xs mb-4'>
            <div className='flex justify-between'>
              <span className='text-gray-400'>الجزيئات المحاكاة:</span>
              <span className='text-pink-400 glow-text'>
                {1247 + Math.floor(Math.random() * 100)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>دقة المحاكاة:</span>
              <span className='text-green-400 glow-text'>
                {(99.7 + Math.random() * 0.2).toFixed(1)}%
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>وقت المحاكاة:</span>
              <span className='text-purple-400 glow-text'>
                {Math.floor(Math.random() * 60 + 10)} ثانية
              </span>
            </div>
          </div>
          <div className='flex gap-2'>
            <button className='flex-1 px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded text-xs text-purple-300 hover:bg-purple-600/50 transition-all duration-300'>
              🔬 محاكاة
            </button>
            <button className='flex-1 px-3 py-1 bg-pink-600/30 border border-pink-500/50 rounded text-xs text-pink-300 hover:bg-pink-600/50 transition-all duration-300'>
              📊 تحليل
            </button>
            <button
              onClick={() => printToPDF('محاكاة الجزيئات')}
              className='px-2 py-1 bg-gray-600/30 border border-gray-500/50 rounded text-xs text-gray-300 hover:bg-gray-600/50 transition-all duration-300'
            >
              📄 PDF
            </button>
          </div>
        </div>

        <div
          id='section-2'
          className='quantum-card quantum-entangled bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group'
        >
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-all duration-300'>
              <span className='text-2xl animate-bounce'>⚡</span>
            </div>
            <div className='text-green-400 text-sm font-bold animate-pulse'>نشط</div>
          </div>
          <h3 className='text-lg font-bold text-green-300 mb-2 glow-text'>تحسين الطاقة</h3>
          <p className='text-gray-300 text-sm mb-4'>تحسين شبكات الطاقة والتوزيع الذكي</p>
          <div className='space-y-2 text-xs mb-4'>
            <div className='flex justify-between'>
              <span className='text-gray-400'>توفير الطاقة:</span>
              <span className='text-emerald-400 glow-text'>
                {(34.2 + Math.random() * 5).toFixed(1)}%
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>كفاءة الشبكة:</span>
              <span className='text-green-400 glow-text'>
                {(97.8 + Math.random() * 1.5).toFixed(1)}%
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>استهلاك الطاقة:</span>
              <span className='text-emerald-400 glow-text'>
                {Math.floor(Math.random() * 500 + 200)} kW
              </span>
            </div>
          </div>
          <div className='flex gap-2'>
            <button className='flex-1 px-3 py-1 bg-green-600/30 border border-green-500/50 rounded text-xs text-green-300 hover:bg-green-600/50 transition-all duration-300'>
              🔬 محاكاة
            </button>
            <button className='flex-1 px-3 py-1 bg-emerald-600/30 border border-emerald-500/50 rounded text-xs text-emerald-300 hover:bg-emerald-600/50 transition-all duration-300'>
              📊 تحليل
            </button>
            <button
              onClick={() => printToPDF('تحسين الطاقة')}
              className='px-2 py-1 bg-gray-600/30 border border-gray-500/50 rounded text-xs text-gray-300 hover:bg-gray-600/50 transition-all duration-300'
            >
              📄 PDF
            </button>
          </div>
        </div>
      </div>

      {/* الخوارزميات الكمية العملية */}
      <div className='quantum-card hologram bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6'>
        <h3 className='text-xl font-semibold mb-4 text-gray-200 glow-text flex items-center'>
          <span className='quantum-icon mr-2'>🔬</span>
          الخوارزميات الكمية العملية
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div className='quantum-card bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='font-bold text-blue-300 glow-text'>خوارزمية Grover للبحث</h4>
                <div className='w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-300'>
                  <span className='text-lg animate-spin'>🔍</span>
                </div>
              </div>
              <p className='text-gray-300 text-sm mb-3'>
                البحث في قواعد البيانات الضخمة بسرعة كمية
              </p>
              <div className='space-y-2 text-xs mb-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>التسارع الكمي:</span>
                  <span className='text-cyan-400 glow-text'>√N مقابل N</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>حالة التنفيذ:</span>
                  <span className='text-green-400 glow-text animate-pulse'>جاهز للاستخدام</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>سرعة البحث:</span>
                  <span className='text-blue-400 glow-text'>
                    {Math.floor(Math.random() * 1000 + 500)} ops/s
                  </span>
                </div>
              </div>
              <div className='flex gap-2'>
                <button className='flex-1 px-3 py-1 bg-blue-600/30 border border-blue-500/50 rounded text-xs text-blue-300 hover:bg-blue-600/50 transition-all duration-300'>
                  🚀 تشغيل
                </button>
                <button className='flex-1 px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded text-xs text-purple-300 hover:bg-purple-600/50 transition-all duration-300'>
                  📈 تحليل
                </button>
                <button
                  onClick={() => printToPDF('خوارزمية Grover للبحث')}
                  className='px-2 py-1 bg-gray-600/30 border border-gray-500/50 rounded text-xs text-gray-300 hover:bg-gray-600/50 transition-all duration-300'
                >
                  📄 PDF
                </button>
              </div>
            </div>

            <div className='quantum-card bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-4 rounded-lg border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='font-bold text-green-300 glow-text'>خوارزمية Shor للتحليل</h4>
                <div className='w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-all duration-300'>
                  <span className='text-lg animate-pulse'>🔐</span>
                </div>
              </div>
              <p className='text-gray-300 text-sm mb-3'>
                تحليل الأعداد الكبيرة وكسر التشفير التقليدي
              </p>
              <div className='space-y-2 text-xs mb-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>التعقيد:</span>
                  <span className='text-emerald-400 glow-text'>O((log N)³)</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>التهديد للتشفير:</span>
                  <span className='text-red-400 glow-text animate-pulse'>عالي جداً</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>معدل التحليل:</span>
                  <span className='text-green-400 glow-text'>
                    {Math.floor(Math.random() * 50 + 10)} bits/min
                  </span>
                </div>
              </div>
              <div className='flex gap-2'>
                <button className='flex-1 px-3 py-1 bg-green-600/30 border border-green-500/50 rounded text-xs text-green-300 hover:bg-green-600/50 transition-all duration-300'>
                  🔬 محاكاة
                </button>
                <button className='flex-1 px-3 py-1 bg-emerald-600/30 border border-emerald-500/50 rounded text-xs text-emerald-300 hover:bg-emerald-600/50 transition-all duration-300'>
                  ⚠️ تحذير
                </button>
                <button
                  onClick={() => printToPDF('خوارزمية Shor للتحليل')}
                  className='px-2 py-1 bg-gray-600/30 border border-gray-500/50 rounded text-xs text-gray-300 hover:bg-gray-600/50 transition-all duration-300'
                >
                  📄 PDF
                </button>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='quantum-card bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='font-bold text-purple-300 glow-text'>QAOA للتحسين</h4>
                <div className='w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-300'>
                  <span className='text-lg animate-bounce'>📊</span>
                </div>
              </div>
              <p className='text-gray-300 text-sm mb-3'>حل مسائل التحسين المعقدة في الصناعة</p>
              <div className='space-y-2 text-xs mb-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>التطبيقات:</span>
                  <span className='text-pink-400 glow-text'>اللوجستيات، المالية</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>تحسين الحلول:</span>
                  <span className='text-green-400 glow-text'>
                    {(45 + Math.random() * 10).toFixed(1)}% أفضل
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>سرعة التحسين:</span>
                  <span className='text-purple-400 glow-text'>
                    {Math.floor(Math.random() * 100 + 50)} iter/s
                  </span>
                </div>
              </div>
              <div className='flex gap-2'>
                <button className='flex-1 px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded text-xs text-purple-300 hover:bg-purple-600/50 transition-all duration-300'>
                  🎯 تحسين
                </button>
                <button className='flex-1 px-3 py-1 bg-pink-600/30 border border-pink-500/50 rounded text-xs text-pink-300 hover:bg-pink-600/50 transition-all duration-300'>
                  📈 نتائج
                </button>
                <button
                  onClick={() => printToPDF('QAOA للتحسين')}
                  className='px-2 py-1 bg-gray-600/30 border border-gray-500/50 rounded text-xs text-gray-300 hover:bg-gray-600/50 transition-all duration-300'
                >
                  📄 PDF
                </button>
              </div>
            </div>

            <div className='quantum-card bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-4 rounded-lg border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='font-bold text-yellow-300 glow-text'>VQE للكيمياء</h4>
                <div className='w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30 transition-all duration-300'>
                  <span className='text-lg animate-pulse'>⚗️</span>
                </div>
              </div>
              <p className='text-gray-300 text-sm mb-3'>حساب طاقة الحالة الأساسية للجزيئات</p>
              <div className='space-y-2 text-xs mb-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>دقة الحساب:</span>
                  <span className='text-orange-400 glow-text'>Chemical Accuracy</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>تطوير الأدوية:</span>
                  <span className='text-green-400 glow-text'>
                    تسريع {Math.floor(Math.random() * 5 + 8)}x
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>طاقة الجزيء:</span>
                  <span className='text-yellow-400 glow-text'>
                    {(Math.random() * 10 - 5).toFixed(3)} Ha
                  </span>
                </div>
              </div>
              <div className='flex gap-2'>
                <button className='flex-1 px-3 py-1 bg-yellow-600/30 border border-yellow-500/50 rounded text-xs text-yellow-300 hover:bg-yellow-600/50 transition-all duration-300'>
                  🧪 حساب
                </button>
                <button className='flex-1 px-3 py-1 bg-orange-600/30 border border-orange-500/50 rounded text-xs text-orange-300 hover:bg-orange-600/50 transition-all duration-300'>
                  💊 دواء
                </button>
                <button
                  onClick={() => printToPDF('VQE للكيمياء')}
                  className='px-2 py-1 bg-gray-600/30 border border-gray-500/50 rounded text-xs text-gray-300 hover:bg-gray-600/50 transition-all duration-300'
                >
                  📄 PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الحالات الاستخدام الصناعية */}
      <div className='quantum-card hologram bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700'>
        <h3 className='text-xl font-semibold mb-4 text-gray-200 glow-text flex items-center'>
          <span className='quantum-icon mr-2'>🏭</span>
          الحالات الاستخدام الصناعية
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='quantum-card bg-gradient-to-br from-indigo-600/20 to-blue-600/20 p-4 rounded-lg border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300 group'>
            <div className='text-center mb-3'>
              <div className='w-12 h-12 mx-auto bg-indigo-500/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-indigo-500/30 transition-all duration-300'>
                <span className='text-2xl animate-pulse'>🏦</span>
              </div>
              <h4 className='font-bold text-indigo-300 glow-text'>الخدمات المصرفية</h4>
            </div>
            <ul className='text-xs text-gray-300 space-y-1 mb-3'>
              <li>• تحليل المخاطر الكمي</li>
              <li>• كشف الاحتيال المتقدم</li>
              <li>• تحسين المحافظ الاستثمارية</li>
              <li>• التداول عالي التردد</li>
            </ul>
            <div className='text-xs text-center mb-3'>
              <div className='text-indigo-400 glow-text'>
                معدل الكشف: {(95 + Math.random() * 4).toFixed(1)}%
              </div>
            </div>
            <div className='flex gap-1'>
              <button className='flex-1 px-2 py-1 bg-indigo-600/30 border border-indigo-500/50 rounded text-xs text-indigo-300 hover:bg-indigo-600/50 transition-all duration-300'>
                💰 تحليل
              </button>
              <button className='flex-1 px-2 py-1 bg-blue-600/30 border border-blue-500/50 rounded text-xs text-blue-300 hover:bg-blue-600/50 transition-all duration-300'>
                🔍 كشف
              </button>
              <button
                onClick={() => printToPDF('الخدمات المصرفية')}
                className='px-2 py-1 bg-gray-600/30 border border-gray-500/50 rounded text-xs text-gray-300 hover:bg-gray-600/50 transition-all duration-300'
              >
                📄 PDF
              </button>
            </div>
          </div>

          <div className='quantum-card bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-4 rounded-lg border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group'>
            <div className='text-center mb-3'>
              <div className='w-12 h-12 mx-auto bg-green-500/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-green-500/30 transition-all duration-300'>
                <span className='text-2xl animate-bounce'>💊</span>
              </div>
              <h4 className='font-bold text-green-300 glow-text'>الصناعات الدوائية</h4>
            </div>
            <ul className='text-xs text-gray-300 space-y-1 mb-3'>
              <li>• اكتشاف الأدوية الجديدة</li>
              <li>• محاكاة البروتينات</li>
              <li>• تحسين التركيبات الكيميائية</li>
              <li>• التنبؤ بالآثار الجانبية</li>
            </ul>
            <div className='text-xs text-center mb-3'>
              <div className='text-green-400 glow-text'>
                تسريع الاكتشاف: {Math.floor(Math.random() * 5 + 8)}x
              </div>
            </div>
            <div className='flex gap-1'>
              <button className='flex-1 px-2 py-1 bg-green-600/30 border border-green-500/50 rounded text-xs text-green-300 hover:bg-green-600/50 transition-all duration-300'>
                🧬 محاكاة
              </button>
              <button className='flex-1 px-2 py-1 bg-emerald-600/30 border border-emerald-500/50 rounded text-xs text-emerald-300 hover:bg-emerald-600/50 transition-all duration-300'>
                💉 اكتشاف
              </button>
              <button
                onClick={() => printToPDF('الصناعات الدوائية')}
                className='px-2 py-1 bg-gray-600/30 border border-gray-500/50 rounded text-xs text-gray-300 hover:bg-gray-600/50 transition-all duration-300'
              >
                📄 PDF
              </button>
            </div>
          </div>

          <div className='quantum-card bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-4 rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group'>
            <div className='text-center mb-3'>
              <div className='w-12 h-12 mx-auto bg-purple-500/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-purple-500/30 transition-all duration-300'>
                <span className='text-2xl animate-spin'>🚗</span>
              </div>
              <h4 className='font-bold text-purple-300 glow-text'>النقل والمواصلات</h4>
            </div>
            <ul className='text-xs text-gray-300 space-y-1 mb-3'>
              <li>• تحسين المسارات</li>
              <li>• إدارة حركة المرور</li>
              <li>• تطوير البطاريات</li>
              <li>• القيادة الذاتية</li>
            </ul>
            <div className='text-xs text-center mb-3'>
              <div className='text-purple-400 glow-text'>
                توفير الوقود: {(25 + Math.random() * 15).toFixed(1)}%
              </div>
            </div>
            <div className='flex gap-1'>
              <button className='flex-1 px-2 py-1 bg-purple-600/30 border border-purple-500/50 rounded text-xs text-purple-300 hover:bg-purple-600/50 transition-all duration-300'>
                🛣️ تحسين
              </button>
              <button className='flex-1 px-2 py-1 bg-pink-600/30 border border-pink-500/50 rounded text-xs text-pink-300 hover:bg-pink-600/50 transition-all duration-300'>
                🚦 إدارة
              </button>
              <button
                onClick={() => printToPDF('النقل والمواصلات')}
                className='px-2 py-1 bg-gray-600/30 border border-gray-500/50 rounded text-xs text-gray-300 hover:bg-gray-600/50 transition-all duration-300'
              >
                📄 PDF
              </button>
            </div>
          </div>

          <div className='quantum-card bg-gradient-to-br from-yellow-600/20 to-orange-600/20 p-4 rounded-lg border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 group'>
            <div className='text-center mb-3'>
              <div className='w-12 h-12 mx-auto bg-yellow-500/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-yellow-500/30 transition-all duration-300'>
                <span className='text-2xl animate-pulse'>🌡️</span>
              </div>
              <h4 className='font-bold text-yellow-300 glow-text'>المناخ والطقس</h4>
            </div>
            <ul className='text-xs text-gray-300 space-y-1 mb-3'>
              <li>• نمذجة المناخ المتقدمة</li>
              <li>• التنبؤ بالطقس الدقيق</li>
              <li>• محاكاة الأعاصير</li>
              <li>• تحليل التغير المناخي</li>
            </ul>
            <div className='text-xs text-center mb-3'>
              <div className='text-yellow-400 glow-text'>
                دقة التنبؤ: {(92 + Math.random() * 7).toFixed(1)}%
              </div>
            </div>
            <div className='flex gap-1'>
              <button className='flex-1 px-2 py-1 bg-yellow-600/30 border border-yellow-500/50 rounded text-xs text-yellow-300 hover:bg-yellow-600/50 transition-all duration-300'>
                🌦️ تنبؤ
              </button>
              <button className='flex-1 px-2 py-1 bg-orange-600/30 border border-orange-500/50 rounded text-xs text-orange-300 hover:bg-orange-600/50 transition-all duration-300'>
                🌍 تحليل
              </button>
              <button
                onClick={() => printToPDF('المناخ والطقس')}
                className='px-2 py-1 bg-gray-600/30 border border-gray-500/50 rounded text-xs text-gray-300 hover:bg-gray-600/50 transition-all duration-300'
              >
                📄 PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticalApplication;
