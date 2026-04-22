"""Unit tests for MythosConfig."""
import pytest
from open_mythos.config import MythosConfig


class TestMythosConfig:
    def test_default_values(self):
        cfg = MythosConfig()
        assert cfg.vocab_size == 32000
        assert cfg.dim == 512
        assert cfg.n_heads == 8
        assert cfg.n_kv_heads == 8
        assert cfg.max_seq_len == 2048
        assert cfg.attn_type == 'gqa'

    def test_custom_values(self):
        cfg = MythosConfig(vocab_size=1000, dim=128, n_heads=4, n_kv_heads=4)
        assert cfg.vocab_size == 1000
        assert cfg.dim == 128
        assert cfg.n_heads == 4

    def test_head_dim_property(self):
        cfg = MythosConfig(dim=512, n_heads=8)
        assert cfg.head_dim == 64  # 512 // 8

    def test_n_heads_divisible_by_n_kv_heads(self):
        """n_heads must be divisible by n_kv_heads."""
        with pytest.raises(AssertionError):
            MythosConfig(n_heads=8, n_kv_heads=3)

    def test_gqa_valid(self):
        cfg = MythosConfig(attn_type='gqa')
        assert cfg.attn_type == 'gqa'

    def test_mla_requires_params(self):
        """MLA attention type requires additional parameters."""
        with pytest.raises(ValueError, match='MLA requires'):
            MythosConfig(attn_type='mla')  # missing kv_lora_rank etc.

    def test_mla_valid_with_all_params(self):
        cfg = MythosConfig(
            attn_type='mla',
            kv_lora_rank=64,
            q_lora_rank=64,
            qk_rope_head_dim=32,
            qk_nope_head_dim=32,
            v_head_dim=64,
        )
        assert cfg.attn_type == 'mla'
        assert cfg.kv_lora_rank == 64

    def test_moe_defaults(self):
        cfg = MythosConfig()
        assert cfg.n_experts == 8
        assert cfg.n_shared_experts == 1
        assert cfg.n_experts_per_tok == 2
        assert cfg.expert_dim == 256

    def test_loop_defaults(self):
        cfg = MythosConfig()
        assert cfg.max_loop_iters == 4
        assert cfg.prelude_layers == 2
        assert cfg.coda_layers == 2
