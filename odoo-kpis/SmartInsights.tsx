"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Zap, Archive, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id?: string | number;
  name?: string;
  quantity?: number;
  reorder_level?: number;
  price?: number;
  [key: string]: unknown;
}

interface Movement {
  product_id?: string | number;
  date?: string;
  quantity?: number;
  [key: string]: unknown;
}

interface SmartInsightsProps {
  products: Product[];
  movements: Movement[];
  loading?: boolean;
}

interface InsightItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
}

export function SmartInsights({ products, movements, loading }: SmartInsightsProps) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Low stock alerts
  const lowStockProducts = products.filter(
    (p) => (p.quantity ?? 0) < (p.reorder_level ?? 0)
  );

  // Fast moving product (most quantity moved in 30 days)
  const recentMovements = movements.filter(
    (m) => m.date && new Date(m.date) >= thirtyDaysAgo
  );
  const movementByProduct = recentMovements.reduce<Record<string, number>>((acc, m) => {
    const id = String(m.product_id ?? "unknown");
    acc[id] = (acc[id] ?? 0) + (m.quantity ?? 0);
    return acc;
  }, {});

  const fastMovingId = Object.entries(movementByProduct).sort((a, b) => b[1] - a[1])[0]?.[0];
  const fastMovingProduct = products.find((p) => String(p.id) === fastMovingId);

  // Dead stock: products with no movement in 30 days
  const activeProductIds = new Set(recentMovements.map((m) => String(m.product_id)));
  const deadStockProducts = products.filter((p) => !activeProductIds.has(String(p.id)));

  const insights: InsightItem[] = [
    {
      icon: <AlertTriangle size={18} />,
      label: "Low Stock Alerts",
      value: String(lowStockProducts.length),
      sub:
        lowStockProducts.length > 0
          ? `${lowStockProducts.slice(0, 2).map((p) => p.name || "Product").join(", ")}${lowStockProducts.length > 2 ? ` +${lowStockProducts.length - 2} more` : ""}`
          : "All products well stocked",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: <Zap size={18} />,
      label: "Fast Moving Product",
      value: fastMovingProduct ? (fastMovingProduct.name as string) || "—" : "—",
      sub: fastMovingId
        ? `${(movementByProduct[fastMovingId] ?? 0).toLocaleString()} units moved in 30 days`
        : "No movement data available",
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
    },
    {
      icon: <Archive size={18} />,
      label: "Dead Stock Products",
      value: String(deadStockProducts.length),
      sub:
        deadStockProducts.length > 0
          ? `${deadStockProducts.slice(0, 2).map((p) => p.name || "Product").join(", ")}${deadStockProducts.length > 2 ? ` +${deadStockProducts.length - 2} more` : ""}`
          : "All products have recent movement",
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <Card className="border-slate-700/60 bg-slate-900/80 backdrop-blur-sm">
      <CardHeader className="pb-3 flex flex-row items-center gap-2">
        <div className="rounded-lg bg-violet-500/10 p-2">
          <Brain size={16} className="text-violet-400" />
        </div>
        <div>
          <CardTitle className="text-sm font-semibold text-slate-200">Smart Insights</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">AI-driven inventory intelligence</p>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-slate-800/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {insights.map((ins, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl border p-4 transition-all duration-200 hover:scale-[1.01]",
                  ins.bg
                )}
              >
                <div className={cn("mb-2", ins.color)}>{ins.icon}</div>
                <p className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-1">
                  {ins.label}
                </p>
                <p className={cn("text-lg font-bold leading-tight mb-1 truncate", ins.color)}>
                  {ins.value}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{ins.sub}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
