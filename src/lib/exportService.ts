import { google } from 'googleapis';

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

/**
 * Sync / Append data transaksi ke Google Spreadsheet menggunakan Service Account
 */
export async function syncToGoogleSheets(rows: ExportRowData[], sheetTitle = 'Rekap Kas') {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !rawKey || !sheetId) {
    throw new Error(
      'Kredensial Google Service Account belum dikonfigurasi lengkap di .env (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID).'
    );
  }

  // Normalize private key newline
  const privateKey = rawKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Format rows strictly per PRD: No, Nama, Tanggal Bayar, Minggu ke-, Jumlah Bayar
  const values = [
    ['No', 'Nama', 'Tanggal Bayar', 'Minggu ke-', 'Jumlah Bayar'],
    ...rows.map((r) => [
      r.no,
      r.name,
      formatExportDate(r.paymentDate),
      `Minggu ${r.weekNumber}`,
      r.amount,
    ]),
  ];

  // Try writing to Sheet1!A1:E or create / overwrite range
  const range = 'Sheet1!A1:E';

  // 1. Clear existing data in Sheet1
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range,
    });
  } catch (clearErr) {
    console.warn('Could not clear sheet range, proceeding to update:', clearErr);
  }

  // 2. Update sheet with full formatted rows
  const response = await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values,
    },
  });

  return {
    updatedRows: response.data.updatedRows,
    updatedColumns: response.data.updatedColumns,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
  };
}
