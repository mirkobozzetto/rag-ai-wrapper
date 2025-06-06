// src/services/TextChunker.ts

export interface Chunk {
  id: string
  content: string
  metadata: {
    index: number
    startChar: number
    endChar: number
    wordCount: number
    source?: string
  }
}

export class TextChunker {
  static chunk(
    text: string,
    chunkSize: number = 500,
    overlap: number = 50,
    source?: string,
  ): Chunk[] {
    const chunks: Chunk[] = []
    const sentences = this.splitIntoSentences(text)

    let currentChunk = ''
    let currentIndex = 0
    let startChar = 0

    for (const sentence of sentences) {
      const proposedChunk = currentChunk + (currentChunk ? ' ' : '') + sentence

      if (proposedChunk.length > chunkSize && currentChunk.length > 0) {
        chunks.push(
          this.createChunk(currentChunk, currentIndex, startChar, source),
        )

        const overlapText = this.getOverlapText(currentChunk, overlap)
        currentChunk = overlapText + (overlapText ? ' ' : '') + sentence
        startChar =
          startChar +
          currentChunk.length -
          overlapText.length -
          sentence.length -
          1
        currentIndex++
      } else {
        currentChunk = proposedChunk
      }
    }

    if (currentChunk.trim()) {
      chunks.push(
        this.createChunk(currentChunk, currentIndex, startChar, source),
      )
    }

    return chunks
  }

  private static splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
  }

  private static getOverlapText(text: string, overlapSize: number): string {
    const words = text.split(' ')
    const overlapWords = Math.min(
      Math.floor(words.length * 0.3),
      overlapSize / 10,
    )
    return words.slice(-overlapWords).join(' ')
  }

  private static createChunk(
    content: string,
    index: number,
    startChar: number,
    source?: string,
  ): Chunk {
    const trimmedContent = content.trim()
    return {
      id: `chunk_${index}_${Date.now()}`,
      content: trimmedContent,
      metadata: {
        index,
        startChar,
        endChar: startChar + trimmedContent.length,
        wordCount: trimmedContent.split(/\s+/).length,
        source,
      },
    }
  }
}
