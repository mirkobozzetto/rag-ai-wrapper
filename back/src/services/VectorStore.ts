// src/services/VectorStore.ts

import { EmbeddedChunk } from './Embeddings'

export class VectorStore {
  private static instance: VectorStore
  private chunks: EmbeddedChunk[] = []

  private constructor() {}

  static getInstance(): VectorStore {
    if (!VectorStore.instance) {
      VectorStore.instance = new VectorStore()
    }
    return VectorStore.instance
  }

  addChunks(chunks: EmbeddedChunk[]): void {
    this.chunks.push(...chunks)
  }

  getAllChunks(): EmbeddedChunk[] {
    return this.chunks
  }

  getChunksBySource(source: string): EmbeddedChunk[] {
    return this.chunks.filter(chunk => chunk.metadata.source === source)
  }

  clearAll(): void {
    this.chunks = []
  }

  getStats(): { totalChunks: number; sources: string[] } {
    const sources = [
      ...new Set(
        this.chunks
          .map(chunk => chunk.metadata.source)
          .filter((source): source is string => Boolean(source)),
      ),
    ]
    return {
      totalChunks: this.chunks.length,
      sources,
    }
  }
}
