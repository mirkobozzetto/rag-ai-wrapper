// src/services/Embeddings.ts

import OpenAI from 'openai'
import { Chunk } from './TextChunker'

export interface EmbeddedChunk {
  id: string
  content: string
  embedding: number[]
  metadata: Chunk['metadata']
}

export class EmbeddingService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    })
  }

  async createEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    })

    return response.data[0].embedding
  }

  async embedChunks(chunks: Chunk[]): Promise<EmbeddedChunk[]> {
    const embeddedChunks: EmbeddedChunk[] = []

    for (const chunk of chunks) {
      const embedding = await this.createEmbedding(chunk.content)
      embeddedChunks.push({
        id: chunk.id,
        content: chunk.content,
        embedding,
        metadata: chunk.metadata,
      })
    }

    return embeddedChunks
  }

  cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }

  async findSimilarChunks(
    query: string,
    chunks: EmbeddedChunk[],
    limit: number = 3,
  ): Promise<EmbeddedChunk[]> {
    const queryEmbedding = await this.createEmbedding(query)

    const similarities = chunks.map(chunk => ({
      ...chunk,
      similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding),
    }))

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
  }
}
