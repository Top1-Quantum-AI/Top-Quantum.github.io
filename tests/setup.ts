import '@testing-library/jest-dom';

// Mock import.meta.env for Vite
Object.defineProperty(globalThis, 'import_meta_env', {
  value: {
    VITE_API_URL: 'http://localhost:3000/api',
    VITE_GROQ_API_KEY: 'test-key',
    MODE: 'test',
    DEV: false,
    PROD: false,
  },
});

// Mock crypto.randomUUID
if (typeof crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => `test-${Math.random().toString(36).slice(2, 10)}`,
    },
  });
} else if (!crypto.randomUUID) {
  (crypto as unknown as Record<string, unknown>)['randomUUID'] = () =>
    `test-${Math.random().toString(36).slice(2, 10)}`;
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Clean up localStorage between tests
afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
