# Step-by-Step Implementation Plan

## Current Status: Project Setup Phase

### Completed Tasks

- [x] Created project directory structure
- [x] Added Cursor configuration files (.cursorrules, .cursor/rules/\*.mdc)
- [x] Created documentation (tools overview, project structure)
- [x] Added task automation script (tasks.py)
- [x] Set Python version to 3.12.5

### Current Configuration Files

```
rag-project/
├── .cursor/
│   ├── .cursorrules
│   └── rules/
│       ├── fastapi-async.mdc
│       ├── python-rag.mdc
│       └── vector-ops.mdc
├── .env.example
├── .python-version (3.12.5)
├── main.py
├── project-structure.md
├── pyproject.toml (needs replacement)
├── README.md
└── tasks.py
```

---

## Phase 1: Environment Setup

### Step 1: Fix pyproject.toml

Replace current pyproject.toml with minimal version:

```toml
[project]
name = "rag-project"
version = "0.1.0"
description = "RAG with FastAPI + Qdrant + FastEmbed"
requires-python = ">=3.12"

dependencies = [
    "fastapi>=0.104.0",
    "uvicorn>=0.24.0",
    "pydantic>=2.0.0",
]

[project.optional-dependencies]
dev = [
    "black>=23.0.0",
    "ruff>=0.1.0",
]

[tool.black]
line-length = 88

[tool.ruff]
line-length = 88
select = ["E", "F", "W", "I"]
```

### Step 2: Initialize uv environment

```bash
uv sync
```

### Step 3: Create basic FastAPI application

Create `src/api/main.py`:

```python
from fastapi import FastAPI

app = FastAPI(title="RAG Project", version="0.1.0")

@app.get("/")
async def root():
    return {"message": "RAG API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Step 4: Test basic setup

```bash
uv run python src/api/main.py
```

---

## Phase 2: Add Vector Database

### Step 5: Add Qdrant client

```bash
uv add qdrant-client
```

### Step 6: Create Qdrant service

Create `src/core/vector_store.py`:

```python
from qdrant_client import QdrantClient
from typing import Optional

class QdrantService:
    def __init__(self, url: str, api_key: Optional[str] = None):
        self.client = QdrantClient(url=url, api_key=api_key)

    async def health_check(self) -> bool:
        try:
            collections = await self.client.get_collections()
            return True
        except Exception:
            return False
```

### Step 7: Add Qdrant health endpoint

Update `src/api/main.py` to include Qdrant health check.

### Step 8: Test Qdrant connection

```bash
uv run python src/api/main.py
curl http://localhost:8000/health/qdrant
```

---

## Phase 3: Add Document Processing

### Step 9: Add document processing dependencies

```bash
uv add python-multipart pypdf
```

### Step 10: Create document upload endpoint

Create `src/api/routes/documents.py` with file upload functionality.

### Step 11: Test document upload

```bash
curl -F "file=@test.pdf" http://localhost:8000/documents/upload
```

---

## Phase 4: Add Embedding Generation

### Step 12: Add FastEmbed

```bash
uv add fastembed
```

### Step 13: Create embedding service

Create `src/services/embedding_service.py` with FastEmbed integration.

### Step 14: Test embedding generation

Test with sample text to verify FastEmbed is working.

---

## Phase 5: Add RAG Pipeline

### Step 15: Add LangChain core

```bash
uv add langchain-core langchain-openai
```

### Step 16: Create basic RAG service

Create `src/services/rag_service.py` with basic retrieval and generation.

### Step 17: Add query endpoint

Create query endpoint that processes questions and returns answers.

### Step 18: Test complete RAG flow

```bash
# Upload document
curl -F "file=@test.pdf" http://localhost:8000/documents/upload

# Query document
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is this document about?"}'
```

---

## Phase 6: Production Readiness

### Step 19: Add testing

```bash
uv add --dev pytest pytest-asyncio
```

### Step 20: Add basic tests

Create tests for each service and endpoint.

### Step 21: Add configuration management

```bash
uv add pydantic-settings
```

### Step 22: Environment configuration

Create proper settings management with environment variables.

### Step 23: Add logging

```bash
uv add structlog
```

### Step 24: Error handling

Add proper error handling and logging throughout the application.

---

## Key Decision Points

### Tool Selection Rationale

1. **uv over pip/poetry**: Performance and simplicity
2. **FastAPI over Flask**: Async support and automatic documentation
3. **Qdrant over Pinecone**: Self-hosted option and flexibility
4. **FastEmbed over OpenAI**: Cost control and privacy
5. **LangChain over custom**: Rapid prototyping and integrations

### Implementation Strategy

- Start minimal, add complexity incrementally
- Test each component independently before integration
- Maintain working application at each step
- Add production features only after core functionality works

### Next Immediate Action

Replace pyproject.toml with minimal version and run `uv sync` to start with clean environment.
