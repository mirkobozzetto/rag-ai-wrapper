// src/services/FileProcessor.service.ts

import { IFileProcessorService } from '../interfaces/services.interfaces'
import { ProcessedDocument } from '../types'

export class FileProcessorService implements IFileProcessorService {
  async processFile(
    buffer: Buffer,
    filename: string,
  ): Promise<ProcessedDocument> {
    const content = buffer.toString('utf-8')
    const extension = filename.split('.').pop()?.toLowerCase()

    return {
      content: content.trim(),
      metadata: {
        filename,
        extension: extension || '',
        size: buffer.length,
        lines: content.split('\n').length,
        words: content.split(/\s+/).filter(word => word.length > 0).length,
        processedAt: new Date().toISOString(),
      },
    }
  }

  isValidFile(filename: string): boolean {
    const validExtensions = ['txt', 'md']
    const extension = filename.split('.').pop()?.toLowerCase()
    return validExtensions.includes(extension || '')
  }
}
