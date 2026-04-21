"""
LoRALinear – Linear layer augmented with low-rank adaptation.

The forward pass computes:
    output = W x + (1/√r) B A x
where W is the frozen base weight (trained jointly here), A projects
down to rank r, and B projects back up.  B is initialised to zero so
the delta starts at zero.
"""

import math

import torch
import torch.nn as nn


class LoRALinear(nn.Module):
    def __init__(
        self,
        in_features: int,
        out_features: int,
        rank: int,
        bias: bool = False,
    ) -> None:
        super().__init__()
        self.linear = nn.Linear(in_features, out_features, bias=bias)
        self.lora_A = nn.Linear(in_features, rank, bias=False)
        self.lora_B = nn.Linear(rank, out_features, bias=False)
        self.scale = 1.0 / math.sqrt(rank)
        # Zero-init B so the initial delta is zero
        nn.init.zeros_(self.lora_B.weight)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.linear(x) + self.scale * self.lora_B(self.lora_A(x))
