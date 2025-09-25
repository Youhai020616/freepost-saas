# Use Node.js 20 LTS
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files and build script
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml build.sh ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/

# Make build script executable
RUN chmod +x build.sh

# Copy source code
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV DATABASE_PROVIDER=postgresql
ENV SKIP_ENV_VALIDATION=true

# Run the optimized build script
RUN ./build.sh

# Expose port
EXPOSE 3000

# Start the web application
CMD ["pnpm", "--filter", "@freepost/web", "start"]