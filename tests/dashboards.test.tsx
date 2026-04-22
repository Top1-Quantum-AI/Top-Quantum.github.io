/**
 * Dashboard component smoke tests
 * Tests for: QuantumDashboard, AIDashboard, AdminDashboard, SecurityDashboard,
 * AdvancedSecurityDashboard, NetworkDashboard, SubscriptionDashboard,
 * ApiKeysDashboard, AdvancedSettings, OpenMythosDashboard, AIAnalysisDashboard, WorkflowDiagnosticTool
 */
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// ─── Tests ────────────────────────────────────────────────

import AdvancedSecurityDashboard from '../src/components/AdvancedSecurityDashboard';
import AdvancedSettings from '../src/components/AdvancedSettings';
import AIAnalysisDashboard from '../src/components/AIAnalysisDashboard';
import AIDashboard from '../src/components/AIDashboard';
import ApiKeysDashboard from '../src/components/ApiKeysDashboard';
import NetworkDashboard from '../src/components/NetworkDashboard';
import OpenMythosDashboard from '../src/components/OpenMythosDashboard';
import QuantumDashboard from '../src/components/QuantumDashboard';
import SecurityDashboard from '../src/components/SecurityDashboard';
import SubscriptionDashboard from '../src/components/SubscriptionDashboard';
import AdminDashboard from '../src/pages/AdminDashboard';

// ─── Global mocks for all tests in this file ──────────────

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...p }: React.HTMLProps<HTMLDivElement>) => <div {...p}>{children}</div>,
    span: ({ children, ...p }: React.HTMLProps<HTMLSpanElement>) => <span {...p}>{children}</span>,
    button: ({ children, ...p }: React.HTMLProps<HTMLButtonElement>) =>
      <button {...(p as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>,
    p: ({ children, ...p }: React.HTMLProps<HTMLParagraphElement>) => <p {...p}>{children}</p>,
    h1: ({ children, ...p }: React.HTMLProps<HTMLHeadingElement>) => <h1 {...p}>{children}</h1>,
    h2: ({ children, ...p }: React.HTMLProps<HTMLHeadingElement>) => <h2 {...p}>{children}</h2>,
    h3: ({ children, ...p }: React.HTMLProps<HTMLHeadingElement>) => <h3 {...p}>{children}</h3>,
    section: ({ children, ...p }: React.HTMLProps<HTMLElement>) => <section {...p}>{children}</section>,
    nav: ({ children, ...p }: React.HTMLProps<HTMLElement>) => <nav {...p}>{children}</nav>,
    aside: ({ children, ...p }: React.HTMLProps<HTMLElement>) => <aside {...p}>{children}</aside>,
    ul: ({ children, ...p }: React.HTMLProps<HTMLUListElement>) => <ul {...p}>{children}</ul>,
    li: ({ children, ...p }: React.HTMLProps<HTMLLIElement>) => <li {...p}>{children}</li>,
    table: ({ children, ...p }: React.HTMLProps<HTMLTableElement>) => <table {...p}>{children}</table>,
    tr: ({ children, ...p }: React.HTMLProps<HTMLTableRowElement>) => <tr {...p}>{children}</tr>,
    td: ({ children, ...p }: React.HTMLProps<HTMLTableDataCellElement>) => <td {...p}>{children}</td>,
    th: ({ children, ...p }: React.HTMLProps<HTMLTableHeaderCellElement>) => <th {...p}>{children}</th>,
    header: ({ children, ...p }: React.HTMLProps<HTMLElement>) => <header {...p}>{children}</header>,
    footer: ({ children, ...p }: React.HTMLProps<HTMLElement>) => <footer {...p}>{children}</footer>,
    input: (p: React.HTMLProps<HTMLInputElement>) => <input {...(p as React.InputHTMLAttributes<HTMLInputElement>)} />,
    form: ({ children, ...p }: React.HTMLProps<HTMLFormElement>) => <form {...(p as React.FormHTMLAttributes<HTMLFormElement>)}>{children}</form>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAnimation: () => ({ start: jest.fn(), stop: jest.fn() }),
  useInView: () => true,
}));

const mockUser = {
  id: 'user-1',
  username: 'testuser',
  email: 'test@example.com',
  role: 'user' as const,
  subscription: {
    planId: 'professional',
    status: 'active',
    startDate: '2024-01-01',
    expiresAt: null,
    autoRenew: false,
    usage: {
      simulationsThisMonth: 5,
      aiQueriesThisMonth: 10,
      apiCallsToday: 10,
      tokensToday: 1000,
      lastSimulationDate: '2024-01-01',
      lastResetDate: '2024-01-01',
    },
  },
  apiUsage: { dailyRequests: 0, dailyTokens: 0, totalRequests: 0, lastReset: '2024-01-01' },
  createdAt: '2024-01-01',
  isEmailVerified: true,
};

