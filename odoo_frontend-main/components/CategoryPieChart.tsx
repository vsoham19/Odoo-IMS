"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { LayoutGrid } from "lucide-react";

interface Product {
  category?: string;
  [key: string]: unknown;
}

interface CategoryPieChartProps {
  data: Product[];
  loading?: boolean;
}

const PALETTE = [
  "#38bdf8", "#818cf8", "#34d399", "#fb923c",
  "#f472b6", "#facc15", "#a78bfa", "#2dd4bf",
];

function CustomTooltip({ active, payload }: any) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 shadow-xl text-sm">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{payload[0].name}</p>
        <p className="text-slate-500 dark:text-slate-400">
          {payload[0].value} product{payload[0].value !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }
  return null;
}

function CustomLegend({ payload }: any) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center">
      {payload?.map((entry: any, i: number) => (
        <li key={i} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span
            className="inline-block h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
}

export function CategoryPieChart({ data, loading }: CategoryPieChartProps) {
  const categoryMap = data.reduce<Record<string, number>>((acc, p) => {
    const cat = (p.category as string) || "Uncategorized";
    acc[cat] = (acc[cat] ?? 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  return (
    <Card className="border-slate-200 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm h-full">
      <CardHeader className="pb-2 flex flex-row items-center gap-2">
        <div className="rounded-lg bg-violet-500/10 p-2">
          <LayoutGrid size={16} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Category Distribution
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Products by category</p>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <div className="h-64 rounded-lg bg-slate-200 dark:bg-slate-800/50 animate-pulse" />
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-600 text-sm">
            No category data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
