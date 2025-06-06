// src/index.ts

import { serve } from '@hono/node-server'
import { config } from 'dotenv'
import { Hono } from 'hono'
import { Ask } from './routes/ask'
import { Chunk } from './routes/chunk'
import { Upload } from './routes/upload'

config()

const app = new Hono()

app.get('/', c => {
  return c.text('RAG Wrapper API Ready!')
})

app.route('/upload', new Upload().getRouter())
app.route('/chunk', new Chunk().getRouter())
app.route('/ask', new Ask().getRouter())

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000,
  },
  info => {
    console.log(`Server running on http://localhost:${info.port}`)
  },
)
