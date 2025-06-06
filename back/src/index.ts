import { serve } from '@hono/node-server'
import { config } from 'dotenv'
import { Hono } from 'hono'
import 'reflect-metadata'
import { container } from 'tsyringe'

import { setupContainer } from './container'
import { Ask } from './routes/ask'
import { Chunk } from './routes/chunk'
import { Upload } from './routes/upload'

config()
setupContainer()

const app = new Hono()

app.get('/', c => {
  return c.text('RAG Wrapper API Ready!')
})

app.route('/upload', container.resolve(Upload).getRouter())
app.route('/ask', container.resolve(Ask).getRouter())
app.route('/chunk', container.resolve(Chunk).getRouter())

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000,
  },
  info => {
    console.log(`Server running on http://localhost:${info.port}`)
  },
)
