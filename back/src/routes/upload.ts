// src/routes/upload.ts

import { Context, Hono } from 'hono'
import { container } from 'tsyringe'
import { IRagService } from '../interfaces/services.interfaces'

export class Upload {
  private app = new Hono()
  private ragService: IRagService

  constructor() {
    this.ragService = container.resolve<IRagService>('IRagService')
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

      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await this.ragService.processDocument(buffer, file.name)

      return c.json({
        success: true,
        message: 'Document processed and indexed',
        data: result,
      })
    } catch (error) {
      console.error('Upload error:', error)
      return c.json({ error: 'Failed to process document' }, 500)
    }
  }

  getRouter() {
    return this.app
  }
}
