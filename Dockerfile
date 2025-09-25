# Railway Dockerfile for Node.js monorepo
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/db/package.json packages/db/
COPY packages/types/package.json packages/types/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/ packages/
COPY apps/ apps/

# Build packages in the correct order
RUN pnpm --filter @freepost/db build
RUN pnpm --filter @freepost/types build
RUN pnpm --filter @freepost/api build
RUN pnpm --filter @freepost/web build

# Expose port (Railway will set PORT automatically)
EXPOSE 3000

# Start the web app
CMD ["pnpm", "--filter", "@freepost/web", "start"]