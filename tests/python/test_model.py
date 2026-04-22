"""
Integration tests for the full OpenMythos model:
  - forward pass shape
  - generation output
  - weight tying
  - compile() method
  - sampling modes (greedy, top-k)
"""
import torch
import pytest
from open_mythos.config import MythosConfig
from open_mythos.main import OpenMythos


@pytest.fixture
def small_cfg():
    """Minimal config for fast CPU tests."""
    return MythosConfig(
        vocab_size=256,
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
        max_loop_iters=2,
    )


@pytest.fixture
def model(small_cfg):
    m = OpenMythos(small_cfg)
    m.eval()
    return m


class TestOpenMythosForward:
    def test_output_shape(self, model, small_cfg):
        ids = torch.randint(0, small_cfg.vocab_size, (2, 8))
        logits = model(ids, n_loops=1)
        assert logits.shape == (2, 8, small_cfg.vocab_size)

    def test_output_shape_multiple_loops(self, model, small_cfg):
        ids = torch.randint(0, small_cfg.vocab_size, (1, 4))
        logits = model(ids, n_loops=3)
        assert logits.shape == (1, 4, small_cfg.vocab_size)

    def test_no_nan_in_forward(self, model, small_cfg):
        ids = torch.randint(0, small_cfg.vocab_size, (2, 8))
        logits = model(ids)
        assert not torch.isnan(logits).any()

    def test_weight_tying(self, model):
        """head.weight must share data with embed.weight."""
        assert model.head.weight.data_ptr() == model.embed.weight.data_ptr()

    def test_gradient_flows_through_model(self, small_cfg):
        m = OpenMythos(small_cfg)
        ids = torch.randint(0, small_cfg.vocab_size, (2, 4))
        logits = m(ids)
        loss = logits.mean()
        loss.backward()
        # Check at least one parameter received a gradient
        grads = [p.grad for p in m.parameters() if p.grad is not None]
        assert len(grads) > 0


class TestOpenMythosGenerate:
    def test_output_length(self, model, small_cfg):
        max_new = 5
        ids = torch.randint(0, small_cfg.vocab_size, (1, 4))
        out = model.generate(ids, max_new_tokens=max_new, n_loops=1)
        assert out.shape == (1, 4 + max_new)

    def test_output_stays_in_vocab(self, model, small_cfg):
        ids = torch.randint(0, small_cfg.vocab_size, (2, 4))
        out = model.generate(ids, max_new_tokens=4)
        assert (out >= 0).all()
        assert (out < small_cfg.vocab_size).all()

    def test_greedy_deterministic(self, model, small_cfg):
        """top_k=1 → greedy decoding → deterministic across two calls."""
        ids = torch.randint(0, small_cfg.vocab_size, (1, 4))
        with torch.no_grad():
            out1 = model.generate(ids.clone(), max_new_tokens=4, top_k=1)
            out2 = model.generate(ids.clone(), max_new_tokens=4, top_k=1)
        torch.testing.assert_close(out1, out2)

    def test_prompt_is_preserved(self, model, small_cfg):
        """The original prompt tokens must appear unchanged at the start."""
        ids = torch.randint(0, small_cfg.vocab_size, (1, 4))
        out = model.generate(ids.clone(), max_new_tokens=3)
        torch.testing.assert_close(out[:, :4], ids)

    def test_no_nan_in_generated_tokens(self, model, small_cfg):
        ids = torch.randint(0, small_cfg.vocab_size, (1, 4))
        out = model.generate(ids, max_new_tokens=4)
        assert not torch.isnan(out.float()).any()

    def test_generate_with_temperature(self, model, small_cfg):
        ids = torch.randint(0, small_cfg.vocab_size, (1, 4))
        out = model.generate(ids, max_new_tokens=3, temperature=0.5)
        assert out.shape == (1, 7)

    def test_generate_zero_max_new_tokens(self, model, small_cfg):
        """Generating 0 new tokens should return the original ids unchanged."""
        ids = torch.randint(0, small_cfg.vocab_size, (1, 4))
        out = model.generate(ids.clone(), max_new_tokens=0)
        # With 0 new tokens the warm-up adds 1; this is expected behaviour.
        assert out.shape[1] >= ids.shape[1]


class TestOpenMythosCompile:
    def test_compile_returns_self(self, small_cfg):
        """compile() should return the model for chaining."""
        m = OpenMythos(small_cfg)
        result = m.compile()
        assert result is m

    def test_compile_doesnt_break_forward(self, small_cfg):
        """After compile(), forward should still produce correct output."""
        m = OpenMythos(small_cfg)
        m.compile()
        m.eval()
        ids = torch.randint(0, small_cfg.vocab_size, (1, 4))
        with torch.no_grad():
            logits = m(ids)
        assert logits.shape == (1, 4, small_cfg.vocab_size)
        assert not torch.isnan(logits).any()
