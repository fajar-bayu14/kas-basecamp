'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface WeeklyDataItem {
  weekNumber: number;
  label: string;
  shortLabel: string;
  totalAmount: number;
  txCount: number;
  targetAmount: number;
}

interface WeeklyCashChartProps {
  data: WeeklyDataItem[];
  monthName: string;
  year: number;
  selectedWeek?: number | null;
  onSelectWeek?: (weekNumber: number | null) => void;
}

export function WeeklyCashChart({
  data,
  monthName,
  year,
  selectedWeek,
  onSelectWeek,
}: WeeklyCashChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as WeeklyDataItem;
      const percentage =
        item.targetAmount > 0
          ? Math.round((item.totalAmount / item.targetAmount) * 100)
          : 0;
      return (
        <div className="min-w-[160px] space-y-1.5 rounded-md border bg-card p-3 text-xs">
          <div className="flex items-center justify-between border-b pb-1 font-medium text-card-foreground">
            <span>{item.label}</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{item.shortLabel}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Terkumpul</span>
            <span className="font-semibold text-card-foreground">{formatCurrency(item.totalAmount)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Transaksi</span>
            <span className="font-medium text-card-foreground">{item.txCount}</span>
          </div>
          {item.targetAmount > 0 && (
            <div className="pt-1">
              <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                <span>{formatCurrency(item.targetAmount)}</span>
                <span>{percentage}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${Math.min(percentage, 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const totalSum = data.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-card-foreground">Pemasukan mingguan</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {monthName} {year} · Klik batang untuk filter
          </p>
        </div>
        <div className="self-start rounded-md border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground sm:self-auto">
          Akumulasi: {formatCurrency(totalSum)}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-6">
        <div className="h-64 w-full sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              onClick={(state: any) => {
                if (state && state.activePayload && state.activePayload.length && onSelectWeek) {
                  const clickedWeek = state.activePayload[0].payload.weekNumber;
                  onSelectWeek(selectedWeek === clickedWeek ? null : clickedWeek);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
              <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: 'var(--border)' }} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={{ stroke: 'var(--border)' }} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : `${value}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.5 }} />
              <Bar dataKey="totalAmount" radius={[4, 4, 0, 0]} className="cursor-pointer">
                {data.map((entry) => {
                  const isSelected = selectedWeek === entry.weekNumber;
                  const isDimmed = selectedWeek !== null && !isSelected;
                  return (
                    <Cell
                      key={`cell-${entry.weekNumber}`}
                      fill={isSelected ? 'var(--accent)' : isDimmed ? 'var(--muted)' : 'var(--muted-foreground)'}
                      opacity={isSelected ? 1 : isDimmed ? 0.35 : 0.85}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {selectedWeek !== null && onSelectWeek && (
          <div className="mt-3 flex items-center justify-between rounded-md border bg-muted px-3 py-2 text-xs">
            <span className="font-medium text-muted-foreground">Filter: Minggu {selectedWeek}</span>
            <button onClick={() => onSelectWeek(null)} className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Tampilkan semua
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
