'use client';

import * as React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { recordCashPayment } from '@/app/actions/transaction';
import { toast } from 'sonner';
import { Check, Calendar, User, Coins, CheckCircle2, AlertTriangle, Search } from 'lucide-react';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

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

  // State periode lokal — bisa dioverride admin untuk input retroaktif
  const [localMonth, setLocalMonth] = React.useState<number>(currentMonth);
  const [localYear, setLocalYear] = React.useState<number>(currentYear);

  // State combobox pencarian anggota
  const [memberSearch, setMemberSearch] = React.useState<string>('');
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Filtered list berdasarkan teks pencarian (case-insensitive)
  const filteredMembers = React.useMemo(() => {
    if (!memberSearch.trim()) return activeMembers;
    const q = memberSearch.toLowerCase();
    return activeMembers.filter((m) => m.name.toLowerCase().includes(q));
  }, [activeMembers, memberSearch]);

  // Nama anggota terpilih — dipakai untuk restore input saat klik luar dropdown
  const selectedMemberName = React.useMemo(
    () => activeMembers.find((m) => String(m.id) === memberId)?.name ?? '',
    [activeMembers, memberId]
  );

  // Handler ganti periode: reset week ke W1 karena auto-detect minggu
  // berjalan hanya relevan untuk bulan aktif
  const handlePeriodChange = (month: number, year: number) => {
    setLocalMonth(month);
    setLocalYear(year);
    setSelectedWeeks([1]);
  };

  // Handler combobox anggota
  const handleSelectMember = (id: number, name: string) => {
    setMemberId(String(id));
    setMemberSearch(name);       // tampilkan nama di input setelah dipilih
    setIsMemberDropdownOpen(false);
  };

  const handleMemberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberSearch(e.target.value);
    setMemberId('');             // reset pilihan saat user mulai mengetik lagi
    setIsMemberDropdownOpen(true);
  };

  const handleMemberInputFocus = () => {
    setMemberSearch('');         // kosongkan input saat fokus agar filter fresh
    setIsMemberDropdownOpen(true);
  };

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
      // Sync periode lokal ke bulan/tahun dashboard yang aktif
      setLocalMonth(currentMonth);
      setLocalYear(currentYear);
      // Pick current calendar week default (hanya relevan jika bulan sama dengan sekarang)
      const day = new Date().getDate();
      const currentWeek = Math.min(Math.ceil(day / 7), 5);
      setSelectedWeeks([currentWeek]);
      setNotes('');
      // Reset combobox pencarian
      setMemberSearch('');
      setIsMemberDropdownOpen(false);
    }
  }, [isOpen, currentMonth, currentYear]);

  // Click-outside: tutup dropdown dan restore nama anggota terpilih
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsMemberDropdownOpen(false);
        // Jika ada anggota terpilih, kembalikan namanya ke input
        if (memberId) setMemberSearch(selectedMemberName);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [memberId, selectedMemberName]);

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
      month: localMonth,
      year: localYear,
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
        {/* 0. Pilih Periode Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            Periode Kas <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-2">
            {/* Dropdown Bulan */}
            <select
              value={localMonth}
              onChange={(e) => handlePeriodChange(Number(e.target.value), localYear)}
              className="flex-1 h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={idx + 1} value={idx + 1}>{name}</option>
              ))}
            </select>

            {/* Dropdown Tahun */}
            <select
              value={localYear}
              onChange={(e) => handlePeriodChange(localMonth, Number(e.target.value))}
              className="w-24 h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Peringatan jika input retroaktif (beda dari bulan dashboard) */}
          {(localMonth !== currentMonth || localYear !== currentYear) && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 font-medium">
              <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
              Input retroaktif: data akan masuk ke{' '}
              <strong>{MONTH_NAMES[localMonth - 1]} {localYear}</strong>
            </div>
          )}
        </div>

        {/* 1. Pilih Anggota */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            Nama Anggota <span className="text-red-500">*</span>
          </label>

          {/* Custom combobox dengan pencarian real-time */}
          <div ref={dropdownRef} className="relative">
            {/* Input pencarian */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari nama anggota..."
                value={memberSearch}
                onChange={handleMemberInputChange}
                onFocus={handleMemberInputFocus}
                autoComplete="off"
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
              />
            </div>

            {/* Dropdown list — tampil saat isMemberDropdownOpen */}
            {isMemberDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg max-h-48 overflow-y-auto">
                {filteredMembers.length === 0 ? (
                  <div className="px-3.5 py-3 text-sm text-slate-400 text-center">
                    Anggota tidak ditemukan
                  </div>
                ) : (
                  filteredMembers.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectMember(m.id, m.name)}
                      className={`w-full text-left px-3.5 py-2.5 text-sm transition-colors flex items-center justify-between gap-2 first:rounded-t-xl last:rounded-b-xl ${
                        String(m.id) === memberId
                          ? 'bg-emerald-50 text-emerald-800 font-semibold'
                          : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span>{m.name}</span>
                      {String(m.id) === memberId && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
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
