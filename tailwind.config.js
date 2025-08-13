/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.html',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // الألوان المخصصة للنظام الكمي
      colors: {
        // الألوان الأساسية
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        // الألوان الثانوية (البنفسجي للكم)
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764'
        },
        // ألوان الكم المتخصصة
        quantum: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b'
        },
        // ألوان الذكاء الاصطناعي
        ai: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724'
        },
        // ألوان الأمان
        security: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22'
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        }
      },
      
      // الخطوط المخصصة
      fontFamily: {
        sans: ['Inter', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        arabic: ['Noto Sans Arabic', 'Inter', 'system-ui', 'sans-serif']
      },
      
      // الظلال المخصصة
      boxShadow: {
        'quantum': '0 0 30px rgba(168, 85, 247, 0.3)',
        'quantum-lg': '0 0 50px rgba(168, 85, 247, 0.4)',
        'ai': '0 0 30px rgba(236, 72, 153, 0.3)',
        'ai-lg': '0 0 50px rgba(236, 72, 153, 0.4)',
        'security': '0 0 30px rgba(16, 185, 129, 0.3)',
        'security-lg': '0 0 50px rgba(16, 185, 129, 0.4)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.6)'
      },
      
      // التدرجات المخصصة
      backgroundImage: {
        'gradient-quantum': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-ai': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-security': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #1e3a8a 100%)'
      },
      
      // الرسوم المتحركة المخصصة
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'quantum-pulse': 'quantum-pulse 2s ease-in-out infinite alternate',
        'quantum-float': 'quantumFloat 3s ease-in-out infinite',
        'quantum-glow': 'quantumGlow 2s ease-in-out infinite',
      },
      
      // إطارات الرسوم المتحركة
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' }
        },
        'quantum-pulse': {
          '0%': { boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' },
          '100%': { boxShadow: '0 0 50px rgba(168, 85, 247, 0.6)' }
        },
        quantumFloat: {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-20px) rotate(180deg)',
          },
        },
        quantumPulse: {
          '0%, 100%': {
            opacity: '0.5',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.1)',
          },
        },
        quantumGlow: {
          '0%, 100%': {
            boxShadow: '0 0 5px #a855f7',
          },
          '50%': {
            boxShadow: '0 0 20px #a855f7, 0 0 30px #a855f7',
          },
        },
      }
    }
  },
  plugins: [
    // إضافة المكونات المخصصة
    function({ addComponents, theme }) {
      addComponents({
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          borderRadius: theme('borderRadius.lg'),
          transition: 'all 200ms',
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 2px ${theme('colors.blue.500')}`
          }
        },
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.md'),
          border: `1px solid ${theme('colors.gray.200')}`,
          transition: 'all 200ms'
        },
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }
      })
    }
  ]
}