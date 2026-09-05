'use server';

import { verifyCredentials, setAdminSession, clearAdminSession, getIsAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {}
}

export async function loginAdminAction(formData: { username?: string; password?: string }) {
  const username = formData.username || '';
  const password = formData.password || '';

  if (!username.trim() || !password.trim()) {
    return { success: false, error: 'Username dan password wajib diisi.' };
  }

  const isValid = verifyCredentials(username, password);
  if (!isValid) {
    return { success: false, error: 'Username atau password tidak sesuai.' };
  }

  await setAdminSession();
  safeRevalidatePath('/');
  safeRevalidatePath('/anggota');

  return { success: true };
}

export async function logoutAdminAction() {
  await clearAdminSession();
  safeRevalidatePath('/');
  safeRevalidatePath('/anggota');
  return { success: true };
}

export async function getAdminStatusAction() {
  return await getIsAdmin();
}
