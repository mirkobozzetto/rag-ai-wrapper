# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server with hot reload on port 3000
- `npm run build` - Build TypeScript to dist/
- `npm start` - Run built application
- Server runs on http://localhost:3000

## Architecture

This is a RAG (Retrieval-Augmented Generation) wrapper API built with Hono.js and TypeScript.

**Core Structure:**
- **Routes**: Class-based route handlers in `src/routes/` that return Hono router instances
- **Services**: Business logic classes in `src/services/` for file processing and text chunking
- **Main App**: `src/index.ts` sets up Hono app with route mounting pattern

**Key APIs:**
- `POST /upload` - Accepts .txt/.md files, processes them with FileProcessor
- `POST /chunk` - Takes text and returns sentence-based chunks with configurable size/overlap

**Processing Flow:**
1. FileProcessor validates file types and extracts text content with metadata
2. TextChunker splits text into sentence-based chunks with word-based overlap
3. All chunks include unique IDs, character positions, and word counts

**Technical Details:**
- Uses ESNext modules with bundler resolution
- Class-based architecture with dependency injection pattern
- Environment config via dotenv
- Chunking strategy: sentence boundaries with 30% max word overlap