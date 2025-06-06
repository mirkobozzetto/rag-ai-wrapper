// src/services/FileProcessor.ts

export class FileProcessor {
  static processText(
    buffer: Buffer,
    filename: string,
  ): { content: string; metadata: any } {
    const content = buffer.toString('utf-8')
    const extension = filename.split('.').pop()?.toLowerCase()

    return {
      content: content.trim(),
      metadata: {
        filename,
        extension,
        size: buffer.length,
        lines: content.split('\n').length,
        words: content.split(/\s+/).filter(word => word.length > 0).length,
        processedAt: new Date().toISOString(),
      },
    }
  }

  static isValidFile(filename: string): boolean {
    const validExtensions = ['txt', 'md']
    const extension = filename.split('.').pop()?.toLowerCase()
    return validExtensions.includes(extension || '')
  }
}
