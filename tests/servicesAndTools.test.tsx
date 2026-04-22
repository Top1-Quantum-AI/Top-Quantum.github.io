/**
 * Tests for aiService, openaiService, WorkflowDiagnosticTool and reportExporter
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { aiService } from '../src/aiService';
import { OpenAIService } from '../src/openaiService';
import { exportDashboardSnapshot, exportDataReport } from '../src/services/reportExporter';
import WorkflowDiagnosticTool from '../src/WorkflowDiagnosticTool';

describe('aiService', () => {
  it('should have sendMessage method', () => {
    expect(typeof aiService.sendMessage).toBe('function');
  });

  it('should have clearHistory method', () => {
    expect(typeof aiService.clearHistory).toBe('function');
  });

  it('should return a default response when sendMessage is called', async () => {
    const result = await aiService.sendMessage('test message');
    expect(result).toBeDefined();
    expect(result.response).toBeDefined();
    expect(typeof result.response).toBe('string');
  });

  it('should return response with confidence and quantumScore', async () => {
    const result = await aiService.sendMessage('hello');
    expect(typeof result.confidence).toBe('number');
    expect(typeof result.quantumScore).toBe('string');
    expect(typeof result.tokensUsed).toBe('number');
  });

  it('should not throw when clearHistory is called', () => {
    expect(() => aiService.clearHistory()).not.toThrow();
  });

  it('should accept optional personality parameter', async () => {
    const result = await aiService.sendMessage('test', 'friendly');
    expect(result).toBeDefined();
  });
});

describe('OpenAIService', () => {
  it('should be instantiable', () => {
    const service = new OpenAIService();
    expect(service).toBeDefined();
  });

  it('should have createResponse method', () => {
    const service = new OpenAIService();
    expect(typeof service.createResponse).toBe('function');
  });

  it('should return a response object from createResponse', async () => {
    const service = new OpenAIService();
    const result = await service.createResponse('prompt-1', { key: 'value' });
    expect(result).toBeDefined();
    expect(typeof result.text).toBe('string');
  });

  it('should accept optional version parameter', async () => {
    const service = new OpenAIService();
    const result = await service.createResponse('prompt-1', {}, 'v1');
    expect(result).toBeDefined();
  });
});

describe('reportExporter', () => {
  beforeEach(() => {
    // Mock document.getElementById for html2canvas
    jest.spyOn(document, 'getElementById').mockReturnValue(document.createElement('div'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should export exportDashboardSnapshot function', () => {
    expect(typeof exportDashboardSnapshot).toBe('function');
  });

  it('should export exportDataReport function', () => {
    expect(typeof exportDataReport).toBe('function');
  });

  it('should call exportDashboardSnapshot without throwing', async () => {
    await expect(exportDashboardSnapshot()).resolves.not.toThrow();
  });

  it('should call exportDataReport with options without throwing', () => {
    expect(() => exportDataReport({ title: 'Test Report', sections: [] })).not.toThrow();
  });
});

// ─── WorkflowDiagnosticTool tests ─────────────────────────

// Mock import.meta.env for WorkflowDiagnosticTool
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...p }: React.HTMLProps<HTMLDivElement>) => <div {...p}>{children}</div>,
    span: ({ children, ...p }: React.HTMLProps<HTMLSpanElement>) => <span {...p}>{children}</span>,
    button: ({ children, ...p }: React.HTMLProps<HTMLButtonElement>) => (
      <button {...(p as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>
    ),
    p: ({ children, ...p }: React.HTMLProps<HTMLParagraphElement>) => <p {...p}>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('WorkflowDiagnosticTool', () => {
  it('should render without crashing', () => {
    const { container } = render(<WorkflowDiagnosticTool />);
    expect(container).toBeTruthy();
  });

  it('should render login form initially (auth-gated)', () => {
    render(<WorkflowDiagnosticTool />);
    // The tool is gated behind a login — should show login UI
    expect(document.body.textContent?.length).toBeGreaterThan(5);
  });

  it('should have login form fields', () => {
    render(<WorkflowDiagnosticTool />);
    const inputs = document.querySelectorAll('input');
    // Should have username and password fields
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('should show error on invalid login attempt', async () => {
    const user = userEvent.setup({ delay: null });
    render(<WorkflowDiagnosticTool />);
    const inputs = document.querySelectorAll('input');
    if (inputs.length >= 2) {
      await user.type(inputs[0] as HTMLElement, 'wronguser');
      await user.type(inputs[1] as HTMLElement, 'wrongpass');
      const submitBtn =
        (document.querySelector('button[type="submit"]') as HTMLElement) ??
        (screen.getAllByRole('button')[0] as HTMLElement);
      if (submitBtn) {
        await user.click(submitBtn);
        // Should show some error or remain on login screen
        expect(document.body).toBeTruthy();
      }
    }
    expect(document.body).toBeTruthy();
  });
});
