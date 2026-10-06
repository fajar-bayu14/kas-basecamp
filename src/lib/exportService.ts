export interface ExportRowData {
  no: number;
  name: string;
  paymentDate: string; // ISO or DD/MM/YYYY
  weekNumber: number;
  amount: number;
}

/**
 * Format tanggal ISO ke DD/MM/YYYY
 */
export function formatExportDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return isoDate;
  }
}

/**
 * Generate CSV berstandar RFC 4180 dengan header baku sesuai PRD Section 9
 */
export function generateTransactionsCsv(rows: ExportRowData[]): string {
  const headers = ['No', 'Nama', 'Tanggal Bayar', 'Minggu ke-', 'Jumlah Bayar'];

  const csvRows = rows.map((row) => {
    const escapedName = `"${row.name.replace(/"/g, '""')}"`;
    const formattedDate = formatExportDate(row.paymentDate);
    const weekStr = `"Minggu ${row.weekNumber}"`;
    return [row.no, escapedName, formattedDate, weekStr, row.amount].join(',');
  });

  return '\uFEFF' + [headers.join(','), ...csvRows].join('\r\n');
}

export interface ExpenseExportRow { no: number; description: string; category: string; expenseDate: string; amount: number; }

export function generateExpenseCsv(rows: ExpenseExportRow[]): string {
  const headers = ['No', 'Deskripsi', 'Kategori', 'Tanggal', 'Jumlah'];
  const csvRows = rows.map((r) => {
    const desc = `"${r.description.replace(/"/g, '""')}"`;
    const cat = `"${r.category.replace(/"/g, '""')}"`;
    return [r.no, desc, cat, formatExportDate(r.expenseDate), r.amount].join(',');
  });
  return '\uFEFF' + [headers.join(','), ...csvRows].join('\r\n');
}
