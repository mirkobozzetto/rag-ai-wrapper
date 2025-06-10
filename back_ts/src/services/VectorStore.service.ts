// src/services/VectorStore.service.ts

import { QdrantClient } from '@qdrant/qdrant-js'
import { injectable } from 'tsyringe'
import { IVectorStoreService } from '../interfaces/services.interfaces'
import { ChunkMetadata, EmbeddedChunk, VectorStoreStats } from '../types'

@injectable()
export class VectorStoreService implements IVectorStoreService {
  private client: QdrantClient
  private collectionName = 'my_rag_docs'

  constructor() {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL!,
      apiKey: process.env.QDRANT_API_KEY!,
    })
    this.initializeCollection()
  }

  private async initializeCollection(): Promise<void> {
    try {
      const collections = await this.client.getCollections()
      const exists = collections.collections.some(
        c => c.name === this.collectionName,
      )

      if (!exists) {
        console.log(`Creating collection: ${this.collectionName}`)
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: 1536,
            distance: 'Cosine',
          },
        })
        console.log(`Collection ${this.collectionName} created successfully`)
      } else {
        console.log(`Collection ${this.collectionName} already exists`)
      }
    } catch (error) {
      console.error('Failed to initialize collection:', error)
    }
  }

  async addChunks(chunks: EmbeddedChunk[]): Promise<void> {
    try {
      const points = chunks.map(chunk => ({
        id: chunk.id,
        vector: chunk.embedding,
        payload: {
          content: chunk.content,
          metadata: chunk.metadata,
        },
      }))

      await this.client.upsert(this.collectionName, {
        wait: true,
        points,
      })
      console.log(`Added ${chunks.length} chunks to ${this.collectionName}`)
    } catch (error) {
      console.error('Failed to add chunks:', error)
      throw error
    }
  }

  async getAllChunks(): Promise<EmbeddedChunk[]> {
    const result = await this.client.scroll(this.collectionName, {
      limit: 1000,
      with_payload: true,
      with_vector: true,
    })

    return result.points.map(point => ({
      id: point.id as string,
      content: point.payload?.content as string,
      embedding: point.vector as number[],
      metadata: point.payload?.metadata as ChunkMetadata,
    }))
  }

  async getChunksBySource(source: string): Promise<EmbeddedChunk[]> {
    const result = await this.client.scroll(this.collectionName, {
      filter: {
        must: [
          {
            key: 'metadata.source',
            match: { value: source },
          },
        ],
      },
      limit: 1000,
      with_payload: true,
      with_vector: true,
    })

    return result.points.map(point => ({
      id: point.id as string,
      content: point.payload?.content as string,
      embedding: point.vector as number[],
      metadata: point.payload?.metadata as ChunkMetadata,
    }))
  }

  async clearAll(): Promise<void> {
    await this.client.deleteCollection(this.collectionName)
    await this.initializeCollection()
  }

  async getStats(): Promise<VectorStoreStats> {
    const info = await this.client.getCollection(this.collectionName)
    const result = await this.client.scroll(this.collectionName, {
      limit: 1000,
      with_payload: true,
    })

    const sources = [
      ...new Set(
        result.points
          .map(p => (p.payload?.metadata as ChunkMetadata)?.source)
          .filter(Boolean) as string[],
      ),
    ]

    return {
      totalChunks: info.points_count || 0,
      sources,
    }
  }
}
