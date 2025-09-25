# Deployment Instructions

This document provides step-by-step instructions for deploying the Freepost SaaS application to Vercel (frontend) and Railway (backend).

## Prerequisites

1. **Database**: You'll need a PostgreSQL database. Options:
   - Vercel Postgres (recommended for Vercel deployments)
   - Railway PostgreSQL (recommended for Railway deployments)
   - Any external PostgreSQL provider (Supabase, PlanetScale, etc.)

2. **External Services**:
   - Upstash Redis account (for caching and rate limiting)
   - AWS S3 bucket (for file uploads)
   - Twitter/X Developer account (for social media integration)

## Vercel Deployment (Frontend)

### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the `vercel.json` configuration

### Step 2: Configure Build Settings
Vercel should automatically use the settings from `vercel.json`:
- **Framework**: Next.js
- **Build Command**: `cd apps/web && pnpm install --frozen-lockfile && pnpm --filter @freepost/db prisma:generate && pnpm build`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `pnpm install --frozen-lockfile`

### Step 3: Set Environment Variables
In your Vercel project settings, add these environment variables:

```bash
# Database
DATABASE_URL=your_postgresql_connection_string

# Authentication
BETTER_AUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Social Media APIs
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# Environment
NODE_ENV=production
```

### Step 4: Deploy
1. Click "Deploy"
2. Vercel will build and deploy your application
3. Set up your custom domain if needed

## Railway Deployment (Backend API)

### Step 1: Connect Repository
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect the `railway.toml` configuration

### Step 2: Configure Database
1. In your Railway project, click "New Service"
2. Choose "PostgreSQL"
3. Railway will create a database and provide connection details

### Step 3: Set Environment Variables
In your Railway service settings, add these environment variables:

```bash
# Database (use the Railway PostgreSQL connection string)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Server Configuration
NODE_ENV=production
PORT=3001

# Authentication (use the same secret as Vercel)
BETTER_AUTH_SECRET=your_random_secret_key

# External APIs (same as Vercel)
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
```

### Step 4: Deploy
1. Railway will automatically deploy using the `railway.toml` configuration
2. The build process will:
   - Install dependencies
   - Generate Prisma client
   - Run database migrations
   - Build the API
3. Your API will be available at the Railway-provided URL

## Post-Deployment Configuration

### 1. Run Database Migrations
After deploying to Railway, your database migrations should run automatically. If you need to run them manually:

```bash
# Using Railway CLI
railway run pnpm --filter @freepost/db prisma:migrate:deploy
```

### 2. Test the Deployment
1. Check that your Vercel frontend loads correctly
2. Verify API connectivity between frontend and backend
3. Test authentication flow
4. Test file upload functionality
5. Verify social media integration

### 3. Set up Domain and SSL
1. **Vercel**: Add your custom domain in project settings
2. **Railway**: Configure custom domain for API if needed

## Environment-Specific Notes

### Development
```bash
DATABASE_URL="file:./prisma/dev.db"  # SQLite for local dev
```

### Staging
```bash
DATABASE_URL="postgresql://..."     # Separate staging database
BETTER_AUTH_SECRET="staging_secret"
```

### Production
```bash
DATABASE_URL="postgresql://..."     # Production database
BETTER_AUTH_SECRET="production_secret"
```

## Troubleshooting

### Build Failures
1. **Font loading errors**: The app now uses system fonts to avoid network issues
2. **Prisma generation fails**: Build scripts handle network limitations gracefully
3. **TypeScript errors**: Build ignores linting errors for deployment

### Runtime Issues
1. **Database connection**: Verify `DATABASE_URL` is correct
2. **CORS errors**: Ensure API URL is correctly configured in frontend
3. **Environment variables**: Check all required variables are set

### Monitoring
1. **Vercel**: Use Vercel Analytics and Logs
2. **Railway**: Use Railway Logs and Metrics
3. **Database**: Monitor connection pool usage

## Scaling Considerations

### Performance
1. Enable Vercel Edge Functions for better global performance
2. Configure Railway autoscaling based on CPU/memory usage
3. Use Redis caching aggressively

### Cost Optimization
1. **Vercel**: Monitor function execution time and bandwidth
2. **Railway**: Set resource limits and monitoring alerts
3. **Database**: Optimize queries and use connection pooling

## Security Checklist

- [ ] All environment variables are properly set
- [ ] Database has proper access controls
- [ ] API endpoints have rate limiting (via Upstash Redis)
- [ ] File uploads are scanned and size-limited
- [ ] HTTPS is enforced on all endpoints
- [ ] Authentication secrets are strong and unique

## Maintenance

### Regular Tasks
1. Monitor application logs for errors
2. Update dependencies monthly
3. Review database performance
4. Backup database regularly
5. Monitor uptime and performance metrics

### Deployment Updates
1. Push to main/master branch triggers automatic deployment
2. Use GitHub Actions for CI/CD pipeline
3. Test staging environment before production deployments