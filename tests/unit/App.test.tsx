import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import App, { AppInfo } from '../../src/App';

// Mock AdvancedSecurityDashboard to avoid complex dependencies
vi.mock('../../src/components/AdvancedSecurityDashboard', () => ({
  default: () => <div data-testid="advanced-security-dashboard">لوحة الأمان المتقدمة</div>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Atom: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg data-testid="atom-icon" className={className} style={style} />
  ),
  Loader2: ({ className }: { className?: string }) => (
    <svg data-testid="loader-icon" className={className} />
  ),
  AlertCircle: ({ className }: { className?: string }) => (
    <svg data-testid="alert-icon" className={className} />
  ),
  CheckCircle: ({ className }: { className?: string }) => (
    <svg data-testid="check-icon" className={className} />
  ),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('يجب أن يعرض شاشة التحميل في البداية', async () => {
    render(<App />);
    expect(screen.getByText('النظام الكمي المتقدم')).toBeInTheDocument();
    expect(screen.getByText('Advanced Quantum AI System')).toBeInTheDocument();
  });

  it('يجب أن يعرض مؤشر التقدم', () => {
    render(<App />);
    expect(screen.getByText(/جاري التحميل/)).toBeInTheDocument();
  });

  it('يجب أن يعرض رسالة الانتظار', () => {
    render(<App />);
    expect(screen.getByText('يرجى الانتظار...')).toBeInTheDocument();
  });
});

describe('AppInfo', () => {
  it('يجب أن يحتوي على معلومات التطبيق الأساسية', () => {
    expect(AppInfo).toHaveProperty('name');
    expect(AppInfo).toHaveProperty('version');
    expect(AppInfo).toHaveProperty('description');
    expect(AppInfo).toHaveProperty('author');
    expect(AppInfo).toHaveProperty('features');
    expect(AppInfo).toHaveProperty('technologies');
  });

  it('اسم التطبيق يجب أن يكون صحيحاً', () => {
    expect(AppInfo.name).toBe('Advanced Quantum AI System');
  });

  it('الإصدار يجب أن يكون 2.0.0', () => {
    expect(AppInfo.version).toBe('2.0.0');
  });

  it('يجب أن يحتوي على قائمة المميزات', () => {
    expect(Array.isArray(AppInfo.features)).toBe(true);
    expect(AppInfo.features.length).toBeGreaterThan(0);
  });

  it('يجب أن يحتوي على قائمة التقنيات', () => {
    expect(Array.isArray(AppInfo.technologies)).toBe(true);
    expect(AppInfo.technologies).toContain('React 18');
    expect(AppInfo.technologies).toContain('TypeScript');
  });

  it('الوصف يجب أن يكون نصاً غير فارغ', () => {
    expect(typeof AppInfo.description).toBe('string');
    expect(AppInfo.description.length).toBeGreaterThan(0);
  });
});