const mockPlan = {
  name: 'الاحترافي',
  price: 29,
  color: '#6366f1',
  limits: {
    maxQubits: 20,
    maxSimulationsPerMonth: 10000,
    maxAlgorithms: 10,
    maxAPIRequestsPerDay: 1000,
    maxTokensPerDay: 100000,
  },
};

const MOCK_PLANS = {
  free: { ...mockPlan, name: 'المجاني', price: 0, color: '#6b7280', limits: { maxQubits: 5, maxSimulationsPerMonth: 100, maxAlgorithms: 3, maxAPIRequestsPerDay: 100, maxTokensPerDay: 10000 } },
  professional: mockPlan,
  enterprise: { ...mockPlan, name: 'المؤسسات', price: 99, color: '#f59e0b', limits: { maxQubits: 128, maxSimulationsPerMonth: Infinity, maxAlgorithms: Infinity, maxAPIRequestsPerDay: 10000, maxTokensPerDay: 1000000 } },
};

jest.mock('../src/services/subscriptionService', () => ({
  getCurrentUser: jest.fn().mockReturnValue(mockUser),
  logoutUser: jest.fn(),
  trackSimulation: jest.fn(),
  getUsagePercentages: jest.fn().mockReturnValue({ simulations: 10, aiQueries: 5 }),
  getCurrentLimits: jest.fn().mockReturnValue({ maxQubits: 20, maxSimulationsPerMonth: 10000, maxAlgorithms: 10, maxAPIRequestsPerDay: 1000, maxTokensPerDay: 100000, maxAiQueriesPerMonth: 5000 }),
  PLANS: MOCK_PLANS,
  getTrialDaysRemaining: jest.fn().mockReturnValue(null),
  hasFeature: jest.fn().mockReturnValue(true),
  canRunSimulation: jest.fn().mockReturnValue(true),
  getRemainingSimulations: jest.fn().mockReturnValue(100),
}));

jest.mock('../src/services/apiClient', () => ({
  isAuthenticated: jest.fn().mockReturnValue(true),
  clearToken: jest.fn(),
  apiLogout: jest.fn().mockResolvedValue(undefined),
  adminGetStats: jest.fn().mockResolvedValue({
    users: { total: 100, active: 80, verified: 70, recentSignups: 5 },
    plans: { free: 60, professional: 30, enterprise: 10 },
    api: { totalRequests: 50000, totalTokens: 1000000 },
  }),
  adminGetUsers: jest.fn().mockResolvedValue({
    users: [],
    pagination: { page: 1, limit: 10, total: 0, pages: 0 },
  }),
  adminUpdateUser: jest.fn().mockResolvedValue({ ...mockUser, role: 'admin' }),
  adminDeactivateUser: jest.fn().mockResolvedValue(undefined),
  adminGetAuditLogs: jest.fn().mockResolvedValue([]),
  checkBackendAvailable: jest.fn().mockResolvedValue(true),
}));

jest.mock('../src/services/groqService', () => ({
  isApiKeyConfigured: jest.fn().mockReturnValue(false),
  sendChatMessage: jest.fn().mockResolvedValue('AI response'),
  analyzeSystemData: jest.fn().mockResolvedValue('analysis'),
  analyzeSecurityThreats: jest.fn().mockResolvedValue('threat analysis'),
  analyzeQuantumPerformance: jest.fn().mockResolvedValue('quantum analysis'),
}));

jest.mock('../src/services/mythosService', () => ({
  listModels: jest.fn().mockResolvedValue({ models: [] }),
  getMythosHealth: jest.fn().mockResolvedValue({ status: 'ok', models_loaded: [], device: 'cpu', torch_version: '2.0.0' }),
}));

jest.mock('../src/services/reportExporter', () => ({
  exportDashboardSnapshot: jest.fn().mockResolvedValue(undefined),
  exportDataReport: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../src/services/quantumSimulator', () => ({
  simulateCircuit: jest.fn().mockResolvedValue({ success: true, statevector: [], probabilities: {}, fidelity: 0.99 }),
  algorithms: [],
}));

// ─── Helpers ──────────────────────────────────────────────

const withRouter = (component: React.ReactElement) =>
  render(<MemoryRouter>{component}</MemoryRouter>);

const renderAndTick = async (component: React.ReactElement) => {
  const result = withRouter(component);
  await act(async () => {
    await new Promise(r => setTimeout(r, 0));
  });
  return result;
};

