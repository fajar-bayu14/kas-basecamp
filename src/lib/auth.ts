import { cookies, headers } from 'next/headers';
import crypto from 'crypto';

function cleanEnv(val: string | undefined, fallback: string): string {
  if (!val) return fallback;
  const cleaned = val.trim().replace(/^["']|["']$/g, '');
  return cleaned || fallback;
}

function getAdminUsername(): string {
  return cleanEnv(process.env.ADMIN_USERNAME, 'admin');
}

function getAdminPassword(): string {
  return cleanEnv(process.env.ADMIN_PASSWORD, '@FajarBayu23404');
}

function getSessionSecret(): string {
  return cleanEnv(process.env.SESSION_SECRET, 'kas-basecamp-auth-secret-salt-2026');
}

const COOKIE_NAME = 'kas_admin_session';

function generateExpectedToken(): string {
  const secret = getSessionSecret();
  const user = getAdminUsername();
  const pass = getAdminPassword();
  return crypto
    .createHmac('sha256', secret)
    .update(`${user}:${pass}`)
    .digest('hex');
}

async function isSecureRequest(): Promise<boolean> {
  // If explicitly configured via env, respect it
  if (process.env.COOKIE_SECURE === 'true') return true;
  if (process.env.COOKIE_SECURE === 'false') return false;

  // Otherwise, auto-detect if the incoming connection is HTTPS
  try {
    const headerList = await headers();
    const proto = headerList.get('x-forwarded-proto');
    if (proto === 'https') return true;
    const referer = headerList.get('referer');
    if (referer && referer.startsWith('https://')) return true;
  } catch {
    // If headers() is unavailable, default to false so plain HTTP/Docker works
  }
  return false;
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
  const secure = await isSecureRequest();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: secure,
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
  const adminUser = getAdminUsername();
  const adminPass = getAdminPassword();

  return (
    username.trim().toLowerCase() === adminUser.toLowerCase() &&
    password.trim() === adminPass
  );
}
