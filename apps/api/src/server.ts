import { serve } from '@hono/node-server'
import app from './index'

const port = Number(process.env.PORT || 8787)
console.log(`[api] listening on http://localhost:${port}`)
serve({ fetch: app.fetch, port })

