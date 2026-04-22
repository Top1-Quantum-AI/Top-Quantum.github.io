const { TextEncoder, TextDecoder } = require('util');
Object.assign(globalThis, { TextEncoder, TextDecoder });

// Provide Vite-style env vars for modules using import.meta.env (replaced with process.env by jestTransform.cjs)
process.env['VITE_API_URL'] = process.env['VITE_API_URL'] ?? '/api';
process.env['VITE_OPENAI_API_KEY'] = process.env['VITE_OPENAI_API_KEY'] ?? '';
process.env['VITE_GROQ_API_KEY'] = process.env['VITE_GROQ_API_KEY'] ?? '';

