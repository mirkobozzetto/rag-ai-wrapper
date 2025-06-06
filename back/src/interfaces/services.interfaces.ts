// src/interfaces/services.interfaces.ts

import {
  BookMetadata,
  Chunk,
  EmbeddedChunk,
  ProcessedDocument,
  VectorStoreStats,
} from '../types'

export interface IFileProcessorService {
  processFile(buffer: Buffer, filename: string): Promise<ProcessedDocument>
  isValidFile(filename: string): boolean
  extractBookMetadata?(document: ProcessedDocument): BookMetadata
}

export interface ITextChunkerService {
  chunk(
    text: string,
    chunkSize?: number,
    overlap?: number,
    source?: string,
  ): Chunk[]
  detectChapters?(text: string): string[]
  chunkBySemanticStructure?(text: string, source?: string): Chunk[]
}

export interface IEmbeddingService {
  createEmbedding(text: string): Promise<number[]>
  embedChunks(chunks: Chunk[]): Promise<EmbeddedChunk[]>
  findSimilarChunks(
    query: string,
    chunks: EmbeddedChunk[],
    limit?: number,
  ): Promise<EmbeddedChunk[]>
  cosineSimilarity(a: number[], b: number[]): number
}

export interface IVectorStoreService {
  addChunks(chunks: EmbeddedChunk[]): void
  getAllChunks(): EmbeddedChunk[]
  getChunksBySource(source: string): EmbeddedChunk[]
  clearAll(): void
  getStats(): VectorStoreStats
}

export interface IRagService {
  processDocument(
    buffer: Buffer,
    filename: string,
  ): Promise<{
    filename: string
    chunks: number
    metadata: unknown
    bookInfo?: BookMetadata
  }>
  askQuestion(question: string): Promise<{
    answer: string | null
    sources: Array<{
      filename?: string
      content: string
      similarity: number
      page?: number
      chapter?: string
    }>
  }>
  askAsAuthor?(
    question: string,
    authorPersona?: string,
  ): Promise<{
    answer: string | null
    sources: Array<{
      filename?: string
      content: string
      similarity: number
    }>
    persona: string
  }>
  getStats(): VectorStoreStats
}
