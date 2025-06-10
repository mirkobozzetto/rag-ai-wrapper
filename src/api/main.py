from fastapi import FastAPI

app = FastAPI(
    title="RAG Project",
    version="0.1.0",
    description="RAG application with FastAPI, Qdrant, and FastEmbed"
)

@app.get("/")
async def root():
    return {"message": "RAG API is running", "version": "0.1.0"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "rag-api"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
