// src/services/RagService.service.ts

import OpenAI from 'openai'
import { inject, injectable } from 'tsyringe'
import {
  IEmbeddingService,
  IFileProcessorService,
  IRagService,
  ITextChunkerService,
  IVectorStoreService,
} from '../interfaces/services.interfaces'
import { EmbeddedChunk, VectorStoreStats } from '../types'

@injectable()
export class RagService implements IRagService {
  private openai: OpenAI

  constructor(
    @inject('IFileProcessorService')
    private fileProcessor: IFileProcessorService,
    @inject('ITextChunkerService') private textChunker: ITextChunkerService,
    @inject('IEmbeddingService') private embeddingService: IEmbeddingService,
    @inject('IVectorStoreService') private vectorStore: IVectorStoreService,
  ) {
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
    const { content, metadata } = await this.fileProcessor.processFile(
      buffer,
      filename,
    )

    const chunks = this.textChunker.chunk(content, 500, 50, filename)

    const embeddedChunks = await this.embeddingService.embedChunks(chunks)

    await this.vectorStore.addChunks(embeddedChunks)

    return {
      filename,
      chunks: chunks.length,
      metadata,
    }
  }

  async askQuestion(question: string): Promise<{
    answer: string | null
    sources: Array<{
      filename?: string
      content: string
      similarity: number
    }>
  }> {
    const allChunks = await this.vectorStore.getAllChunks()

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

  async getStats(): Promise<VectorStoreStats> {
    return await this.vectorStore.getStats()
  }
}
