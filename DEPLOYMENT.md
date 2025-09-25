# Production Deployment Guide

## Vercel Deployment

1. **Environment Variables** (Required):
   ```
   DATABASE_PROVIDER=postgresql
   DATABASE_URL=postgresql://[user]:[pass]@[host]/[db]
   AUTH_SECRET=[your-auth-secret-32-chars+]
   ```

2. **Optional Environment Variables**:
   ```
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   ```

3. **Deployment Steps**:
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy will automatically use `vercel.json` configuration
   - Vercel Cron will handle `/api/cron/publish` endpoint

## Railway Deployment

1. **Environment Variables** (Required):
   ```
   DATABASE_PROVIDER=postgresql
   DATABASE_URL=postgresql://[user]:[pass]@[host]/[db]
   AUTH_SECRET=[your-auth-secret-32-chars+]
   PORT=3000
   ```

2. **Deployment Steps**:
   - Connect GitHub repository to Railway
   - Add PostgreSQL database service
   - Set environment variables
   - Deploy will automatically use `Dockerfile` and `railway.json`

## Database Migration

For production deployment, run database migrations:

```bash
# For Vercel (using Vercel CLI)
vercel env pull .env.production
DATABASE_URL="your-production-db-url" pnpm --filter @freepost/db prisma:migrate:deploy

# For Railway (using Railway CLI)
railway run pnpm --filter @freepost/db prisma:migrate:deploy
```

## Health Check Endpoints

- **Application**: `GET /api/health` (TODO: create)
- **Database**: `GET /api/health/db` (TODO: create)
- **Cron Jobs**: `GET /api/health/cron` (TODO: create)

## Troubleshooting

### Build Issues
- If Prisma client generation fails, the build uses fallback mock client
- Real database operations require successful Prisma generation in production
- Check network connectivity for Prisma binary downloads

### Runtime Issues  
- Verify all environment variables are set
- Check database connectivity
- Monitor Vercel/Railway logs for errors

### Performance
- Static pages are pre-rendered at build time
- API routes are server-rendered on demand
- Database queries use connection pooling (built into @vercel/postgres)