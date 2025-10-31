# Freepost SaaS 项目结构

## 📁 项目概览

Freepost SaaS 是一个基于 **pnpm monorepo** 架构的社交媒体管理平台，采用 Next.js 15 和 TypeScript 构建。

```
freepost-saas/
├── apps/                    # 应用层
│   └── web/                # Next.js 15 主应用
├── packages/               # 共享包
│   ├── db/                # 数据库层（Prisma）
│   └── types/             # 共享类型定义
├── docs/                   # 项目文档
├── scripts/               # 部署和维护脚本
└── 配置文件
```

---

## 🏗️ Monorepo 架构

### 工作区配置

**pnpm-workspace.yaml**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 依赖关系图

```
@freepost/web (Next.js App)
    ├── @freepost/db (Prisma Client)
    └── @freepost/types (TypeScript Types)
```

---

## 📦 Apps 层

### `apps/web/` - Next.js 15 主应用

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 路由
│   │   │   ├── auth/         # 身份验证（BetterAuth）
│   │   │   ├── workspaces/   # 工作区管理
│   │   │   ├── social-accounts/ # 社交账户连接
│   │   │   ├── posts/        # 内容管理
│   │   │   ├── media/        # 文件上传（S3）
│   │   │   ├── billing/      # Stripe 订阅
│   │   │   ├── cron/         # 定时任务
│   │   │   └── oauth/        # OAuth 回调
│   │   ├── dashboard/        # 仪表板页面
│   │   ├── compose/          # 内容创作
│   │   ├── schedule/         # 调度管理
│   │   ├── media/            # 媒体库
│   │   ├── settings/         # 设置页面
│   │   ├── billing/          # 订阅管理
│   │   ├── sign-in/          # 登录页
│   │   ├── sign-up/          # 注册页
│   │   ├── layout.tsx        # 根布局
│   │   └── page.tsx          # 首页
│   ├── components/            # React 组件
│   │   ├── ui/               # Radix UI 组件
│   │   └── dashboard/        # 业务组件
│   └── lib/                   # 工具库
│       ├── auth.ts           # BetterAuth 配置
│       ├── db.ts             # Prisma 客户端
│       ├── api.ts            # API 客户端
│       ├── supabase.ts       # Supabase 客户端
│       ├── twitter.ts        # Twitter API
│       └── utils.ts          # 工具函数
├── public/                    # 静态资源
├── middleware.ts              # Next.js 中间件
├── next.config.ts             # Next.js 配置
├── tailwind.config.js         # Tailwind CSS 配置
└── package.json
```

#### 关键配置

**package.json**
```json
{
  "name": "@freepost/web",
  "dependencies": {
    "@freepost/db": "workspace:*",
    "@freepost/types": "workspace:*",
    "next": "15.5.3",
    "better-auth": "^1.3.11",
    "@tanstack/react-query": "^5.89.0"
  }
}
```

---

## 📚 Packages 层

### `packages/db/` - 数据库层

```
packages/db/
├── prisma/
│   ├── schema.prisma          # Prisma 数据模型
│   ├── migrations/            # 数据库迁移
│   └── init_supabase.sql      # Supabase 初始化脚本
├── src/
│   └── index.ts               # 导出 Prisma 客户端
├── dist/                      # 编译输出
└── package.json
```

#### 核心数据模型

```prisma
// 用户和身份验证
model User {
  id            String        @id @default(cuid())
  email         String        @unique
  emailVerified Boolean       @default(false)
  name          String?
  image         String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  // 关系
  accounts      Account[]
  sessions      Session[]
  memberships   Membership[]
}

// 工作区
model Workspace {
  id          String        @id @default(cuid())
  name        String
  slug        String        @unique
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  // 关系
  memberships Membership[]
  socialAccounts SocialAccount[]
  posts       Post[]
}

// 社交账户
model SocialAccount {
  id           String    @id @default(cuid())
  provider     String    // 'twitter', 'linkedin', etc.
  accountId    String    // 平台账户 ID
  username     String
  accessToken  String    // 加密存储
  refreshToken String?   // 加密存储
  expiresAt    DateTime?
  
  workspaceId  String
  workspace    Workspace @relation(fields: [workspaceId], references: [id])
  posts        Post[]
}

// 帖子
model Post {
  id          String    @id @default(cuid())
  content     String
  mediaUrls   String[]  // S3 URLs
  status      String    // 'draft', 'scheduled', 'published'
  scheduledAt DateTime?
  publishedAt DateTime?
  
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  
  socialAccountId String
  socialAccount   SocialAccount @relation(fields: [socialAccountId], references: [id])
  
  schedulerJobs SchedulerJob[]
}

