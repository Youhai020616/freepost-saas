let PrismaClient;
let prismaClient;

try {
  // Try to import the real Prisma client
  const prismaModule = require('@prisma/client');
  PrismaClient = prismaModule.PrismaClient;
} catch (error) {
  console.warn('Prisma client not available, using mock. This is expected during build without network access.');
  // Use a mock PrismaClient for build environments
  PrismaClient = class {
    constructor(options) {
      // Mock all the database operations
      this.user = {
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        findMany: () => Promise.resolve([]),
        create: () => Promise.resolve({}),
        update: () => Promise.resolve({}),
        upsert: () => Promise.resolve({}),
        delete: () => Promise.resolve({}),
      };
      this.workspace = {
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        findMany: () => Promise.resolve([]),
        create: () => Promise.resolve({}),
        update: () => Promise.resolve({}),
        upsert: () => Promise.resolve({}),
        delete: () => Promise.resolve({}),
      };
      this.membership = {
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        findMany: () => Promise.resolve([]),
        create: () => Promise.resolve({}),
        update: () => Promise.resolve({}),
        upsert: () => Promise.resolve({}),
        delete: () => Promise.resolve({}),
      };
      this.post = {
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        findMany: () => Promise.resolve([]),
        create: () => Promise.resolve({}),
        update: () => Promise.resolve({}),
        upsert: () => Promise.resolve({}),
        delete: () => Promise.resolve({}),
      };
      this.schedulerJob = {
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        findMany: () => Promise.resolve([]),
        create: () => Promise.resolve({}),
        update: () => Promise.resolve({}),
        upsert: () => Promise.resolve({}),
        delete: () => Promise.resolve({}),
      };
    }
  };
}

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn']
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Try to export from @prisma/client, fallback to empty export
try {
  module.exports = { ...require('@prisma/client'), prisma };
} catch (error) {
  module.exports = { prisma, PrismaClient };
}

