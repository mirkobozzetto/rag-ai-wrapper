// src/routes/upload.ts

import { Context, Hono } from 'hono'
import { FileProcessor } from '../services/FileProcessor'

export class Upload {
  private app = new Hono()

  constructor() {
    this.setupRoutes()
  }

  private setupRoutes() {
    this.app.post('/', this.handleUpload.bind(this))
  }

  private async handleUpload(c: Context) {
    try {
      const body = await c.req.parseBody()
      const file = body.file as File

      if (!file) {
        return c.json({ error: 'No file provided' }, 400)
      }

      if (!FileProcessor.isValidFile(file.name)) {
        return c.json(
          { error: 'Invalid file type. Only .txt and .md files are allowed' },
          400,
        )
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      const result = FileProcessor.processText(buffer, file.name)

      return c.json({
        success: true,
        data: result,
      })
    } catch (error) {
      console.error('Upload error:', error)
      return c.json({ error: 'Failed to process file' }, 500)
    }
  }

  getRouter() {
    return this.app
  }
}
