import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

export async function getSession(request: Request): Promise<Session | null> {
  try {
    // Extraire le cookie de session depuis les headers
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;

    const sessionCookie = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('session='));
    
    if (!sessionCookie) return null;

    const sessionId = sessionCookie.split('=')[1];
    if (!sessionId) return null;

    // Vérifier la session en base de données
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      // Session expirée ou inexistante
      if (session) {
        await prisma.session.delete({ where: { id: sessionId } });
      }
      return null;
    }

    return {
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    return null;
  }
}

export async function createSession(userId: string): Promise<string> {
  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 jours
    },
  });

  return session.id;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await prisma.session.delete({
    where: { id: sessionId },
  });
}