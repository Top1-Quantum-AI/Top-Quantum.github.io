/**
 * groqService Tests
 * Tests the Groq AI service client.
 */
import {
  isApiKeyConfigured,
  sendChatMessage,
  analyzeSystemData,
  analyzeSecurityThreats,
  analyzeQuantumPerformance,
  type ChatMessage,
} from '../src/services/groqService';

interface FetchMock {
  fetch: jest.Mock;
}

function mockFetchOk(content: string): void {
  (globalThis as unknown as FetchMock).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        choices: [{ message: { content } }],
      }),
  } as Response);
}

function mockFetchError(status: number, errorMsg: string): void {
  (globalThis as unknown as FetchMock).fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ error: { message: errorMsg } }),
  } as Response);
}

function mockFetchErrorJsonFail(status: number): void {
  (globalThis as unknown as FetchMock).fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.reject(new Error('parse fail')),
  } as unknown as Response);
}

describe('groqService', () => {
  beforeEach(() => {
    (globalThis as unknown as FetchMock).fetch = jest.fn();
  });

  describe('isApiKeyConfigured()', () => {
    it('should return false when VITE_OPENAI_API_KEY is empty', () => {
      process.env['VITE_OPENAI_API_KEY'] = '';
      expect(isApiKeyConfigured()).toBe(false);
    });

    it('should return true when VITE_OPENAI_API_KEY is set', () => {
      process.env['VITE_OPENAI_API_KEY'] = 'sk-test-key';
      expect(isApiKeyConfigured()).toBe(true);
      process.env['VITE_OPENAI_API_KEY'] = ''; // restore
    });
  });

  describe('sendChatMessage()', () => {
    beforeEach(() => {
      process.env['VITE_OPENAI_API_KEY'] = 'sk-test-key';
    });

    afterEach(() => {
      process.env['VITE_OPENAI_API_KEY'] = '';
    });

    it('should throw when API key is not configured', async () => {
      process.env['VITE_OPENAI_API_KEY'] = '';
      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }];
      await expect(sendChatMessage(messages)).rejects.toThrow('مفتاح API');
    });

    it('should POST to Groq API endpoint', async () => {
      mockFetchOk('AI response text');
      const messages: ChatMessage[] = [{ role: 'user', content: 'مرحبا' }];
      await sendChatMessage(messages);
      expect((globalThis as unknown as FetchMock).fetch).toHaveBeenCalledWith(
        'https://api.groq.com/openai/v1/chat/completions',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should include Authorization header with bearer token', async () => {
      mockFetchOk('response');
      await sendChatMessage([{ role: 'user', content: 'test' }]);
      const callArgs = (globalThis as unknown as FetchMock).fetch.mock.calls[0] as [
        string,
        { headers: Record<string, string> },
      ];
      expect(callArgs[1].headers['Authorization']).toBe('Bearer sk-test-key');
    });

    it('should include Content-Type application/json header', async () => {
      mockFetchOk('response');
      await sendChatMessage([{ role: 'user', content: 'test' }]);
      const callArgs = (globalThis as unknown as FetchMock).fetch.mock.calls[0] as [
        string,
        { headers: Record<string, string> },
      ];
      expect(callArgs[1].headers['Content-Type']).toBe('application/json');
    });

    it('should return the AI response content', async () => {
      mockFetchOk('هذا هو الرد من الذكاء الاصطناعي');
      const result = await sendChatMessage([{ role: 'user', content: 'سؤال' }]);
      expect(result).toBe('هذا هو الرد من الذكاء الاصطناعي');
    });

    it('should prepend system prompt to messages', async () => {
      mockFetchOk('ok');
      await sendChatMessage([{ role: 'user', content: 'hello' }], 'Custom system prompt');
      const callArgs = (globalThis as unknown as FetchMock).fetch.mock.calls[0] as [
        string,
        { body: string },
      ];
      const body = JSON.parse(callArgs[1].body) as { messages: ChatMessage[] };
      expect(body.messages[0]?.role).toBe('system');
      expect(body.messages[0]?.content).toBe('Custom system prompt');
      expect(body.messages[1]?.role).toBe('user');
    });

    it('should use default system prompt when none provided', async () => {
      mockFetchOk('ok');
      await sendChatMessage([{ role: 'user', content: 'test' }]);
      const callArgs = (globalThis as unknown as FetchMock).fetch.mock.calls[0] as [
        string,
        { body: string },
      ];
      const body = JSON.parse(callArgs[1].body) as { messages: ChatMessage[] };
      expect(body.messages[0]?.role).toBe('system');
      // Default prompt contains Arabic text about AI analysis
      expect(body.messages[0]?.content).toContain('Top1 Quantum AI');
    });

    it('should use llama-3.3-70b-versatile model', async () => {
      mockFetchOk('ok');
      await sendChatMessage([{ role: 'user', content: 'test' }]);
      const callArgs = (globalThis as unknown as FetchMock).fetch.mock.calls[0] as [
        string,
        { body: string },
      ];
      const body = JSON.parse(callArgs[1].body) as { model: string };
      expect(body.model).toBe('llama-3.3-70b-versatile');
    });

    it('should throw on API error response with error message', async () => {
      mockFetchError(400, 'Invalid request body');
      await expect(sendChatMessage([{ role: 'user', content: 'test' }])).rejects.toThrow(
        'Invalid request body'
      );
    });

    it('should throw with status fallback when JSON parse fails', async () => {
      mockFetchErrorJsonFail(500);
      await expect(sendChatMessage([{ role: 'user', content: 'test' }])).rejects.toThrow(
        'خطأ في API: 500'
      );
    });

    it('should throw when choices array is empty', async () => {
      (globalThis as unknown as FetchMock).fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ choices: [] }),
      } as Response);
      await expect(sendChatMessage([{ role: 'user', content: 'test' }])).rejects.toThrow(
        'لم يتم استلام رد'
      );
    });

    it('should throw when choice has no content', async () => {
      (globalThis as unknown as FetchMock).fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ choices: [{ message: { content: null } }] }),
      } as Response);
      await expect(sendChatMessage([{ role: 'user', content: 'test' }])).rejects.toThrow(
        'لم يتم استلام رد'
      );
    });

    it('should handle multiple user messages', async () => {
      mockFetchOk('multi-turn response');
      const messages: ChatMessage[] = [
        { role: 'user', content: 'سؤال أول' },
        { role: 'assistant', content: 'رد أول' },
        { role: 'user', content: 'سؤال ثاني' },
      ];
      const result = await sendChatMessage(messages);
      expect(result).toBe('multi-turn response');
    });
  });

  describe('analyzeSystemData()', () => {
    beforeEach(() => {
      process.env['VITE_OPENAI_API_KEY'] = 'sk-test';
    });

    afterEach(() => {
      process.env['VITE_OPENAI_API_KEY'] = '';
    });

    it('should call sendChatMessage with system data as JSON', async () => {
      mockFetchOk('تحليل البيانات...');
      const systemData = { cpu: 42, memory: 65, status: 'ok' };
      const result = await analyzeSystemData(systemData);
      expect(result).toBe('تحليل البيانات...');
      // Verify the system data was included in the request
      const callArgs = (globalThis as unknown as FetchMock).fetch.mock.calls[0] as [
        string,
        { body: string },
      ];
      const body = JSON.parse(callArgs[1].body) as { messages: ChatMessage[] };
      const userMsg = body.messages.find(m => m.role === 'user');
      expect(userMsg?.content).toContain(JSON.stringify(systemData, null, 2));
    });
  });

  describe('analyzeSecurityThreats()', () => {
    beforeEach(() => {
      process.env['VITE_OPENAI_API_KEY'] = 'sk-test';
    });

    afterEach(() => {
      process.env['VITE_OPENAI_API_KEY'] = '';
    });

    it('should call sendChatMessage with threats as JSON', async () => {
      mockFetchOk('تحليل التهديدات...');
      const threats = [{ type: 'brute-force', severity: 'high' }];
      const result = await analyzeSecurityThreats(threats);
      expect(result).toBe('تحليل التهديدات...');
      const callArgs = (globalThis as unknown as FetchMock).fetch.mock.calls[0] as [
        string,
        { body: string },
      ];
      const body = JSON.parse(callArgs[1].body) as { messages: ChatMessage[] };
      const userMsg = body.messages.find(m => m.role === 'user');
      expect(userMsg?.content).toContain('"type": "brute-force"');
    });
  });

  describe('analyzeQuantumPerformance()', () => {
    beforeEach(() => {
      process.env['VITE_OPENAI_API_KEY'] = 'sk-test';
    });

    afterEach(() => {
      process.env['VITE_OPENAI_API_KEY'] = '';
    });

    it('should call sendChatMessage with quantum data', async () => {
      mockFetchOk('تحليل الكم...');
      const quantumData = [{ qubits: 50, fidelity: 0.99 }];
      const result = await analyzeQuantumPerformance(quantumData);
      expect(result).toBe('تحليل الكم...');
    });
  });
});
