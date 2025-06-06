export type DocumentMetadata = {
  filename: string
  extension: string
  size: number
  lines: number
  words: number
  processedAt: string
}

export type ProcessedDocument = {
  content: string
  metadata: DocumentMetadata
}

export type Chunk = {
  id: string
  content: string
  metadata: ChunkMetadata
}

export type ChunkMetadata = {
  index: number
  startChar: number
  endChar: number
  wordCount: number
  source?: string
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
