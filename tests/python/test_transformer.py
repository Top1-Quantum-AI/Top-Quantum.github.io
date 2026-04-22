"""Unit tests for TransformerBlock."""
import torch
import pytest
from open_mythos.config import MythosConfig
from open_mythos.transformer import TransformerBlock


@pytest.fixture
def cfg():
    return MythosConfig(
        dim=64,
        n_heads=4,
        n_kv_heads=4,
        n_experts=4,
        n_shared_experts=1,
        n_experts_per_tok=2,
        expert_dim=32,
        lora_rank=4,
        max_seq_len=32,
        prelude_layers=1,
        coda_layers=1,
    )


class TestTransformerBlock:
    def test_output_shape(self, cfg):
        block = TransformerBlock(cfg)
        x = torch.randn(2, 8, cfg.dim)
        out = block(x)
        assert out.shape == x.shape

    def test_output_shape_batch_1(self, cfg):
        block = TransformerBlock(cfg)
        x = torch.randn(1, 1, cfg.dim)
        out = block(x)
        assert out.shape == (1, 1, cfg.dim)

    def test_no_nan_in_output(self, cfg):
        block = TransformerBlock(cfg)
        x = torch.randn(2, 8, cfg.dim)
        out = block(x)
        assert not torch.isnan(out).any()

    def test_residual_connection(self, cfg):
        """Output should not equal input (block does something)."""
        block = TransformerBlock(cfg)
        block.eval()
        x = torch.randn(2, 4, cfg.dim)
        with torch.no_grad():
            out = block(x)
        assert not torch.allclose(out, x)

    def test_gradient_flows(self, cfg):
        block = TransformerBlock(cfg)
        x = torch.randn(2, 4, cfg.dim, requires_grad=True)
        out = block(x)
        out.sum().backward()
        assert x.grad is not None

    def test_deterministic_eval(self, cfg):
        block = TransformerBlock(cfg)
        block.eval()
        x = torch.randn(1, 4, cfg.dim)
        with torch.no_grad():
            out1 = block(x)
            out2 = block(x)
        torch.testing.assert_close(out1, out2)

    def test_layer_norms_present(self, cfg):
        block = TransformerBlock(cfg)
        assert hasattr(block, 'attn_norm')
        assert hasattr(block, 'ffn_norm')
