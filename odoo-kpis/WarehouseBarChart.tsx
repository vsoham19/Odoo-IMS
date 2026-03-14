"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Warehouse } from "lucide-react";

interface InventoryItem {
  warehouse?: string;
  warehouse_name?: string;
  quantity?: number;
  [key: string]: unknown;
}

interface WarehouseBarChartProps {
  data: InventoryItem[];
  loading?: boolean;
}

const BAR_COLORS = ["#38bdf8", "#818cf8", "#34d399", "#fb923c", "#f472b6"];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl text-sm">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="font-semibold text-slate-100">
          Stock: <span className="text-emerald-400">{payload[0].value?.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
}

export function WarehouseBarChart({ data, loading }: WarehouseBarChartProps) {
  const warehouseMap = data.reduce<Record<string, number>>((acc, item) => {
    const wh = (item.warehouse_name as string) || (item.warehouse as string) || "Unknown";
    acc[wh] = (acc[wh] ?? 0) + (item.quantity ?? 0);
    return acc;
  }, {});

  const chartData = Object.entries(warehouseMap)
    .map(([name, stock]) => ({ name, stock }))
    .sort((a, b) => b.stock - a.stock);

  return (
    <Card className="border-slate-700/60 bg-slate-900/80 backdrop-blur-sm h-full">
      <CardHeader className="pb-2 flex flex-row items-center gap-2">
        <div className="rounded-lg bg-emerald-500/10 p-2">
          <Warehouse size={16} className="text-emerald-400" />
        </div>
        <div>
          <CardTitle className="text-sm font-semibold text-slate-200">
            Warehouse Stock
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Total units per warehouse</p>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <div className="h-64 rounded-lg bg-slate-800/50 animate-pulse" />
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-600 text-sm">
            No warehouse data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="stock" radius={[4, 4, 0, 0]} maxBarSize={60}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
