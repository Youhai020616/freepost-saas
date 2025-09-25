import { Hono } from 'hono'
import { cors } from 'hono/cors'

// Minimal Hono API server; we'll wire real routes after extracting services.
const app = new Hono()
app.use('*', cors())

import { posts } from './routes/posts'
import { workspaces } from './routes/workspaces'

app.route('/', posts)
app.route('/', workspaces)
import { oauth } from './routes/oauth'
app.route('/', oauth)


app.get('/health', (c) => c.json({ ok: true }))

export default app

