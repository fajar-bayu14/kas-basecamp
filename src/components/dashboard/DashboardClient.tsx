'use client';

import * as React from 'react';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { WeeklyCashChart } from '@/components/dashboard/WeeklyCashChart';
import { TransactionTable } from '@/components/dashboard/TransactionTable';
import { QuickInputModal } from '@/components/dashboard/QuickInputModal';
import { Button } from '@/components/ui/button';
import { Plus, Wallet, Sparkles } from 'lucide-react';
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
      totalMonthAmount: number;
      totalCurrentWeekAmount: number;
      targetWeekForKpi: number;
      uniqueMembersPaidThisWeek: number;
      activeMembersCount: number;
      paymentRatio: number;
    };
    weeklyData: {
      weekNumber: number;
      label: string;
      shortLabel: string;
      totalAmount: number;
      txCount: number;
      targetAmount: number;
    }[];
    transactions: any[];
    period: {
      month: number;
      year: number;
      week: number | null;
    };
  };
  members: {
    id: number;
    name: string;
    isActive: boolean;
  }[];
}

export function DashboardClient({
  initialData,
  members,
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

  // Quick Input Modal state
  const [isQuickInputOpen, setIsQuickInputOpen] = React.useState(false);

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

        <Button
          onClick={() => setIsQuickInputOpen(true)}
          size="lg"
          className="relative z-10 bg-white text-emerald-800 hover:bg-emerald-50 shadow-md font-bold text-sm sm:text-base self-start sm:self-auto rounded-2xl gap-2 border border-emerald-100"
        >
          <Plus className="w-5 h-5 text-emerald-600" />
          <span>Input Kas Cepat</span>
        </Button>
      </div>

      {/* 1. KPI Summary Cards */}
      <KpiCards
        totalMonthAmount={initialData.kpi.totalMonthAmount}
        totalCurrentWeekAmount={initialData.kpi.totalCurrentWeekAmount}
        targetWeek={initialData.kpi.targetWeekForKpi}
        uniqueMembersPaidThisWeek={initialData.kpi.uniqueMembersPaidThisWeek}
        activeMembersCount={initialData.kpi.activeMembersCount}
        paymentRatio={initialData.kpi.paymentRatio}
        monthName={monthName}
      />

      {/* 2. Interactive Weekly Chart (graphify) */}
      <WeeklyCashChart
        data={initialData.weeklyData}
        monthName={monthName}
        year={currentYear}
        selectedWeek={selectedWeek}
        onSelectWeek={handleSelectWeek}
      />

      {/* 3. Transaction Table & Filter Module */}
      <TransactionTable
        transactions={initialData.transactions}
        currentMonth={currentMonth}
        currentYear={currentYear}
        selectedWeek={selectedWeek}
        onSelectWeek={handleSelectWeek}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />

      {/* 4. Quick Input Modal Dialog / Mobile Bottom Sheet */}
      <QuickInputModal
        isOpen={isQuickInputOpen}
        onClose={() => setIsQuickInputOpen(false)}
        members={members}
        currentMonth={currentMonth}
        currentYear={currentYear}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* 5. Mobile Floating Action Button (FAB) - Touch-friendly quick entry */}
      <div className="fixed right-5 bottom-6 z-40 sm:hidden">
        <button
          onClick={() => setIsQuickInputOpen(true)}
          className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-600/40 hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
          aria-label="Input Kas Cepat"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
