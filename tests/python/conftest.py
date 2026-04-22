"""
Pytest configuration for OpenMythos tests.
Adds the repo root to sys.path so `open_mythos` is importable.
"""
import sys
import os

# Ensure the repo root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
