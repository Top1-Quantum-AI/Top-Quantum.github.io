"""
Attention implementations:
  - GQAAttention  – Grouped Query Attention (standard GQA with RoPE)
  - MLAAttention  – Multi-head Latent Attention (DeepSeek-style KV compression)
  - build_attention(cfg) – factory returning the correct attention for a config
"""

import math

import torch
import torch.nn as nn
import torch.nn.functional as F

from .config import MythosConfig
from .lora import LoRALinear


# ─── Rotary Position Embeddings ──────────────────────────────────────────────

def _rotate_half(x: torch.Tensor) -> torch.Tensor:
    half = x.shape[-1] // 2
    return torch.cat([-x[..., half:], x[..., :half]], dim=-1)


def _apply_rope(
    x: torch.Tensor,
    cos: torch.Tensor,
    sin: torch.Tensor,
) -> torch.Tensor:
    return x * cos + _rotate_half(x) * sin


def _build_rope_cache(
    seq_len: int,
    head_dim: int,
    device: torch.device,
    dtype: torch.dtype = torch.float32,
) -> tuple[torch.Tensor, torch.Tensor]:
    """Return (cos, sin) tensors of shape [1, 1, seq_len, head_dim]."""
    theta = 1.0 / (
        10000.0 ** (torch.arange(0, head_dim, 2, device=device, dtype=dtype) / head_dim)
    )
    positions = torch.arange(seq_len, device=device, dtype=dtype)
    angles = torch.outer(positions, theta)       # [T, head_dim/2]
    angles = torch.cat([angles, angles], dim=-1) # [T, head_dim]
    return angles.cos()[None, None], angles.sin()[None, None]  # [1, 1, T, D]


# ─── GQA Attention ───────────────────────────────────────────────────────────

