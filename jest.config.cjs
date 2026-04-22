/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.test.{ts,tsx}', '<rootDir>/src/**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx)$': '<rootDir>/tests/jestTransform.cjs',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
    '\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
    '^jspdf$': '<rootDir>/tests/__mocks__/jspdfMock.cjs',
    '^html2canvas$': '<rootDir>/tests/__mocks__/html2canvasMock.cjs',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFiles: ['<rootDir>/tests/env.setup.cjs'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 15000,
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/vite-env.d.ts',
    '!src/main.tsx',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
};
