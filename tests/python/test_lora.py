"""Unit tests for LoRALinear."""
import math
import torch
from open_mythos.lora import LoRALinear


class TestLoRALinear:
    def setup_method(self):
        self.in_f = 32
        self.out_f = 64
        self.rank = 4
        self.lora = LoRALinear(self.in_f, self.out_f, self.rank)

    def test_output_shape(self):
        x = torch.randn(2, 8, self.in_f)
        out = self.lora(x)
        assert out.shape == (2, 8, self.out_f)

    def test_zero_init_delta(self):
        """At initialisation lora_B is zero, so output == linear(x)."""
        x = torch.randn(1, 4, self.in_f)
        with torch.no_grad():
            out_lora = self.lora(x)
            out_linear = self.lora.linear(x)
        torch.testing.assert_close(out_lora, out_linear)

    def test_scale_factor(self):
        expected_scale = 1.0 / math.sqrt(self.rank)
        assert abs(self.lora.scale - expected_scale) < 1e-6

    def test_parameter_counts(self):
        """LoRA adds A (in_f × rank) + B (rank × out_f) parameters."""
        named = {n: p for n, p in self.lora.named_parameters()}
        assert 'lora_A.weight' in named
        assert 'lora_B.weight' in named
        assert named['lora_A.weight'].shape == (self.rank, self.in_f)
        assert named['lora_B.weight'].shape == (self.out_f, self.rank)

    def test_no_bias_by_default(self):
        assert self.lora.linear.bias is None

    def test_with_bias(self):
        lora_b = LoRALinear(self.in_f, self.out_f, self.rank, bias=True)
        assert lora_b.linear.bias is not None
        x = torch.randn(1, 4, self.in_f)
        out = lora_b(x)
        assert out.shape == (1, 4, self.out_f)

    def test_batch_independence(self):
        """Different batch elements should produce independent outputs."""
        x1 = torch.randn(1, 4, self.in_f)
        x2 = torch.randn(1, 4, self.in_f)
        x_batch = torch.cat([x1, x2], dim=0)
        out_batch = self.lora(x_batch)
        out1 = self.lora(x1)
        out2 = self.lora(x2)
        torch.testing.assert_close(out_batch[0:1], out1)
        torch.testing.assert_close(out_batch[1:2], out2)
