import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuantumSystemDemo from '../../src/components/QuantumSystemDemo';
import { aiService as mockAiService } from '../../src/aiService';

// Mock aiService
vi.mock('../../src/aiService', () => ({
  aiService: {
    sendMessage: vi.fn().mockResolvedValue({
      response: 'استجابة الذكاء الاصطناعي للاختبار',
      confidence: 0.85,
      quantumScore: '1.234',
      tokensUsed: 50,
      provider: 'OpenAI',
    }),
    getUsageStats: vi.fn().mockReturnValue({
      totalMessages: 0,
      userMessages: 0,
      aiMessages: 0,
    }),
  },
}));

// Mock config
vi.mock('../../src/config', () => ({
  AI_CONFIG: {
    OPENAI_API_KEY: 'test-key',
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    OPENAI_MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.7,
  },
  AI_PERSONALITIES: {
    analytical: { name: 'تحليلي', systemPrompt: '...', temperature: 0.3 },
    creative: { name: 'إبداعي', systemPrompt: '...', temperature: 0.9 },
    friendly: { name: 'ودود', systemPrompt: '...', temperature: 0.7 },
    professional: { name: 'مهني', systemPrompt: '...', temperature: 0.5 },
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => {
  const mockIcon = ({ className }: { className?: string }) => (
    <svg data-testid="icon" className={className} />
  );
  return {
    Atom: mockIcon,
    Shield: mockIcon,
    Brain: mockIcon,
    Activity: mockIcon,
    CheckCircle: mockIcon,
    Zap: mockIcon,
    BarChart3: mockIcon,
    Lock: mockIcon,
    Cpu: mockIcon,
    Network: mockIcon,
  };
});

describe('QuantumSystemDemo Component', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('يجب أن يعرض عنوان النظام', () => {
    render(<QuantumSystemDemo />);
    expect(screen.getByText('النظام الكمي المتقدم')).toBeInTheDocument();
  });

  it('يجب أن يعرض شريط التبويبات', () => {
    render(<QuantumSystemDemo />);
    expect(screen.getByText('نظرة عامة')).toBeInTheDocument();
    expect(screen.getByText('الكم')).toBeInTheDocument();
    expect(screen.getByText('الذكاء الاصطناعي')).toBeInTheDocument();
    expect(screen.getByText('الأمان')).toBeInTheDocument();
  });

  it('يجب أن يعرض نظرة عامة كتبويب افتراضي', () => {
    render(<QuantumSystemDemo />);
    expect(screen.getByText('مقاييس الأداء الكمي')).toBeInTheDocument();
    expect(screen.getByText('مكونات النظام')).toBeInTheDocument();
  });

  it('يجب أن يعرض مقاييس الأداء الأولية', () => {
    render(<QuantumSystemDemo />);
    expect(screen.getByText('الكيوبتات النشطة')).toBeInTheDocument();
    expect(screen.getByText('دقة البوابات')).toBeInTheDocument();
    expect(screen.getByText('زمن التماسك')).toBeInTheDocument();
    expect(screen.getByText('معدل الخطأ')).toBeInTheDocument();
  });

  it('يجب أن تتحدث المقاييس بعد التهيئة', async () => {
    render(<QuantumSystemDemo />);
    await waitFor(() => expect(screen.getByText('127')).toBeInTheDocument(), { timeout: 2000 });
  });

  it('يجب أن يعرض ميزات النظام', () => {
    render(<QuantumSystemDemo />);
    expect(screen.getByText('الحوسبة الكمية')).toBeInTheDocument();
    expect(screen.getByText('الذكاء الاصطناعي التوليدي')).toBeInTheDocument();
    expect(screen.getByText('الأمان الكمي')).toBeInTheDocument();
  });

  it('يجب أن ينتقل إلى تبويب الكم عند النقر', () => {
    render(<QuantumSystemDemo />);
    fireEvent.click(screen.getByText('الكم'));
    expect(screen.getByText('الخوارزميات الكمية المدعومة')).toBeInTheDocument();
  });

  it('يجب أن يعرض خوارزميات الكم في تبويب الكم', () => {
    render(<QuantumSystemDemo />);
    fireEvent.click(screen.getByText('الكم'));
    expect(screen.getByText('خوارزمية Shor')).toBeInTheDocument();
    expect(screen.getByText('خوارزمية Grover')).toBeInTheDocument();
    expect(screen.getByText('VQE')).toBeInTheDocument();
    expect(screen.getByText('QAOA')).toBeInTheDocument();
    expect(screen.getByText('QFT')).toBeInTheDocument();
  });

  it('يجب أن ينتقل إلى تبويب الذكاء الاصطناعي', () => {
    render(<QuantumSystemDemo />);
    fireEvent.click(screen.getByText('الذكاء الاصطناعي'));
    expect(screen.getByText('شخصية المساعد')).toBeInTheDocument();
    expect(screen.getByText('محادثة مع الذكاء الاصطناعي')).toBeInTheDocument();
  });

  it('يجب أن يعرض خيارات الشخصيات في تبويب الذكاء الاصطناعي', () => {
    render(<QuantumSystemDemo />);
    fireEvent.click(screen.getByText('الذكاء الاصطناعي'));
    expect(screen.getByText('تحليلي')).toBeInTheDocument();
    expect(screen.getByText('إبداعي')).toBeInTheDocument();
    expect(screen.getByText('ودود')).toBeInTheDocument();
    expect(screen.getByText('مهني')).toBeInTheDocument();
  });

  it('يجب أن يتمكن من تغيير الشخصية', () => {
    render(<QuantumSystemDemo />);
    fireEvent.click(screen.getByText('الذكاء الاصطناعي'));
    fireEvent.click(screen.getByText('تحليلي'));
    const analyticalBtn = screen.getByText('تحليلي');
    expect(analyticalBtn.className).toContain('bg-blue-600');
  });

  it('يجب أن يعرض حقل إدخال المحادثة', () => {
    render(<QuantumSystemDemo />);
    fireEvent.click(screen.getByText('الذكاء الاصطناعي'));
    expect(screen.getByPlaceholderText('اكتب رسالتك هنا...')).toBeInTheDocument();
  });

  it('يجب أن يرسل رسالة عند النقر على زر الإرسال', async () => {
    render(<QuantumSystemDemo />);
    fireEvent.click(screen.getByText('الذكاء الاصطناعي'));

    const input = screen.getByPlaceholderText('اكتب رسالتك هنا...');
    fireEvent.change(input, { target: { value: 'مرحباً' } });
    fireEvent.click(screen.getByText('إرسال'));

    await waitFor(() => {
      expect(screen.getByText('مرحباً')).toBeInTheDocument();
    });
  });

  it('يجب أن يرسل رسالة عند الضغط على Enter', async () => {
    render(<QuantumSystemDemo />);
    fireEvent.click(screen.getByText('الذكاء الاصطناعي'));

    const input = screen.getByPlaceholderText('اكتب رسالتك هنا...');
    fireEvent.change(input, { target: { value: 'رسالة Enter' } });

    await waitFor(() => expect(input).toHaveValue('رسالة Enter'));

    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(mockAiService.sendMessage).toHaveBeenCalled();
    });
  });

  it('يجب أن ينتقل إلى تبويب الأمان', () => {
    render(<QuantumSystemDemo />);
    fireEvent.click(screen.getByText('الأمان'));
    expect(screen.getByText('فحوصات الأمان')).toBeInTheDocument();
  });

  it('يجب أن يعرض فحوصات الأمان في تبويب الأمان', () => {
    render(<QuantumSystemDemo />);
    fireEvent.click(screen.getByText('الأمان'));
    expect(screen.getByText('تشفير AES-256')).toBeInTheDocument();
    expect(screen.getByText('مصادقة ثنائية')).toBeInTheDocument();
    expect(screen.getByText('بروتوكول BB84 الكمي')).toBeInTheDocument();
    expect(screen.getByText('حماية من هجمات Quantum')).toBeInTheDocument();
  });

  it('يجب أن يعرض مستوى الأمان في تبويب الأمان', () => {
    render(<QuantumSystemDemo />);
    fireEvent.click(screen.getByText('الأمان'));
    expect(screen.getByText('98.7%')).toBeInTheDocument();
    expect(screen.getByText('مستوى الأمان')).toBeInTheDocument();
  });

  it('يجب أن يعرض حالة النظام يعمل', () => {
    render(<QuantumSystemDemo />);
    expect(screen.getByText('النظام يعمل')).toBeInTheDocument();
  });

  it('يجب أن يعرض التذييل', () => {
    render(<QuantumSystemDemo />);
    expect(screen.getByText(/جميع الحقوق محفوظة/)).toBeInTheDocument();
  });
});
