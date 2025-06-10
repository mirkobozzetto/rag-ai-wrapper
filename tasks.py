#!/usr/bin/env python3
"""
Development task automation for RAG project using uv.
Provides convenient commands for common development tasks.

Usage:
    python tasks.py <command>

Available commands:
    setup       - Initial project setup
    install     - Install all dependencies
    dev         - Start development server
    test        - Run test suite
    lint        - Run linting and type checking
    format      - Format code with black and ruff
    clean       - Clean up generated files
    qdrant      - Setup Qdrant collections
    docs        - Generate documentation
    build       - Build the project
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path
from typing import NoReturn


def run_cmd(cmd: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    """Execute command with proper error handling."""
    print(f"🔄 Running: {cmd}")
    result = subprocess.run(
        cmd,
        shell=True,
        capture_output=False,
        text=True,
        check=False
    )
    if check and result.returncode != 0:
        print(f"❌ Command failed with exit code {result.returncode}")
        sys.exit(result.returncode)
    return result


def check_uv() -> None:
    """Check if uv is installed."""
    result = run_cmd("uv --version", check=False)
    if result.returncode != 0:
        print("❌ uv is not installed. Please install it first:")
        print("   pip install uv")
        print("   or visit: https://github.com/astral-sh/uv")
        sys.exit(1)


def setup() -> None:
    """Initial project setup."""
    print("🚀 Setting up RAG project...")

    # Check uv installation
    check_uv()

    # Create directory structure
    directories = [
        ".cursor/rules",
        "src/api/routes",
        "src/core",
        "src/services",
        "src/models",
        "src/utils",
        "tests/unit",
        "tests/integration",
        "tests/fixtures",
        "scripts",
        "data/raw",
        "data/processed",
        "docs",
    ]

    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        # Create __init__.py files for Python packages
        if directory.startswith("src/") or directory.startswith("tests/"):
            (Path(directory) / "__init__.py").touch()

    print("✅ Directory structure created")

    # Install dependencies
    install()

    print("✅ Project setup complete!")


def install() -> None:
    """Install all dependencies."""
    print("📦 Installing dependencies...")
    run_cmd("uv sync")
    run_cmd("uv add --dev pre-commit")
    run_cmd("uv run pre-commit install")
    print("✅ Dependencies installed")


def dev() -> None:
    """Start development server."""
    print("🔧 Starting development server...")
    run_cmd("uv run python -m src.api.main")


def test() -> None:
    """Run comprehensive test suite."""
    print("🧪 Running tests...")
    run_cmd("uv run pytest --cov=src --cov-report=html --cov-report=term-missing")


def test_unit() -> None:
    """Run only unit tests."""
    print("🧪 Running unit tests...")
    run_cmd("uv run pytest tests/unit/ -v")


def test_integration() -> None:
    """Run only integration tests."""
    print("🧪 Running integration tests...")
    run_cmd("uv run pytest tests/integration/ -v")


def lint() -> None:
    """Run linting and type checking."""
    print("🔍 Running linting and type checking...")
    run_cmd("uv run ruff check src/ tests/")
    run_cmd("uv run mypy src/")
    print("✅ Linting complete")


def format_code() -> None:
    """Format code with black and ruff."""
    print("🎨 Formatting code...")
    run_cmd("uv run black src/ tests/ tasks.py")
    run_cmd("uv run ruff check --fix src/ tests/")
    print("✅ Code formatted")


def clean() -> None:
    """Clean up generated files."""
    print("🧹 Cleaning up...")
    import shutil

    patterns_to_remove = [
        ".pytest_cache",
        ".coverage",
        "htmlcov",
        ".mypy_cache",
        ".ruff_cache",
        "dist",
        "build",
        "*.egg-info",
        "__pycache__",
    ]

    for pattern in patterns_to_remove:
        for path in Path(".").rglob(pattern):
            if path.is_dir():
                shutil.rmtree(path)
                print(f"  Removed directory: {path}")
            elif path.is_file():
                path.unlink()
                print(f"  Removed file: {path}")

    print("✅ Cleanup complete")


def setup_qdrant() -> None:
    """Setup Qdrant collections."""
    print("🗄️  Setting up Qdrant collections...")
    run_cmd("uv run python scripts/setup_qdrant.py")
    print("✅ Qdrant setup complete")


def ingest_docs() -> None:
    """Ingest sample documents."""
    print("📄 Ingesting documents...")
    run_cmd("uv run python scripts/ingest_documents.py")
    print("✅ Documents ingested")


def docs() -> None:
    """Generate documentation."""
    print("📚 Generating documentation...")
    run_cmd("uv run python -m src.api.main --generate-openapi-json")
    print("✅ Documentation generated")


def build() -> None:
    """Build the project."""
    print("🏗️  Building project...")
    run_cmd("uv build")
    print("✅ Build complete")


def health_check() -> None:
    """Run system health checks."""
    print("💊 Running health checks...")
    run_cmd("uv run python scripts/health_check.py")


def requirements() -> None:
    """Export requirements for compatibility."""
    print("📝 Exporting requirements...")
    run_cmd("uv export --format requirements-txt --output-file requirements.txt")
    run_cmd("uv export --format requirements-txt --dev --output-file requirements-dev.txt")
    print("✅ Requirements exported")


def show_help() -> None:
    """Show available commands."""
    print(__doc__)


def main() -> NoReturn:
    """Main task runner."""
    if len(sys.argv) < 2:
        show_help()
        sys.exit(1)

    command = sys.argv[1].replace("-", "_")

    # Map of available commands
    commands = {
        "setup": setup,
        "install": install,
        "dev": dev,
        "test": test,
        "test_unit": test_unit,
        "test_integration": test_integration,
        "lint": lint,
        "format": format_code,
        "clean": clean,
        "qdrant": setup_qdrant,
        "ingest": ingest_docs,
        "docs": docs,
        "build": build,
        "health": health_check,
        "requirements": requirements,
        "help": show_help,
    }

    if command not in commands:
        print(f"❌ Unknown command: {sys.argv[1]}")
        print("\nAvailable commands:")
        for cmd in commands:
            print(f"  {cmd}")
        sys.exit(1)

    try:
        commands[command]()
    except KeyboardInterrupt:
        print("\n❌ Task interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Task failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
