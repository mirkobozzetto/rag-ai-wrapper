.PHONY: dev start install clean test lint format

dev:
	uv run fastapi dev src/api/main.py

start:
	uv run hypercorn src.api.main:app --bind 0.0.0.0:8000

install:
	uv sync

clean:
	rm -rf .venv uv.lock
	uv sync

test:
	uv run pytest

lint:
	uv run ruff check .

format:
	uv run black .
	uv run ruff check --fix .

help:
	@echo "Available commands:"
	@echo "  dev       - Start development server"
	@echo "  start     - Start production server"
	@echo "  install   - Install dependencies"
	@echo "  clean     - Clean and reinstall dependencies"
	@echo "  test      - Run tests"
	@echo "  lint      - Lint code"
	@echo "  format    - Format code"
