'use client';

import * as React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { recordCashPayment } from '@/app/actions/transaction';
import { toast } from 'sonner';
import { Check, Calendar, User, Coins, CheckCircle2 } from 'lucide-react';

interface MemberOption {
  id: number;
  name: string;
  isActive: boolean;
}

interface QuickInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: MemberOption[];
  currentMonth: number;
  currentYear: number;
  onSuccess?: () => void;
}

export function QuickInputModal({
  isOpen,
  onClose,
  members,
  currentMonth,
  currentYear,
  onSuccess,
}: QuickInputModalProps) {
  const activeMembers = React.useMemo(
    () => members.filter((m) => m.isActive),
    [members]
  );

  // Form states
  const [memberId, setMemberId] = React.useState<string>('');
  const [paymentDate, setPaymentDate] = React.useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedWeeks, setSelectedWeeks] = React.useState<number[]>([1]);
  const [notes, setNotes] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Auto calculated nominal
  const totalAmount = selectedWeeks.length * 5000;

  // Toggle week selection
  const toggleWeek = (week: number) => {
    if (selectedWeeks.includes(week)) {
      if (selectedWeeks.length === 1) {
        toast.info('Minimal harus memilih 1 minggu pembayaran');
        return;
      }
      setSelectedWeeks(selectedWeeks.filter((w) => w !== week));
    } else {
      setSelectedWeeks([...selectedWeeks, week].sort((a, b) => a - b));
    }
  };

  // Quick reset when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const firstActive = members.find((m) => m.isActive);
      if (firstActive) {
        setMemberId((prev) => (prev ? prev : String(firstActive.id)));
      }
      // Pick current calendar week default
      const day = new Date().getDate();
      const currentWeek = Math.min(Math.ceil(day / 7), 5);
      setSelectedWeeks([currentWeek]);
      setNotes('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) {
      toast.error('Pilih nama anggota terlebih dahulu');
      return;
    }
    if (selectedWeeks.length === 0) {
      toast.error('Pilih minimal satu minggu pembayaran');
      return;
    }

    setIsSubmitting(true);
    const res = await recordCashPayment({
      memberId: Number(memberId),
      paymentDate,
      weeks: selectedWeeks,
      month: currentMonth,
      year: currentYear,
      notes: notes.trim() || undefined,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success(
        `Berhasil! Kas ${res.memberName} (${formatCurrency(
          res.totalAmount || 0
        )}) tercatat untuk ${res.count} minggu.`
      );
      onClose();
      if (onSuccess) onSuccess();
    } else {
      toast.error(res.error || 'Gagal menyimpan transaksi kas.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Input Kas Cepat"
      description="Pencatatan iuran kas mingguan Rp 5.000 per anggota."
      className="sm:max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Pilih Anggota */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            Nama Anggota <span className="text-red-500">*</span>
          </label>
          <Select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            required
            className="font-medium text-slate-900"
          >
            <option value="" disabled>
              -- Pilih Anggota Kas --
            </option>
            {activeMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
        </div>

        {/* 2. Pilihan Minggu Pembayaran (Multi-select chip) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Pilih Minggu Kas <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-normal">
              Bisa pilih &gt; 1 minggu
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5].map((w) => {
              const isSelected = selectedWeeks.includes(w);
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => toggleWeek(w)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold opacity-80">
                    Minggu
                  </span>
                  <span className="text-sm font-extrabold">{w}</span>
                  {isSelected && <Check className="w-3 h-3 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Nominal Otomatis (Rp 5.000 / minggu) */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-800">
                Total Jumlah Bayar
              </div>
              <div className="text-xs text-emerald-700">
                {selectedWeeks.length} Minggu × Rp 5.000
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg sm:text-xl font-black text-emerald-800 font-mono tracking-tight">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {/* 4. Tanggal Pembayaran */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
            Tanggal Pembayaran
          </label>
          <Input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
            className="font-medium"
          />
        </div>

        {/* 5. Catatan Tambahan */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
            Catatan (Opsional)
          </label>
          <Input
            placeholder="Misal: Titip lewat Budi, Tunai"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !memberId}
            className="flex-1 sm:flex-initial shadow-md shadow-emerald-600/20"
          >
            {isSubmitting ? (
              'Menyimpan...'
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Simpan ({formatCurrency(totalAmount)})
              </span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
