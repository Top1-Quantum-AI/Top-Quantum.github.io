"""
RecurrentInjection and RecurrentModule.

RecurrentInjection
──────────────────
Maintains a hidden state **h** of shape [B, dim].

State update:
    h_new = LayerNorm( A ⊙ h  +  B · pool(x)  +  b )

where A is a diagonal matrix parameterised so that all eigenvalues
lie in (0, 1) via sigmoid – this guarantees ρ(A) < 1 (stability).

The updated hidden state is then *injected* back into every position
of the sequence:
    x_injected = x + h_new.unsqueeze(1)

RecurrentModule
───────────────
One full loop iteration: Attention → MoE FFN → RecurrentInjection.
"""

import torch
import torch.nn as nn

from .config import MythosConfig
from .attention import build_attention
from .moe import MoEFFN


class RecurrentInjection(nn.Module):
    """
    Stable diagonal-linear recurrent cell.

    Stability: get_A() returns sigmoid(_log_A) ∈ (0, 1)^dim,
    so the spectral radius ρ(A) = max(A) < 1.
    """

    def __init__(self, cfg: MythosConfig) -> None:
        super().__init__()
        self.dim = cfg.dim
        # Parameterise A via sigmoid; initialise to ~0.5
        self._log_A = nn.Parameter(torch.zeros(cfg.dim))
        self.B      = nn.Linear(cfg.dim, cfg.dim, bias=False)
        self.bias   = nn.Parameter(torch.zeros(cfg.dim))
        self.norm   = nn.LayerNorm(cfg.dim)

    def get_A(self) -> torch.Tensor:
        """Return the diagonal of A; all values in (0, 1)."""
        return torch.sigmoid(self._log_A)

    def forward(
        self,
        x: torch.Tensor,
        h: torch.Tensor,
    ) -> tuple[torch.Tensor, torch.Tensor]:
        """
        Args:
            x : context  [B, T, dim]
            h : state    [B, dim]
        Returns:
            x_out : x + injected h  [B, T, dim]
            h_new : updated state   [B, dim]
        """
        A = self.get_A()                       # [dim]
        x_pool = x.mean(dim=1)                 # [B, dim]
        h_new  = self.norm(A * h + self.B(x_pool) + self.bias)
        x_out  = x + h_new.unsqueeze(1)        # broadcast over T
        return x_out, h_new


class RecurrentModule(nn.Module):
    """One recurrent loop iteration: Attention + MoE FFN + RecurrentInjection."""

    def __init__(self, cfg: MythosConfig) -> None:
        super().__init__()
        self.attn_norm = nn.LayerNorm(cfg.dim)
        self.ffn_norm  = nn.LayerNorm(cfg.dim)
        self.attn      = build_attention(cfg)
        self.ffn       = MoEFFN(cfg)
        self.injection = RecurrentInjection(cfg)

    def forward(
        self,
        x: torch.Tensor,
        h: torch.Tensor,
    ) -> tuple[torch.Tensor, torch.Tensor]:
        x = x + self.attn(self.attn_norm(x))
        x = x + self.ffn(self.ffn_norm(x))
        x, h = self.injection(x, h)
        return x, h
