"""Unit tests for GQAAttention and MLAAttention."""
import torch
import pytest
from open_mythos.config import MythosConfig
from open_mythos.attention import GQAAttention, MLAAttention, build_attention


@pytest.fixture
def gqa_cfg():
    return MythosConfig(
        dim=64,
        n_heads=4,
        n_kv_heads=2,
        lora_rank=4,
        attn_type='gqa',
        max_seq_len=32,
        n_experts=4,
        n_shared_experts=1,
        n_experts_per_tok=2,
        expert_dim=32,
        prelude_layers=1,
        coda_layers=1,
    )


@pytest.fixture
def mla_cfg():
    return MythosConfig(
        dim=64,
        n_heads=4,
        n_kv_heads=4,
        lora_rank=4,
        attn_type='mla',
        max_seq_len=32,
        kv_lora_rank=16,
        q_lora_rank=16,
        qk_rope_head_dim=8,
        qk_nope_head_dim=8,
        v_head_dim=16,
        n_experts=4,
        n_shared_experts=1,
        n_experts_per_tok=2,
        expert_dim=32,
        prelude_layers=1,
        coda_layers=1,
    )


class TestGQAAttention:
    def test_output_shape(self, gqa_cfg):
        attn = GQAAttention(gqa_cfg)
        x = torch.randn(2, 8, gqa_cfg.dim)
        out = attn(x)
        assert out.shape == x.shape

    def test_causal_mask_registered(self, gqa_cfg):
        attn = GQAAttention(gqa_cfg)
        assert hasattr(attn, '_causal_mask')
        assert attn._causal_mask.shape == (gqa_cfg.max_seq_len, gqa_cfg.max_seq_len)

    def test_causal_mask_is_upper_triangular(self, gqa_cfg):
        attn = GQAAttention(gqa_cfg)
        mask = attn._causal_mask
        # Upper triangle (excluding diagonal) should be True
        assert mask[0, 1].item() is True
        # Lower triangle (including diagonal) should be False
        assert mask[0, 0].item() is False
        assert mask[1, 0].item() is False

    def test_no_nan_in_output(self, gqa_cfg):
        attn = GQAAttention(gqa_cfg)
        x = torch.randn(2, 8, gqa_cfg.dim)
        out = attn(x)
        assert not torch.isnan(out).any()

    def test_single_token(self, gqa_cfg):
        attn = GQAAttention(gqa_cfg)
        x = torch.randn(1, 1, gqa_cfg.dim)
        out = attn(x)
        assert out.shape == (1, 1, gqa_cfg.dim)

    def test_gradient_flows(self, gqa_cfg):
        attn = GQAAttention(gqa_cfg)
        x = torch.randn(2, 4, gqa_cfg.dim, requires_grad=True)
        out = attn(x)
        out.sum().backward()
        assert x.grad is not None


class TestMLAAttention:
    def test_output_shape(self, mla_cfg):
        attn = MLAAttention(mla_cfg)
        x = torch.randn(2, 8, mla_cfg.dim)
        out = attn(x)
        assert out.shape == x.shape

    def test_no_nan_in_output(self, mla_cfg):
        attn = MLAAttention(mla_cfg)
        x = torch.randn(2, 4, mla_cfg.dim)
        out = attn(x)
        assert not torch.isnan(out).any()

    def test_gradient_flows(self, mla_cfg):
        attn = MLAAttention(mla_cfg)
        x = torch.randn(2, 4, mla_cfg.dim, requires_grad=True)
        out = attn(x)
        out.sum().backward()
        assert x.grad is not None


class TestBuildAttention:
    def test_builds_gqa(self, gqa_cfg):
        attn = build_attention(gqa_cfg)
        assert isinstance(attn, GQAAttention)

    def test_builds_mla(self, mla_cfg):
        attn = build_attention(mla_cfg)
        assert isinstance(attn, MLAAttention)

    def test_unknown_type_raises(self):
        cfg = MythosConfig()
        cfg.attn_type = 'unknown'  # type: ignore[assignment]
        with pytest.raises(ValueError, match='Unknown attention type'):
            build_attention(cfg)