describe('QuantumDashboard', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it('should render without crashing', async () => {
    const { container } = render(<QuantumDashboard />);
    await act(async () => { jest.advanceTimersByTime(100); });
    expect(container).toBeTruthy();
  });

  it('should render quantum circuit content', async () => {
    render(<QuantumDashboard />);
    await act(async () => { jest.advanceTimersByTime(500); });
    expect(document.body.textContent?.length).toBeGreaterThan(10);
  });

  it('should switch between view modes', async () => {
    const user = userEvent.setup({ delay: null, advanceTimers: jest.advanceTimersByTime.bind(jest) });
    const { container } = render(<QuantumDashboard />);
    await act(async () => { jest.advanceTimersByTime(200); });

    const buttons = Array.from(container.querySelectorAll('button'));
    for (const btn of buttons.slice(0, 6)) {
      await act(async () => { await user.click(btn as HTMLElement); });
      await act(async () => { jest.advanceTimersByTime(50); });
    }
    expect(document.body).toBeTruthy();
  });
});

describe('AIDashboard', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it('should render without crashing', async () => {
    const { container } = render(<AIDashboard />);
    await act(async () => { jest.advanceTimersByTime(100); });
    expect(container).toBeTruthy();
  });

  it('should render AI model content', async () => {
    render(<AIDashboard />);
    await act(async () => { jest.advanceTimersByTime(500); });
    expect(document.body.textContent?.length).toBeGreaterThan(10);
  });
});

describe('AdminDashboard', () => {
  it('should render without crashing', async () => {
    const { container } = await renderAndTick(
      <AdminDashboard />
    );
    expect(container).toBeTruthy();
  });

  it('should render admin panel content', async () => {
    await renderAndTick(<AdminDashboard />);
    expect(document.body.textContent?.length).toBeGreaterThan(10);
  });
});

describe('AdvancedSecurityDashboard', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it('should render without crashing', async () => {
    const { container } = render(<AdvancedSecurityDashboard />);
    await act(async () => { jest.advanceTimersByTime(100); });
    expect(container).toBeTruthy();
  });

  it('should render security content', async () => {
    render(<AdvancedSecurityDashboard />);
    await act(async () => { jest.advanceTimersByTime(500); });
    expect(document.body.textContent?.length).toBeGreaterThan(10);
  });
});

describe('SecurityDashboard', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it('should render without crashing', async () => {
    const { container } = render(<SecurityDashboard />);
    await act(async () => { jest.advanceTimersByTime(100); });
    expect(container).toBeTruthy();
  });

  it('should render security metrics', async () => {
    render(<SecurityDashboard />);
    await act(async () => { jest.advanceTimersByTime(500); });
    expect(document.body.textContent?.length).toBeGreaterThan(10);
  });
});

describe('NetworkDashboard', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it('should render without crashing', async () => {
    const { container } = render(<NetworkDashboard />);
    await act(async () => { jest.advanceTimersByTime(100); });
    expect(container).toBeTruthy();
  });

  it('should render network topology content', async () => {
    render(<NetworkDashboard />);
    await act(async () => { jest.advanceTimersByTime(500); });
    expect(document.body.textContent?.length).toBeGreaterThan(10);
  });
});

describe('SubscriptionDashboard', () => {
  it('should render without crashing', () => {
    const { container } = withRouter(<SubscriptionDashboard />);
    expect(container).toBeTruthy();
  });

  it('should render plan information', () => {
    withRouter(<SubscriptionDashboard />);
    expect(document.body.textContent?.length).toBeGreaterThan(10);
  });
});

describe('ApiKeysDashboard', () => {
  it('should render without crashing', () => {
    const { container } = withRouter(<ApiKeysDashboard />);
    expect(container).toBeTruthy();
  });

  it('should render API keys list or empty state', () => {
    withRouter(<ApiKeysDashboard />);
    expect(document.body.textContent?.length).toBeGreaterThan(10);
  });
});

describe('AdvancedSettings', () => {
  it('should render without crashing', () => {
    const { container } = withRouter(<AdvancedSettings />);
    expect(container).toBeTruthy();
  });

  it('should render settings content', () => {
    withRouter(<AdvancedSettings />);
    expect(document.body.textContent?.length).toBeGreaterThan(10);
  });
});

describe('OpenMythosDashboard', () => {
  it('should render without crashing', async () => {
    const { container } = await renderAndTick(<OpenMythosDashboard />);
    expect(container).toBeTruthy();
  });

  it('should render OpenMythos content', async () => {
    await renderAndTick(<OpenMythosDashboard />);
    expect(document.body.textContent?.length).toBeGreaterThan(10);
  });
});

describe('AIAnalysisDashboard', () => {
  it('should render without crashing', async () => {
    const { container } = await renderAndTick(<AIAnalysisDashboard />);
    expect(container).toBeTruthy();
  });

  it('should render AI analysis content', async () => {
    await renderAndTick(<AIAnalysisDashboard />);
    expect(document.body.textContent?.length).toBeGreaterThan(10);
  });
});
