"""Unit tests for MoEFFN (Mixture-of-Experts Feed-Forward Network)."""
import torch
import pytest
from open_mythos.config import MythosConfig
from open_mythos.moe import MoEFFN


@pytest.fixture
def small_cfg():
    return MythosConfig(
        dim=64,
        n_heads=4,
        n_kv_heads=4,
        n_experts=4,
        n_shared_experts=1,
        n_experts_per_tok=2,
        expert_dim=32,
        prelude_layers=1,
        coda_layers=1,
        max_seq_len=32,
    )


class TestMoEFFN:
    def test_output_shape(self, small_cfg):
        moe = MoEFFN(small_cfg)
        x = torch.randn(2, 8, small_cfg.dim)
        out = moe(x)
        assert out.shape == x.shape

    def test_output_shape_single_token(self, small_cfg):
        moe = MoEFFN(small_cfg)
        x = torch.randn(1, 1, small_cfg.dim)
        out = moe(x)
        assert out.shape == (1, 1, small_cfg.dim)

    def test_output_dtype_preserved(self, small_cfg):
        moe = MoEFFN(small_cfg)
        x = torch.randn(2, 4, small_cfg.dim, dtype=torch.float32)
        out = moe(x)
        assert out.dtype == torch.float32

    def test_expert_count(self, small_cfg):
        moe = MoEFFN(small_cfg)
        assert len(moe.experts) == small_cfg.n_experts
        assert len(moe.shared_experts) == small_cfg.n_shared_experts

    def test_router_output_dim(self, small_cfg):
        moe = MoEFFN(small_cfg)
        assert moe.router.out_features == small_cfg.n_experts

    def test_no_nan_in_output(self, small_cfg):
        moe = MoEFFN(small_cfg)
        x = torch.randn(2, 8, small_cfg.dim)
        out = moe(x)
        assert not torch.isnan(out).any()

    def test_gradient_flows(self, small_cfg):
        moe = MoEFFN(small_cfg)
        x = torch.randn(2, 4, small_cfg.dim, requires_grad=True)
        out = moe(x)
        loss = out.sum()
        loss.backward()
        assert x.grad is not None

    def test_deterministic_with_fixed_seed(self, small_cfg):
        moe = MoEFFN(small_cfg)
        moe.eval()
        x = torch.randn(1, 4, small_cfg.dim)
        with torch.no_grad():
            out1 = moe(x)
            out2 = moe(x)
        torch.testing.assert_close(out1, out2)
