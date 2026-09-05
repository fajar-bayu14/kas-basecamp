'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Wallet, CalendarCheck, Users, ArrowUpRight } from 'lucide-react';

interface KpiCardsProps {
  totalMonthAmount: number;
  totalCurrentWeekAmount: number;
  targetWeek: number;
  uniqueMembersPaidThisWeek: number;
  activeMembersCount: number;
  paymentRatio: number;
  monthName: string;
}

export function KpiCards({
  totalMonthAmount,
  totalCurrentWeekAmount,
  targetWeek,
  uniqueMembersPaidThisWeek,
  activeMembersCount,
  paymentRatio,
  monthName,
}: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Kas Bulan Ini */}
      <Card className="border-emerald-200/60 bg-gradient-to-br from-white to-emerald-50/40 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
        <CardHeader className="p-4 sm:p-5 pb-1 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Kas ({monthName})
          </CardTitle>
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Wallet className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 pt-2">
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
            {formatCurrency(totalMonthAmount)}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>Akumulasi kas masuk bulan berjalan</span>
          </p>
        </CardContent>
      </Card>

      {/* 2. Kas Minggu Berjalan */}
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
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
            {formatCurrency(totalCurrentWeekAmount)}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Target: {formatCurrency(activeMembersCount * 5000)} (100% lunas)
          </p>
        </CardContent>
      </Card>

      {/* 3. Rasio Anggota Lunas */}
      <Card className="border-slate-200/80 bg-white shadow-sm relative overflow-hidden">
        <CardHeader className="p-4 sm:p-5 pb-1 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Ketercapaian Minggu {targetWeek}
          </CardTitle>
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Users className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 pt-2">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {paymentRatio}%
            </div>
            <span className="text-xs font-semibold text-slate-600">
              {uniqueMembersPaidThisWeek} / {activeMembersCount} Anggota
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                paymentRatio >= 80
                  ? 'bg-emerald-500'
                  : paymentRatio >= 50
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(paymentRatio, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
