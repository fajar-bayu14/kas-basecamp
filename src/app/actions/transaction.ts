'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getIsAdmin } from '@/lib/auth';

const recordPaymentSchema = z.object({
  memberId: z.coerce.number().int().positive('Anggota wajib dipilih'),
  paymentDate: z.string().min(1, 'Tanggal pembayaran wajib diisi'),
  weeks: z
    .array(z.coerce.number().int().min(1).max(5))
    .min(1, 'Pilih minimal satu minggu pembayaran'),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2020).max(2050),
  notes: z.string().max(255).optional().nullable(),
});

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {}
}

export async function recordCashPayment(rawInput: any) {
  try {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Akses ditolak. Silakan login sebagai admin untuk mencatat kas.' };
    }

    const data = recordPaymentSchema.parse(rawInput);
    const dateObj = new Date(data.paymentDate);

    // Verify member exists and is active
    const member = await prisma.member.findUnique({
      where: { id: data.memberId },
    });
    if (!member) {
      return { success: false, error: 'Anggota tidak ditemukan.' };
    }

    const createdRecords = [];

    // Execute atomic transaction for each selected week
    await prisma.$transaction(async (tx) => {
      for (const weekNum of data.weeks) {
        // Upsert or create per week so duplicates are cleanly updated/handled
        const record = await tx.cashTransaction.upsert({
          where: {
            member_period_week_unique: {
              memberId: data.memberId,
              year: data.year,
              month: data.month,
              weekNumber: weekNum,
            },
          },
          update: {
            paymentDate: dateObj,
            amount: 5000,
            notes: data.notes || `Iuran Kas W${weekNum}`,
          },
          create: {
            memberId: data.memberId,
            paymentDate: dateObj,
            weekNumber: weekNum,
            month: data.month,
            year: data.year,
            amount: 5000,
            notes: data.notes || `Iuran Kas W${weekNum}`,
          },
        });
        createdRecords.push(record);
      }
    });

    safeRevalidatePath('/');
    safeRevalidatePath('/anggota');

    return {
      success: true,
      count: data.weeks.length,
      totalAmount: data.weeks.length * 5000,
      memberName: member.name,
    };
  } catch (error: any) {
    console.error('Error recording cash payment:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Gagal mencatat transaksi kas.' };
  }
}

export async function deleteTransaction(id: number) {
  try {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Akses ditolak. Silakan login sebagai admin untuk membatalkan transaksi.' };
    }

    await prisma.cashTransaction.delete({
      where: { id },
    });

    safeRevalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { success: false, error: 'Gagal menghapus transaksi.' };
  }
}

export async function getDashboardData(
  filterMonth?: number,
  filterYear?: number,
  filterWeek?: number | null
) {
  const now = new Date(); // dideklarasikan di luar try/catch agar tersedia di blok catch
  try {
    const currentYear = filterYear || now.getFullYear();
    const currentMonth = filterMonth || (now.getMonth() + 1);

    // Determine current calendar week (1-5) based on day of month
    const currentDay = now.getDate();
    const activeCurrentWeek = Math.min(Math.ceil(currentDay / 7), 5);
    const targetWeekForKpi = filterWeek ? filterWeek : activeCurrentWeek;

    const [activeMembersCount, totalCashAggregation, totalExpenseAgg, monthTransactions, monthExpenses] =
      await Promise.all([
        prisma.member.count({ where: { isActive: true } }),
        prisma.cashTransaction.aggregate({ _sum: { amount: true } }),
        prisma.cashExpense.aggregate({ _sum: { amount: true } }),
        prisma.cashTransaction.findMany({
          where: { year: currentYear, month: currentMonth },
          include: { member: true },
          orderBy: [{ paymentDate: 'desc' }, { id: 'desc' }],
        }),
        prisma.cashExpense.findMany({
          where: { year: currentYear, month: currentMonth },
          orderBy: [{ expenseDate: 'desc' }, { id: 'desc' }],
        }),
      ]);

    const totalAllTimeAmount = totalCashAggregation._sum.amount || 0;
    const totalAllTimeExpense = totalExpenseAgg._sum.amount || 0;
    const totalMonthAmount = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalMonthExpense = monthExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);

    // Filtered by week for current week KPI
    const currentWeekTransactions = monthTransactions.filter(
      (t) => t.weekNumber === targetWeekForKpi
    );
    const totalCurrentWeekAmount = currentWeekTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // Unique members paid this week
    const uniqueMembersPaidThisWeek = new Set(
      currentWeekTransactions.map((t) => t.memberId)
    ).size;

    // 3. Weekly Aggregation (W1 to W5)
    const weeklyData = [1, 2, 3, 4, 5].map((w) => {
      const txForWeek = monthTransactions.filter((t) => t.weekNumber === w);
      const totalAmount = txForWeek.reduce((sum, t) => sum + t.amount, 0);
      const txCount = txForWeek.length;

      return {
        weekNumber: w,
        label: `Minggu ${w}`,
        shortLabel: `W${w}`,
        totalAmount,
        txCount,
        targetAmount: activeMembersCount * 5000,
      };
    });

    // 4. Transactions list filtered based on filterWeek if specified
    const displayTransactions = filterWeek
      ? monthTransactions.filter((t) => t.weekNumber === filterWeek)
      : monthTransactions;

    return {
      success: true,
      kpi: {
        totalAllTimeAmount,
        totalAllTimeExpense,
        netBalanceAllTime: totalAllTimeAmount - totalAllTimeExpense,
        totalMonthAmount,
        totalMonthExpense,
        netBalanceMonth: totalMonthAmount - totalMonthExpense,
        monthTxCount: monthTransactions.length,
        monthExpenseCount: monthExpenses.length,
        totalCurrentWeekAmount,
        targetWeekForKpi,
        uniqueMembersPaidThisWeek,
        activeMembersCount,
        paymentRatio: activeMembersCount > 0 ? Math.round((uniqueMembersPaidThisWeek / activeMembersCount) * 100) : 0,
      },
      weeklyData,
      transactions: displayTransactions.map((tx, index) => ({
        no: index + 1, id: tx.id, memberId: tx.memberId, name: tx.member.name,
        paymentDate: tx.paymentDate.toISOString(), weekNumber: tx.weekNumber, month: tx.month, year: tx.year, amount: tx.amount, notes: tx.notes,
      })),
      expenses: monthExpenses.map((e: any, i: number) => ({
        no: i + 1, id: e.id, amount: e.amount, category: e.category, description: e.description,
        expenseDate: e.expenseDate.toISOString(), month: e.month, year: e.year, notes: e.notes,
      })),
      period: { month: currentMonth, year: currentYear, week: filterWeek || null },
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      success: false,
      error: 'Gagal mengambil data dashboard.',
      kpi: {
        totalAllTimeAmount: 0, totalAllTimeExpense: 0, netBalanceAllTime: 0,
        totalMonthAmount: 0, totalMonthExpense: 0, netBalanceMonth: 0,
        monthTxCount: 0, monthExpenseCount: 0,
        totalCurrentWeekAmount: 0, targetWeekForKpi: 1,
        uniqueMembersPaidThisWeek: 0, activeMembersCount: 0, paymentRatio: 0,
      },
      weeklyData: [], transactions: [], expenses: [],
      period: { month: filterMonth || (now.getMonth() + 1), year: filterYear || now.getFullYear(), week: null },
    };
  }
}
