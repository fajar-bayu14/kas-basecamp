'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total keseluruhan kas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold tracking-tight text-card-foreground">
            {formatCurrency(totalAllTimeAmount)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Akumulasi seluruh periode</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total kas {monthName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold tracking-tight text-card-foreground">
            {formatCurrency(totalMonthAmount)}
          </div>
          <p className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>{monthTxCount} setoran</span>
            <span className="text-muted-foreground">{monthName} {year || ''}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Kas minggu ke-{targetWeek}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-xl font-semibold tracking-tight text-card-foreground">
              {formatCurrency(totalCurrentWeekAmount)}
            </div>
            <span className="rounded-md border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {paymentRatio}% lunas
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {uniqueMembersPaidThisWeek} dari {activeMembersCount} anggota
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pengeluaran {monthName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold tracking-tight text-card-foreground">{formatCurrency(totalMonthExpense)}</div>
          <p className="mt-1 text-xs text-muted-foreground">{monthExpenseCount} pengeluaran</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Saldo bersih {monthName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold tracking-tight text-card-foreground">{formatCurrency(netMonth)}</div>
          <p className="mt-1 text-xs text-muted-foreground">All-time: {formatCurrency(netAll)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
