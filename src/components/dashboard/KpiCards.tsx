'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Wallet, Calendar, CalendarCheck, ArrowUpRight, TrendingDown, Scale } from 'lucide-react';

interface KpiCardsProps {
  totalAllTimeAmount: number;
  totalAllTimeExpense?: number;
  netBalanceAllTime?: number;
  totalMonthAmount: number;
  totalMonthExpense?: number;
  netBalanceMonth?: number;
  monthTxCount?: number;
  monthExpenseCount?: number;
  totalCurrentWeekAmount: number;
  targetWeek: number;
  uniqueMembersPaidThisWeek: number;
  activeMembersCount: number;
  paymentRatio: number;
  monthName: string;
  year?: number;
}

export function KpiCards({
  totalAllTimeAmount,
  totalAllTimeExpense = 0,
  netBalanceAllTime,
  totalMonthAmount,
  totalMonthExpense = 0,
  netBalanceMonth,
  monthTxCount = 0,
  monthExpenseCount = 0,
  totalCurrentWeekAmount,
  targetWeek,
  uniqueMembersPaidThisWeek,
  activeMembersCount,
  paymentRatio,
  monthName,
  year,
}: KpiCardsProps) {
  const netAll = netBalanceAllTime ?? totalAllTimeAmount - totalAllTimeExpense;
  const netMonth = netBalanceMonth ?? totalMonthAmount - totalMonthExpense;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. Total Keseluruhan Kas (All-Time) */}
      <Card className="border-emerald-200/60 bg-gradient-to-br from-white to-emerald-50/40 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
        <CardHeader className="p-4 sm:p-5 pb-1 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Keseluruhan Kas
          </CardTitle>
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Wallet className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 pt-2">
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
            {formatCurrency(totalAllTimeAmount)}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>Akumulasi saldo kas fisik (seluruh periode)</span>
          </p>
        </CardContent>
      </Card>

      {/* 2. Total Kas Bulan Berdasarkan Filter */}
      <Card className="border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
        <CardHeader className="p-4 sm:p-5 pb-1 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Kas ({monthName})
          </CardTitle>
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Calendar className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 pt-2">
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
            {formatCurrency(totalMonthAmount)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center justify-between">
            <span>{monthTxCount} setoran tercatat</span>
            <span className="text-indigo-700 font-semibold">{monthName} {year || ''}</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Kas Minggu Berjalan / Terpilih */}
      <Card className="border-slate-200/80 bg-white shadow-sm relative overflow-hidden">
        <CardHeader className="p-4 sm:p-5 pb-1 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Kas Minggu ke-{targetWeek}
          </CardTitle>
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 pt-2">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {formatCurrency(totalCurrentWeekAmount)}
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {paymentRatio}% lunas
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {uniqueMembersPaidThisWeek} dari {activeMembersCount} anggota telah membayar
          </p>
        </CardContent>
      </Card>

      <Card className="border-red-200/60 bg-gradient-to-br from-white to-red-50/40 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 w-20 h-20 bg-red-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
        <CardHeader className="p-4 sm:p-5 pb-1 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Pengeluaran ({monthName})</CardTitle>
          <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs"><TrendingDown className="w-4 h-4" /></div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 pt-2">
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">{formatCurrency(totalMonthExpense)}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">{monthExpenseCount} pengeluaran tercatat</p>
        </CardContent>
      </Card>

      <Card className={`${netMonth >= 0 ? 'border-emerald-200/60 bg-gradient-to-br from-white to-emerald-50/40' : 'border-red-200/60 bg-gradient-to-br from-white to-red-50/40'} shadow-sm relative overflow-hidden group`}>
        <div className={`absolute right-0 top-0 translate-x-2 -translate-y-2 w-20 h-20 ${netMonth >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'} rounded-full blur-xl`} />
        <CardHeader className="p-4 sm:p-5 pb-1 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Saldo Bersih ({monthName})</CardTitle>
          <div className={`w-8 h-8 rounded-xl ${netMonth >= 0 ? 'bg-emerald-600' : 'bg-red-600'} text-white flex items-center justify-center shadow-xs`}><Scale className="w-4 h-4" /></div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 pt-2">
          <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${netMonth >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{formatCurrency(netMonth)}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">All-time: {formatCurrency(netAll)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
