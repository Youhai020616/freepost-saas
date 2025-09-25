import { Hono } from 'hono'
import { cors } from 'hono/cors'

// Minimal Hono API server; we'll wire real routes after extracting services.
const app = new Hono()
app.use('*', cors())

app.get('/health', (c) => c.json({ ok: true }))

export default app

