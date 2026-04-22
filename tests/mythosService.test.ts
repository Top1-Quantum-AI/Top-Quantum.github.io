/**
 * mythosService Tests
 * Tests the TypeScript client for the OpenMythos FastAPI microservice.
 * All network calls are mocked by replacing globalThis.fetch.
 */
import {
  createModel,
  getModelInfo,
  listModels,
  forwardPass,
  generateTokens,
  getMythosHealth,
  type ModelInfo,
  type GenerateResult,
  type ForwardResult,
  type HealthStatus,
} from '../src/services/mythosService';

const BASE = '/api/mythos';

function mockFetchOk(data: unknown): void {
  (globalThis as unknown as { fetch: jest.Mock }).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
    statusText: 'OK',
  } as Response);
}

function mockFetchError(status: number, detail?: string): void {
  (globalThis as unknown as { fetch: jest.Mock }).fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    statusText: 'Error',
    json: () => Promise.resolve(detail ? { detail } : {}),
  } as Response);
}

function mockFetchErrorJsonFail(statusText: string): void {
  (globalThis as unknown as { fetch: jest.Mock }).fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 500,
    statusText,
    json: () => Promise.reject(new Error('parse error')),
  } as unknown as Response);
}

function getFetchMock(): jest.Mock {
  return (globalThis as unknown as { fetch: jest.Mock }).fetch;
}

