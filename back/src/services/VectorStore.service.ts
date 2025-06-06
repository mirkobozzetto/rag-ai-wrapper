// src/services/VectorStore.service.ts

import { injectable } from 'tsyringe'
import { IVectorStoreService } from '../interfaces/services.interfaces'
import { EmbeddedChunk, VectorStoreStats } from '../types'

@injectable()
export class VectorStoreService implements IVectorStoreService {
  private static instance: VectorStoreService
  private chunks: EmbeddedChunk[] = []

  constructor() {
    if (VectorStoreService.instance) {
      return VectorStoreService.instance
    }
    VectorStoreService.instance = this
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

  getStats(): VectorStoreStats {
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
