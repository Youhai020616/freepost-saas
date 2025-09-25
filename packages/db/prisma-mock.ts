// Mock Prisma client types for development when binaries can't be downloaded
export class PrismaClient {
  constructor(options?: any) {}
  
  // Mock models for the schema
  user = {
    findUnique: (args: any) => Promise.resolve(null),
    findFirst: (args: any) => Promise.resolve(null),
    findMany: (args: any) => Promise.resolve([]),
    create: (args: any) => Promise.resolve({}),
    update: (args: any) => Promise.resolve({}),
    upsert: (args: any) => Promise.resolve({}),
    delete: (args: any) => Promise.resolve({}),
  }
  
  workspace = {
    findUnique: (args: any) => Promise.resolve(null),
    findFirst: (args: any) => Promise.resolve(null),
    findMany: (args: any) => Promise.resolve([]),
    create: (args: any) => Promise.resolve({}),
    update: (args: any) => Promise.resolve({}),
    upsert: (args: any) => Promise.resolve({}),
    delete: (args: any) => Promise.resolve({}),
  }
  
  membership = {
    findUnique: (args: any) => Promise.resolve(null),
    findFirst: (args: any) => Promise.resolve(null),
    findMany: (args: any) => Promise.resolve([]),
    create: (args: any) => Promise.resolve({}),
    update: (args: any) => Promise.resolve({}),
    upsert: (args: any) => Promise.resolve({}),
    delete: (args: any) => Promise.resolve({}),
  }
  
  post = {
    findUnique: (args: any) => Promise.resolve(null),
    findFirst: (args: any) => Promise.resolve(null),
    findMany: (args: any) => Promise.resolve([]),
    create: (args: any) => Promise.resolve({}),
    update: (args: any) => Promise.resolve({}),
    upsert: (args: any) => Promise.resolve({}),
    delete: (args: any) => Promise.resolve({}),
  }
  
  schedulerJob = {
    findUnique: (args: any) => Promise.resolve(null),
    findFirst: (args: any) => Promise.resolve(null),
    findMany: (args: any) => Promise.resolve([]),
    create: (args: any) => Promise.resolve({}),
    update: (args: any) => Promise.resolve({}),
    upsert: (args: any) => Promise.resolve({}),
    delete: (args: any) => Promise.resolve({}),
  }
}

export * from '@prisma/client'