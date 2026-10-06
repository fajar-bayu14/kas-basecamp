'use client';
import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { deleteExpense } from '@/app/actions/expense';
import { toast } from 'sonner';
import { Search, Download, Trash2 } from 'lucide-react';

interface ExpenseItem { no: number; id: number; amount: number; category: string; description: string; expenseDate: string; notes?: string | null; }
interface Props { expenses: ExpenseItem[]; currentMonth: number; currentYear: number; isAdmin?: boolean; }

const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

export function ExpenseTable({ expenses, currentMonth, currentYear, isAdmin = false }: Props) {
  const [q, setQ] = React.useState('');
  const filtered = React.useMemo(() => {
    if (!q.trim()) return expenses;
    const s = q.toLowerCase();
    return expenses.filter((e) => e.description.toLowerCase().includes(s) || e.category.toLowerCase().includes(s) || (e.notes && e.notes.toLowerCase().includes(s)));
  }, [expenses, q]);
  const total = filtered.reduce((a, e) => a + e.amount, 0);
  const csvUrl = `/api/export/expense?month=${currentMonth}&year=${currentYear}`;
  const handleDelete = async (e: ExpenseItem) => {
    if (!confirm(`Hapus pengeluaran "${e.description}" (${formatCurrency(e.amount)})?`)) return;
    const res = await deleteExpense(e.id);
    if (res.success) toast.success('Pengeluaran dihapus');
    else toast.error(res.error || 'Gagal hapus');
  };
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-4 border-b p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-card-foreground">Pengeluaran</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">{MONTH_NAMES[currentMonth - 1]} {currentYear}</p>
        </div>
        <a href={csvUrl} download className="inline-flex items-center justify-center gap-2 rounded-md border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Download className="h-4 w-4" />Unduh CSV
        </a>
      </CardHeader>
      <div className="border-b bg-muted/30 p-4">
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari deskripsi/kategori..." value={q} onChange={(e) => setQ(e.target.value)} className="h-9 pl-8 text-xs" />
        </div>
      </div>
      <CardContent className="p-0">
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">Belum ada pengeluaran periode ini</p>
            <p className="mt-1 text-xs text-muted-foreground">Gunakan Input Pengeluaran untuk mencatat.</p>
          </div>
        ) : (
          <Table>
            <TableHeader><TableRow>
              <TableHead className="w-12 text-center">No</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              {isAdmin && <TableHead className="text-right">Aksi</TableHead>}
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((e, idx) => (
                <TableRow key={e.id}>
                  <TableCell className="text-center text-xs text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell className="text-sm font-medium text-card-foreground">{e.description}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[11px]">{e.category}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(e.expenseDate)}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-card-foreground">{formatCurrency(e.amount)}</TableCell>
                  {isAdmin && <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleDelete(e)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button></TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3 text-xs font-medium text-muted-foreground sm:px-5">
          <span>{filtered.length} pengeluaran</span>
          <span className="font-semibold text-card-foreground">{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
