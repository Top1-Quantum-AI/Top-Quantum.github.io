'use strict';
/**
 * Mock for jspdf — replaces the ESM-only package in Jest (CommonJS) tests.
 */
function JsPDF() {
  return {
    text: jest.fn().mockReturnThis(),
    setFontSize: jest.fn().mockReturnThis(),
    setFont: jest.fn().mockReturnThis(),
    setTextColor: jest.fn().mockReturnThis(),
    setFillColor: jest.fn().mockReturnThis(),
    setDrawColor: jest.fn().mockReturnThis(),
    setLineWidth: jest.fn().mockReturnThis(),
    rect: jest.fn().mockReturnThis(),
    line: jest.fn().mockReturnThis(),
    addPage: jest.fn().mockReturnThis(),
    save: jest.fn().mockReturnThis(),
    output: jest.fn().mockReturnValue(''),
    addImage: jest.fn().mockReturnThis(),
    setPage: jest.fn().mockReturnThis(),
    getNumberOfPages: jest.fn().mockReturnValue(1),
    internal: { pageSize: { getWidth: () => 210, getHeight: () => 297 } },
  };
}
JsPDF.default = JsPDF;
module.exports = JsPDF;
module.exports.default = JsPDF;
module.exports.jsPDF = JsPDF;
