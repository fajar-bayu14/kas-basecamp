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
import { BarChart3, TrendingUp } from 'lucide-react';

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
  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as WeeklyDataItem;
      const percentage =
        item.targetAmount > 0
          ? Math.round((item.totalAmount / item.targetAmount) * 100)
          : 0;

      return (
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-xl border border-slate-200 text-xs space-y-1.5 min-w-[170px] pointer-events-none">
          <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center justify-between">
            <span>{item.label}</span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-bold">
              {item.shortLabel}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Total Terkumpul:</span>
            <span className="font-black text-emerald-700 font-mono">
              {formatCurrency(item.totalAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Anggota Bayar:</span>
            <span className="font-semibold text-slate-700 font-mono">
              {item.txCount} Transaksi
            </span>
          </div>
          {item.targetAmount > 0 && (
            <div className="pt-1">
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>Target ({formatCurrency(item.targetAmount)})</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
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
    <Card className="border-slate-200/80 shadow-sm overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Grafik Pemasukan Kas Mingguan
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Periode: {monthName} {year} • Klik batang grafik untuk filter per minggu
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Akumulasi: {formatCurrency(totalSum)}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-6">
        <div className="h-64 sm:h-72 w-full">
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${value / 1000}k` : `${value}`
                }
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar
                dataKey="totalAmount"
                radius={[8, 8, 0, 0]}
                className="cursor-pointer transition-all duration-200"
              >
                {data.map((entry) => {
                  const isSelected = selectedWeek === entry.weekNumber;
                  const isDimmed = selectedWeek && !isSelected;
                  return (
                    <Cell
                      key={`cell-${entry.weekNumber}`}
                      fill={
                        isSelected
                          ? '#047857' // Deep Emerald
                          : isDimmed
                          ? '#a7f3d0' // Light faded emerald
                          : '#059669' // Default vibrant emerald
                      }
                      opacity={isDimmed ? 0.45 : 1}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {selectedWeek && onSelectWeek && (
          <div className="mt-3 flex items-center justify-between text-xs bg-emerald-50/60 border border-emerald-200/60 p-2 px-3 rounded-xl">
            <span className="text-emerald-800 font-medium">
              Filter aktif: <strong>Minggu {selectedWeek}</strong>
            </span>
            <button
              onClick={() => onSelectWeek(null)}
              className="text-emerald-700 hover:text-emerald-900 underline font-semibold cursor-pointer"
            >
              Tampilkan Semua Minggu
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
