"""
OpenMythos – Hybrid Transformer-Recurrent Language Model.

Architecture (token flow):
    embed
      └─ prelude  (prelude_layers standard Transformer blocks)
           └─ recurrent loop  (n_loops iterations of RecurrentModule)
                └─ coda  (coda_layers standard Transformer blocks)
                     └─ norm → head → logits

Usage
─────
    from open_mythos.main import OpenMythos, MythosConfig

    cfg = MythosConfig(vocab_size=1000, dim=256, ...)
    model = OpenMythos(cfg)

    logits = model(ids, n_loops=4)          # [B, T, vocab_size]
    out    = model.generate(ids, max_new_tokens=8, n_loops=4)
"""

import torch
import torch.nn as nn

from .config import MythosConfig
from .transformer import TransformerBlock
from .recurrent import RecurrentModule


class OpenMythos(nn.Module):
    def __init__(self, cfg: MythosConfig) -> None:
        super().__init__()
        self.cfg = cfg

        self.embed    = nn.Embedding(cfg.vocab_size, cfg.dim)
        self.prelude  = nn.ModuleList([TransformerBlock(cfg) for _ in range(cfg.prelude_layers)])
        self.recurrent = RecurrentModule(cfg)
        self.coda     = nn.ModuleList([TransformerBlock(cfg) for _ in range(cfg.coda_layers)])
        self.norm     = nn.LayerNorm(cfg.dim)
        self.head     = nn.Linear(cfg.dim, cfg.vocab_size, bias=False)

        # Tie embedding ↔ head weights (standard practice)
        self.head.weight = self.embed.weight

        self._init_weights()

    # ── Weight initialisation ─────────────────────────────────────────────

    def _init_weights(self) -> None:
        for m in self.modules():
            if isinstance(m, nn.Linear):
                nn.init.normal_(m.weight, std=0.02)
                if m.bias is not None:
                    nn.init.zeros_(m.bias)
            elif isinstance(m, nn.Embedding):
                nn.init.normal_(m.weight, std=0.02)

    # ── Forward ───────────────────────────────────────────────────────────

    def forward(self, ids: torch.Tensor, n_loops: int = 1) -> torch.Tensor:
        """
        Args:
            ids     : token ids  [B, T]
            n_loops : number of recurrent iterations (≥ 1)
        Returns:
            logits  : [B, T, vocab_size]
        """
        B, _ = ids.shape
        x = self.embed(ids)                         # [B, T, dim]

        for block in self.prelude:
            x = block(x)

        h = torch.zeros(B, self.cfg.dim, device=ids.device, dtype=x.dtype)
        for _ in range(max(1, n_loops)):
            x, h = self.recurrent(x, h)

        for block in self.coda:
            x = block(x)

        return self.head(self.norm(x))              # [B, T, vocab_size]

    # ── Generation ────────────────────────────────────────────────────────

    @torch.no_grad()
    def generate(
        self,
        ids: torch.Tensor,
        max_new_tokens: int = 20,
        n_loops: int = 1,
        temperature: float = 1.0,
        top_k: int = 50,
    ) -> torch.Tensor:
        """
        Autoregressive generation with optional temperature / top-k sampling.

        Args:
            ids            : prompt token ids  [B, T]
            max_new_tokens : tokens to append
            n_loops        : recurrent iterations per step
            temperature    : sampling temperature (1.0 = unchanged)
            top_k          : top-k filtering (0 = disabled, greedy)
        Returns:
            ids  : [B, T + max_new_tokens]
        """
        self.eval()
        for _ in range(max_new_tokens):
            ctx     = ids[:, -self.cfg.max_seq_len:]          # sliding window
            logits  = self.forward(ctx, n_loops=n_loops)      # [B, T, vocab]
            next_l  = logits[:, -1, :] / max(temperature, 1e-6)

            if top_k > 0:
                k        = min(top_k, next_l.size(-1))
                top_vals = torch.topk(next_l, k).values
                threshold = top_vals[:, -1].unsqueeze(-1)
                next_l   = next_l.masked_fill(next_l < threshold, float('-inf'))

            probs    = torch.softmax(next_l, dim=-1)
            next_tok = torch.multinomial(probs, num_samples=1)   # [B, 1]
            ids      = torch.cat([ids, next_tok], dim=1)

        return ids
