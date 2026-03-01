import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InvestorPitch from '../../src/components/InvestorPitch';

// Mock lucide-react to avoid SVG issues in jsdom
vi.mock('lucide-react', () => {
  const mock = ({ className }: { className?: string }) => (
    <svg data-testid="icon" className={className} />
  );
  return {
    Atom: mock,
    Brain: mock,
    Shield: mock,
    TrendingUp: mock,
    DollarSign: mock,
    Users: mock,
    Target: mock,
    Zap: mock,
    Globe: mock,
    Award: mock,
    BarChart3: mock,
    CheckCircle: mock,
    ArrowRight: mock,
    Layers: mock,
    Lock: mock,
    Cpu: mock,
    Activity: mock,
    Star: mock,
    ChevronDown: mock,
    ChevronUp: mock,
    Mail: mock,
    Phone: mock,
    Network: mock,
  };
});

describe('InvestorPitch Component', () => {
  it('يجب أن يُعرض دون أخطاء', () => {
    render(<InvestorPitch />);
    expect(document.body).toBeTruthy();
  });

  it('يجب أن يعرض اسم الشركة', () => {
    render(<InvestorPitch />);
    expect(screen.getAllByText(/Top1/i).length).toBeGreaterThan(0);
  });

  it('يجب أن يعرض شريط التنقل بين الشرائح', () => {
    render(<InvestorPitch />);
    expect(screen.getByText('الرؤية')).toBeInTheDocument();
    expect(screen.getByText('المشكلة')).toBeInTheDocument();
    expect(screen.getByText('الحل')).toBeInTheDocument();
    expect(screen.getByText('السوق')).toBeInTheDocument();
    expect(screen.getByText('المنتج')).toBeInTheDocument();
    expect(screen.getByText('النموذج التجاري')).toBeInTheDocument();
    expect(screen.getByText('الإنجازات')).toBeInTheDocument();
    expect(screen.getByText('خارطة الطريق')).toBeInTheDocument();
    expect(screen.getByText('الفريق')).toBeInTheDocument();
    expect(screen.getByText('الاستثمار')).toBeInTheDocument();
  });

  it('يجب أن يعرض شريحة الرؤية افتراضياً', () => {
    render(<InvestorPitch />);
    expect(screen.getByText('Quantum AI')).toBeInTheDocument();
    expect(screen.getByText(/فرصة استثمارية/)).toBeInTheDocument();
  });

  it('يجب أن تعرض شريحة الرؤية المقاييس الأساسية', () => {
    render(<InvestorPitch />);
    expect(screen.getByText('127+')).toBeInTheDocument();
    expect(screen.getByText('99.1%')).toBeInTheDocument();
    expect(screen.getByText('$2.5T')).toBeInTheDocument();
    expect(screen.getByText('10x')).toBeInTheDocument();
  });

  it('يجب أن ينتقل إلى شريحة المشكلة عند النقر', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('المشكلة'));
    expect(screen.getByText(/الحوسبة الكلاسيكية وصلت إلى حدودها/)).toBeInTheDocument();
  });

  it('يجب أن ينتقل إلى شريحة الحل عند النقر', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('الحل'));
    expect(screen.getByText(/منصة متكاملة تجمع الكم والذكاء الاصطناعي/)).toBeInTheDocument();
  });

  it('يجب أن ينتقل إلى شريحة السوق عند النقر', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('السوق'));
    expect(screen.getByText(/سوق عالمي بنمو متسارع/)).toBeInTheDocument();
    expect(screen.getByText('$850B')).toBeInTheDocument();
    expect(screen.getByText('$12B')).toBeInTheDocument();
  });

  it('يجب أن ينتقل إلى شريحة المنتج عند النقر', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('المنتج'));
    expect(screen.getByText(/منصة موحدة/)).toBeInTheDocument();
  });

  it('يجب أن ينتقل إلى شريحة النموذج التجاري عند النقر', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('النموذج التجاري'));
    expect(screen.getByText(/مصادر إيرادات متعددة ومستدامة/)).toBeInTheDocument();
    expect(screen.getByText('Enterprise SaaS')).toBeInTheDocument();
    expect(screen.getByText('Government Contracts')).toBeInTheDocument();
  });

  it('يجب أن ينتقل إلى شريحة الإنجازات عند النقر', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('الإنجازات'));
    expect(screen.getByText(/أرقام تتحدث عن نفسها/)).toBeInTheDocument();
    expect(screen.getByText('$2M')).toBeInTheDocument();
  });

  it('يجب أن ينتقل إلى شريحة خارطة الطريق عند النقر', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('خارطة الطريق'));
    expect(screen.getByText(/مسار واضح نحو القيادة العالمية/)).toBeInTheDocument();
    expect(screen.getByText('المرحلة الأولى: التأسيس')).toBeInTheDocument();
  });

  it('يجب أن ينتقل إلى شريحة الفريق عند النقر', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('الفريق'));
    expect(screen.getByText(/فريق من قادة الصناعة/)).toBeInTheDocument();
  });

  it('يجب أن ينتقل إلى شريحة الاستثمار عند النقر', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('الاستثمار'));
    expect(screen.getByText('$15M')).toBeInTheDocument();
    expect(screen.getByText('Series A — جولة السلسلة الأولى')).toBeInTheDocument();
  });

  it('يجب أن يعرض الأسئلة الشائعة في شريحة الاستثمار', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('الاستثمار'));
    expect(screen.getByText('أسئلة شائعة — FAQ')).toBeInTheDocument();
    expect(screen.getByText('ما الذي يميزكم عن المنافسين؟')).toBeInTheDocument();
  });

  it('يجب أن تعمل الأسئلة الشائعة (accordion)', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('الاستثمار'));
    const faqBtn = screen.getByText('ما الذي يميزكم عن المنافسين؟');
    fireEvent.click(faqBtn);
    expect(screen.getByText(/نحن الوحيدون الذين يجمعون/)).toBeInTheDocument();
    // click again to close
    fireEvent.click(faqBtn);
    expect(screen.queryByText(/نحن الوحيدون الذين يجمعون/)).not.toBeInTheDocument();
  });

  it('يجب أن يعمل زر التالي للتنقل للشريحة التالية', () => {
    render(<InvestorPitch />);
    // Start at hero, click next → problem
    fireEvent.click(screen.getByLabelText('الشريحة التالية'));
    expect(screen.getByText(/الحوسبة الكلاسيكية وصلت إلى حدودها/)).toBeInTheDocument();
  });

  it('يجب أن يكون زر السابق معطلاً في الشريحة الأولى', () => {
    render(<InvestorPitch />);
    const prevBtn = screen.getByLabelText('الشريحة السابقة');
    expect(prevBtn).toBeDisabled();
  });

  it('يجب أن يعمل زر السابق للعودة للشريحة السابقة', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByLabelText('الشريحة التالية'));
    fireEvent.click(screen.getByLabelText('الشريحة السابقة'));
    expect(screen.getByText('Quantum AI')).toBeInTheDocument();
  });

  it('يجب أن يكون زر التالي معطلاً في آخر شريحة', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('الاستثمار'));
    expect(screen.getByLabelText('الشريحة التالية')).toBeDisabled();
  });

  it('يجب أن يعرض شريط التقدم', () => {
    render(<InvestorPitch />);
    // Progress bar is a div with a width style
    const progressBar = document.querySelector('.h-1.bg-gradient-to-r');
    expect(progressBar).toBeTruthy();
  });

  it('يجب أن يعرض معلومات التواصل في شريحة الاستثمار', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('الاستثمار'));
    expect(screen.getByText('invest@top1quantum.ai')).toBeInTheDocument();
    expect(screen.getByText('www.top1quantum.ai')).toBeInTheDocument();
  });

  it('يجب أن تعرض شريحة الاستثمار توزيع الأموال', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('الاستثمار'));
    expect(screen.getByText('توزيع الاستثمار — Use of Funds')).toBeInTheDocument();
    expect(screen.getByText('البنية التحتية والأجهزة الكمية')).toBeInTheDocument();
  });

  it('يجب أن تعرض شريحة الاستثمار توقعات الإيرادات', () => {
    render(<InvestorPitch />);
    fireEvent.click(screen.getByText('الاستثمار'));
    expect(screen.getByText('$8M')).toBeInTheDocument();
    expect(screen.getByText('$35M')).toBeInTheDocument();
    expect(screen.getByText('$120M')).toBeInTheDocument();
  });
});
