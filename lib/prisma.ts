import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Fallback configuration for environments without proper Prisma setup
let prisma: PrismaClient

try {
  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ['warn', 'error'],
  })
} catch (error) {
  console.warn('Prisma client initialization failed, using mock client:', error)
  // Create a mock Prisma client for development environments where Prisma can't be properly initialized
  prisma = {
    user: {
      findUnique: async () => null,
      findMany: async () => [],
      create: async () => null,
      update: async () => null,
      delete: async () => null,
    },
    session: {
      findUnique: async () => null,
      findMany: async () => [],
      create: async () => null,
      update: async () => null,
      delete: async () => null,
    },
    subject: {
      findMany: async () => [],
      upsert: async () => null,
    },
    grade: {
      findMany: async () => [],
      upsert: async () => null,
    },
    question: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => null,
    },
    questionOption: {
      create: async () => null,
    },
    questionCorrectAnswer: {
      create: async () => null,
      deleteMany: async () => null,
    },
    assessment: {
      create: async () => null,
    },
    assessmentAnswer: {
      create: async () => null,
    },
    $disconnect: async () => {},
  } as any
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }