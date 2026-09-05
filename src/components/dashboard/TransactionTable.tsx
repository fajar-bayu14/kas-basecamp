'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { deleteTransaction } from '@/app/actions/transaction';
import { toast } from 'sonner';
import {
  Search,
  Download,
  Trash2,
  Calendar,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

interface TransactionItem {
  no: number;
  id: number;
  memberId: number;
  name: string;
  paymentDate: string;
  weekNumber: number;
  month: number;
  year: number;
  amount: number;
  notes?: string | null;
}

interface TransactionTableProps {
  transactions: TransactionItem[];
  currentMonth: number;
  currentYear: number;
  selectedWeek: number | null;
  onSelectWeek: (week: number | null) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  isAdmin?: boolean;
}

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function TransactionTable({
  transactions,
  currentMonth,
  currentYear,
  selectedWeek,
  onSelectWeek,
  onMonthChange,
  onYearChange,
  isAdmin = false,
}: TransactionTableProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  // Filter transactions by search query
  const filteredTransactions = React.useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q))
    );
  }, [transactions, searchQuery]);

  // Handle Delete
  const handleDelete = async (tx: TransactionItem) => {
    if (
      !confirm(
        `Batalkan catatan kas ${tx.name} (Minggu ${tx.weekNumber} - ${formatCurrency(
          tx.amount
        )})?`
      )
    ) {
      return;
    }

    const res = await deleteTransaction(tx.id);
    if (res.success) {
      toast.success('Transaksi kas berhasil dibatalkan.');
    } else {
      toast.error(res.error || 'Gagal membatalkan transaksi.');
    }
  };

  // CSV direct download url
  const csvDownloadUrl = `/api/export/csv?month=${currentMonth}&year=${currentYear}${
    selectedWeek ? `&week=${selectedWeek}` : ''
  }`;

  const totalFilteredAmount = filteredTransactions.reduce(
    (acc, t) => acc + t.amount,
    0
  );

  return (
    <Card className="border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header with Title & CSV Export Action */}
      <CardHeader className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            Rekapan Transaksi Kas
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Log riwayat setoran uang kas mingguan per anggota ({MONTH_NAMES[currentMonth - 1]} {currentYear})
          </p>
        </div>

        {/* Action Button: Download CSV */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <a
            href={csvDownloadUrl}
            download
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 transition-colors shadow-xs"
            title="Download file CSV format standar RFC 4180"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Unduh Rekap CSV</span>
          </a>
        </div>
      </CardHeader>

      {/* Filter Toolbar: Period, Weeks & Search */}
      <div className="p-4 sm:p-6 bg-slate-50/50 border-b border-slate-100 space-y-3">
        {/* Month & Year Selection Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Periode:</span>
          </div>

          <select
            value={currentMonth}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={currentYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Week Segmented Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            <button
              onClick={() => onSelectWeek(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedWeek === null
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua Minggu
            </button>
            {[1, 2, 3, 4, 5].map((w) => (
              <button
                key={w}
                onClick={() => onSelectWeek(w)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedWeek === w
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Minggu {w}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Cari nama pembayar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-8 text-xs bg-white"
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <CardContent className="p-0">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700">
              Belum ada transaksi kas pada periode ini
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `Tidak ada transaksi yang cocok dengan "${searchQuery}".`
                : 'Klik tombol "Input Kas Cepat" untuk mencatat setoran anggota.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center text-xs">No</TableHead>
                <TableHead className="text-xs">Nama Anggota</TableHead>
                <TableHead className="text-xs">Tanggal Bayar</TableHead>
                <TableHead className="text-center text-xs">Minggu Ke-</TableHead>
                <TableHead className="text-right text-xs">Jumlah Bayar</TableHead>
                <TableHead className="hidden md:table-cell text-xs">Catatan</TableHead>
                {isAdmin && <TableHead className="text-right text-xs">Aksi</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx, idx) => (
                <TableRow key={tx.id} className="hover:bg-slate-50/80">
                  <TableCell className="text-center text-xs font-mono text-slate-400">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 text-sm">
                    {tx.name}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {formatDate(tx.paymentDate)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono text-[11px] bg-slate-50">
                      Minggu {tx.weekNumber}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-emerald-700 text-sm">
                    {formatCurrency(tx.amount)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-slate-500 max-w-xs truncate">
                    {tx.notes || <span className="text-slate-300">-</span>}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(tx)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Batalkan transaksi kas ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Footer Summary */}
        <div className="p-4 sm:px-6 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div>
            Total: <strong>{filteredTransactions.length}</strong> transaksi kas
          </div>
          <div className="text-slate-900 font-bold font-mono text-sm">
            Subtotal: <span className="text-emerald-700">{formatCurrency(totalFilteredAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
