// src/services/FileProcessor.service.ts

import pdf from 'pdf-parse'
import { IFileProcessorService } from '../interfaces/services.interfaces'
import { PDFInfo, ProcessedDocument } from '../types'

export class FileProcessorService implements IFileProcessorService {
  async processFile(
    buffer: Buffer,
    filename: string,
  ): Promise<ProcessedDocument> {
    const extension = filename.split('.').pop()?.toLowerCase()

    let content: string
    let additionalMetadata: Partial<PDFInfo> = {}

    switch (extension) {
      case 'pdf':
        const pdfData = await pdf(buffer)
        content = pdfData.text
        additionalMetadata = {
          pages: pdfData.numpages,
          title: pdfData.info?.Title || undefined,
          author: pdfData.info?.Author || undefined,
          creator: pdfData.info?.Creator || undefined,
          subject: pdfData.info?.Subject || undefined,
          keywords: pdfData.info?.Keywords || undefined,
        }
        break
      case 'txt':
      case 'md':
        content = buffer.toString('utf-8')
        break
      default:
        throw new Error(`Unsupported file type: ${extension}`)
    }

    return {
      content: content.trim(),
      metadata: {
        filename,
        extension: extension || '',
        size: buffer.length,
        lines: content.split('\n').length,
        words: content.split(/\s+/).filter(word => word.length > 0).length,
        processedAt: new Date().toISOString(),
        ...additionalMetadata,
      },
    }
  }

  isValidFile(filename: string): boolean {
    const validExtensions = ['txt', 'md', 'pdf']
    const extension = filename.split('.').pop()?.toLowerCase()
    return validExtensions.includes(extension || '')
  }
}
