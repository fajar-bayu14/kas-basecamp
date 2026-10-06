'use client';

import * as React from 'react';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { WeeklyCashChart } from '@/components/dashboard/WeeklyCashChart';
import { TransactionTable } from '@/components/dashboard/TransactionTable';
import { QuickInputModal } from '@/components/dashboard/QuickInputModal';
import { ExpenseInputModal } from '@/components/dashboard/ExpenseInputModal';
import { ExpenseTable } from '@/components/dashboard/ExpenseTable';
import { LoginModal } from '@/components/auth/LoginModal';
import { Button } from '@/components/ui/button';
import { Plus, Lock, TrendingDown, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GuestQrModal } from '@/components/dashboard/GuestQrModal';

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

interface DashboardClientProps {
  initialData: {
    kpi: {
      totalAllTimeAmount: number;
      totalAllTimeExpense?: number;
      netBalanceAllTime?: number;
      totalMonthAmount: number;
      totalMonthExpense?: number;
      netBalanceMonth?: number;
      monthTxCount: number;
      monthExpenseCount?: number;
      totalCurrentWeekAmount: number;
      targetWeekForKpi: number;
      uniqueMembersPaidThisWeek: number;
      activeMembersCount: number;
      paymentRatio: number;
    };
    weeklyData: any[];
    transactions: any[];
    expenses?: any[];
    period: { month: number; year: number; week: number | null };
  };
  members: { id: number; name: string; isActive: boolean }[];
  isAdmin?: boolean;
}

export function DashboardClient({
  initialData,
  members,
  isAdmin = false,
}: DashboardClientProps) {
  const router = useRouter();

  const [currentMonth, setCurrentMonth] = React.useState<number>(
    initialData.period.month
  );
  const [currentYear, setCurrentYear] = React.useState<number>(
    initialData.period.year
  );
  const [selectedWeek, setSelectedWeek] = React.useState<number | null>(
    initialData.period.week
  );

  const [isQuickInputOpen, setIsQuickInputOpen] = React.useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = React.useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [pendingExpense, setPendingExpense] = React.useState(false);
  const [isQrOpen, setIsQrOpen] = React.useState(false);
  const handleTriggerInput = () => {
    if (isAdmin) setIsQuickInputOpen(true);
    else { setPendingExpense(false); setIsLoginModalOpen(true); }
  };
  const handleTriggerExpense = () => {
    if (isAdmin) setIsExpenseOpen(true);
    else { setPendingExpense(true); setIsLoginModalOpen(true); }
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
    setSelectedWeek(null);
    router.push(`/?month=${month}&year=${currentYear}`);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    setSelectedWeek(null);
    router.push(`/?month=${currentMonth}&year=${year}`);
  };

  const handleSelectWeek = (week: number | null) => {
    setSelectedWeek(week);
    if (week) {
      router.push(`/?month=${currentMonth}&year=${currentYear}&week=${week}`);
    } else {
      router.push(`/?month=${currentMonth}&year=${currentYear}`);
    }
  };

  const monthName = MONTH_NAMES[currentMonth - 1] || 'September';

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Kas Basecamp · Rp 5.000 / minggu</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-card-foreground sm:text-2xl">
            Dashboard Kas Mingguan
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Pantau akumulasi kas, capaian iuran mingguan, dan unduh rekapan CSV.
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          {isAdmin ? (
            <>
              <Button onClick={handleTriggerInput} className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Input Kas</span>
              </Button>
              <Button onClick={handleTriggerExpense} variant="outline" className="gap-2">
                <TrendingDown className="h-4 w-4" />
                <span>Pengeluaran</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsQrOpen(true)}
              className="gap-2"
            >
              <QrCode className="h-4 w-4" />
              <span>Bayar via QR</span>
            </Button>
          )}
        </div>
      </div>

      <KpiCards
        totalAllTimeAmount={initialData.kpi.totalAllTimeAmount}
        totalAllTimeExpense={initialData.kpi.totalAllTimeExpense}
        netBalanceAllTime={initialData.kpi.netBalanceAllTime}
        totalMonthAmount={initialData.kpi.totalMonthAmount}
        totalMonthExpense={initialData.kpi.totalMonthExpense}
        netBalanceMonth={initialData.kpi.netBalanceMonth}
        monthTxCount={initialData.kpi.monthTxCount}
        monthExpenseCount={initialData.kpi.monthExpenseCount}
        totalCurrentWeekAmount={initialData.kpi.totalCurrentWeekAmount}
        targetWeek={initialData.kpi.targetWeekForKpi}
        uniqueMembersPaidThisWeek={initialData.kpi.uniqueMembersPaidThisWeek}
        activeMembersCount={initialData.kpi.activeMembersCount}
        paymentRatio={initialData.kpi.paymentRatio}
        monthName={monthName}
        year={currentYear}
      />

      <WeeklyCashChart
        data={initialData.weeklyData}
        monthName={monthName}
        year={currentYear}
        selectedWeek={selectedWeek}
        onSelectWeek={handleSelectWeek}
      />

      <TransactionTable
        transactions={initialData.transactions}
        currentMonth={currentMonth}
        currentYear={currentYear}
        selectedWeek={selectedWeek}
        onSelectWeek={handleSelectWeek}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        isAdmin={isAdmin}
      />
      <ExpenseTable expenses={initialData.expenses || []} currentMonth={currentMonth} currentYear={currentYear} isAdmin={isAdmin} />

      <QuickInputModal isOpen={isQuickInputOpen} onClose={() => setIsQuickInputOpen(false)} members={members} currentMonth={currentMonth} currentYear={currentYear} onSuccess={() => router.refresh()} />
      <ExpenseInputModal isOpen={isExpenseOpen} onClose={() => setIsExpenseOpen(false)} onSuccess={() => router.refresh()} />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => { if (pendingExpense) { setPendingExpense(false); setIsExpenseOpen(true); } else setIsQuickInputOpen(true); }}
        title="Login Diperlukan"
        description="Silakan masuk dengan akun pengelola kas."
      />
      <GuestQrModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      {isAdmin ? (
        <div className="fixed bottom-6 right-5 z-40 flex flex-col gap-2 sm:hidden">
          <button onClick={handleTriggerInput} className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer" aria-label="Input Kas">
            <Plus className="h-5 w-5" />
          </button>
          <button onClick={handleTriggerExpense} className="flex h-12 w-12 items-center justify-center rounded-full border bg-card text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer" aria-label="Pengeluaran">
            <TrendingDown className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsQrOpen(true)}
          className="fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer sm:hidden"
          aria-label="Bayar kas via QR"
        >
          <QrCode className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
