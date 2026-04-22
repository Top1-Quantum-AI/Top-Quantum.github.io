/**
 * mythosService.ts – TypeScript client for the OpenMythos FastAPI microservice.
 *
 * In production the Node.js backend proxies all /api/mythos/* requests to the
 * Python service.  In development (Vite) the same proxy path is used so this
 * client never talks directly to the Python service.
 */

const BASE = '/api/mythos';

// ─── Types ────────────────────────────────────────────────────────────────

export interface MythosConfigInput {
  vocab_size?: number;
  dim?: number;
  n_heads?: number;
  n_kv_heads?: number;
  max_seq_len?: number;
  max_loop_iters?: number;
  prelude_layers?: number;
  coda_layers?: number;
  n_experts?: number;
  n_shared_experts?: number;
  n_experts_per_tok?: number;
  expert_dim?: number;
  lora_rank?: number;
  attn_type?: 'gqa' | 'mla';
  // MLA only
  kv_lora_rank?: number;
  q_lora_rank?: number;
  qk_rope_head_dim?: number;
  qk_nope_head_dim?: number;
  v_head_dim?: number;
}

export interface ModelInfo {
  model_id: string;
  total_parameters: number;
  spectral_radius: number;
  config: Record<string, unknown>;
}

export interface GenerateResult {
  model_id: string;
  output_ids: number[][];
  shape: number[];
  new_tokens: number;
}

export interface ForwardResult {
  shape: number[];
}

export interface HealthStatus {
  status: string;
  torch_version: string;
  device: string;
  models_loaded: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error((err as { detail?: string }).detail ?? res.statusText);
  }
  return res.json() as Promise<T>;
};

// ─── API ──────────────────────────────────────────────────────────────────

/** Create a new model instance on the Python service. */
export const createModel = (modelId: string, config: MythosConfigInput): Promise<ModelInfo> =>
  request<ModelInfo>('/models/create', {
    method: 'POST',
    body: JSON.stringify({ model_id: modelId, config }),
  });

/** Get metadata for an existing model. */
export const getModelInfo = (modelId: string): Promise<ModelInfo> =>
  request<ModelInfo>(`/models/${modelId}/info`);

/** List all loaded models. */
export const listModels = (): Promise<{ models: ModelInfo[] }> =>
  request<{ models: ModelInfo[] }>('/models');

/**
 * Run a forward pass and return the logits shape.
 *
 * @param inputIds  Batch of token-id sequences [[id, …], …]
 */
export const forwardPass = (
  modelId: string,
  inputIds: number[][],
  nLoops = 4
): Promise<ForwardResult> =>
  request<ForwardResult>(`/models/${modelId}/forward`, {
    method: 'POST',
    body: JSON.stringify({ input_ids: inputIds, n_loops: nLoops }),
  });

/**
 * Generate tokens autoregressively.
 *
 * @param inputIds      Prompt token ids [[id, …], …]
 * @param maxNewTokens  Number of tokens to generate
 */
export const generateTokens = (
  modelId: string,
  inputIds: number[][],
  maxNewTokens = 20,
  nLoops = 4,
  temperature = 1.0,
  topK = 50
): Promise<GenerateResult> =>
  request<GenerateResult>(`/models/${modelId}/generate`, {
    method: 'POST',
    body: JSON.stringify({
      input_ids: inputIds,
      max_new_tokens: maxNewTokens,
      n_loops: nLoops,
      temperature,
      top_k: topK,
    }),
  });

/** Check the health of the Python microservice. */
export const getMythosHealth = (): Promise<HealthStatus> => request<HealthStatus>('/health');
