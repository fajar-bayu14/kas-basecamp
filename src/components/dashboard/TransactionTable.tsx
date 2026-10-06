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
import { Search, Download, Trash2 } from 'lucide-react';

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

  const filteredTransactions = React.useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q))
    );
  }, [transactions, searchQuery]);

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
    if (res.success) toast.success('Transaksi kas berhasil dibatalkan.');
    else toast.error(res.error || 'Gagal membatalkan transaksi.');
  };

  const csvDownloadUrl = `/api/export/csv?month=${currentMonth}&year=${currentYear}${
    selectedWeek ? `&week=${selectedWeek}` : ''
  }`;

  const totalFilteredAmount = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-4 border-b p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-card-foreground">Rekapan transaksi</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {MONTH_NAMES[currentMonth - 1]} {currentYear}
          </p>
        </div>
        <a
          href={csvDownloadUrl}
          download
          className="inline-flex items-center justify-center gap-2 rounded-md border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Download className="h-4 w-4" />
          Unduh CSV
        </a>
      </CardHeader>

      <div className="space-y-3 border-b bg-muted/30 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Periode</span>
          <select
            value={currentMonth}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="h-9 rounded-md border bg-card px-3 text-xs font-medium text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            className="h-9 rounded-md border bg-card px-3 text-xs font-medium text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => onSelectWeek(null)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selectedWeek === null ? 'bg-accent text-accent-foreground' : 'border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              Semua minggu
            </button>
            {[1, 2, 3, 4, 5].map((w) => (
              <button
                key={w}
                onClick={() => onSelectWeek(w)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selectedWeek === w ? 'bg-accent text-accent-foreground' : 'border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                Minggu {w}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari nama..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-9 pl-8 text-xs" />
          </div>
        </div>
      </div>

      <CardContent className="p-0">
        {filteredTransactions.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">Belum ada transaksi pada periode ini</p>
            <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
              {searchQuery ? `Tidak ada hasil untuk "${searchQuery}".` : 'Gunakan Input Kas untuk mencatat setoran.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-center">Minggu</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="hidden md:table-cell">Catatan</TableHead>
                {isAdmin && <TableHead className="text-right">Aksi</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx, idx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-center text-xs text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell className="text-sm font-medium text-card-foreground">{tx.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(tx.paymentDate)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="text-[11px]">Minggu {tx.weekNumber}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium text-card-foreground">{formatCurrency(tx.amount)}</TableCell>
                  <TableCell className="hidden max-w-[16rem] truncate text-xs text-muted-foreground md:table-cell">
                    {tx.notes || <span className="text-muted-foreground/60">—</span>}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(tx)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" title="Batalkan transaksi">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3 text-xs font-medium text-muted-foreground sm:px-5">
          <span>{filteredTransactions.length} transaksi</span>
          <span className="font-semibold text-card-foreground">{formatCurrency(totalFilteredAmount)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
