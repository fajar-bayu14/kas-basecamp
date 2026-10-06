'use client';

import * as React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { recordCashPayment } from '@/app/actions/transaction';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

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

  const [memberId, setMemberId] = React.useState<string>('');
  const [paymentDate, setPaymentDate] = React.useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedWeeks, setSelectedWeeks] = React.useState<number[]>([1]);
  const [notes, setNotes] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [localMonth, setLocalMonth] = React.useState<number>(currentMonth);
  const [localYear, setLocalYear] = React.useState<number>(currentYear);

  const [memberSearch, setMemberSearch] = React.useState<string>('');
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const filteredMembers = React.useMemo(() => {
    if (!memberSearch.trim()) return activeMembers;
    const q = memberSearch.toLowerCase();
    return activeMembers.filter((m) => m.name.toLowerCase().includes(q));
  }, [activeMembers, memberSearch]);

  const selectedMemberName = React.useMemo(
    () => activeMembers.find((m) => String(m.id) === memberId)?.name ?? '',
    [activeMembers, memberId]
  );

  const handlePeriodChange = (month: number, year: number) => {
    setLocalMonth(month);
    setLocalYear(year);
    setSelectedWeeks([1]);
  };

  const handleSelectMember = (id: number, name: string) => {
    setMemberId(String(id));
    setMemberSearch(name);
    setIsMemberDropdownOpen(false);
  };

  const handleMemberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberSearch(e.target.value);
    setMemberId('');
    setIsMemberDropdownOpen(true);
  };

  const handleMemberInputFocus = () => {
    setMemberSearch('');
    setIsMemberDropdownOpen(true);
  };

  const totalAmount = selectedWeeks.length * 5000;

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

  React.useEffect(() => {
    if (isOpen) {
      const firstActive = members.find((m) => m.isActive);
      if (firstActive) {
        setMemberId((prev) => (prev ? prev : String(firstActive.id)));
      }
      setLocalMonth(currentMonth);
      setLocalYear(currentYear);
      const day = new Date().getDate();
      const currentWeek = Math.min(Math.ceil(day / 7), 5);
      setSelectedWeeks([currentWeek]);
      setNotes('');
      setMemberSearch('');
      setIsMemberDropdownOpen(false);
    }
  }, [isOpen, currentMonth, currentYear]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsMemberDropdownOpen(false);
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
      title="Input kas"
      description="Iuran Rp 5.000 per minggu per anggota."
      className="sm:max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-muted-foreground">
            Periode <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-2">
            <select
              value={localMonth}
              onChange={(e) => handlePeriodChange(Number(e.target.value), localYear)}
              className="flex h-9 flex-1 rounded-md border bg-card px-3 text-sm text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={idx + 1} value={idx + 1}>{name}</option>
              ))}
            </select>
            <select
              value={localYear}
              onChange={(e) => handlePeriodChange(localMonth, Number(e.target.value))}
              className="h-9 w-24 rounded-md border bg-card px-3 text-sm text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          {(localMonth !== currentMonth || localYear !== currentYear) && (
            <p className="rounded-md border bg-muted px-3 py-2 text-xs text-muted-foreground">
              Input retroaktif: {MONTH_NAMES[localMonth - 1]} {localYear}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Nama anggota <span className="text-destructive">*</span>
          </label>
          <div ref={dropdownRef} className="relative">
            <input
              type="text"
              placeholder="Cari nama anggota..."
              value={memberSearch}
              onChange={handleMemberInputChange}
              onFocus={handleMemberInputFocus}
              autoComplete="off"
              className="flex h-9 w-full rounded-md border bg-card px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {isMemberDropdownOpen && (
              <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-card">
                {filteredMembers.length === 0 ? (
                  <div className="px-3 py-3 text-center text-sm text-muted-foreground">Tidak ditemukan</div>
                ) : (
                  filteredMembers.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectMember(m.id, m.name)}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:bg-muted ${String(m.id) === memberId ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    >
                      <span>{m.name}</span>
                      {String(m.id) === memberId && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-xs font-medium text-muted-foreground">
              Minggu <span className="text-destructive">*</span>
            </label>
            <span className="text-xs text-muted-foreground">Bisa pilih lebih dari 1</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5].map((w) => {
              const isSelected = selectedWeeks.includes(w);
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => toggleWeek(w)}
                  className={`flex flex-col items-center justify-center rounded-md border p-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isSelected ? 'border-accent bg-accent text-accent-foreground' : 'border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  <span className="text-[11px] font-medium opacity-70">Minggu</span>
                  <span className="text-sm font-semibold">{w}</span>
                  {isSelected && <Check className="mt-0.5 h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border bg-muted px-3 py-3">
          <div>
            <div className="text-xs font-medium text-muted-foreground">Total bayar</div>
            <div className="text-xs text-muted-foreground">{selectedWeeks.length} minggu × Rp 5.000</div>
          </div>
          <span className="text-base font-semibold text-card-foreground">{formatCurrency(totalAmount)}</span>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-card-foreground">Tanggal bayar</label>
          <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Catatan (opsional)</label>
          <Input placeholder="Misal: Titip lewat Budi" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className="flex items-center justify-end gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Batal</Button>
          <Button type="submit" disabled={isSubmitting || !memberId} className="flex-1 sm:flex-initial">
            {isSubmitting ? 'Menyimpan...' : `Simpan · ${formatCurrency(totalAmount)}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
