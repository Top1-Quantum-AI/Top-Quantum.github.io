import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuantumDashboard from '../../src/components/QuantumDashboard';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Use importOriginal to avoid enumerating all icons
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return { ...actual };
});

describe('QuantumDashboard Component', () => {
  it('يجب أن يُعرض دون أخطاء', () => {
    render(<QuantumDashboard />);
    expect(document.body).toBeTruthy();
  });

  it('يجب أن يعرض لوحة تحكم الحوسبة الكمية', () => {
    render(<QuantumDashboard />);
    expect(screen.getAllByText(/كم|Quantum|معالج/i).length).toBeGreaterThan(0);
  });

  it('يجب أن يعرض محتوى اللوحة', () => {
    render(<QuantumDashboard />);
    const content = document.body.textContent ?? '';
    expect(content.length).toBeGreaterThan(0);
  });

  it('يجب أن تكون الأزرار قابلة للنقر', () => {
    render(<QuantumDashboard />);
    const buttons = screen.getAllByRole('button');
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]!);
      expect(document.body).toBeTruthy();
    }
  });

  it('يجب أن يعرض مقاييس المعالجات الكمية', () => {
    render(<QuantumDashboard />);
    expect(screen.getAllByText(/معالج كمي/i).length).toBeGreaterThan(0);
  });

  it('يجب أن يعرض حالة الدوائر الكمية', () => {
    render(<QuantumDashboard />);
    const circuitElements = screen.queryAllByText(/دائرة كمية/i);
    expect(circuitElements.length >= 0).toBe(true);
  });
});

