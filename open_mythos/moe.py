"""
MoE FFN – Mixture-of-Experts feed-forward network.

Architecture
────────────
- n_shared_experts  experts are always active (shared path)
- n_experts         routed experts; top-n_experts_per_tok are selected
  per token via a softmax router
- Each expert uses the SwiGLU activation:  down( silu(gate(x)) ⊙ up(x) )
"""

import torch
import torch.nn as nn
import torch.nn.functional as F

from .config import MythosConfig


class _Expert(nn.Module):
    """Single SwiGLU expert."""

    def __init__(self, dim: int, expert_dim: int) -> None:
        super().__init__()
        self.gate = nn.Linear(dim, expert_dim, bias=False)
        self.up   = nn.Linear(dim, expert_dim, bias=False)
        self.down = nn.Linear(expert_dim, dim, bias=False)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.down(F.silu(self.gate(x)) * self.up(x))


class MoEFFN(nn.Module):
    def __init__(self, cfg: MythosConfig) -> None:
        super().__init__()
        self.n_experts    = cfg.n_experts
        self.n_shared     = cfg.n_shared_experts
        self.n_per_tok    = cfg.n_experts_per_tok

        self.shared_experts = nn.ModuleList(
            [_Expert(cfg.dim, cfg.expert_dim) for _ in range(cfg.n_shared_experts)]
        )
        self.experts = nn.ModuleList(
            [_Expert(cfg.dim, cfg.expert_dim) for _ in range(cfg.n_experts)]
        )
        self.router = nn.Linear(cfg.dim, cfg.n_experts, bias=False)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, T, D = x.shape
        flat = x.view(-1, D)   # [B*T, D]

        # Shared experts (always active)
        shared_out = sum(e(flat) for e in self.shared_experts)  # [B*T, D]

        # Router: top-k selection
        logits = self.router(flat)                               # [B*T, n_experts]
        probs  = F.softmax(logits, dim=-1)
        topk_probs, topk_ids = torch.topk(probs, self.n_per_tok, dim=-1)  # [B*T, k]
        # Renormalize selected probabilities
        topk_probs = topk_probs / (topk_probs.sum(dim=-1, keepdim=True) + 1e-9)

        # Accumulate routed expert outputs
        routed_out = torch.zeros_like(flat)
        for k in range(self.n_per_tok):
            expert_ids = topk_ids[:, k]      # [B*T]
            weights    = topk_probs[:, k]    # [B*T]
            for e_idx, expert in enumerate(self.experts):
                mask = (expert_ids == e_idx)
                if mask.any():
                    routed_out[mask] += weights[mask].unsqueeze(-1) * expert(flat[mask])

        return (shared_out + routed_out).view(B, T, D)
