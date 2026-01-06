import crypto from 'crypto';
import { cookies } from 'next/headers';
import { User, Role, Session } from '@/models/sequelize';
import { SessionDTO } from '@/models/Session';
import { Op } from 'sequelize';

const SESSION_COOKIE_NAME = 'session-id';
const SESSION_MAX_AGE_DAYS = 30;
const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE_DAYS * 24 * 60 * 60;

export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function createSession(userId?: number): Promise<SessionDTO> {
  const sessionId = generateSessionId();

  const newSession = await Session.create({
    sessionId,
    userId,
    createdAt: new Date(),
    lastSeenAt: new Date(),
  });

  await setSessionCookie(sessionId);

  return newSession;
}

export async function setSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
  });
}

export async function getSessionCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  return cookie?.value || null;
}

export async function hasSession(): Promise<boolean> {
  const sessionId = await getSessionCookie();
  if (!sessionId) return false;
  return true;
}

export async function getCurrentSession(): Promise<Session | null> {
  const sessionId = await getSessionCookie();
  if (!sessionId) return null;
  const session = await Session.findOne({
    where: { sessionId },
    include: [{ model: User, as: 'user', include: [{ model: Role, as: 'role' }] }],
  });
  return session;
}

export async function getSessionBySessionId(sessionId: string): Promise<Session | null> {
  const session = await Session.findOne({
    where: { sessionId },
    include: [{ model: User, as: 'user', include: [{ model: Role, as: 'role' }] }],
  });
  return session;
}

export async function updateSessionUser(sessionId: string, userId: number): Promise<void> {
  await Session.update({ userId }, { where: { sessionId } });
}

export async function endSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
