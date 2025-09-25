#!/bin/bash
set -e

echo "🚂 Deploying to Railway..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Generate Prisma client
echo "🔄 Generating Prisma client..."
pnpm --filter @freepost/db prisma:generate

# Run database migrations
echo "🗄️ Running database migrations..."
pnpm --filter @freepost/db prisma:migrate:deploy

# Build the project
echo "🔨 Building project..."
pnpm build --filter @freepost/api

echo "✅ Deployment complete!"