// 调度任务
model SchedulerJob {
  id          String    @id @default(cuid())
  status      String    // 'pending', 'processing', 'completed', 'failed'
  scheduledAt DateTime
  executedAt  DateTime?
  error       String?
  
  postId      String
  post        Post      @relation(fields: [postId], references: [id])
}
```

#### 数据库配置

**schema.prisma**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Supabase Pooler
  directUrl = env("DIRECT_URL")        // 直连（用于迁移）
}

generator client {
  provider = "prisma-client-js"
}
```

---

### `packages/types/` - 类型定义

```
packages/types/
├── src/
│   └── index.ts               # 共享 TypeScript 类型
├── dist/                      # 编译输出
└── package.json
```

**示例类型定义**
```typescript
// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 工作区类型
export interface WorkspaceWithMembers {
  id: string;
  name: string;
  slug: string;
  members: {
    userId: string;
    role: 'owner' | 'admin' | 'member';
  }[];
}
```

---

## 🔌 API 路由结构

### 身份验证 (`/api/auth/`)

```
/api/auth/
├── [...all]/route.ts          # BetterAuth 自动路由
├── sign-up/route.ts           # 用户注册
└── sign-in/route.ts           # 用户登录
```

### 工作区管理 (`/api/workspaces/`)

```
GET    /api/workspaces         # 获取用户的所有工作区
POST   /api/workspaces         # 创建新工作区
GET    /api/workspaces/[id]    # 获取工作区详情
PATCH  /api/workspaces/[id]    # 更新工作区
DELETE /api/workspaces/[id]    # 删除工作区
```

### 社交账户 (`/api/social-accounts/`)

```
GET    /api/social-accounts    # 获取工作区的社交账户
POST   /api/social-accounts    # 连接新账户
DELETE /api/social-accounts/[id] # 断开账户
```

### 内容管理 (`/api/posts/`)

```
GET    /api/posts              # 获取帖子列表
POST   /api/posts              # 创建帖子
GET    /api/posts/[id]         # 获取帖子详情
PATCH  /api/posts/[id]         # 更新帖子
DELETE /api/posts/[id]         # 删除帖子
POST   /api/posts/[id]/publish # 立即发布
POST   /api/posts/schedule     # 批量调度
```

### 媒体上传 (`/api/media/`)

```
POST   /api/media/upload       # 上传文件到 S3
```

### 订阅管理 (`/api/billing/`)

```
GET    /api/billing/plans      # 获取订阅计划
POST   /api/billing/checkout   # 创建 Stripe 支付会话
GET    /api/billing/subscription # 获取当前订阅
POST   /api/billing/subscription # 更新订阅
```

### 定时任务 (`/api/cron/`)

```
POST   /api/cron/publish       # 发布调度的帖子（Vercel Cron）
```

---

## 🛠️ 脚本和工具

### `scripts/` 目录

```
scripts/
├── backup-db.sh               # 数据库备份
├── deploy.sh                  # 部署脚本
├── health-check.sh            # 健康检查
└── rollback.sh                # 回滚脚本
```

---

## ⚙️ 配置文件

### 根目录配置

```
freepost-saas/
├── package.json               # 根 package.json（workspace 配置）
├── pnpm-workspace.yaml        # pnpm workspace 配置
├── tsconfig.json              # 根 TypeScript 配置
├── vercel.json                # Vercel 部署配置
├── docker-compose.yml         # Docker 编排
├── Dockerfile                 # Docker 镜像
├── railway.toml               # Railway 部署配置
└── .env.example               # 环境变量模板
```

### 环境变量

```env
# 数据库
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# 身份验证
AUTH_SECRET="your-256-bit-secret"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AWS S3
AWS_S3_BUCKET="bucket-name"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."

# 应用
APP_URL="http://localhost:3000"
```

---

## 🚀 技术栈总结

| 层级 | 技术 | 版本 |
|------|------|------|
| **框架** | Next.js | 15.5.3 |
| **UI** | Radix UI + Tailwind CSS | v4 |
| **状态管理** | TanStack Query | 5.89.0 |
| **数据库** | Prisma + PostgreSQL | 6.16.2 |
| **认证** | BetterAuth | 1.3.11 |
| **支付** | Stripe | - |
| **存储** | AWS S3 | - |
| **限流** | Upstash Redis | - |
| **包管理** | pnpm | workspace |

---

## 📖 相关文档

- [CLAUDE.md](../CLAUDE.md) - AI 助手指南
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署文档
- [README.md](../README.md) - 项目说明

