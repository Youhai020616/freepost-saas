# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Freepost SaaS 是一个现代化的社交媒体管理平台，采用 pnpm monorepo 架构，基于 Next.js 15 和 TypeScript 构建。

**核心功能**：
- 多工作区管理
- 跨平台内容调度
- 分析仪表板
- Stripe 订阅集成
- BetterAuth 身份验证

## 架构设计

### Monorepo 结构

```
freepost-saas/
├── apps/
│   ├── web/              # Next.js 15 主应用
│   └── api/              # 独立 API 服务（可选）
└── packages/
    ├── db/               # Prisma ORM + 数据库架构
    └── types/            # 共享 TypeScript 类型定义
```

**工作区依赖**：
- `@freepost/web` 依赖 `@freepost/db` 和 `@freepost/types`
- `@freepost/db` 是数据库层的唯一来源
- 所有应用共享相同的 Prisma 客户端实例

### 数据库架构关键点

**核心模型关系**：
- `User` ← 1:N → `Workspace`（通过 Membership）
- `Workspace` ← 1:N → `SocialAccount`（社交媒体连接）
- `Workspace` ← 1:N → `Post`（内容管理）
- `Post` ← 1:N → `SchedulerJob`（调度系统）

**重要设计决策**：
- 开发环境使用 SQLite，生产环境使用 PostgreSQL
- BetterAuth 需要 `Session`、`Account`、`Verification` 表
- 敏感数据（accessToken、refreshToken）在应用层加密
- `directUrl` 字段用于 Prisma 迁移（避免连接池限制）

### 身份验证架构

**BetterAuth 集成**（`apps/web/src/lib/auth.ts`）：
- 使用 Prisma Adapter 连接 PostgreSQL
- 启用 email/password 认证
- 开发环境暂时禁用邮箱验证
- 通过 `nextCookies()` 插件处理 Server Actions/Route Handlers 的 cookies

**关键配置**：
- `AUTH_SECRET`：生产环境必须设置（256位）
- Provider：`postgresql`（匹配 Supabase 连接池）
- Adapter：`prismaAdapter` 使用共享 Prisma 实例

## 常用命令

### 开发流程

```bash
# 安装依赖
pnpm install

# 启动开发服务器（web + api 并行运行）
pnpm dev

# 仅启动 web 应用
cd apps/web && pnpm dev

# 构建所有应用
pnpm build

# 代码检查
pnpm lint
```

### 数据库操作

```bash
# 生成 Prisma 客户端（修改 schema 后必须执行）
cd packages/db && pnpm prisma:generate

# 开发环境迁移（会提示输入迁移名称）
cd packages/db && pnpm prisma:migrate

# 生产环境迁移（无交互，CI/CD 使用）
cd packages/db && pnpm prisma:migrate:deploy

# 打开 Prisma Studio 可视化数据库
cd packages/db && pnpm prisma:studio
```

### 测试单个功能

```bash
# 测试特定 API 路由
curl http://localhost:3000/api/workspaces

# 测试特定页面
open http://localhost:3000/dashboard

# 使用 Next.js 快速刷新（修改代码后自动重载）
# Turbopack 已启用，无需额外配置
```

## 环境变量配置

### 必需变量

```env
# 数据库配置
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host:5432/db"

# 身份验证
AUTH_SECRET="your-256-bit-secret-key"

# Stripe 支付
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AWS S3 存储
AWS_S3_BUCKET="your-bucket-name"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"

# 应用配置
APP_URL="http://localhost:3000"
```

### 数据库 URL 说明

- `DATABASE_URL`：运行时使用（Supabase Pooler，支持无服务器）
- `DIRECT_URL`：迁移时使用（直连数据库，避免连接池问题）

## API 路由规范

### 路由结构

```
apps/web/src/app/api/
├── auth/              # BetterAuth 自动生成的路由
├── workspaces/        # 工作区管理
├── social-accounts/   # 社交媒体账户
├── posts/             # 内容管理
├── media/             # 文件上传
├── billing/           # 订阅和支付
└── cron/              # 定时任务（Vercel Cron）
```

### 关键端点

- `POST /api/auth/sign-up`：用户注册
- `POST /api/auth/sign-in/email`：邮箱登录
- `POST /api/workspaces`：创建工作区
- `POST /api/posts`：创建帖子
- `POST /api/posts/[id]/publish`：立即发布
- `POST /api/media/upload`：上传媒体文件
- `POST /api/billing/checkout`：创建支付会话

## 开发注意事项

### Prisma Schema 修改流程

1. 修改 `packages/db/prisma/schema.prisma`
2. 运行 `pnpm prisma:generate` 生成客户端
3. 运行 `pnpm prisma:migrate` 创建迁移
4. 验证类型定义已更新
5. 重启开发服务器

### 类型安全最佳实践

- 所有 API 响应使用 Zod 验证
- Prisma 类型自动导出到 `@freepost/db`
- 共享类型定义放在 `@freepost/types`
- 使用 TypeScript 严格模式（`strict: true`）

### Server Actions vs API Routes

- **Server Actions**：适合简单的表单提交和数据变更
- **API Routes**：适合复杂逻辑、外部调用、Webhook

### 错误处理模式

```typescript
// API Routes
return NextResponse.json({ error: 'Message' }, { status: 400 });

// Server Actions
return { success: false, error: 'Message' };
```

## 部署检查清单

### Vercel 部署

1. 确保 `vercel.json` 配置正确
2. 在 Vercel 控制台设置所有环境变量
3. 运行生产迁移：`pnpm db:migrate:deploy`
4. 配置 Cron Jobs：`POST /api/cron/publish`（每分钟）
5. 验证数据库连接（使用 Supabase Pooler URL）

### 性能优化

- Next.js Image Optimization 已启用
- Turbopack 用于更快的构建
- 数据库查询使用索引（见 schema `@@index`）
- 媒体文件通过 S3 CDN 分发

### 安全检查

- 生产环境必须设置强随机的 `AUTH_SECRET`
- Stripe Webhook 必须验证签名
- 敏感 token 在应用层加密存储
- CORS 配置限制允许的来源

## 故障排查

### 常见问题

**构建失败**：
- 检查 `pnpm install --frozen-lockfile` 是否成功
- 确认 Prisma 客户端已生成

**数据库连接错误**：
- 验证 `DATABASE_URL` 格式（Supabase 需要 `?pgbouncer=true`）
- 确认 `DIRECT_URL` 用于迁移

**OAuth 回调失败**：
- 检查社交媒体应用的回调 URL：`{APP_URL}/oauth-success`

**类型错误**：
- 运行 `pnpm db:generate` 重新生成 Prisma 客户端
- 重启 TypeScript 服务器

### 日志查看

```bash
# Vercel 部署日志
vercel logs

# 本地开发日志
# Next.js 自动输出到控制台
```

## 技术栈总结

- **框架**：Next.js 15.5.3（App Router + Server Actions）
- **UI**：Radix UI + Tailwind CSS v4 + Framer Motion
- **状态管理**：TanStack Query（@tanstack/react-query）
- **数据库**：Prisma 6.16.2 + PostgreSQL（Supabase）
- **认证**：BetterAuth 1.3.11
- **支付**：Stripe
- **存储**：AWS S3
- **限流**：Upstash Redis + Ratelimit
- **包管理器**：pnpm（workspace 模式）