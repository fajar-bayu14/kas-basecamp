'use server';

import { prisma } from '@/lib/prisma';
import { syncToGoogleSheets, ExportRowData } from '@/lib/exportService';

export async function exportToGoogleSheetsAction(
  month = 9,
  year = 2026,
  weekNumber?: number | null
) {
  try {
    // 1. Fetch transactions based on filter
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

    if (transactions.length === 0) {
      return {
        success: false,
        error: 'Tidak ada data transaksi kas pada periode yang dipilih.',
      };
    }

    const exportRows: ExportRowData[] = transactions.map((t, index) => ({
      no: index + 1,
      name: t.member.name,
      paymentDate: t.paymentDate.toISOString(),
      weekNumber: t.weekNumber,
      amount: t.amount,
    }));

    const result = await syncToGoogleSheets(exportRows);

    return {
      success: true,
      count: exportRows.length,
      url: result.spreadsheetUrl,
    };
  } catch (error: any) {
    console.error('Error in exportToGoogleSheetsAction:', error);
    return {
      success: false,
      error: error.message || 'Gagal mengekspor data ke Google Sheets.',
    };
  }
}
