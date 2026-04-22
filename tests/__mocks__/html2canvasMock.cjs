'use strict';
/**
 * Mock for html2canvas — replaces the ESM-only package in Jest tests.
 */
const html2canvas = jest.fn().mockResolvedValue({
  toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mock'),
  width: 800,
  height: 600,
});
html2canvas.default = html2canvas;
module.exports = html2canvas;
module.exports.default = html2canvas;
