'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getIsAdmin } from '@/lib/auth';

const expenseCategories = ['Operasional', 'Konsumsi', 'Peralatan', 'Transport', 'Lainnya'] as const;

const recordExpenseSchema = z.object({
  amount: z.coerce.number().int().positive('Nominal harus > 0'),
  category: z.enum(expenseCategories, { message: 'Kategori wajib dipilih' }),
  description: z.string().min(2, 'Deskripsi minimal 2 karakter').max(255).trim(),
  expenseDate: z.string().min(1, 'Tanggal wajib diisi'),
  notes: z.string().max(255).optional().nullable(),
});

function safeRevalidatePath(path: string) {
  try { revalidatePath(path); } catch {}
}

export async function recordExpense(rawInput: any) {
  try {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) return { success: false, error: 'Akses ditolak. Login sebagai admin.' };
    const data = recordExpenseSchema.parse(rawInput);
    const dateObj = new Date(data.expenseDate);
    const expense = await prisma.cashExpense.create({
      data: {
        amount: data.amount,
        category: data.category,
        description: data.description,
        expenseDate: dateObj,
        month: dateObj.getMonth() + 1,
        year: dateObj.getFullYear(),
        notes: data.notes || null,
      },
    });
    safeRevalidatePath('/');
    return { success: true, expense };
  } catch (error: any) {
    if (error instanceof z.ZodError) return { success: false, error: error.issues[0].message };
    console.error('recordExpense', error);
    return { success: false, error: 'Gagal mencatat pengeluaran.' };
  }
}

export async function deleteExpense(id: number) {
  try {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) return { success: false, error: 'Akses ditolak.' };
    await prisma.cashExpense.delete({ where: { id } });
    safeRevalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('deleteExpense', error);
    return { success: false, error: 'Gagal menghapus pengeluaran.' };
  }
}

export async function getExpenses(filterMonth?: number, filterYear?: number) {
  const where: any = {};
  if (filterYear) where.year = filterYear;
  if (filterMonth) where.month = filterMonth;
  try {
    return await prisma.cashExpense.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: [{ expenseDate: 'desc' }, { id: 'desc' }],
    });
  } catch (error) {
    console.error('getExpenses', error);
    return [];
  }
}
