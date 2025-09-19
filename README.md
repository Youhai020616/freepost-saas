# Freepost (Next.js SaaS)

Next.js 14 (App Router) SaaS 重构版本，迁移自 Laravel/Mixpost：
- RESTful API Routes / Server Actions
- 认证：BetterAuth（预留接入点）
- ORM：Prisma（dev=SQLite、prod=Vercel Postgres）
- 计划任务：Vercel Cron 调用 /api/cron/publish
- 计费：Stripe（开发阶段使用 Mock）

## 本地开发
```bash
cp .env.example .env
# dev 默认使用 SQLite: file:./prisma/dev.db
npm run prisma:migrate -- --name init  # 若已执行过可忽略
npm run dev
```

## 主要 API（初版占位）
- POST /api/workspaces
- GET  /api/workspaces?userId=...
- POST /api/social-accounts
- GET  /api/social-accounts?workspaceId=...
- GET  /api/posts?workspaceId=...
- POST /api/posts
- PATCH/DELETE/GET /api/posts/[id]
- POST /api/posts/[id]/publish
- POST /api/posts/schedule
- POST /api/media/upload (multipart)
- GET  /api/billing/plans
- GET  /api/billing/subscription?workspaceId=...
- POST /api/billing/checkout (mock)

## 数据模型（Prisma）
User, Workspace, Membership, SocialAccount, Post, Media, SchedulerJob, Subscription, Log, Cache。

## 部署到 Vercel（概要）
- 连接 GitHub 仓库并导入到 Vercel
- 设置环境变量：DATABASE_URL、AUTH_SECRET、STRIPE_LIVE 等
- 配置 Vercel Cron -> POST /api/cron/publish 每分钟

详见 .env.example。
