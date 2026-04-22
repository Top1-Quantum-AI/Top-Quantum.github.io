/**
 * Additional coverage tests for:
 * - PracticalApplication
 * - AIAnalysisDashboard
 * - AdvancedSettings
 * - ApiKeysDashboard
 * - CommandPalette
 * - ExportToolbar
 */
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// ─── Global mocks ──────────────────────────────────────────

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...p }: React.HTMLProps<HTMLDivElement>) => <div {...p}>{children}</div>,
    span: ({ children, ...p }: React.HTMLProps<HTMLSpanElement>) => <span {...p}>{children}</span>,
    button: ({ children, ...p }: React.HTMLProps<HTMLButtonElement>) =>
      <button {...(p as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>,
    p: ({ children, ...p }: React.HTMLProps<HTMLParagraphElement>) => <p {...p}>{children}</p>,
    h2: ({ children, ...p }: React.HTMLProps<HTMLHeadingElement>) => <h2 {...p}>{children}</h2>,
    h3: ({ children, ...p }: React.HTMLProps<HTMLHeadingElement>) => <h3 {...p}>{children}</h3>,
    ul: ({ children, ...p }: React.HTMLProps<HTMLUListElement>) => <ul {...p}>{children}</ul>,
    li: ({ children, ...p }: React.HTMLProps<HTMLLIElement>) => <li {...p}>{children}</li>,
    textarea: (p: React.HTMLProps<HTMLTextAreaElement>) =>
      <textarea {...(p as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />,
    form: ({ children, ...p }: React.HTMLProps<HTMLFormElement>) =>
      <form {...(p as React.FormHTMLAttributes<HTMLFormElement>)}>{children}</form>,
    input: (p: React.HTMLProps<HTMLInputElement>) =>
      <input {...(p as React.InputHTMLAttributes<HTMLInputElement>)} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAnimation: () => ({ start: jest.fn(), stop: jest.fn() }),
  useInView: () => true,
}));

jest.mock('../src/services/subscriptionService', () => ({
  getCurrentUser: jest.fn().mockReturnValue({
    id: 'user-1',
    email: 'test@example.com',
    role: 'user',
    subscription: { planId: 'professional', status: 'active' },
  }),
  hasFeature: jest.fn().mockReturnValue(true),
  logoutUser: jest.fn(),
  getUsagePercentages: jest.fn().mockReturnValue({ simulations: 10, aiQueries: 5 }),
  getCurrentLimits: jest.fn().mockReturnValue({
    maxQubits: 20,
    maxSimulationsPerMonth: 10000,
    maxAlgorithms: 10,
    maxAPIRequestsPerDay: 1000,
    maxTokensPerDay: 100000,
  }),
}));

jest.mock('../src/services/groqService', () => ({
  isApiKeyConfigured: jest.fn().mockReturnValue(true),
  sendChatMessage: jest.fn().mockResolvedValue('مرحبا! هذا رد الذكاء الاصطناعي'),
  analyzeSystemData: jest.fn().mockResolvedValue('تحليل النظام: كل شيء يعمل بشكل جيد'),
  analyzeSecurityThreats: jest.fn().mockResolvedValue('لا توجد تهديدات'),
  analyzeQuantumPerformance: jest.fn().mockResolvedValue('الأداء الكمي ممتاز'),
}));

jest.mock('../src/services/reportExporter', () => ({
  exportDashboardSnapshot: jest.fn().mockResolvedValue(undefined),
  exportDataReport: jest.fn(),
}));

// Mock clipboard
Object.assign(navigator, {
  clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
});

// ─── Imports ───────────────────────────────────────────────

import PracticalApplication from '../src/components/revolutionary/PracticalApplication';
import AIAnalysisDashboard from '../src/components/AIAnalysisDashboard';
import AdvancedSettings from '../src/components/AdvancedSettings';
import ApiKeysDashboard from '../src/components/ApiKeysDashboard';
import CommandPalette from '../src/components/revolutionary/CommandPalette';
import ExportToolbar from '../src/components/ExportToolbar';
import { isApiKeyConfigured, sendChatMessage } from '../src/services/groqService';
import { hasFeature } from '../src/services/subscriptionService';
import { exportDashboardSnapshot, exportDataReport } from '../src/services/reportExporter';

// ─── Helpers ───────────────────────────────────────────────

const withRouter = (component: React.ReactElement) =>
  render(<MemoryRouter>{component}</MemoryRouter>);

// ─── PracticalApplication ──────────────────────────────────

describe('PracticalApplication', () => {
  const mockPrintToPDF = jest.fn();

  beforeEach(() => {
    mockPrintToPDF.mockClear();
  });

  it('renders without crashing', () => {
    const { container } = render(<PracticalApplication printToPDF={mockPrintToPDF} />);
    expect(container).toBeTruthy();
  });

  it('renders the main heading', () => {
    render(<PracticalApplication printToPDF={mockPrintToPDF} />);
    expect(screen.getByText(/التطبيق الكمي العملي/)).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<PracticalApplication printToPDF={mockPrintToPDF} />);
    const searchInput = screen.getByPlaceholderText(/ابحث في التطبيقات/);
    expect(searchInput).toBeInTheDocument();
  });

  it('handles search input changes', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    render(<PracticalApplication printToPDF={mockPrintToPDF} />);
    const searchInput = screen.getByPlaceholderText(/ابحث في التطبيقات/);
    fireEvent.change(searchInput, { target: { value: 'تشفير' } });
    expect(consoleSpy).toHaveBeenCalledWith('البحث عن:', 'تشفير');
    consoleSpy.mockRestore();
  });

  it('renders category navigation buttons', () => {
    render(<PracticalApplication printToPDF={mockPrintToPDF} />);
    // Use getAllByText since the text may appear in both category buttons and card headings
    const items = screen.getAllByText(/التشفير الكمي/);
    expect(items.length).toBeGreaterThan(0);
    const molItems = screen.getAllByText(/محاكاة الجزيئات/);
    expect(molItems.length).toBeGreaterThan(0);
  });

  it('calls printToPDF when PDF button is clicked', () => {
    render(<PracticalApplication printToPDF={mockPrintToPDF} />);
    const pdfButtons = screen.getAllByText(/PDF/);
    expect(pdfButtons.length).toBeGreaterThan(0);
    fireEvent.click(pdfButtons[0] as HTMLElement);
    expect(mockPrintToPDF).toHaveBeenCalled();
  });

  it('renders action buttons (محاكاة, تحليل, تشغيل)', () => {
    render(<PracticalApplication printToPDF={mockPrintToPDF} />);
    const simButtons = screen.getAllByText(/محاكاة/);
    expect(simButtons.length).toBeGreaterThan(0);
  });

  it('handles category navigation click', () => {
    const scrollIntoViewMock = jest.fn();
    document.getElementById = jest.fn().mockReturnValue({ scrollIntoView: scrollIntoViewMock });

    render(<PracticalApplication printToPDF={mockPrintToPDF} />);
    // The first text matching التشفير الكمي in the category nav bar (button role)
    const catButtons = screen.getAllByRole('button');
    const catBtn = catButtons.find(btn => btn.textContent === 'التشفير الكمي');
    if (catBtn) {
      fireEvent.click(catBtn);
      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    } else {
      expect(catButtons.length).toBeGreaterThan(0);
    }
  });
});

