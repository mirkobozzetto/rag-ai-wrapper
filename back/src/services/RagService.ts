// src/services/RagService.ts

import OpenAI from 'openai'
import { EmbeddedChunk, EmbeddingService } from './Embeddings'
import { FileProcessor } from './FileProcessor'
import { TextChunker } from './TextChunker'
import { VectorStore } from './VectorStore'

export class RagService {
  private embeddingService: EmbeddingService
  private vectorStore: VectorStore
  private openai: OpenAI

  constructor() {
    this.embeddingService = new EmbeddingService()
    this.vectorStore = VectorStore.getInstance()
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    })
  }

  async processDocument(
    buffer: Buffer,
    filename: string,
  ): Promise<{
    filename: string
    chunks: number
    metadata: unknown
  }> {
    const { content, metadata } = FileProcessor.processText(buffer, filename)

    const chunks = TextChunker.chunk(content, 500, 50, filename)

    const embeddedChunks = await this.embeddingService.embedChunks(chunks)

    this.vectorStore.addChunks(embeddedChunks)

    return {
      filename,
      chunks: chunks.length,
      metadata,
    }
  }

  async askQuestion(question: string): Promise<any> {
    const allChunks = this.vectorStore.getAllChunks()

    if (allChunks.length === 0) {
      return {
        answer:
          "Aucun document n'a été traité. Veuillez d'abord uploader des documents.",
        sources: [],
      }
    }

    const relevantChunks = (await this.embeddingService.findSimilarChunks(
      question,
      allChunks,
      3,
    )) as (EmbeddedChunk & { similarity: number })[]

    const context = relevantChunks.map(chunk => chunk.content).join('\n\n')

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            "Tu es un assistant qui répond aux questions en te basant uniquement sur le contexte fourni. Si le contexte ne contient pas l'information demandée, dis-le clairement.",
        },
        {
          role: 'user',
          content: `Contexte:\n${context}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.1,
    })

    return {
      answer: response.choices[0].message.content,
      sources: relevantChunks.map(chunk => ({
        filename: chunk.metadata.source,
        content: chunk.content.substring(0, 100) + '...',
        similarity: chunk.similarity,
      })),
    }
  }

  getStats(): { totalChunks: number; sources: string[] } {
    return this.vectorStore.getStats()
  }
}
