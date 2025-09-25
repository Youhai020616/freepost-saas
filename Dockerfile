# Use Node.js official image
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build all packages
RUN pnpm build --filter=@freepost/api...

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/db/package.json ./packages/db/
COPY --from=builder /app/packages/types/package.json ./packages/types/

EXPOSE 3001

CMD ["node", "apps/api/dist/server.js"]