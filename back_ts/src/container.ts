// src/container.ts

import { container } from 'tsyringe'
import {
  IEmbeddingService,
  IFileProcessorService,
  IRagService,
  ITextChunkerService,
  IVectorStoreService,
} from './interfaces/services.interfaces'

import { EmbeddingService } from './services/Embeddings.service'
import { FileProcessorService } from './services/FileProcessor.service'
import { RagService } from './services/RagService.service'
import { TextChunkerService } from './services/TextChunker.service'
import { VectorStoreService } from './services/VectorStore.service'

export function setupContainer(): void {
  container.registerSingleton<IFileProcessorService>(
    'IFileProcessorService',
    FileProcessorService,
  )

  container.registerSingleton<ITextChunkerService>(
    'ITextChunkerService',
    TextChunkerService,
  )

  container.registerSingleton<IEmbeddingService>(
    'IEmbeddingService',
    EmbeddingService,
  )

  container.registerSingleton<IVectorStoreService>(
    'IVectorStoreService',
    VectorStoreService,
  )

  container.registerSingleton<IRagService>('IRagService', RagService)
}

export function getService<T>(token: string): T {
  return container.resolve<T>(token)
}
