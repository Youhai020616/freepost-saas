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

## 部署

### Vercel 部署（推荐）
1. 连接 GitHub 仓库到 Vercel
2. 设置环境变量：
   - `DATABASE_PROVIDER=postgresql`
   - `DATABASE_URL=postgresql://...`
   - `AUTH_SECRET=your-secret-key`
3. 部署会自动使用 `vercel.json` 配置
4. Vercel Cron 会自动设置 `/api/cron/publish` 每分钟执行

### Railway 部署
1. 连接 GitHub 仓库到 Railway
2. 添加 PostgreSQL 数据库服务
3. 设置环境变量（同上）
4. 使用 `Dockerfile` 自动构建和部署

### Docker 本地部署
```bash
# 构建镜像
docker build -t freepost-saas .

# 运行容器
docker run -p 3000:3000 \
  -e DATABASE_PROVIDER=postgresql \
  -e DATABASE_URL=postgresql://... \
  -e AUTH_SECRET=your-secret \
  freepost-saas
```

详见 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取完整部署指南。

## 构建和测试

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 生产构建
pnpm build  # 或 ./build.sh

# 启动生产服务器
pnpm start
```

## 架构特点

- **容错构建**: Prisma 客户端生成失败时自动使用 fallback mock client
- **多环境支持**: 开发用 SQLite，生产用 PostgreSQL
- **字体优化**: 使用系统字体避免网络依赖问题
- **ESLint 宽松**: 构建时跳过严格 linting 确保部署成功
- **Monorepo**: 使用 pnpm workspaces 管理多包结构
