# Freepost SaaS

A social media scheduling SaaS application built with Next.js 15, featuring a modern monorepo architecture.

## Architecture

This project uses a monorepo structure with:
- **Frontend**: Next.js 15 app (`apps/web`) - deployed to Vercel
- **Backend API**: Hono API (`apps/api`) - deployed to Railway
- **Database**: Prisma ORM (`packages/db`) - PostgreSQL on Vercel/Railway
- **Types**: Shared TypeScript types (`packages/types`)

### Tech Stack
- **Frontend**: Next.js 15, React 19, TailwindCSS, Better Auth
- **Backend**: Hono, Node.js, TypeScript
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: Better Auth
- **File Storage**: AWS S3
- **Caching**: Upstash Redis
- **Payments**: Stripe (planned)

## Local Development

1. **Install dependencies**:
```bash
pnpm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Generate Prisma client and run migrations**:
```bash
pnpm --filter @freepost/db prisma:generate
pnpm --filter @freepost/db prisma:migrate:dev
```

4. **Start development servers**:
```bash
pnpm dev
# This runs both web (port 3000) and api (port 3001) in parallel
```

## Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set the build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build --filter=@freepost/web`
   - **Output Directory**: `apps/web/.next`
   - **Install Command**: `pnpm install --frozen-lockfile`

3. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - See `.env.example` for complete list

### Railway (Backend API)
1. Connect your GitHub repository to Railway
2. Railway will automatically detect the `railway.toml` configuration
3. Set environment variables in Railway dashboard:
   - `DATABASE_URL`
   - `NODE_ENV=production`
   - `PORT=3001`
   - Other environment variables as needed

### Alternative: Docker Deployment
You can also deploy the API using the included `Dockerfile`:

```bash
docker build -t freepost-api .
docker run -p 3001:3001 --env-file .env freepost-api
```

## Build Commands

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build --filter @freepost/web
pnpm build --filter @freepost/api

# Development
pnpm dev

# Database operations
pnpm --filter @freepost/db prisma:generate
pnpm --filter @freepost/db prisma:migrate:dev
pnpm --filter @freepost/db prisma:studio
```

## API Routes (Current Implementation)

- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces?userId=...` - List user workspaces
- `POST /api/social-accounts` - Connect social account
- `GET /api/social-accounts?workspaceId=...` - List connected accounts
- `GET /api/posts?workspaceId=...` - List posts
- `POST /api/posts` - Create post
- `PATCH/DELETE/GET /api/posts/[id]` - Manage posts
- `POST /api/posts/[id]/publish` - Publish post
- `POST /api/posts/schedule` - Schedule post
- `POST /api/media/upload` - Upload media files
- `GET /api/billing/plans` - List billing plans
- `POST /api/billing/checkout` - Create checkout session
- `POST /api/cron/publish` - Cron job for scheduled posts

## Data Models

- **User**: User accounts and profiles
- **Workspace**: Team workspaces/organizations
- **Membership**: User-workspace relationships
- **SocialAccount**: Connected social media accounts
- **Post**: Social media posts and scheduling
- **Media**: File uploads and media management
- **SchedulerJob**: Background job queue
- **Subscription**: Billing and subscription management
- **Log**: System logs and audit trails
- **Cache**: Application caching

## Environment Variables

See `.env.example` for a complete list of required environment variables for both development and production environments.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and commit: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.