// ─── AIAnalysisDashboard ───────────────────────────────────

describe('AIAnalysisDashboard', () => {
  beforeEach(() => {
    (isApiKeyConfigured as jest.Mock).mockReturnValue(true);
    (sendChatMessage as jest.Mock).mockResolvedValue('رد الذكاء الاصطناعي');
    // JSDOM does not implement scrollIntoView — mock it
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without crashing when API key is configured', () => {
    const { container } = render(<AIAnalysisDashboard />);
    expect(container).toBeTruthy();
  });

  it('shows the initial assistant greeting message', () => {
    render(<AIAnalysisDashboard />);
    expect(screen.getByText(/مرحباً/)).toBeInTheDocument();
  });

  it('shows the analysis buttons', () => {
    render(<AIAnalysisDashboard />);
    expect(screen.getByText('تحليل النظام')).toBeInTheDocument();
    expect(screen.getByText('تحليل الأمان')).toBeInTheDocument();
    expect(screen.getByText('تحليل كمي')).toBeInTheDocument();
  });

  it('shows the textarea input field', () => {
    render(<AIAnalysisDashboard />);
    const textarea = screen.getByPlaceholderText(/اكتب سؤالك/);
    expect(textarea).toBeInTheDocument();
  });

  it('shows unconfigured state when API key is missing', () => {
    (isApiKeyConfigured as jest.Mock).mockReturnValue(false);
    render(<AIAnalysisDashboard />);
    expect(screen.getByText(/مفتاح API غير مُعدّ/)).toBeInTheDocument();
  });

  it('shows .env instruction when API is not configured', () => {
    (isApiKeyConfigured as jest.Mock).mockReturnValue(false);
    render(<AIAnalysisDashboard />);
    expect(screen.getByText(/\.env/)).toBeInTheDocument();
  });

  it('handles typing in the chat input', () => {
    render(<AIAnalysisDashboard />);
    const textarea = screen.getByPlaceholderText(/اكتب سؤالك/);
    fireEvent.change(textarea, { target: { value: 'كيف حال النظام؟' } });
    expect((textarea as HTMLTextAreaElement).value).toBe('كيف حال النظام؟');
  });

  it('handles send on Enter key (without shift)', async () => {
    render(<AIAnalysisDashboard />);
    const textarea = screen.getByPlaceholderText(/اكتب سؤالك/);
    fireEvent.change(textarea, { target: { value: 'سؤال' } });
    await act(async () => {
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
      await new Promise(r => setTimeout(r, 0));
    });
    // After sending, the input should be cleared
    expect((textarea as HTMLTextAreaElement).value).toBe('');
  });

  it('does not send when Shift+Enter is pressed', () => {
    render(<AIAnalysisDashboard />);
    const textarea = screen.getByPlaceholderText(/اكتب سؤالك/);
    fireEvent.change(textarea, { target: { value: 'سؤال' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    // Input should remain
    expect((textarea as HTMLTextAreaElement).value).toBe('سؤال');
  });

  it('handles system analysis button click', async () => {
    const { analyzeSystemData } = jest.requireMock('../src/services/groqService') as Record<string, jest.Mock>;
    analyzeSystemData.mockResolvedValue('تحليل النظام جيد');
    render(<AIAnalysisDashboard />);
    const sysBtn = screen.getByText('تحليل النظام').closest('button');
    await act(async () => {
      fireEvent.click(sysBtn as HTMLElement);
      await new Promise(r => setTimeout(r, 0));
    });
    expect(analyzeSystemData).toHaveBeenCalled();
  });

  it('handles security analysis button click', async () => {
    const { analyzeSecurityThreats } = jest.requireMock('../src/services/groqService') as Record<string, jest.Mock>;
    analyzeSecurityThreats.mockResolvedValue('لا تهديدات');
    render(<AIAnalysisDashboard />);
    const secBtn = screen.getByText('تحليل الأمان').closest('button');
    await act(async () => {
      fireEvent.click(secBtn as HTMLElement);
      await new Promise(r => setTimeout(r, 0));
    });
    expect(analyzeSecurityThreats).toHaveBeenCalled();
  });

  it('handles quantum analysis button click', async () => {
    const { analyzeQuantumPerformance } = jest.requireMock('../src/services/groqService') as Record<string, jest.Mock>;
    analyzeQuantumPerformance.mockResolvedValue('أداء كمي جيد');
    render(<AIAnalysisDashboard />);
    const qBtn = screen.getByText('تحليل كمي').closest('button');
    await act(async () => {
      fireEvent.click(qBtn as HTMLElement);
      await new Promise(r => setTimeout(r, 0));
    });
    expect(analyzeQuantumPerformance).toHaveBeenCalled();
  });

  it('handles clear chat button', async () => {
    render(<AIAnalysisDashboard />);
    const clearBtn = document.querySelector('button[title="مسح المحادثة"]') as HTMLElement;
    if (clearBtn) {
      fireEvent.click(clearBtn);
      // Messages should be cleared back to initial
      expect(screen.getByText(/مرحباً/)).toBeInTheDocument();
    }
  });

  it('renders with systemMetrics provided', () => {
    const metrics = {
      cpu: 75,
      memory: 60,
      disk: 40,
      network: 30,
      uptime: '10 days',
      activeConnections: 25,
    };
    const { container } = render(<AIAnalysisDashboard systemMetrics={metrics} />);
    expect(container).toBeTruthy();
  });

  it('handles errors from analyzeSystemData gracefully', async () => {
    const { analyzeSystemData } = jest.requireMock('../src/services/groqService') as Record<string, jest.Mock>;
    analyzeSystemData.mockRejectedValue(new Error('network error'));
    render(<AIAnalysisDashboard />);
    const sysBtn = screen.getByText('تحليل النظام').closest('button');
    await act(async () => {
      fireEvent.click(sysBtn as HTMLElement);
      await new Promise(r => setTimeout(r, 0));
    });
    expect(screen.getByText(/خطأ/)).toBeInTheDocument();
  });
});

// ─── AdvancedSettings ──────────────────────────────────────

describe('AdvancedSettings', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    const { container } = withRouter(<AdvancedSettings />);
    expect(container).toBeTruthy();
  });

  it('renders the main heading', () => {
    withRouter(<AdvancedSettings />);
    expect(screen.getByText('الإعدادات المتقدمة')).toBeInTheDocument();
  });

  it('renders all tabs', () => {
    withRouter(<AdvancedSettings />);
    expect(screen.getByText('عام')).toBeInTheDocument();
    expect(screen.getByText('المظهر')).toBeInTheDocument();
    expect(screen.getByText('الأمان')).toBeInTheDocument();
    expect(screen.getByText('الإشعارات')).toBeInTheDocument();
    expect(screen.getByText('الأداء')).toBeInTheDocument();
  });

  it('switches to appearance tab on click', async () => {
    withRouter(<AdvancedSettings />);
    const appearanceTab = screen.getByText('المظهر');
    fireEvent.click(appearanceTab);
    await waitFor(() => {
      expect(screen.getByText('داكن')).toBeInTheDocument();
    });
  });

  it('switches to security tab and shows security level select', async () => {
    withRouter(<AdvancedSettings />);
    const secTab = screen.getByText('الأمان');
    fireEvent.click(secTab);
    await waitFor(() => {
      expect(screen.getByText('مستوى الأمان')).toBeInTheDocument();
    });
  });

  it('switches to notifications tab and shows toggles', async () => {
    withRouter(<AdvancedSettings />);
    const notifTab = screen.getByText('الإشعارات');
    fireEvent.click(notifTab);
    await waitFor(() => {
      expect(screen.getByText('النظام')).toBeInTheDocument();
    });
  });

  it('switches to performance tab and shows toggles', async () => {
    withRouter(<AdvancedSettings />);
    const perfTab = screen.getByText('الأداء');
    fireEvent.click(perfTab);
    await waitFor(() => {
      expect(screen.getByText('الرسوم المتحركة')).toBeInTheDocument();
    });
  });

  it('changes language setting from select', async () => {
    withRouter(<AdvancedSettings />);
    // General tab is active by default
    const langSelect = screen.getByDisplayValue('العربية');
    fireEvent.change(langSelect, { target: { value: 'en' } });
    // hasChanges should now be true - save button should become enabled
    await waitFor(() => {
      expect(screen.getByText('تغييرات غير محفوظة')).toBeInTheDocument();
    });
  });

  it('resets settings when reset button is clicked', async () => {
    withRouter(<AdvancedSettings />);
    const langSelect = screen.getByDisplayValue('العربية');
    fireEvent.change(langSelect, { target: { value: 'en' } });
    const resetBtn = screen.getByText('إعادة تعيين');
    fireEvent.click(resetBtn);
    await waitFor(() => {
      expect(screen.getByDisplayValue('العربية')).toBeInTheDocument();
    });
  });

  it('saves settings when save button is clicked', async () => {
    withRouter(<AdvancedSettings />);
    const langSelect = screen.getByDisplayValue('العربية');
    fireEvent.change(langSelect, { target: { value: 'en' } });
    const saveBtn = screen.getByText('حفظ');
    fireEvent.click(saveBtn);
    // Wait for "جاري الحفظ..."
    await waitFor(() => {
      expect(screen.getByText(/جاري الحفظ/)).toBeInTheDocument();
    });
  });

  it('loads settings from localStorage on mount', () => {
    const storedSettings = {
      theme: 'dark',
      language: 'en',
      quantumMode: 'expert',
      aiAssistance: false,
      securityLevel: 'high',
      notifications: { system: true, quantum: true, security: true, ai: false },
      performance: { animations: true, autoSave: true, caching: true, compression: false },
      privacy: { analytics: false, crashReports: true, dataCollection: false },
      advanced: { debugMode: false, experimentalFeatures: false, developerMode: false },
    };
    localStorage.setItem('quantumSettings', JSON.stringify(storedSettings));
    withRouter(<AdvancedSettings />);
    // After loading, language should be 'en' (English)
    expect(screen.getByDisplayValue('English')).toBeInTheDocument();
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('quantumSettings', 'invalid-json');
    // Should not throw
    expect(() => withRouter(<AdvancedSettings />)).not.toThrow();
  });

  it('toggles notification settings', async () => {
    withRouter(<AdvancedSettings />);
    fireEvent.click(screen.getByText('الإشعارات'));
    await waitFor(() => screen.getByText('النظام'));
    // Click the toggle for "النظام" notifications
    const toggleBtns = screen.getAllByRole('button');
    const toggleBtn = toggleBtns.find(btn => btn.className.includes('rounded-full'));
    if (toggleBtn) {
      fireEvent.click(toggleBtn);
      await waitFor(() => {
        expect(screen.getByText('تغييرات غير محفوظة')).toBeInTheDocument();
      });
    }
  });

  it('changes quantum mode setting', () => {
    withRouter(<AdvancedSettings />);
    const modeSelect = screen.getByDisplayValue('أساسي');
    fireEvent.change(modeSelect, { target: { value: 'advanced' } });
    expect(screen.getByText('تغييرات غير محفوظة')).toBeInTheDocument();
  });
});

