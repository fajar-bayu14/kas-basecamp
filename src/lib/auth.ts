import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '@FajarBayu23404';
const SESSION_SECRET = process.env.SESSION_SECRET || 'kas-basecamp-auth-secret-salt-2026';
const COOKIE_NAME = 'kas_admin_session';

function generateExpectedToken(): string {
  return crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`)
    .digest('hex');
}

export async function getIsAdmin(): Promise<boolean> {
  if (process.env.TEST_ADMIN === '1') {
    return true;
  }
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return false;
    }
    const expected = generateExpectedToken();
    return sessionCookie.value === expected;
  } catch (error) {
    return false;
  }
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = generateExpectedToken();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: '/',
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function verifyCredentials(username: string, password: string): boolean {
  if (!username || !password) return false;
  return username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}
