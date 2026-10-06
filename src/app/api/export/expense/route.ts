import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateExpenseCsv } from '@/lib/exportService';

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const month = parseInt(sp.get('month') || '9', 10);
  const year = parseInt(sp.get('year') || '2026', 10);
  const rows = await prisma.cashExpense.findMany({ where: { year, month }, orderBy: [{ expenseDate: 'asc' }] });
  const csv = generateExpenseCsv(rows.map((r, i) => ({ no: i + 1, description: r.description, category: r.category, expenseDate: r.expenseDate.toISOString(), amount: r.amount })));
  return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="pengeluaran-${year}-${String(month).padStart(2, '0')}.csv"` } });
}