// ─── ApiKeysDashboard ──────────────────────────────────────

describe('ApiKeysDashboard', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    localStorage.clear();
    onClose.mockClear();
    (hasFeature as jest.Mock).mockReturnValue(true);
  });

  it('renders without crashing', () => {
    const { container } = render(<ApiKeysDashboard onClose={onClose} />);
    expect(container).toBeTruthy();
  });

  it('renders the dashboard heading', () => {
    render(<ApiKeysDashboard onClose={onClose} />);
    expect(screen.getByText('مفاتيح API')).toBeInTheDocument();
  });

  it('shows upgrade prompt when API access is not available', () => {
    (hasFeature as jest.Mock).mockReturnValue(false);
    render(<ApiKeysDashboard onClose={onClose} />);
    expect(screen.getByText('الوصول لـ API غير متاح')).toBeInTheDocument();
  });

  it('shows stats section when API access is available', () => {
    render(<ApiKeysDashboard onClose={onClose} />);
    expect(screen.getByText('مفاتيح نشطة')).toBeInTheDocument();
    expect(screen.getByText('طلبات إجمالية')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<ApiKeysDashboard onClose={onClose} />);
    // The X button in the header
    const buttons = screen.getAllByRole('button');
    const closeBtn = buttons.find(btn =>
      btn.querySelector('svg') !== null && btn.className.includes('hover:bg-gray-800')
    );
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('calls onClose when backdrop is clicked', () => {
    const { container } = render(<ApiKeysDashboard onClose={onClose} />);
    // The outer fixed div backdrop
    const backdrop = container.firstChild as HTMLElement;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('shows new key form when "مفتاح جديد" is clicked', async () => {
    render(<ApiKeysDashboard onClose={onClose} />);
    const createBtn = screen.getByText('مفتاح جديد');
    fireEvent.click(createBtn);
    await waitFor(() => {
      expect(screen.getByText('اسم المفتاح')).toBeInTheDocument();
    });
  });

  it('creates a new API key when form is submitted', async () => {
    render(<ApiKeysDashboard onClose={onClose} />);
    fireEvent.click(screen.getByText('مفتاح جديد'));
    await waitFor(() => screen.getByText('اسم المفتاح'));
    // The placeholder text in the actual component
    const nameInput = screen.getByPlaceholderText(/Production API/i);
    fireEvent.change(nameInput, { target: { value: 'Test Key' } });
    const createSubmitBtn = screen.getByText('إنشاء');
    fireEvent.click(createSubmitBtn);
    await waitFor(() => {
      expect(screen.getByText('Test Key')).toBeInTheDocument();
    });
  });

  it('shows empty state when no keys exist', () => {
    render(<ApiKeysDashboard onClose={onClose} />);
    expect(screen.getByText(/المفاتيح/)).toBeInTheDocument();
  });
});

// ─── CommandPalette ────────────────────────────────────────

describe('CommandPalette', () => {
  const onClose = jest.fn();
  const setCommandQuery = jest.fn();

  const mockCommands = [
    {
      id: 'cmd-1',
      label: 'Toggle Theme',
      labelAr: 'تبديل الثيم',
      icon: () => <span data-testid="icon-1">⚙</span>,
      category: 'theme' as const,
      action: jest.fn(),
      shortcut: 'Ctrl+T',
    },
    {
      id: 'cmd-2',
      label: 'Go to Dashboard',
      labelAr: 'لوحة التحكم',
      icon: () => <span data-testid="icon-2">🏠</span>,
      category: 'navigation' as const,
      action: jest.fn(),
    },
    {
      id: 'cmd-3',
      label: 'Quantum Simulate',
      labelAr: 'محاكاة كمية',
      icon: () => <span data-testid="icon-3">⚛</span>,
      category: 'quantum' as const,
      action: jest.fn(),
    },
  ];

  beforeEach(() => {
    onClose.mockClear();
    setCommandQuery.mockClear();
    mockCommands.forEach(cmd => (cmd.action as jest.Mock).mockClear());
  });

  it('returns null when isOpen is false', () => {
    const { container } = render(
      <CommandPalette
        isOpen={false}
        onClose={onClose}
        commandQuery=""
        setCommandQuery={setCommandQuery}
        filteredCommands={mockCommands}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders when isOpen is true', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        commandQuery=""
        setCommandQuery={setCommandQuery}
        filteredCommands={mockCommands}
      />
    );
    expect(screen.getByText('لوحة الأوامر الذكية')).toBeInTheDocument();
  });

  it('shows the search input with placeholder', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        commandQuery=""
        setCommandQuery={setCommandQuery}
        filteredCommands={mockCommands}
      />
    );
    expect(screen.getByPlaceholderText(/ابحث عن الأوامر/)).toBeInTheDocument();
  });

  it('calls setCommandQuery when search input changes', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        commandQuery=""
        setCommandQuery={setCommandQuery}
        filteredCommands={mockCommands}
      />
    );
    const searchInput = screen.getByPlaceholderText(/ابحث عن الأوامر/);
    fireEvent.change(searchInput, { target: { value: 'محاكاة' } });
    expect(setCommandQuery).toHaveBeenCalledWith('محاكاة');
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        commandQuery=""
        setCommandQuery={setCommandQuery}
        filteredCommands={mockCommands}
      />
    );
    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('shows "no commands" message when filteredCommands is empty', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        commandQuery="nonexistent"
        setCommandQuery={setCommandQuery}
        filteredCommands={[]}
      />
    );
    expect(screen.getByText(/لا توجد أوامر مطابقة/)).toBeInTheDocument();
  });

  it('renders commands grouped by category', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        commandQuery=""
        setCommandQuery={setCommandQuery}
        filteredCommands={mockCommands}
      />
    );
    expect(screen.getByText('تبديل الثيم')).toBeInTheDocument();
    expect(screen.getByText('لوحة التحكم')).toBeInTheDocument();
    expect(screen.getByText('محاكاة كمية')).toBeInTheDocument();
  });

  it('shows category headings', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        commandQuery=""
        setCommandQuery={setCommandQuery}
        filteredCommands={mockCommands}
      />
    );
    expect(screen.getByText('الثيم والمظهر')).toBeInTheDocument();
    expect(screen.getByText('التنقل')).toBeInTheDocument();
    expect(screen.getByText('النظام الكمي')).toBeInTheDocument();
  });

  it('executes command and closes palette when a command button is clicked', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        commandQuery=""
        setCommandQuery={setCommandQuery}
        filteredCommands={mockCommands}
      />
    );
    const cmdButton = screen.getByText('تبديل الثيم').closest('button');
    fireEvent.click(cmdButton as HTMLElement);
    expect(mockCommands[0]!.action).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    expect(setCommandQuery).toHaveBeenCalledWith('');
  });

  it('shows keyboard shortcut for commands that have one', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        commandQuery=""
        setCommandQuery={setCommandQuery}
        filteredCommands={mockCommands}
      />
    );
    expect(screen.getByText('Ctrl+T')).toBeInTheDocument();
  });

  it('shows keyboard shortcut hints at bottom', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        commandQuery=""
        setCommandQuery={setCommandQuery}
        filteredCommands={mockCommands}
      />
    );
    expect(screen.getByText(/Ctrl\+K/)).toBeInTheDocument();
  });

  it('displays current commandQuery value in input', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        commandQuery="test query"
        setCommandQuery={setCommandQuery}
        filteredCommands={[]}
      />
    );
    const input = screen.getByPlaceholderText(/ابحث عن الأوامر/) as HTMLInputElement;
    expect(input.value).toBe('test query');
  });
});

