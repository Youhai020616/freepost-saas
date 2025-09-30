# Freepost SaaS 部署架构设计

## 概述

本文档详细说明 Freepost SaaS 平台的完整部署方案，包括多环境配置、CI/CD 流程、监控告警和灾难恢复策略。

---

## 1. 架构设计

### 1.1 部署架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户层                                │
│  Web Browser / Mobile App / API Clients                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    CDN / Edge Network                        │
│  Vercel Edge Network (Global Distribution)                  │
│  • 静态资源缓存 (Images, CSS, JS)                            │
│  • Edge Functions (A/B Testing, Geolocation)                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   应用层 (Vercel)                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Next.js 15 Application (@freepost/web)             │   │
│  │ • App Router + Server Actions                       │   │
│  │ • API Routes (/api/*)                               │   │
│  │ • Server-Side Rendering (SSR)                       │   │
│  │ • Static Site Generation (SSG)                      │   │
│  └─────────────────────────────────────────────────────┘   │
└────────┬──────────────────┬──────────────────┬──────────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│  数据库层       │  │  认证服务         │  │  存储服务        │
│                │  │                  │  │                 │
│ Supabase       │  │ BetterAuth       │  │ AWS S3          │
│ PostgreSQL     │  │ + Prisma         │  │ + CloudFront    │
│ (Primary)      │  │ Adapter          │  │ (CDN)           │
│                │  │                  │  │                 │
│ • Connection   │  │ • Session Mgmt   │  │ • Media Files   │
│   Pooling      │  │ • OAuth 2.0      │  │ • User Uploads  │
│ • Read         │  │ • Email/Pass     │  │ • Static Assets │
│   Replicas     │  │                  │  │                 │
└────────────────┘  └──────────────────┘  └─────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│              第三方集成服务                                  │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Stripe      │  │ Social APIs  │  │ Upstash Redis    │  │
│  │ Payment     │  │ • Twitter    │  │ Rate Limiting    │  │
│  │ Processing  │  │ • Facebook   │  │ + Caching        │  │
│  └─────────────┘  │ • LinkedIn   │  └──────────────────┘  │
│                   │ • Instagram  │                         │
│                   └──────────────┘                         │
└────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│              监控与日志系统                                  │
│                                                             │
│  • Vercel Analytics (性能监控)                              │
│  • Sentry (错误追踪)                                        │
│  • LogTail / Better Stack (日志聚合)                        │
│  • Uptime Robot (可用性监控)                                │
└────────────────────────────────────────────────────────────┘
```

### 1.2 环境划分

| 环境 | 用途 | 部署分支 | 数据库 | 访问域名 |
|------|------|----------|--------|----------|
| **Development** | 本地开发 | `feature/*` | SQLite (本地) | `localhost:3000` |
| **Preview** | 功能预览/测试 | Pull Requests | Supabase (Dev) | `*.vercel.app` |
| **Staging** | 预生产环境 | `develop` | Supabase (Staging) | `staging.freepost.io` |
| **Production** | 生产环境 | `main` | Supabase (Prod) | `app.freepost.io` |

---

## 2. 环境配置

### 2.1 Development (本地开发)

**数据库配置**：
```env
# .env.local
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"

# 本地认证
AUTH_SECRET="dev-secret-min-32-chars-long"
APP_URL="http://localhost:3000"

# Mock 模式（不调用真实 API）
STRIPE_LIVE=false
```

**启动流程**：
```bash
# 1. 安装依赖
pnpm install

# 2. 生成 Prisma 客户端
cd packages/db && pnpm prisma:generate

# 3. 运行数据库迁移
pnpm prisma:migrate

# 4. 启动开发服务器
pnpm dev
```

### 2.2 Preview (PR 环境)

**触发条件**：每次创建或更新 Pull Request

**配置特点**：
- 自动部署到临时 Vercel URL
- 使用 Supabase Dev 数据库
- 启用真实第三方集成（Twitter OAuth 等）
- 自动清理过期 PR 环境（7天后）

**Vercel 环境变量**：
```bash
# Preview Environment Variables
DATABASE_URL=$SUPABASE_DEV_POOLER_URL
DIRECT_URL=$SUPABASE_DEV_DIRECT_URL
AUTH_SECRET=$PREVIEW_AUTH_SECRET
STRIPE_LIVE=false
APP_URL="https://$VERCEL_URL"
```

### 2.3 Staging (预生产)

**部署分支**：`develop`

**配置要求**：
- 独立的 Supabase Staging 项目
- 真实支付集成（Stripe 测试模式）
- 完整监控和日志记录
- 定期数据库备份

**环境变量**：
```env
# Staging Environment
DATABASE_URL="postgresql://user:pass@staging.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@staging.supabase.co:5432/postgres"

# Stripe 测试密钥
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_test_..."

# AWS S3 Staging Bucket
AWS_S3_BUCKET="freepost-staging"
AWS_REGION="us-east-1"

# 真实 OAuth 凭证（测试应用）
OAUTH_TWITTER_CLIENT_ID="..."
OAUTH_TWITTER_CLIENT_SECRET="..."
```

### 2.4 Production (生产)

**部署分支**：`main`

**安全要求**：
- 强随机 256 位 `AUTH_SECRET`
- 生产级数据库连接池配置
- 启用所有安全功能（CSRF、CORS）
- 定时数据库备份（每日）

**环境变量示例**：
```env
# Production Environment
DATABASE_URL="postgresql://user:pass@prod.supabase.co:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://user:pass@prod.supabase.co:5432/postgres?sslmode=require"

# 生产认证密钥（256位随机生成）
AUTH_SECRET="<openssl rand -base64 32 生成>"
APP_URL="https://app.freepost.io"

# Stripe 生产密钥
STRIPE_LIVE=true
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_live_..."

# AWS S3 生产 Bucket
AWS_S3_BUCKET="freepost-prod"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."

# Upstash Redis（限流 + 缓存）
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# 监控和错误追踪
SENTRY_DSN="https://..."
VERCEL_ANALYTICS_ID="..."
```

---

## 3. CI/CD 流程

### 3.1 GitHub Actions 工作流

**文件位置**：`.github/workflows/deploy.yml`

**工作流程**：
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # 1. 代码质量检查
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Generate Prisma Client
        run: cd packages/db && pnpm prisma:generate
      
      - name: Run linter
        run: pnpm lint
      
      - name: Type check
        run: pnpm -r tsc --noEmit
      
      - name: Run tests
        run: pnpm test
  
  # 2. 数据库迁移检查
  migration-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check migration status
        run: |
          cd packages/db
          pnpm prisma migrate diff --from-schema-datasource schema.prisma --to-schema-datamodel schema.prisma --exit-code
  
  # 3. 部署到 Vercel
  deploy:
    needs: [lint-and-test, migration-check]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}
```

### 3.2 部署触发条件

| 触发事件 | 目标环境 | 自动部署 | 需要审批 |
|---------|---------|---------|---------|
| PR 创建/更新 | Preview | ✅ | ❌ |
| 推送到 `develop` | Staging | ✅ | ❌ |
| 推送到 `main` | Production | ✅ | ✅ (需要 Code Review) |
| 手动触发 | 任意 | ✅ | ✅ |

### 3.3 部署前检查清单

**自动检查**：
- ✅ 代码风格检查（ESLint）
- ✅ 类型检查（TypeScript）
- ✅ 单元测试通过
- ✅ Prisma Schema 验证
- ✅ 依赖安全扫描（npm audit）

**手动确认（生产部署）**：
- ⚠️ 数据库迁移脚本已审核
- ⚠️ 环境变量已更新
- ⚠️ 第三方服务状态正常
- ⚠️ 回滚计划已准备

---

## 4. 数据库部署策略

### 4.1 迁移流程

**开发环境**：
```bash
# 创建迁移（交互式）
cd packages/db
pnpm prisma:migrate

# 查看迁移状态
pnpm prisma migrate status
```

**生产环境（自动化）**：
```bash
# CI/CD 脚本中执行
cd packages/db
pnpm prisma migrate deploy  # 非交互式，仅应用已有迁移
```

### 4.2 迁移安全策略

**破坏性变更处理**：
1. **分阶段迁移**（适用于删除列）：
   ```sql
   -- 第一次部署：标记列为可选
   ALTER TABLE posts ALTER COLUMN old_column DROP NOT NULL;
   
   -- 第二次部署（数周后）：删除列
   ALTER TABLE posts DROP COLUMN old_column;
   ```

2. **数据迁移脚本**（大量数据转换）：
   ```typescript
   // scripts/migrate-data.ts
   import { PrismaClient } from '@freepost/db';
   
   const prisma = new PrismaClient();
   
   async function migrateData() {
     const batchSize = 1000;
     let offset = 0;
     
     while (true) {
       const posts = await prisma.post.findMany({
         where: { migrated: false },
         take: batchSize,
         skip: offset,
       });
       
       if (posts.length === 0) break;
       
       await prisma.$transaction(
         posts.map(post => 
           prisma.post.update({
             where: { id: post.id },
             data: { newField: transformOldField(post.oldField), migrated: true },
           })
         )
       );
       
       offset += batchSize;
       console.log(`Migrated ${offset} records`);
     }
   }
   
   migrateData().catch(console.error).finally(() => prisma.$disconnect());
   ```

3. **回滚计划**：
   ```bash
   # 生成回滚迁移
   cd packages/db
   pnpm prisma migrate diff \
     --from-schema-datamodel schema.prisma \
     --to-schema-datasource schema.prisma \
     --script > rollback.sql
   ```

### 4.3 数据库连接配置

**Supabase 连接池最佳实践**：
```env
# 运行时连接（使用连接池）
DATABASE_URL="postgresql://postgres.xxx:5432/postgres?pgbouncer=true&connection_limit=20"

# 迁移连接（直连数据库）
DIRECT_URL="postgresql://postgres.xxx:5432/postgres"
```

**Prisma 客户端配置**：
```typescript
// packages/db/src/index.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## 5. 监控与告警

### 5.1 性能监控

**Vercel Analytics**：
- 实时用户访问统计
- Core Web Vitals（LCP, FID, CLS）
- 地理分布热力图
- API 路由响应时间

**自定义性能追踪**：
```typescript
// apps/web/src/lib/monitoring.ts
import { Analytics } from '@vercel/analytics/react';

export function trackApiPerformance(endpoint: string, duration: number) {
  Analytics.track('api_performance', {
    endpoint,
    duration,
    timestamp: Date.now(),
  });
}
```

### 5.2 错误追踪（Sentry）

**安装配置**：
```typescript
// apps/web/src/app/layout.tsx
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV || 'development',
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // 过滤敏感信息
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

**错误边界**：
```typescript
// apps/web/src/components/error-boundary.tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function ErrorBoundary({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}
```

### 5.3 告警配置

**Vercel 告警规则**：
- 构建失败 → Slack 通知
- 部署成功 → Slack 通知（仅生产环境）
- 异常错误率 >1% → 邮件 + Slack
- API 响应时间 >1s → PagerDuty

**Uptime Robot 配置**：
```yaml
monitors:
  - name: "Freepost Production"
    url: "https://app.freepost.io/api/health"
    interval: 5  # 每 5 分钟检查一次
    alert_contacts:
      - email: ops@freepost.io
      - slack: "#alerts"
```

---

## 6. 安全最佳实践

### 6.1 环境变量管理

**敏感信息加密**：
```bash
# 使用 Vercel CLI 加密环境变量
vercel env add AUTH_SECRET production < <(openssl rand -base64 32)
vercel env add STRIPE_SECRET_KEY production  # 交互式输入
```

**访问控制**：
- 开发环境变量：所有开发者可读
- 预生产环境变量：团队 Lead + DevOps
- 生产环境变量：仅 DevOps + CTO

### 6.2 数据库安全

**连接加密**：
```env
DATABASE_URL="postgresql://...?sslmode=require"
```

**访问控制（Supabase RLS）**：
```sql
-- 启用行级安全策略
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 只允许访问自己工作区的数据
CREATE POLICY "Users can only access their workspace posts"
  ON posts
  FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM memberships WHERE user_id = auth.uid()
  ));
```

### 6.3 API 限流

**Upstash Rate Limiting**：
```typescript
// apps/web/src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),  // 10 请求/10秒
  analytics: true,
});

// 使用示例
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await rateLimiter.limit(ip);
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
  
  // 处理请求...
}
```

---

## 7. 灾难恢复

### 7.1 数据库备份策略

**自动备份（Supabase）**：
- 每日全量备份（保留 7 天）
- 每周增量备份（保留 30 天）
- 每月归档备份（保留 1 年）

**手动备份**：
```bash
# 导出生产数据库
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# 上传到 S3
aws s3 cp backup-$(date +%Y%m%d).sql s3://freepost-backups/db/
```

### 7.2 回滚流程

**应用回滚**：
```bash
# Vercel CLI 回滚到上一个部署
vercel rollback

# 或指定部署 ID
vercel rollback <deployment-id>
```

**数据库回滚**：
```bash
# 1. 停止应用（防止数据不一致）
vercel env rm DATABASE_URL production

# 2. 恢复数据库
psql $DATABASE_URL < backup-20250130.sql

# 3. 回滚 Prisma 迁移
cd packages/db
pnpm prisma migrate resolve --rolled-back <migration-name>

# 4. 重新启动应用
vercel env add DATABASE_URL production
```

### 7.3 灾难恢复演练

**季度演练计划**：
1. 模拟数据库故障（使用备份恢复）
2. 模拟 Vercel 部署失败（回滚流程）
3. 模拟第三方服务中断（降级模式）
4. 全员演练，记录恢复时间（RTO）

**目标 RTO/RPO**：
- RTO（恢复时间目标）：< 1 小时
- RPO（恢复点目标）：< 5 分钟（数据丢失窗口）

---

## 8. 性能优化

### 8.1 构建优化

**Next.js 配置**：
```typescript
// apps/web/next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  experimental: {
    turbopack: true,  // 使用 Turbopack
    optimizePackageImports: ['@freepost/db', '@freepost/types'],
  },
  
  // 图片优化
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'freepost-prod.s3.amazonaws.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Bundle 分析
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
        },
      };
    }
    return config;
  },
};

export default config;
```

### 8.2 数据库优化

**连接池配置**：
```typescript
// packages/db/src/index.ts
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error', 'warn'],
  // 连接池配置
  pool: {
    timeout: 10,
    max: 20,
  },
});
```

**查询优化示例**：
```typescript
// 使用索引字段查询
const posts = await prisma.post.findMany({
  where: {
    workspaceId: 'xxx',  // 使用 @@index([workspaceId])
    status: 'PUBLISHED',
  },
  select: {  // 只选择需要的字段
    id: true,
    content: true,
    publishedAt: true,
  },
  take: 20,  // 分页限制
});

// 批量操作
await prisma.$transaction([
  prisma.post.update({ where: { id: '1' }, data: { status: 'PUBLISHED' } }),
  prisma.schedulerJob.update({ where: { id: '1' }, data: { status: 'DONE' } }),
]);
```

### 8.3 缓存策略

**Upstash Redis 缓存**：
```typescript
// apps/web/src/lib/cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCachedWorkspace(id: string) {
  const cached = await redis.get(`workspace:${id}`);
  if (cached) return cached;
  
  const workspace = await prisma.workspace.findUnique({ where: { id } });
  await redis.set(`workspace:${id}`, workspace, { ex: 3600 });  // 1小时过期
  return workspace;
}
```

---

## 9. 部署检查清单

### 9.1 预生产部署

- [ ] 代码审查通过（至少 2 名审核者）
- [ ] 所有测试通过（单元测试 + 集成测试）
- [ ] Prisma 迁移已测试（Staging 环境）
- [ ] 环境变量已更新（Vercel Dashboard）
- [ ] 第三方服务配额充足（Stripe, AWS S3）
- [ ] 监控告警规则已配置
- [ ] 性能基准测试通过（Lighthouse Score >90）

### 9.2 生产部署

- [ ] 部署窗口已确认（非高峰时段）
- [ ] 数据库备份已完成（< 1 小时前）
- [ ] 回滚计划已准备
- [ ] 团队成员待命（至少 2 人）
- [ ] 部署通知已发送（Slack #deployments）
- [ ] 健康检查端点正常（/api/health）
- [ ] 关键业务流程验证（注册、登录、支付）
- [ ] 性能监控数据正常（Core Web Vitals）

---

## 10. 常见问题排查

### 10.1 部署失败

**问题**：Build 过程中 Prisma 客户端未生成

**解决方案**：
```json
// apps/web/package.json
{
  "scripts": {
    "postinstall": "cd ../../packages/db && pnpm prisma:generate",
    "build": "next build --turbopack"
  }
}
```

### 10.2 数据库连接超时

**问题**：`P2024: Timed out fetching a new connection from the connection pool`

**解决方案**：
```env
# 增加连接池大小
DATABASE_URL="postgresql://...?connection_limit=30&pool_timeout=20"

# 或使用 Supabase Pooler
DATABASE_URL="postgresql://...?pgbouncer=true"
```

### 10.3 Vercel 函数超时

**问题**：API 路由执行时间超过 10 秒

**解决方案**：
```typescript
// apps/web/src/app/api/long-task/route.ts
export const maxDuration = 60;  // Pro 计划最多 60 秒

export async function POST(req: Request) {
  // 长时间运行的任务
}
```

---

## 11. 附录

### 11.1 有用的命令

```bash
# Vercel CLI
vercel login
vercel env pull .env.local  # 拉取环境变量
vercel logs --follow        # 实时日志
vercel domains ls           # 查看域名

# Prisma
pnpm prisma studio          # 可视化数据库
pnpm prisma db seed         # 种子数据
pnpm prisma format          # 格式化 schema

# 性能分析
pnpm next build && pnpm next analyze  # Bundle 分析
lighthouse https://app.freepost.io    # 性能测试
```

### 11.2 推荐工具

- **Vercel CLI**：部署和日志管理
- **Prisma Studio**：数据库可视化
- **Postman/Insomnia**：API 测试
- **Sentry**：错误追踪
- **LogTail**：日志聚合
- **Uptime Robot**：可用性监控

---

## 12. 联系方式

- **技术负责人**：[您的名字] <your-email@freepost.io>
- **DevOps 团队**：devops@freepost.io
- **紧急联系**：+1-XXX-XXX-XXXX（仅生产故障）