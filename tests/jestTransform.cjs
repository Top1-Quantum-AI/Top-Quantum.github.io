'use strict';
/**
 * Custom Jest transformer: replaces `import.meta.env` with `process.env`
 * before ts-jest processes the file, enabling testing of Vite-style env vars.
 */
const { TsJestTransformer } = require('ts-jest');

const transformer = new TsJestTransformer({
  tsconfig: 'tsconfig.json',
  isolatedModules: true,
});

module.exports = {
  process(sourceText, sourcePath, options) {
    const patched = sourceText.replace(/\bimport\.meta\.env\b/g, 'process.env');
    return transformer.process(patched, sourcePath, options);
  },
  getCacheKey(sourceText, sourcePath, options) {
    const patched = sourceText.replace(/\bimport\.meta\.env\b/g, 'process.env');
    return transformer.getCacheKey(patched, sourcePath, options);
  },
};