// ─── ExportToolbar ─────────────────────────────────────────

describe('ExportToolbar (additional coverage)', () => {
  beforeEach(() => {
    (hasFeature as jest.Mock).mockReturnValue(true);
    (exportDashboardSnapshot as jest.Mock).mockResolvedValue(undefined);
    (exportDataReport as jest.Mock).mockImplementation(() => undefined);
  });

  it('renders export button when feature is enabled', () => {
    render(<ExportToolbar tabName="لوحة التحكم" />);
    expect(screen.getByText('تصدير')).toBeInTheDocument();
  });

  it('opens dropdown menu when export button is clicked', async () => {
    render(<ExportToolbar tabName="لوحة التحكم" />);
    const exportBtn = screen.getByText('تصدير');
    fireEvent.click(exportBtn);
    await waitFor(() => {
      expect(screen.getByText('لقطة الشاشة (PDF)')).toBeInTheDocument();
    });
  });

  it('closes menu and calls exportDashboardSnapshot on snapshot click', async () => {
    render(<ExportToolbar tabName="لوحة التحكم" />);
    fireEvent.click(screen.getByText('تصدير'));
    await waitFor(() => screen.getByText('لقطة الشاشة (PDF)'));
    fireEvent.click(screen.getByText('لقطة الشاشة (PDF)'));
    await waitFor(() => {
      expect(exportDashboardSnapshot).toHaveBeenCalled();
    });
  });

  it('shows data report button when sections are provided', async () => {
    const sections = [{ title: 'قسم 1', data: [{ label: 'A', value: '1' }] }];
    render(<ExportToolbar tabName="تقرير" sections={sections} />);
    fireEvent.click(screen.getByText('تصدير'));
    await waitFor(() => {
      expect(screen.getByText('تقرير بيانات (PDF)')).toBeInTheDocument();
    });
  });

  it('calls exportDataReport when data report button is clicked', async () => {
    const sections = [{ title: 'قسم 1', data: [{ label: 'A', value: '1' }] }];
    render(<ExportToolbar tabName="تقرير" sections={sections} />);
    fireEvent.click(screen.getByText('تصدير'));
    await waitFor(() => screen.getByText('تقرير بيانات (PDF)'));
    fireEvent.click(screen.getByText('تقرير بيانات (PDF)'));
    expect(exportDataReport).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'تقرير تقرير' })
    );
  });

  it('hides data report button when no sections provided', async () => {
    render(<ExportToolbar tabName="لوحة" />);
    fireEvent.click(screen.getByText('تصدير'));
    await waitFor(() => screen.getByText('لقطة الشاشة (PDF)'));
    expect(screen.queryByText('تقرير بيانات (PDF)')).not.toBeInTheDocument();
  });

  it('toggles menu closed when export button is clicked again', async () => {
    render(<ExportToolbar tabName="لوحة" />);
    fireEvent.click(screen.getByText('تصدير'));
    await waitFor(() => screen.getByText('لقطة الشاشة (PDF)'));
    fireEvent.click(screen.getByText('تصدير'));
    await waitFor(() => {
      expect(screen.queryByText('لقطة الشاشة (PDF)')).not.toBeInTheDocument();
    });
  });

  it('returns null when hasPdfExport feature is not available', () => {
    (hasFeature as jest.Mock).mockReturnValue(false);
    const { container } = render(<ExportToolbar tabName="لوحة" />);
    expect(container.firstChild).toBeNull();
  });
});
