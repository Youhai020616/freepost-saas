import { serve } from '@hono/node-server'
import app from './index'

const port = Number(process.env.PORT || 8787)
console.log(`[api] listening on http://localhost:${port}`)

// Add graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[api] received SIGTERM, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('[api] received SIGINT, shutting down gracefully')  
  process.exit(0)
})

serve({ fetch: app.fetch, port })

