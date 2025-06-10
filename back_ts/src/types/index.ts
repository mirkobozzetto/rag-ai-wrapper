// src/types/index.ts

export type DocumentMetadata = {
  filename: string
  extension: string
  size: number
  lines: number
  words: number
  processedAt: string
  pages?: number
  title?: string
  author?: string
  creator?: string
  subject?: string
  keywords?: string
}

export type ProcessedDocument = {
  content: string
  metadata: DocumentMetadata
}

export type ChunkMetadata = {
  index: number
  startChar: number
  endChar: number
  wordCount: number
  source?: string
  page?: number
  chapter?: string
}

export type Chunk = {
  id: string
  content: string
  metadata: ChunkMetadata
}

export type EmbeddedChunk = {
  id: string
  content: string
  embedding: number[]
  metadata: ChunkMetadata
}

export type ChunkingOptions = {
  chunkSize?: number
  overlap?: number
  source?: string
}

export type VectorStoreStats = {
  totalChunks: number
  sources: string[]
}

export type BookMetadata = {
  title?: string
  author?: string
  subject?: string
  chapters?: string[]
  language?: string
  pageCount?: number
}

export type PDFInfo = {
  pages: number
  title?: string
  author?: string
  creator?: string
  subject?: string
  keywords?: string
}
