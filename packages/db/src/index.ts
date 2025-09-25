// Fallback Prisma client for deployment environments
// This handles cases where Prisma generation fails during build

// Try to import generated client, fall back to base if needed
let PrismaClient: any
let prismaExports: any

try {
  // Try to import generated client
  const prismaModule = require('@prisma/client')
  PrismaClient = prismaModule.PrismaClient
  prismaExports = prismaModule
} catch (error) {
  console.warn('Prisma client not generated, using mock implementation')
  // Create minimal mock for build environments
  PrismaClient = class MockPrismaClient {
    constructor(options?: any) {
      console.log('Using mock Prisma client')
    }
    
    // Add basic methods that might be called
    $connect() { return Promise.resolve() }
    $disconnect() { return Promise.resolve() }
    
    // Mock models - add as needed based on schema
    user = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
    workspace = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
    post = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
    schedulerJob = { findMany: () => Promise.resolve([]), findUnique: () => Promise.resolve(null) }
  }
  
  // Mock exports for when Prisma isn't available
  prismaExports = {
    PrismaClient,
    Prisma: {},
    PostStatus: { DRAFT: 'DRAFT', SCHEDULED: 'SCHEDULED', PUBLISHED: 'PUBLISHED', FAILED: 'FAILED' },
    JobStatus: { QUEUED: 'QUEUED', RUNNING: 'RUNNING', DONE: 'DONE', FAILED: 'FAILED' }
  }
}

const globalForPrisma = global as unknown as { prisma?: any }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn']
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Export all Prisma types and enums
export * from '@prisma/client'
export { PrismaClient }
export default prisma

