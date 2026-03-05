import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AIService, aiService } from '../../src/aiService';

// Mock import.meta.env for config
vi.mock('../../src/config', () => ({
  AI_CONFIG: {
    OPENAI_API_KEY: 'test-key',
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    OPENAI_MODEL: 'o1-mini',
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.7,
  },
  AI_PERSONALITIES: {
    analytical: {
      name: 'تحليلي',
      systemPrompt: 'أنت مساعد تحليلي',
      temperature: 0.3,
    },
    creative: {
      name: 'إبداعي',
      systemPrompt: 'أنت مساعد إبداعي',
      temperature: 0.9,
    },
    friendly: {
      name: 'ودود',
      systemPrompt: 'أنت مساعد ودود',
      temperature: 0.7,
    },
    professional: {
      name: 'مهني',
      systemPrompt: 'أنت مساعد مهني',
      temperature: 0.5,
    },
  },
}));

describe('AIService', () => {
  let service: AIService;

  beforeEach(() => {
    service = new AIService();
    vi.useFakeTimers();
  });

  it('يجب إنشاء مثيل من AIService بنجاح', () => {
    expect(service).toBeInstanceOf(AIService);
  });

  it('getCurrentProvider يجب أن يُرجع OpenAI', () => {
    expect(service.getCurrentProvider()).toBe('OpenAI');
  });

  it('getHistory يجب أن يُرجع قائمة فارغة في البداية', () => {
    expect(service.getHistory()).toEqual([]);
  });

  it('getUsageStats يجب أن يُرجع إحصائيات صفرية في البداية', () => {
    const stats = service.getUsageStats();
    expect(stats.totalMessages).toBe(0);
    expect(stats.userMessages).toBe(0);
    expect(stats.aiMessages).toBe(0);
  });

  it('clearHistory يجب أن يمسح تاريخ المحادثة', async () => {
    const sendPromise = service.sendMessage('مرحباً', 'friendly');
    await vi.runAllTimersAsync();
    await sendPromise;

    service.clearHistory();
    expect(service.getHistory()).toEqual([]);
  });

  it('sendMessage يجب أن يُرجع استجابة صحيحة', async () => {
    const sendPromise = service.sendMessage('مرحباً', 'friendly');
    await vi.runAllTimersAsync();
    const result = await sendPromise;

    expect(result).toHaveProperty('response');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('quantumScore');
    expect(result).toHaveProperty('tokensUsed');
    expect(result).toHaveProperty('provider');
    expect(result.provider).toBe('OpenAI');
    expect(typeof result.response).toBe('string');
    expect(result.response.length).toBeGreaterThan(0);
  });

  it('sendMessage مع شخصية analytical يجب أن يُرجع استجابة', async () => {
    const sendPromise = service.sendMessage('تحليل', 'analytical');
    await vi.runAllTimersAsync();
    const result = await sendPromise;

    expect(result.provider).toBe('OpenAI');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('sendMessage يجب أن يتعامل مع رسائل الكم', async () => {
    const sendPromise = service.sendMessage('ما هو الكمومي؟', 'friendly');
    await vi.runAllTimersAsync();
    const result = await sendPromise;

    expect(result.response).toContain('كمومي');
  });

  it('sendMessage يجب أن يتعامل مع رسائل الذكاء الاصطناعي', async () => {
    const sendPromise = service.sendMessage('ما هو الذكاء الاصطناعي؟', 'friendly');
    await vi.runAllTimersAsync();
    const result = await sendPromise;

    expect(result.response).toContain('الذكاء الاصطناعي');
  });

  it('sendMessage يجب أن يتعامل مع رسائل الأمن', async () => {
    const sendPromise = service.sendMessage('ما هو الأمن السيبراني؟', 'professional');
    await vi.runAllTimersAsync();
    const result = await sendPromise;

    expect(result.response).toContain('الأمن');
  });

  it('getUsageStats يجب أن يحسب الإحصائيات بعد إرسال رسالة', async () => {
    const sendPromise = service.sendMessage('مرحباً', 'friendly');
    await vi.runAllTimersAsync();
    await sendPromise;

    const stats = service.getUsageStats();
    expect(stats.totalMessages).toBe(2); // user + assistant
    expect(stats.userMessages).toBe(1);
    expect(stats.aiMessages).toBe(1);
  });

  it('confidence يجب أن يكون بين 0 و 0.95', async () => {
    const sendPromise = service.sendMessage('مرحباً', 'friendly');
    await vi.runAllTimersAsync();
    const result = await sendPromise;

    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(0.95);
  });

  it('quantumScore يجب أن يكون رقم منسق بثلاثة خانات عشرية', async () => {
    const sendPromise = service.sendMessage('اختبار', 'analytical');
    await vi.runAllTimersAsync();
    const result = await sendPromise;

    expect(result.quantumScore).toMatch(/^\d+\.\d{3}$/);
  });

  it('الـ singleton aiService يجب أن يكون مثيلاً من AIService', () => {
    expect(aiService).toBeInstanceOf(AIService);
  });
});
