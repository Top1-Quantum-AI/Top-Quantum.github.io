"""
OpenMythos FastAPI microservice.

Endpoints
─────────
POST /models/create          – instantiate a new model and return info
POST /models/{model_id}/generate  – generate tokens
POST /models/{model_id}/forward   – forward pass (return logits shape)
GET  /models/{model_id}/info       – model metadata
GET  /models                       – list loaded models
GET  /health                       – liveness check
"""

import os
import sys
from typing import Any, Optional

import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Resolve the project root so `open_mythos` is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from open_mythos.main import OpenMythos  # noqa: E402
from open_mythos.config import MythosConfig  # noqa: E402

app = FastAPI(
    title='OpenMythos API',
    description='Hybrid Transformer-Recurrent Language Model microservice',
    version='1.0.0',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

# In-memory model registry
_models: dict[str, OpenMythos] = {}


# ─── Pydantic schemas ────────────────────────────────────────────────────────

class MythosConfigRequest(BaseModel):
    vocab_size: int = Field(1000, ge=1)
    dim: int = Field(256, ge=16)
    n_heads: int = Field(8, ge=1)
    n_kv_heads: int = Field(8, ge=1)
    max_seq_len: int = Field(128, ge=8)
    max_loop_iters: int = Field(4, ge=1)
    prelude_layers: int = Field(1, ge=0)
    coda_layers: int = Field(1, ge=0)
    n_experts: int = Field(8, ge=1)
    n_shared_experts: int = Field(1, ge=0)
    n_experts_per_tok: int = Field(2, ge=1)
    expert_dim: int = Field(64, ge=8)
    lora_rank: int = Field(8, ge=1)
    attn_type: str = Field('gqa', pattern=r'^(gqa|mla)$')
    # MLA-specific (optional)
    kv_lora_rank: Optional[int] = None
    q_lora_rank: Optional[int] = None
    qk_rope_head_dim: Optional[int] = None
    qk_nope_head_dim: Optional[int] = None
    v_head_dim: Optional[int] = None


class CreateModelRequest(BaseModel):
    model_id: str = Field('default', min_length=1)
    config: MythosConfigRequest = Field(default_factory=MythosConfigRequest)


class ForwardRequest(BaseModel):
    input_ids: list[list[int]]
    n_loops: int = Field(4, ge=1)


class GenerateRequest(BaseModel):
    input_ids: list[list[int]]
    max_new_tokens: int = Field(20, ge=1, le=512)
    n_loops: int = Field(4, ge=1)
    temperature: float = Field(1.0, gt=0.0, le=10.0)
    top_k: int = Field(50, ge=0)


class ModelInfo(BaseModel):
    model_id: str
    total_parameters: int
    spectral_radius: float
    config: dict[str, Any]


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _get_model(model_id: str) -> OpenMythos:
    if model_id not in _models:
        raise HTTPException(status_code=404, detail=f"Model '{model_id}' not found. Create it first.")
    return _models[model_id]


def _model_info(model_id: str, model: OpenMythos) -> ModelInfo:
    total = sum(p.numel() for p in model.parameters())
    rho   = model.recurrent.injection.get_A().max().item()
    return ModelInfo(
        model_id=model_id,
        total_parameters=total,
        spectral_radius=round(rho, 6),
        config=model.cfg.__dict__,
    )


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.get('/health')
def health() -> dict[str, Any]:
    return {
        'status': 'healthy',
        'torch_version': torch.__version__,
        'device': 'cuda' if torch.cuda.is_available() else 'cpu',
        'models_loaded': list(_models.keys()),
    }


@app.get('/models')
def list_models() -> dict[str, Any]:
    return {
        'models': [
            {
                'model_id': mid,
                'total_parameters': sum(p.numel() for p in m.parameters()),
                'spectral_radius': round(m.recurrent.injection.get_A().max().item(), 6),
            }
            for mid, m in _models.items()
        ]
    }


@app.post('/models/create', response_model=ModelInfo, status_code=201)
def create_model(body: CreateModelRequest) -> ModelInfo:
    cfg_dict = {k: v for k, v in body.config.model_dump().items() if v is not None}
    try:
        cfg   = MythosConfig(**cfg_dict)
        model = OpenMythos(cfg)
        model.eval()
    except (ValueError, AssertionError) as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    _models[body.model_id] = model
    return _model_info(body.model_id, model)


@app.get('/models/{model_id}/info', response_model=ModelInfo)
def model_info(model_id: str) -> ModelInfo:
    return _model_info(model_id, _get_model(model_id))


@app.post('/models/{model_id}/forward')
def forward(model_id: str, body: ForwardRequest) -> dict[str, Any]:
    model = _get_model(model_id)
    try:
        ids    = torch.tensor(body.input_ids, dtype=torch.long)
        logits = model(ids, n_loops=body.n_loops)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {'shape': list(logits.shape)}


@app.post('/models/{model_id}/generate')
def generate(model_id: str, body: GenerateRequest) -> dict[str, Any]:
    model = _get_model(model_id)
    try:
        ids = torch.tensor(body.input_ids, dtype=torch.long)
        out = model.generate(
            ids,
            max_new_tokens=body.max_new_tokens,
            n_loops=body.n_loops,
            temperature=body.temperature,
            top_k=body.top_k,
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {
        'model_id': model_id,
        'output_ids': out.tolist(),
        'shape': list(out.shape),
        'new_tokens': body.max_new_tokens,
    }
