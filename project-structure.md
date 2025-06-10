# Project Structure for RAG Application

## Complete Directory Architecture

```
rag-project/
├── .cursor/
│   └── rules/
│       ├── python-rag.mdc           # RAG-specific patterns
│       ├── fastapi-async.mdc        # FastAPI async patterns
│       └── vector-ops.mdc           # Qdrant operations
├── src/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI app initialization
│   │   ├── dependencies.py          # Dependency injection
│   │   ├── middleware.py            # CORS, auth, logging
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── chat.py              # RAG query endpoints
│   │       ├── documents.py         # Document management
│   │       └── health.py            # Health checks
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py                # Pydantic settings
│   │   ├── exceptions.py            # Custom exceptions
│   │   └── security.py              # Auth utilities
│   ├── services/
│   │   ├── __init__.py
│   │   ├── rag_service.py           # RAG orchestration
│   │   ├── document_processor.py    # Document ingestion
│   │   ├── embedding_service.py     # FastEmbed integration
│   │   └── vector_store.py          # Qdrant operations
│   ├── models/
│   │   ├── __init__.py
│   │   ├── requests.py              # API request schemas
│   │   ├── responses.py             # API response schemas
│   │   └── entities.py              # Business entities
│   └── utils/
│       ├── __init__.py
│       ├── logging.py               # Structured logging
│       └── validators.py            # Input validation
├── tests/
│   ├── __init__.py
│   ├── conftest.py                  # Pytest configuration
│   ├── unit/                        # Unit tests
│   ├── integration/                 # Integration tests
│   └── fixtures/                    # Test data
├── scripts/
│   ├── setup_qdrant.py             # Initialize Qdrant
│   ├── ingest_documents.py         # Batch processing
│   └── health_check.py             # System health
├── data/
│   ├── raw/                         # Original documents
│   └── processed/                   # Processed chunks
├── .cursorrules                     # Main Cursor rules
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore patterns
├── .python-version                  # Python version (3.11)
├── pyproject.toml                   # uv configuration
├── uv.lock                          # Dependency lockfile
└── README.md                        # Project documentation
```

## Key Files and Their Purpose

### Configuration Files

- **`.cursorrules`**: Main Cursor IDE configuration with project-wide development rules
- **`.cursor/rules/*.mdc`**: Modular rules for specific components (RAG, FastAPI, Qdrant)
- **`pyproject.toml`**: uv package management and tool configuration
- **`.env.example`**: Environment variables template

### Core Application Structure

- **`src/api/`**: FastAPI application layer with routes, middleware, and dependencies
- **`src/core/`**: Core utilities, configuration, and cross-cutting concerns
- **`src/services/`**: Business logic layer with RAG orchestration and processing
- **`src/models/`**: Pydantic models for data validation and serialization
- **`src/utils/`**: Helper functions and utilities

### Development and Operations

- **`tests/`**: Comprehensive test suite with unit and integration tests
- **`scripts/`**: Operational scripts for setup, maintenance, and health checks
- **`data/`**: Data directories for document storage and processing

## Architecture Principles

### Dependency Injection

- Protocol-based interfaces for type safety
- FastAPI's dependency system for clean separation
- Easy testing with dependency overrides

### Async-First Design

- All I/O operations are async
- Proper connection pooling
- Background task processing

### Type Safety

- Comprehensive type hints throughout
- Pydantic models for data validation
- Protocol classes for interfaces

### Error Handling

- Custom exception hierarchies
- Structured logging with correlation IDs
- Proper error propagation and handling

### Performance Optimization

- Connection pooling for external services
- Batch processing for large operations
- Caching strategies for frequent operations
- Monitoring and metrics collection

## Getting Started

1. **Initialize the project:**

   ```bash
   uv init rag-project --python 3.11
   cd rag-project
   ```

2. **Install dependencies:**

   ```bash
   uv add fastapi hypercorn langchain qdrant-client fastembed pydantic
   uv add --dev pytest pytest-asyncio black ruff mypy
   ```

3. **Set up the directory structure:**

   ```bash
   mkdir -p .cursor/rules src/{api,core,services,models,utils}/routes tests/{unit,integration} scripts data/{raw,processed}
   ```

4. **Create the rule files** using the provided artifacts

5. **Configure environment:**

   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

6. **Initialize Qdrant:**

   ```bash
   uv run python scripts/setup_qdrant.py
   ```

7. **Start development:**
   ```bash
   uv run python -m src.api.main
   ```

This structure maximizes Cursor IDE's AI assistance while maintaining production-ready patterns and clear separation of concerns.
