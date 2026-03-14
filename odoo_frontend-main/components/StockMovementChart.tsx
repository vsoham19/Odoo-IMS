"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface Movement {
  date: string;
  quantity: number;
  type?: string;
  [key: string]: unknown;
}

interface StockMovementChartProps {
  data: Movement[];
  loading?: boolean;
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 shadow-xl text-sm">
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="font-semibold text-slate-900 dark:text-slate-100">
            {p.name}: <span className="text-sky-600 dark:text-sky-400">{p.value?.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function StockMovementChart({ data, loading }: StockMovementChartProps) {
  // Aggregate by date
  const aggregated = Object.values(
    data.reduce<Record<string, { date: string; quantity: number }>>((acc, m) => {
      const d = m.date?.slice(0, 10) ?? "Unknown";
      acc[d] = { date: d, quantity: (acc[d]?.quantity ?? 0) + (m.quantity ?? 0) };
      return acc;
    }, {})
  ).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card className="border-slate-200 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-sky-500/10 p-2">
            <TrendingUp size={16} className="text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Stock Movement Trend
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Quantity moved over time</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <div className="h-64 rounded-lg bg-slate-200 dark:bg-slate-800/50 animate-pulse" />
        ) : aggregated.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-600 text-sm">
            No movement data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={aggregated} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="quantity"
                name="Quantity"
                stroke="#38bdf8"
                strokeWidth={2}
                fill="url(#stockGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#38bdf8", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
