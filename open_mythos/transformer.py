"""
TransformerBlock – standard pre-norm Transformer block
(LayerNorm → Attention → residual, LayerNorm → MoE FFN → residual).
"""

import torch
import torch.nn as nn

from .config import MythosConfig
from .attention import build_attention
from .moe import MoEFFN


class TransformerBlock(nn.Module):
    def __init__(self, cfg: MythosConfig) -> None:
        super().__init__()
        self.attn_norm = nn.LayerNorm(cfg.dim)
        self.ffn_norm  = nn.LayerNorm(cfg.dim)
        self.attn      = build_attention(cfg)
        self.ffn       = MoEFFN(cfg)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = x + self.attn(self.attn_norm(x))
        x = x + self.ffn(self.ffn_norm(x))
        return x
