// src/routes/chunk.ts

import { Context, Hono } from 'hono'
import { TextChunker } from '../services/TextChunker'

export class Chunk {
  private app = new Hono()

  constructor() {
    this.setupRoutes()
  }

  private setupRoutes() {
    this.app.post('/', this.handleChunk.bind(this))
  }

  private async handleChunk(c: Context) {
    try {
      const body = await c.req.json()
      const { text, chunkSize = 500, overlap = 50, source } = body

      if (!text || typeof text !== 'string') {
        return c.json({ error: 'Text is required and must be a string' }, 400)
      }

      if (text.trim().length === 0) {
        return c.json({ error: 'Text cannot be empty' }, 400)
      }

      const chunks = TextChunker.chunk(text, chunkSize, overlap, source)

      return c.json({
        success: true,
        data: {
          chunks,
          metadata: {
            totalChunks: chunks.length,
            originalLength: text.length,
            chunkSize,
            overlap,
            processedAt: new Date().toISOString(),
          },
        },
      })
    } catch (error) {
      console.error('Chunk error:', error)
      return c.json({ error: 'Failed to process text chunking' }, 500)
    }
  }

  getRouter() {
    return this.app
  }
}
