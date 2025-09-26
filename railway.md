# Railway Deployment Configuration

This file configures Railway deployment for the Freepost SaaS backend API and database.

## Services:
- API Server: Hono-based REST API
- PostgreSQL Database: Railway-managed database
- Redis Cache: For rate limiting and caching

## Environment Variables Required:
- DATABASE_URL: Automatically provided by Railway PostgreSQL
- REDIS_URL: Automatically provided by Railway Redis
- All OAuth credentials from .env.example

## Deployment Commands:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add PostgreSQL database
railway add --service postgresql

# Add Redis cache
railway add --service redis

# Deploy
railway up
```