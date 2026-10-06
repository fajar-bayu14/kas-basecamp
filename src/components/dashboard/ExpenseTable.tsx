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
import { Search, Download, Trash2, Receipt, FileSpreadsheet } from 'lucide-react';

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
    <Card className="border-slate-200/80 shadow-sm overflow-hidden">
      <CardHeader className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2"><Receipt className="w-5 h-5 text-red-600" />Rekapan Pengeluaran</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Log pengeluaran kas ({MONTH_NAMES[currentMonth - 1]} {currentYear})</p>
        </div>
        <a href={csvUrl} download className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-red-200 bg-red-50 text-red-800 hover:bg-red-100 transition-colors">
          <Download className="w-4 h-4" />Unduh CSV Pengeluaran
        </a>
      </CardHeader>
      <div className="p-4 sm:p-6 bg-slate-50/50 border-b border-slate-100 flex justify-end">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input placeholder="Cari deskripsi/kategori..." value={q} onChange={(e) => setQ(e.target.value)} className="h-9 pl-8 text-xs bg-white" />
        </div>
      </div>
      <CardContent className="p-0">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700">Belum ada pengeluaran periode ini</p>
            <p className="text-xs text-slate-400 mt-1">Klik Input Pengeluaran untuk mencatat.</p>
          </div>
        ) : (
          <Table>
            <TableHeader><TableRow>
              <TableHead className="w-12 text-center text-xs">No</TableHead>
              <TableHead className="text-xs">Deskripsi</TableHead>
              <TableHead className="text-xs">Kategori</TableHead>
              <TableHead className="text-xs">Tanggal</TableHead>
              <TableHead className="text-right text-xs">Jumlah</TableHead>
              {isAdmin && <TableHead className="text-right text-xs">Aksi</TableHead>}
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((e, idx) => (
                <TableRow key={e.id} className="hover:bg-slate-50/80">
                  <TableCell className="text-center text-xs font-mono text-slate-400">{idx + 1}</TableCell>
                  <TableCell className="font-semibold text-slate-900 text-sm">{e.description}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[11px] bg-slate-50">{e.category}</Badge></TableCell>
                  <TableCell className="text-xs text-slate-600">{formatDate(e.expenseDate)}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-red-700 text-sm">{formatCurrency(e.amount)}</TableCell>
                  {isAdmin && <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleDelete(e)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button></TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="p-4 sm:px-6 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between text-xs font-medium">
          <span>Total: <strong>{filtered.length}</strong> pengeluaran</span>
          <span className="font-mono font-bold text-red-700">Subtotal: {formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
