/** @type {import('jest').Config} */
module.exports = {
  // البيئة الأساسية
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  
  // الجذر والمسارات
  rootDir: '.',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/tests/**/*.{test,spec}.{ts,tsx}'
  ],
  
  // تحويل الملفات
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.css$': 'jest-transform-css',
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': 'jest-transform-file'
  },
  
  // تجاهل التحويل لهذه الملفات
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@openquantumsafe|complex\\.js|quantum-js))'
  ],
  
  // إعداد الوحدات
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/quantum/(.*)$': '<rootDir>/src/quantum/$1',
    '^@/ai/(.*)$': '<rootDir>/src/ai/$1',
    '^@/security/(.*)$': '<rootDir>/src/security/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  
  // امتدادات الملفات
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // إعداد البيئة
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.ts',
    '@testing-library/jest-dom'
  ],
  
  // متغيرات البيئة للاختبار
  setupFiles: [
    '<rootDir>/tests/env.setup.js'
  ],
  
  // تغطية الكود
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  
  // تقارير التغطية
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
    'json-summary',
    'cobertura'
  ],
  
  // حدود التغطية المطلوبة
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    },
    // متطلبات خاصة للمكونات الحرجة
    './src/quantum/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    './src/security/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    },
    './src/ai/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  
  // إعدادات المهلة الزمنية
  testTimeout: 30000, // 30 ثانية للاختبارات الكمية المعقدة
  
  // إعدادات التشغيل المتوازي
  maxWorkers: '50%',
  
  // تنظيف التجسس والمحاكيات
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  
  // إعدادات الإخراج
  verbose: true,
  silent: false,
  
  // إعدادات خاصة بالنظام الكمي
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      isolatedModules: true
    },
    // متغيرات عامة للاختبارات الكمية
    QUANTUM_SIMULATOR_ENABLED: true,
    QUANTUM_TEST_MODE: true,
    AI_MOCK_RESPONSES: true,
    SECURITY_TEST_KEYS: true
  },
  
  // مجموعات الاختبار
  projects: [
    {
      displayName: 'Unit Tests',
      testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/tests/unit.setup.ts']
    },
    {
      displayName: 'Integration Tests',
      testMatch: ['<rootDir>/tests/integration/**/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/tests/integration.setup.ts'],
      testTimeout: 60000 // دقيقة واحدة للاختبارات التكاملية
    },
    {
      displayName: 'Quantum Tests',
      testMatch: ['<rootDir>/tests/quantum/**/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/tests/quantum.setup.ts'],
      testTimeout: 120000 // دقيقتان للاختبارات الكمية
    },
    {
      displayName: 'Security Tests',
      testMatch: ['<rootDir>/tests/security/**/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/tests/security.setup.ts'],
      testTimeout: 90000 // دقيقة ونصف لاختبارات الأمان
    },
    {
      displayName: 'AI Tests',
      testMatch: ['<rootDir>/tests/ai/**/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/tests/ai.setup.ts'],
      testTimeout: 45000 // 45 ثانية لاختبارات الذكاء الاصطناعي
    }
  ],
  
  // إعدادات التقارير
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './coverage/html-report',
        filename: 'report.html',
        expand: true,
        hideIcon: false,
        pageTitle: 'Quantum AI System Test Report',
        logoImgPath: './public/quantum-logo.png'
      }
    ],
    [
      'jest-junit',
      {
        outputDirectory: './coverage',
        outputName: 'junit.xml',
        ancestorSeparator: ' › ',
        uniqueOutputName: 'false',
        suiteNameTemplate: '{filepath}',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}'
      }
    ],
    [
      'jest-sonar-reporter',
      {
        outputDirectory: './coverage',
        outputName: 'sonar-report.xml',
        reportedFilePath: 'relative'
      }
    ]
  ],
  
  // إعدادات خاصة بالأداء
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // تجاهل هذه المجلدات
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/coverage/'
  ],
  
  // إعدادات المراقبة
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/build/'
  ],
  
  // إعدادات خاصة بالنظام الكمي والأمان
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
    userAgent: 'QuantumAI-TestRunner/1.0'
  },
  
  // معالجة الأخطاء
  errorOnDeprecated: true,
  
  // إعدادات إضافية للاختبارات المتقدمة
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ],
  
  // إعدادات خاصة بالتوازي
  workerIdleMemoryLimit: '512MB'
};

// إعدادات خاصة للبيئات المختلفة
if (process.env.CI) {
  module.exports.maxWorkers = 2;
  module.exports.cache = false;
  module.exports.verbose = false;
}

if (process.env.NODE_ENV === 'development') {
  module.exports.watchAll = false;
  module.exports.watch = true;
  module.exports.collectCoverage = false;
}

if (process.env.QUANTUM_HARDWARE_TESTS === 'true') {
  module.exports.testTimeout = 300000; // 5 دقائق للاختبارات مع الأجهزة الكمية الفعلية
}