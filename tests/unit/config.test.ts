import { describe, it, expect } from 'vitest';
import { AI_CONFIG, AI_PERSONALITIES } from '../../src/config';

describe('AI_CONFIG', () => {
  it('يجب أن يحتوي على مفاتيح التكوين الأساسية', () => {
    expect(AI_CONFIG).toHaveProperty('OPENAI_API_KEY');
    expect(AI_CONFIG).toHaveProperty('OPENAI_API_URL');
    expect(AI_CONFIG).toHaveProperty('OPENAI_MODEL');
    expect(AI_CONFIG).toHaveProperty('MAX_TOKENS');
    expect(AI_CONFIG).toHaveProperty('TEMPERATURE');
  });

  it('OPENAI_API_URL يجب أن يكون رابط OpenAI صحيح', () => {
    expect(AI_CONFIG.OPENAI_API_URL).toBe('https://api.openai.com/v1/chat/completions');
  });

  it('OPENAI_MODEL يجب أن يكون o1-mini', () => {
    expect(AI_CONFIG.OPENAI_MODEL).toBe('o1-mini');
  });

  it('MAX_TOKENS يجب أن يكون رقم موجب', () => {
    expect(AI_CONFIG.MAX_TOKENS).toBeGreaterThan(0);
  });

  it('TEMPERATURE يجب أن يكون بين 0 و 1', () => {
    expect(AI_CONFIG.TEMPERATURE).toBeGreaterThanOrEqual(0);
    expect(AI_CONFIG.TEMPERATURE).toBeLessThanOrEqual(1);
  });
});

describe('AI_PERSONALITIES', () => {
  it('يجب أن يحتوي على الشخصيات الأربع الأساسية', () => {
    expect(AI_PERSONALITIES).toHaveProperty('analytical');
    expect(AI_PERSONALITIES).toHaveProperty('creative');
    expect(AI_PERSONALITIES).toHaveProperty('friendly');
    expect(AI_PERSONALITIES).toHaveProperty('professional');
  });

  it('كل شخصية يجب أن تحتوي على الخصائص المطلوبة', () => {
    const personalities = ['analytical', 'creative', 'friendly', 'professional'] as const;
    personalities.forEach((key) => {
      const p = AI_PERSONALITIES[key];
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('systemPrompt');
      expect(p).toHaveProperty('temperature');
      expect(typeof p.name).toBe('string');
      expect(typeof p.systemPrompt).toBe('string');
      expect(typeof p.temperature).toBe('number');
    });
  });

  it('درجة حرارة analytical يجب أن تكون أقل من creative', () => {
    expect(AI_PERSONALITIES.analytical.temperature).toBeLessThan(
      AI_PERSONALITIES.creative.temperature
    );
  });

  it('كل شخصية يجب أن تملك اسماً عربياً', () => {
    expect(AI_PERSONALITIES.analytical.name).toBe('تحليلي');
    expect(AI_PERSONALITIES.creative.name).toBe('إبداعي');
    expect(AI_PERSONALITIES.friendly.name).toBe('ودود');
    expect(AI_PERSONALITIES.professional.name).toBe('مهني');
  });

  it('جميع درجات الحرارة يجب أن تكون بين 0 و 1', () => {
    Object.values(AI_PERSONALITIES).forEach((p) => {
      expect(p.temperature).toBeGreaterThanOrEqual(0);
      expect(p.temperature).toBeLessThanOrEqual(1);
    });
  });
});
