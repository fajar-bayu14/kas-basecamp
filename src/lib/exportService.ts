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

  // Include UTF-8 BOM for Microsoft Excel compatibility
  return '\uFEFF' + [headers.join(','), ...csvRows].join('\r\n');
}
