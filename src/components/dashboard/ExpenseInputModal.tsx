'use client';
import * as React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { recordExpense } from '@/app/actions/expense';
const expenseCategories = ['Operasional', 'Konsumsi', 'Peralatan', 'Transport', 'Lainnya'] as const;
import { toast } from 'sonner';
import { Wallet, Tag, Calendar, FileText } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; onSuccess?: () => void; }

export function ExpenseInputModal({ isOpen, onClose, onSuccess }: Props) {
  const [amount, setAmount] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [expenseDate, setExpenseDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setAmount(''); setCategory(''); setDescription('');
      setExpenseDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description.trim()) { toast.error('Lengkapi nominal, kategori, dan deskripsi'); return; }
    setSubmitting(true);
    const res = await recordExpense({ amount: Number(amount), category, description: description.trim(), expenseDate, notes: notes.trim() || undefined });
    setSubmitting(false);
    if (res.success) { toast.success(`Pengeluaran ${formatCurrency(Number(amount))} tercatat`); onClose(); onSuccess?.(); }
    else toast.error(res.error || 'Gagal menyimpan pengeluaran');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Input Pengeluaran" description="Catat pengeluaran kas (konsumsi, operasional, dll)." className="sm:max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5 text-red-600" />Nominal <span className="text-red-500">*</span></label>
          <Input type="number" min={1} placeholder="50000" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          {amount && <p className="text-xs text-slate-500 mt-1">{formatCurrency(Number(amount) || 0)}</p>}
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-red-600" />Kategori <span className="text-red-500">*</span></label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" required>
            <option value="">Pilih kategori</option>
            {expenseCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-red-600" />Deskripsi <span className="text-red-500">*</span></label>
          <Input placeholder="Misal: Konsumsi rapat" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-red-600" />Tanggal</label>
          <Input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Catatan (Opsional)</label>
          <Input placeholder="Keterangan tambahan" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Batal</Button>
          <Button type="submit" disabled={submitting} className="bg-red-600 hover:bg-red-700 flex-1 sm:flex-initial">{submitting ? 'Menyimpan...' : `Simpan ${amount ? formatCurrency(Number(amount) || 0) : ''}`}</Button>
        </div>
      </form>
    </Modal>
  );
}
