// src/services/FileProcessor.service.ts

import { injectable } from 'tsyringe'
import { IFileProcessorService } from '../interfaces/services.interfaces'
import { PDFInfo, ProcessedDocument } from '../types'

@injectable()
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
        try {
          const pdfParse = await import('pdf-parse')
          const pdf = pdfParse.default || pdfParse
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
        } catch (error) {
          console.error('PDF parsing error:', error)
          throw new Error(
            `Failed to parse PDF: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
          )
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
