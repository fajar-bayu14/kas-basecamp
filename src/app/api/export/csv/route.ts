import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateTransactionsCsv, ExportRowData } from '@/lib/exportService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = parseInt(searchParams.get('month') || '9', 10);
    const year = parseInt(searchParams.get('year') || '2026', 10);
    const weekParam = searchParams.get('week');
    const weekNumber = weekParam ? parseInt(weekParam, 10) : undefined;

    const transactions = await prisma.cashTransaction.findMany({
      where: {
        year,
        month,
        ...(weekNumber ? { weekNumber } : {}),
      },
      include: {
        member: true,
      },
      orderBy: [
        { paymentDate: 'asc' },
        { weekNumber: 'asc' },
      ],
    });

    const exportRows: ExportRowData[] = transactions.map((t, index) => ({
      no: index + 1,
      name: t.member.name,
      paymentDate: t.paymentDate.toISOString(),
      weekNumber: t.weekNumber,
      amount: t.amount,
    }));

    const csvContent = generateTransactionsCsv(exportRows);
    const fileName = `rekap-kas-${year}-${String(month).padStart(2, '0')}${
      weekNumber ? `-w${weekNumber}` : ''
    }.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error generating CSV:', error);
    return new NextResponse('Error generating CSV file', { status: 500 });
  }
}
