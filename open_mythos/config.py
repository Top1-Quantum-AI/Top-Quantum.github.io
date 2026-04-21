"""
MythosConfig – configuration dataclass for OpenMythos.
"""

from dataclasses import dataclass
from typing import Literal, Optional


@dataclass
class MythosConfig:
    # Core dimensions
    vocab_size: int = 32000
    dim: int = 512
    n_heads: int = 8
    n_kv_heads: int = 8
    max_seq_len: int = 2048

    # Loop / depth
    max_loop_iters: int = 4
    prelude_layers: int = 2
    coda_layers: int = 2

    # MoE
    n_experts: int = 8
    n_shared_experts: int = 1
    n_experts_per_tok: int = 2
    expert_dim: int = 256

    # LoRA rank (used in Q projection and recurrent B matrix)
    lora_rank: int = 8

    # Attention type: "gqa" or "mla"
    attn_type: Literal['gqa', 'mla'] = 'gqa'

    # MLA-specific params (required when attn_type == "mla")
    kv_lora_rank: Optional[int] = None
    q_lora_rank: Optional[int] = None
    qk_rope_head_dim: Optional[int] = None
    qk_nope_head_dim: Optional[int] = None
    v_head_dim: Optional[int] = None

    def __post_init__(self) -> None:
        assert self.n_heads % self.n_kv_heads == 0, (
            f'n_heads ({self.n_heads}) must be divisible by n_kv_heads ({self.n_kv_heads})'
        )
        if self.attn_type == 'mla':
            missing = [
                k for k, v in {
                    'kv_lora_rank': self.kv_lora_rank,
                    'q_lora_rank': self.q_lora_rank,
                    'qk_rope_head_dim': self.qk_rope_head_dim,
                    'qk_nope_head_dim': self.qk_nope_head_dim,
                    'v_head_dim': self.v_head_dim,
                }.items()
                if v is None
            ]
            if missing:
                raise ValueError(f'MLA requires: {missing}')

    @property
    def head_dim(self) -> int:
        return self.dim // self.n_heads
