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
import { Plus, Wallet, Sparkles, Lock, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

  // Active filter state
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
  const handleTriggerInput = () => {
    if (isAdmin) setIsQuickInputOpen(true);
    else { setPendingExpense(false); setIsLoginModalOpen(true); }
  };
  const handleTriggerExpense = () => {
    if (isAdmin) setIsExpenseOpen(true);
    else { setPendingExpense(true); setIsLoginModalOpen(true); }
  };

  // Month & Year handlers: update state and navigate
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
    <div className="space-y-6">
      {/* Top Banner / Welcome Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg shadow-emerald-700/15 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-emerald-100 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Kas Basecamp • Rp 5.000 / Minggu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Dashboard Kas Mingguan
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-lg">
            Pantau akumulasi kas, periksa ketercapaian iuran mingguan, dan unduh rekapan data instan ke file CSV.
          </p>
        </div>

        <div className="relative z-10 flex gap-2 self-start sm:self-auto flex-wrap">
          <Button onClick={handleTriggerInput} size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50 shadow-md font-bold text-sm sm:text-base rounded-2xl gap-2 border border-emerald-100">
            {isAdmin ? <Plus className="w-5 h-5 text-emerald-600" /> : <Lock className="w-4 h-4 text-emerald-600" />}<span>Input Kas</span>
          </Button>
          <Button onClick={handleTriggerExpense} size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-red-700 font-bold text-sm sm:text-base rounded-2xl gap-2 backdrop-blur">
            {isAdmin ? <TrendingDown className="w-5 h-5" /> : <Lock className="w-4 h-4" />}<span>Pengeluaran</span>
          </Button>
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

      {/* 2. Interactive Weekly Chart (graphify) */}
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

      <div className="fixed right-5 bottom-6 z-40 sm:hidden flex flex-col gap-3">
        <button onClick={handleTriggerInput} className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-600/40 hover:bg-emerald-700 active:scale-95 transition-all" aria-label="Input Kas">
          {isAdmin ? <Plus className="w-7 h-7" /> : <Lock className="w-6 h-6" />}
        </button>
        <button onClick={handleTriggerExpense} className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-600/40 hover:bg-red-700 active:scale-95 transition-all" aria-label="Pengeluaran">
          {isAdmin ? <TrendingDown className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}
