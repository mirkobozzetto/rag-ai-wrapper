# RAG AI Wrapper

A lightweight, modular wrapper API for Retrieval-Augmented Generation (RAG) workflows, designed to simplify the integration of document processing, text chunking, and AI-powered question answering.

## Why This Project?

### The Problem

Building RAG applications typically involves:

- Complex document processing pipelines
- Manual text chunking and embedding management
- Scattered tooling across different platforms
- Vendor lock-in with specific AI services
- Difficulty in prototyping and testing RAG workflows

### The Solution

This wrapper provides a **unified, lightweight API** that abstracts the complexity of RAG operations while maintaining flexibility and modularity.

## Core Philosophy

### 🎯 **Simplicity First**

Clean, intuitive API endpoints that handle complex operations behind the scenes. Upload a document, get structured chunks. Ask a question, get contextual answers.

### 🔄 **Vendor Agnostic**

Designed to work with multiple AI providers and vector databases. Switch between OpenAI, Anthropic, or local models without changing your application logic.

## Use Cases

- **Rapid Prototyping**: Quickly test RAG concepts without infrastructure overhead
- **Educational Projects**: Learn RAG principles with a hands-on, practical API
- **Production Microservice**: Deploy as a dedicated RAG service in your architecture
- **AI Integration**: Add document Q&A capabilities to existing applications
- **Research & Experimentation**: Test different chunking strategies and AI models

## Architecture

```
┌─────────────┐     ┌──────────────┐      ┌──────────────┐
│   Upload    │───▶│   Chunking   │─────▶│   Vector     │
│  Documents  │     │  & Metadata  │      │   Storage    │
└─────────────┘     └──────────────┘      └──────────────┘
                                                 │
┌─────────────┐     ┌───────────────┐            │
│   Query     │◀───│  AI Response   │◀──────────┘
│  Interface  │     │  Generation   │
└─────────────┘     └───────────────┘
```

This project bridges the gap between complex RAG frameworks and simple chatbot APIs, providing the perfect balance of power and simplicity for modern AI applications.
