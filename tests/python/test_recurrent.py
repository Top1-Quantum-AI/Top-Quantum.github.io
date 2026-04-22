"""Unit tests for RecurrentInjection and RecurrentModule."""
import torch
import pytest
from open_mythos.config import MythosConfig
from open_mythos.recurrent import RecurrentInjection, RecurrentModule


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


class TestRecurrentInjection:
    def test_output_shapes(self, cfg):
        inj = RecurrentInjection(cfg)
        B, T = 2, 8
        x = torch.randn(B, T, cfg.dim)
        h = torch.zeros(B, cfg.dim)
        x_out, h_new = inj(x, h)
        assert x_out.shape == (B, T, cfg.dim)
        assert h_new.shape == (B, cfg.dim)

    def test_hidden_state_updates(self, cfg):
        inj = RecurrentInjection(cfg)
        B, T = 2, 4
        x = torch.randn(B, T, cfg.dim)
        h = torch.zeros(B, cfg.dim)
        _, h_new = inj(x, h)
        # h_new should differ from the zero initial state after one step
        assert not torch.allclose(h_new, h)

    def test_stability_get_A(self, cfg):
        """All values of A must lie strictly in (0, 1) — stability guarantee."""
        inj = RecurrentInjection(cfg)
        A = inj.get_A()
        assert (A > 0).all()
        assert (A < 1).all()

    def test_stability_after_many_steps(self, cfg):
        """Repeated application with fixed x should not diverge."""
        inj = RecurrentInjection(cfg)
        inj.eval()
        x = torch.randn(1, 4, cfg.dim)
        h = torch.zeros(1, cfg.dim)
        with torch.no_grad():
            for _ in range(100):
                _, h = inj(x, h)
        assert not torch.isnan(h).any()
        assert not torch.isinf(h).any()

    def test_gradient_flows(self, cfg):
        inj = RecurrentInjection(cfg)
        x = torch.randn(2, 4, cfg.dim, requires_grad=True)
        h = torch.zeros(2, cfg.dim)
        x_out, h_new = inj(x, h)
        (x_out.sum() + h_new.sum()).backward()
        assert x.grad is not None


class TestRecurrentModule:
    def test_output_shapes(self, cfg):
        mod = RecurrentModule(cfg)
        B, T = 2, 8
        x = torch.randn(B, T, cfg.dim)
        h = torch.zeros(B, cfg.dim)
        x_out, h_new = mod(x, h)
        assert x_out.shape == (B, T, cfg.dim)
        assert h_new.shape == (B, cfg.dim)

    def test_no_nan_in_output(self, cfg):
        mod = RecurrentModule(cfg)
        x = torch.randn(2, 4, cfg.dim)
        h = torch.zeros(2, cfg.dim)
        x_out, h_new = mod(x, h)
        assert not torch.isnan(x_out).any()
        assert not torch.isnan(h_new).any()

    def test_gradient_flows(self, cfg):
        mod = RecurrentModule(cfg)
        x = torch.randn(2, 4, cfg.dim, requires_grad=True)
        h = torch.zeros(2, cfg.dim)
        x_out, h_new = mod(x, h)
        (x_out.sum() + h_new.sum()).backward()
        assert x.grad is not None

    def test_deterministic_eval(self, cfg):
        mod = RecurrentModule(cfg)
        mod.eval()
        x = torch.randn(1, 4, cfg.dim)
        h = torch.zeros(1, cfg.dim)
        with torch.no_grad():
            x1, h1 = mod(x, h)
            x2, h2 = mod(x, h)
        torch.testing.assert_close(x1, x2)
        torch.testing.assert_close(h1, h2)