describe('mythosService', () => {
  beforeEach(() => {
    (globalThis as unknown as { fetch: jest.Mock }).fetch = jest.fn();
  });

  describe('createModel()', () => {
    it('should POST to /models/create with correct body', async () => {
      const mockInfo: ModelInfo = {
        model_id: 'test-model',
        total_parameters: 100000,
        spectral_radius: 0.99,
        config: {},
      };
      mockFetchOk(mockInfo);

      const result = await createModel('test-model', { dim: 128, n_heads: 4 });

      expect(getFetchMock()).toHaveBeenCalledWith(
        `${BASE}/models/create`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ model_id: 'test-model', config: { dim: 128, n_heads: 4 } }),
        })
      );
      expect(result).toEqual(mockInfo);
    });

    it('should include Content-Type header', async () => {
      mockFetchOk({ model_id: 'x', total_parameters: 0, spectral_radius: 1, config: {} });
      await createModel('x', {});
      expect(getFetchMock()).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        })
      );
    });

    it('should throw on error response with detail', async () => {
      mockFetchError(400, 'Invalid config');
      await expect(createModel('bad', {})).rejects.toThrow('Invalid config');
    });

    it('should throw on error response when JSON parse fails', async () => {
      mockFetchErrorJsonFail('Internal Server Error');
      await expect(createModel('bad', {})).rejects.toThrow('Internal Server Error');
    });
  });

  describe('getModelInfo()', () => {
    it('should GET /models/:modelId/info', async () => {
      const mockInfo: ModelInfo = {
        model_id: 'abc',
        total_parameters: 50000,
        spectral_radius: 0.95,
        config: { dim: 64 },
      };
      mockFetchOk(mockInfo);

      const result = await getModelInfo('abc');

      expect(getFetchMock()).toHaveBeenCalledWith(`${BASE}/models/abc/info`, expect.any(Object));
      expect(result).toEqual(mockInfo);
    });

    it('should throw when model not found', async () => {
      mockFetchError(404, 'Model not found');
      await expect(getModelInfo('nonexistent')).rejects.toThrow('Model not found');
    });
  });

  describe('listModels()', () => {
    it('should GET /models', async () => {
      const mockResponse = {
        models: [{ model_id: 'm1', total_parameters: 100, spectral_radius: 1, config: {} }],
      };
      mockFetchOk(mockResponse);

      const result = await listModels();

      expect(getFetchMock()).toHaveBeenCalledWith(`${BASE}/models`, expect.any(Object));
      expect(result.models).toHaveLength(1);
      expect(result.models[0]?.model_id).toBe('m1');
    });

    it('should return empty models array when none loaded', async () => {
      mockFetchOk({ models: [] });
      const result = await listModels();
      expect(result.models).toEqual([]);
    });
  });

  describe('forwardPass()', () => {
    it('should POST to /models/:id/forward with correct body', async () => {
      const mockResult: ForwardResult = { shape: [1, 10, 512] };
      mockFetchOk(mockResult);

      const inputIds = [
        [1, 2, 3],
        [4, 5, 6],
      ];
      const result = await forwardPass('mymodel', inputIds, 8);

      expect(getFetchMock()).toHaveBeenCalledWith(
        `${BASE}/models/mymodel/forward`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ input_ids: inputIds, n_loops: 8 }),
        })
      );
      expect(result).toEqual(mockResult);
    });

    it('should use default n_loops = 4', async () => {
      mockFetchOk({ shape: [1, 5, 256] });
      await forwardPass('model1', [[1, 2]]);
      const callArgs = getFetchMock().mock.calls[0] as [string, { body: string }];
      const callBody = JSON.parse(callArgs[1].body) as { n_loops: number };
      expect(callBody.n_loops).toBe(4);
    });
  });

  describe('generateTokens()', () => {
    it('should POST to /models/:id/generate with all params', async () => {
      const mockResult: GenerateResult = {
        model_id: 'gen-model',
        output_ids: [[1, 2, 3]],
        shape: [1, 3],
        new_tokens: 3,
      };
      mockFetchOk(mockResult);

      const result = await generateTokens('gen-model', [[10, 20]], 30, 5, 0.8, 40);

      expect(getFetchMock()).toHaveBeenCalledWith(
        `${BASE}/models/gen-model/generate`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            input_ids: [[10, 20]],
            max_new_tokens: 30,
            n_loops: 5,
            temperature: 0.8,
            top_k: 40,
          }),
        })
      );
      expect(result).toEqual(mockResult);
    });

    it('should use default parameters when not provided', async () => {
      mockFetchOk({ model_id: 'x', output_ids: [[1]], shape: [1, 1], new_tokens: 1 });
      await generateTokens('x', [[1]]);
      const callArgs = getFetchMock().mock.calls[0] as [string, { body: string }];
      const callBody = JSON.parse(callArgs[1].body) as {
        max_new_tokens: number;
        n_loops: number;
        temperature: number;
        top_k: number;
      };
      expect(callBody.max_new_tokens).toBe(20);
      expect(callBody.n_loops).toBe(4);
      expect(callBody.temperature).toBe(1.0);
      expect(callBody.top_k).toBe(50);
    });

    it('should throw on service error', async () => {
      mockFetchError(503, 'Service unavailable');
      await expect(generateTokens('m', [[1]])).rejects.toThrow('Service unavailable');
    });
  });

  describe('getMythosHealth()', () => {
    it('should GET /health', async () => {
      const mockStatus: HealthStatus = {
        status: 'ok',
        torch_version: '2.0.0',
        device: 'cpu',
        models_loaded: ['model-1'],
      };
      mockFetchOk(mockStatus);

      const result = await getMythosHealth();

      expect(getFetchMock()).toHaveBeenCalledWith(`${BASE}/health`, expect.any(Object));
      expect(result).toEqual(mockStatus);
    });

    it('should throw when health check fails', async () => {
      mockFetchError(503, 'Service is down');
      await expect(getMythosHealth()).rejects.toThrow('Service is down');
    });
  });

  describe('error handling', () => {
    it('should use statusText as fallback when JSON has no detail', async () => {
      (globalThis as unknown as { fetch: jest.Mock }).fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ message: 'something' }),
      } as Response);
      await expect(getMythosHealth()).rejects.toThrow('Internal Server Error');
    });

    it('should use statusText when JSON parse fails', async () => {
      mockFetchErrorJsonFail('Bad Gateway');
      await expect(getMythosHealth()).rejects.toThrow('Bad Gateway');
    });
  });
});
