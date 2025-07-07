import { createFallbackPrisma } from './fallback-prisma'

let prisma: any

// Check if we should use fallback Prisma client
const shouldUseFallback = process.env.USE_FALLBACK_PRISMA === 'true' ||
  (process.env.NODE_ENV === 'development' && 
  (process.env.STACKBLITZ || process.env.WEBCONTAINER || !process.env.DATABASE_URL))

if (shouldUseFallback) {
  console.log('Using fallback Prisma client for containerized environment')
  prisma = createFallbackPrisma()
} else {
  try {
    const { PrismaClient } = require('@prisma/client')
    
    const globalForPrisma = globalThis as unknown as {
      prisma: any | undefined
    }

    prisma = globalForPrisma.prisma ?? new PrismaClient({
      log: ['warn', 'error'],
    })

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma
    }
  } catch (error) {
    console.warn('Prisma client initialization failed, using fallback client:', error)
    prisma = createFallbackPrisma()
  }
}

export { prisma }