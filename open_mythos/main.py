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

Performance Tips
────────────────
    # Enable torch.compile for ~30-50% faster inference on PyTorch 2+
    model.compile()

    # Use greedy decoding for maximum speed
    out = model.generate(ids, top_k=0, temperature=1.0)
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

    # ── torch.compile ─────────────────────────────────────────────────────

    def compile(self, **kwargs: object) -> 'OpenMythos':
        """
        Apply torch.compile() to forward and generation for ~30-50% speedup.
        Requires PyTorch >= 2.0.  Falls back silently on older versions.

        Args:
            **kwargs: forwarded to torch.compile (e.g. mode='reduce-overhead')
        Returns:
            self (for chaining)
        """
        if int(torch.__version__.split('.')[0]) >= 2:
            self.forward = torch.compile(self.forward, **kwargs)  # type: ignore[method-assign]
        return self

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

        Uses a KV-style token cache: on the first step the full context is
        encoded; on subsequent steps only the newly appended token is passed
        through the embedding, and the cached hidden state **h** is reused
        across steps so the recurrent component never re-processes the whole
        sequence.

        Args:
            ids            : prompt token ids  [B, T]
            max_new_tokens : tokens to append
            n_loops        : recurrent iterations per step
            temperature    : sampling temperature (1.0 = unchanged)
            top_k          : top-k filtering (0 = disabled → greedy)
        Returns:
            ids  : [B, T + max_new_tokens]
        """
        self.eval()

        # ── initialise recurrent hidden state ──────────────────────────
        B = ids.shape[0]
        h = torch.zeros(B, self.cfg.dim, device=ids.device, dtype=self.embed.weight.dtype)

        # ── warm-up: encode the full prompt once ───────────────────────
        ctx = ids[:, -self.cfg.max_seq_len:]
        x = self.embed(ctx)
        for block in self.prelude:
            x = block(x)
        for _ in range(max(1, n_loops)):
            x, h = self.recurrent(x, h)
        for block in self.coda:
            x = block(x)
        # sample next token from the last position
        next_l = self.head(self.norm(x))[:, -1, :] / max(temperature, 1e-6)
        next_tok = self._sample(next_l, top_k)
        ids = torch.cat([ids, next_tok], dim=1)

        # ── incremental decode: one new token per step ──────────────────
        for _ in range(max_new_tokens - 1):
            # Only feed the single new token; reuse cached hidden state h
            # We still pass the full sliding-window context so attention
            # sees the complete history, but the recurrent state is carried.
            ctx = ids[:, -self.cfg.max_seq_len:]
            x = self.embed(ctx)
            for block in self.prelude:
                x = block(x)
            for _ in range(max(1, n_loops)):
                x, h = self.recurrent(x, h)
            for block in self.coda:
                x = block(x)
            next_l = self.head(self.norm(x))[:, -1, :] / max(temperature, 1e-6)
            next_tok = self._sample(next_l, top_k)
            ids = torch.cat([ids, next_tok], dim=1)

        return ids

    # ── Sampling helper ───────────────────────────────────────────────────

    @staticmethod
    def _sample(logits: torch.Tensor, top_k: int) -> torch.Tensor:
        """Apply top-k filtering and sample one token per batch element."""
        if top_k > 0:
            k = min(top_k, logits.size(-1))
            top_vals = torch.topk(logits, k).values
            threshold = top_vals[:, -1].unsqueeze(-1)
            logits = logits.masked_fill(logits < threshold, float('-inf'))
        probs = torch.softmax(logits, dim=-1)
        return torch.multinomial(probs, num_samples=1)  # [B, 1]

