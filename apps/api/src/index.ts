import { Hono } from 'hono'
import { cors } from 'hono/cors'

// Minimal Hono API server; we'll wire real routes after extracting services.
const app = new Hono()
app.use('*', cors())

// Root endpoint - API information
app.get('/', (c) => {
  const acceptsHtml = c.req.header('Accept')?.includes('text/html')
  
  if (acceptsHtml) {
    return c.html(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Freepost API</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
            width: 100%;
            padding: 40px;
          }
          h1 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 2.5em;
          }
          .version {
            color: #999;
            font-size: 0.9em;
            margin-bottom: 30px;
          }
          .status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 500;
            margin-bottom: 30px;
          }
          .status::before {
            content: '';
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          h2 {
            color: #667eea;
            margin: 30px 0 15px 0;
            font-size: 1.3em;
          }
          .endpoints {
            background: #f8fafc;
            border-radius: 10px;
            padding: 20px;
          }
          .endpoint {
            margin: 10px 0;
            padding: 12px;
            background: white;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          .endpoint-name {
            font-weight: 600;
            color: #667eea;
            margin-bottom: 5px;
          }
          .endpoint-path {
            font-family: 'Monaco', 'Courier New', monospace;
            color: #666;
            font-size: 0.9em;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #999;
          }
          a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Freepost API</h1>
          <div class="version">v0.1.0</div>
          <div class="status">服务运行中</div>
          
          <h2>📡 可用端点</h2>
          <div class="endpoints">
            <div class="endpoint">
              <div class="endpoint-name">健康检查</div>
              <div class="endpoint-path">GET /health</div>
            </div>
            <div class="endpoint">
              <div class="endpoint-name">工作区管理</div>
              <div class="endpoint-path">GET /w/:slug/workspaces</div>
            </div>
            <div class="endpoint">
              <div class="endpoint-name">内容管理</div>
              <div class="endpoint-path">GET /w/:slug/posts</div>
            </div>
            <div class="endpoint">
              <div class="endpoint-name">OAuth 认证</div>
              <div class="endpoint-path">GET /w/:slug/oauth/:provider/start</div>
            </div>
          </div>
          
          <div class="footer">
            <p>📖 <a href="https://github.com/Youhai020616/freepost-saas" target="_blank">查看文档</a></p>
            <p style="margin-top: 10px; font-size: 0.9em;">Powered by Hono ⚡</p>
          </div>
        </div>
      </body>
      </html>
    `)
  }
  
  return c.json({
    name: 'Freepost API',
    version: '0.1.0',
    status: 'running',
    endpoints: {
      health: '/health',
      workspaces: '/w/:slug/workspaces',
      posts: '/w/:slug/posts',
      oauth: '/w/:slug/oauth/:provider/start'
    },
    docs: 'https://github.com/Youhai020616/freepost-saas'
  })
})

// Health check endpoint
app.get('/health', (c) => c.json({ ok: true, timestamp: new Date().toISOString() }))

import { posts } from './routes/posts'
import { workspaces } from './routes/workspaces'
import { oauth } from './routes/oauth'

app.route('/', posts)
app.route('/', workspaces)
app.route('/', oauth)

export default app

