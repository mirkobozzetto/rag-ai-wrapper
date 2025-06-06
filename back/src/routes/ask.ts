// src/routes/ask.ts

import { Context, Hono } from 'hono'
import { RagService } from '../services/RagService.service'

export class Ask {
  private app = new Hono()
  private ragService: RagService

  constructor() {
    this.ragService = new RagService()
    this.setupRoutes()
  }

  private setupRoutes() {
    this.app.post('/', this.handleQuestion.bind(this))
    this.app.get('/stats', this.getStats.bind(this))
  }

  private async handleQuestion(c: Context) {
    try {
      const body = await c.req.json()
      const { question } = body

      if (!question || typeof question !== 'string') {
        return c.json(
          { error: 'Question is required and must be a string' },
          400,
        )
      }

      const result = await this.ragService.askQuestion(question)

      return c.json({
        success: true,
        question,
        ...result,
      })
    } catch (error) {
      console.error('Ask error:', error)
      return c.json({ error: 'Failed to process question' }, 500)
    }
  }

  private async getStats(c: Context) {
    try {
      const stats = this.ragService.getStats()
      return c.json({ success: true, stats })
    } catch (error) {
      console.error('Stats error:', error)
      return c.json({ error: 'Failed to get stats' }, 500)
    }
  }

  getRouter() {
    return this.app
  }
}
