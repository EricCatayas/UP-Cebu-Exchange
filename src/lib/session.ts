import crypto from 'crypto';
import { cookies } from 'next/headers';
import { User, Role, Session } from '@/models/sequelize';
import { JWTPayload } from '@/types/auth';
import { Op } from 'sequelize';

const SESSION_COOKIE_NAME = 'session-id';
const SESSION_MAX_AGE_DAYS = 30;
const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE_DAYS * 24 * 60 * 60;

/**
 * Generate a cryptographically secure session ID
 */
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a new session in the database
 */
export async function createSession(userId: number, rememberMe: boolean = false): Promise<string> {
  const sessionId = generateSessionId();

  await Session.create({
    sessionId,
    userId,
    createdAt: new Date(),
    lastSeenAt: new Date(),
  });

  await setSessionCookie(sessionId, rememberMe);

  return sessionId;
}

/**
 * Get session from database and return user data
 */
export async function getSession(sessionId: string): Promise<JWTPayload | null> {
  const session = await Session.findOne({
    where: { sessionId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'fullName', 'phoneNumber', 'roleId', 'status'],
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
  });

  console.log('getSession - Session:', session);

  if (!session || !session.userId) {
    return null;
  }

  const user = (session as any).user;

  if (!user || user.status !== 'Active') {
    return null;
  }

  // Update lastSeenAt
  await session.update({ lastSeenAt: new Date() });

  return {
    userId: user.id,
    email: user.email,
    roleId: user.roleId,
    roleName: user.role.name,
  };
}

/**
 * Get current session from cookie
 */
export async function getCurrentSession(): Promise<JWTPayload | null> {
  const sessionId = await getSessionCookie();
  if (!sessionId) return null;

  return getSession(sessionId);
}

/**
 * Destroy a session
 */
export async function destroySession(sessionId: string): Promise<void> {
  // await Session.destroy({ where: { sessionId } });
  await removeSessionCookie();
}

/**
 * Set session cookie
 */
export async function setSessionCookie(sessionId: string, rememberMe: boolean = false): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: rememberMe ? SESSION_MAX_AGE_SECONDS : undefined,
    path: '/',
  });
}

/**
 * Get session cookie
 */
export async function getSessionCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  return cookie?.value || null;
}

/**
 * Remove session cookie
 */
export async function removeSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
