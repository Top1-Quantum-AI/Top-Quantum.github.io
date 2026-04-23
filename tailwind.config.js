/** @type {import('tailwindcss').Config} */
/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.html',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // الألوان المخصصة للنظام الكمي
      colors: {
        // الألوان الأساسية - نظام ألوان كلود (برتقالي دافئ)
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // الألوان الثانوية - العنبر الدافئ
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // ألوان الكم المتخصصة - نحاسي دافئ (كلود)
        quantum: {
          50: '#fdf4ef',
          100: '#fbe5d3',
          200: '#f6c9a6',
          300: '#f0a571',
          400: '#e87a3e',
          500: '#d4623a',
          600: '#c04e2a',
          700: '#a03d22',
          800: '#833324',
          900: '#6c2d22',
          950: '#3a130e',
        },
        // ألوان الذكاء الاصطناعي - ذهبي دافئ
        ai: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
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
          950: '#022c22',
        },
        // ألوان الحجر الدافئ - الخلفية والأسطح
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
      },

      // الخطوط المخصصة
      fontFamily: {
        sans: ['Inter', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        arabic: ['Noto Sans Arabic', 'Inter', 'system-ui', 'sans-serif'],
      },

      // الظلال المخصصة - نظام ألوان كلود
      boxShadow: {
        quantum: '0 0 30px rgba(212, 98, 58, 0.3)',
        'quantum-lg': '0 0 50px rgba(212, 98, 58, 0.4)',
        ai: '0 0 30px rgba(245, 158, 11, 0.3)',
        'ai-lg': '0 0 50px rgba(245, 158, 11, 0.4)',
        security: '0 0 30px rgba(16, 185, 129, 0.3)',
        'security-lg': '0 0 50px rgba(16, 185, 129, 0.4)',
        glow: '0 0 20px rgba(212, 98, 58, 0.5)',
        'glow-lg': '0 0 40px rgba(212, 98, 58, 0.6)',
      },

      // التدرجات المخصصة - نظام ألوان كلود
      backgroundImage: {
        'gradient-quantum': 'linear-gradient(135deg, #d4623a 0%, #f59e0b 100%)',
        'gradient-ai': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-security': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #3c3735 100%)',
      },

      // الرسوم المتحركة المخصصة
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'quantum-pulse': 'quantum-pulse 2s ease-in-out infinite alternate',
        'quantum-float': 'quantumFloat 3s ease-in-out infinite',
        'quantum-glow': 'quantumGlow 2s ease-in-out infinite',
      },

      // إطارات الرسوم المتحركة
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' },
        },
        'quantum-pulse': {
          '0%': { boxShadow: '0 0 30px rgba(212, 98, 58, 0.4)' },
          '100%': { boxShadow: '0 0 50px rgba(212, 98, 58, 0.6)' },
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
            boxShadow: '0 0 5px #d4623a',
          },
          '50%': {
            boxShadow: '0 0 20px #d4623a, 0 0 30px #f59e0b',
          },
        },
      },
    },
  },
  plugins: [
    // إضافة المكونات المخصصة
    function ({ addComponents, theme }) {
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
            boxShadow: `0 0 0 2px ${theme('colors.blue.500')}`,
          },
        },
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.md'),
          border: `1px solid ${theme('colors.gray.200')}`,
          transition: 'all 200ms',
        },
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      });
    },
  ],
};
