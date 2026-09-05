'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const memberSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama anggota minimal 2 karakter')
    .max(100, 'Nama anggota maksimal 100 karakter')
    .trim(),
  phone: z.string().max(30).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export async function getMembers(activeOnly = false) {
  try {
    return await prisma.member.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });
  } catch (error) {
    console.error('Failed to fetch members:', error);
    return [];
  }
}

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {}
}

export async function createMember(data: {
  name: string;
  phone?: string;
  notes?: string;
}) {
  try {
    const validated = memberSchema.parse(data);

    const member = await prisma.member.create({
      data: {
        name: validated.name,
        phone: validated.phone || null,
        notes: validated.notes || null,
        isActive: true,
      },
    });

    safeRevalidatePath('/anggota');
    safeRevalidatePath('/');
    return { success: true, member };
  } catch (error: any) {
    console.error('Error creating member:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Gagal menambahkan anggota. Coba lagi.' };
  }
}

export async function updateMember(
  id: number,
  data: {
    name: string;
    phone?: string;
    notes?: string;
    isActive?: boolean;
  }
) {
  try {
    const validated = memberSchema.parse({
      name: data.name,
      phone: data.phone,
      notes: data.notes,
    });

    const member = await prisma.member.update({
      where: { id },
      data: {
        name: validated.name,
        phone: validated.phone || null,
        notes: validated.notes || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    safeRevalidatePath('/anggota');
    safeRevalidatePath('/');
    return { success: true, member };
  } catch (error: any) {
    console.error('Error updating member:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Gagal memperbarui anggota.' };
  }
}

export async function toggleMemberStatus(id: number) {
  try {
    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) return { success: false, error: 'Anggota tidak ditemukan.' };

    const member = await prisma.member.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    safeRevalidatePath('/anggota');
    safeRevalidatePath('/');
    return { success: true, member };
  } catch (error) {
    console.error('Error toggling member status:', error);
    return { success: false, error: 'Gagal mengubah status anggota.' };
  }
}

export async function deleteMember(id: number) {
  try {
    await prisma.member.delete({
      where: { id },
    });

    safeRevalidatePath('/anggota');
    safeRevalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting member:', error);
    return { success: false, error: 'Gagal menghapus anggota.' };
  }
}