class GQAAttention(nn.Module):
    """Grouped Query Attention with RoPE and LoRA on Q."""

    def __init__(self, cfg: MythosConfig) -> None:
        super().__init__()
        self.n_heads = cfg.n_heads
        self.n_kv_heads = cfg.n_kv_heads
        self.head_dim = cfg.head_dim
        self.n_rep = cfg.n_heads // cfg.n_kv_heads
        self.scale = 1.0 / math.sqrt(self.head_dim)

        self.q_proj = LoRALinear(cfg.dim, cfg.n_heads * self.head_dim, cfg.lora_rank)
        self.k_proj = nn.Linear(cfg.dim, cfg.n_kv_heads * self.head_dim, bias=False)
        self.v_proj = nn.Linear(cfg.dim, cfg.n_kv_heads * self.head_dim, bias=False)
        self.o_proj = nn.Linear(cfg.n_heads * self.head_dim, cfg.dim, bias=False)

        # Pre-allocate causal mask up to max_seq_len and reuse in forward
        max_T = cfg.max_seq_len
        self.register_buffer(
            '_causal_mask',
            torch.triu(torch.ones(max_T, max_T, dtype=torch.bool), diagonal=1),
            persistent=False,
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, T, _ = x.shape

        q = self.q_proj(x).view(B, T, self.n_heads, self.head_dim).transpose(1, 2)
        k = self.k_proj(x).view(B, T, self.n_kv_heads, self.head_dim).transpose(1, 2)
        v = self.v_proj(x).view(B, T, self.n_kv_heads, self.head_dim).transpose(1, 2)

        # Apply RoPE
        cos, sin = _build_rope_cache(T, self.head_dim, x.device, x.dtype)
        q = _apply_rope(q, cos, sin)
        k = _apply_rope(k, cos, sin)

        # Expand KV for GQA
        k = k.repeat_interleave(self.n_rep, dim=1)
        v = v.repeat_interleave(self.n_rep, dim=1)

        # Scaled dot-product attention with pre-allocated causal mask
        attn = torch.matmul(q, k.transpose(-2, -1)) * self.scale
        mask: torch.Tensor = self._causal_mask[:T, :T]  # type: ignore[index]
        attn = attn.masked_fill(mask[None, None], float('-inf'))
        attn = F.softmax(attn, dim=-1)

        out = torch.matmul(attn, v)  # [B, H, T, head_dim]
        out = out.transpose(1, 2).contiguous().view(B, T, -1)
        return self.o_proj(out)


# ─── MLA Attention ───────────────────────────────────────────────────────────

class MLAAttention(nn.Module):
    """
    Multi-head Latent Attention (DeepSeek-style).

    KV and Q are first projected into low-rank latent spaces; the
    rope / nope head components are split out, RoPE is applied only to
    the rope parts, then everything is concatenated before the standard
    scaled dot-product attention.
    """

    def __init__(self, cfg: MythosConfig) -> None:
        super().__init__()
        assert cfg.kv_lora_rank is not None
        assert cfg.q_lora_rank is not None
        assert cfg.qk_rope_head_dim is not None
        assert cfg.qk_nope_head_dim is not None
        assert cfg.v_head_dim is not None

        self.n_heads = cfg.n_heads
        self.n_kv_heads = cfg.n_kv_heads
        self.n_rep = cfg.n_heads // cfg.n_kv_heads
        self.qk_rope_head_dim = cfg.qk_rope_head_dim
        self.qk_nope_head_dim = cfg.qk_nope_head_dim
        self.v_head_dim = cfg.v_head_dim
        self.qk_head_dim = cfg.qk_rope_head_dim + cfg.qk_nope_head_dim
        self.scale = 1.0 / math.sqrt(self.qk_head_dim)

        # KV compression
        self.kv_down = nn.Linear(cfg.dim, cfg.kv_lora_rank, bias=False)
        self.k_nope_proj = nn.Linear(cfg.kv_lora_rank, cfg.n_kv_heads * cfg.qk_nope_head_dim, bias=False)
        self.k_rope_proj = nn.Linear(cfg.kv_lora_rank, cfg.n_kv_heads * cfg.qk_rope_head_dim, bias=False)
        self.v_proj = nn.Linear(cfg.kv_lora_rank, cfg.n_kv_heads * cfg.v_head_dim, bias=False)

        # Q compression
        self.q_down = nn.Linear(cfg.dim, cfg.q_lora_rank, bias=False)
        self.q_nope_proj = nn.Linear(cfg.q_lora_rank, cfg.n_heads * cfg.qk_nope_head_dim, bias=False)
        self.q_rope_proj = nn.Linear(cfg.q_lora_rank, cfg.n_heads * cfg.qk_rope_head_dim, bias=False)

        # Output
        self.o_proj = nn.Linear(cfg.n_heads * cfg.v_head_dim, cfg.dim, bias=False)

        # Pre-allocate causal mask up to max_seq_len
        max_T = cfg.max_seq_len
        self.register_buffer(
            '_causal_mask',
            torch.triu(torch.ones(max_T, max_T, dtype=torch.bool), diagonal=1),
            persistent=False,
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, T, _ = x.shape

        # ── KV path ──────────────────────────────────────────
        kv_c = self.kv_down(x)                          # [B, T, kv_lora_rank]
        k_nope = self.k_nope_proj(kv_c).view(B, T, self.n_kv_heads, self.qk_nope_head_dim)
        k_rope = self.k_rope_proj(kv_c).view(B, T, self.n_kv_heads, self.qk_rope_head_dim)
        v      = self.v_proj(kv_c).view(B, T, self.n_kv_heads, self.v_head_dim)

        # ── Q path ───────────────────────────────────────────
        q_c = self.q_down(x)                            # [B, T, q_lora_rank]
        q_nope = self.q_nope_proj(q_c).view(B, T, self.n_heads, self.qk_nope_head_dim)
        q_rope = self.q_rope_proj(q_c).view(B, T, self.n_heads, self.qk_rope_head_dim)

        # ── RoPE on rope parts ───────────────────────────────
        cos_q, sin_q = _build_rope_cache(T, self.qk_rope_head_dim, x.device, x.dtype)
        cos_k, sin_k = cos_q, sin_q  # same positions

        # [B, T, H, D] → transpose to [B, H, T, D] for rope, then back
        q_rope = _apply_rope(q_rope.transpose(1, 2), cos_q, sin_q).transpose(1, 2)
        k_rope = _apply_rope(k_rope.transpose(1, 2), cos_k, sin_k).transpose(1, 2)

        # ── Concat nope + rope ───────────────────────────────
        q = torch.cat([q_nope, q_rope], dim=-1).transpose(1, 2)  # [B, n_heads, T, qk_head_dim]
        k = torch.cat([k_nope, k_rope], dim=-1).transpose(1, 2)  # [B, n_kv_heads, T, qk_head_dim]
        v = v.transpose(1, 2)                                     # [B, n_kv_heads, T, v_head_dim]

        # Expand KV for GQA
        k = k.repeat_interleave(self.n_rep, dim=1)
        v = v.repeat_interleave(self.n_rep, dim=1)

        # ── Attention ────────────────────────────────────────
        attn = torch.matmul(q, k.transpose(-2, -1)) * self.scale
        mask: torch.Tensor = self._causal_mask[:T, :T]  # type: ignore[index]
        attn = attn.masked_fill(mask[None, None], float('-inf'))
        attn = F.softmax(attn, dim=-1)

        out = torch.matmul(attn, v)                   # [B, n_heads, T, v_head_dim]
        out = out.transpose(1, 2).contiguous().view(B, T, -1)
        return self.o_proj(out)


# ─── Factory ─────────────────────────────────────────────────────────────────

def build_attention(cfg: MythosConfig) -> nn.Module:
    if cfg.attn_type == 'gqa':
        return GQAAttention(cfg)
    if cfg.attn_type == 'mla':
        return MLAAttention(cfg)
    raise ValueError(f"Unknown attention type: '{cfg.attn_type}'")
