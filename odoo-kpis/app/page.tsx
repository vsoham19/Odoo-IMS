"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Package,
  Layers,
  AlertCircle,
  Truck,
  ClipboardList,
  IndianRupee,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/KPICard";
import { StockMovementChart } from "@/components/StockMovementChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { WarehouseBarChart } from "@/components/WarehouseBarChart";
import { SmartInsights } from "@/components/SmartInsights";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  getProducts,
  getInventory,
  getDeliveries,
  getReceipts,
  getMovements,
} from "@/services/api";

/* ---------- types ---------- */
interface Product {
  id?: string | number;
  name?: string;
  quantity?: number;
  reorder_level?: number;
  price?: number;
  category?: string;
  [key: string]: unknown;
}
interface InventoryItem {
  quantity?: number;
  product?: { price?: number };
  price?: number;
  warehouse?: string;
  warehouse_name?: string;
  [key: string]: unknown;
}
interface Delivery {
  status?: string;
  [key: string]: unknown;
}
interface Receipt {
  status?: string;
  [key: string]: unknown;
}
interface Movement {
  date?: string;
  quantity?: number;
  product_id?: string | number;
  [key: string]: unknown;
}

interface DashboardData {
  products: Product[];
  inventory: InventoryItem[];
  deliveries: Delivery[];
  receipts: Receipt[];
  movements: Movement[];
}

/* ---------- helpers ---------- */
function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: n >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(n);
}

/* ---------- page ---------- */
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    products: [],
    inventory: [],
    deliveries: [],
    receipts: [],
    movements: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [products, inventory, deliveries, receipts, movements] = await Promise.all([
        getProducts(),
        getInventory(),
        getDeliveries(),
        getReceipts(),
        getMovements(),
      ]);
      setData({ products, inventory, deliveries, receipts, movements });
      setLastUpdated(new Date());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to fetch dashboard data.";
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* ---- KPI calculations ---- */
  const totalProducts = data.products.length;

  const totalStockQty = data.inventory.reduce(
    (s, i) => s + (i.quantity ?? 0),
    0
  );

  const lowStockCount = data.products.filter(
    (p) => (p.quantity ?? 0) < (p.reorder_level ?? 0)
  ).length;

  const pendingDeliveries = data.deliveries.filter(
    (d) => d.status?.toLowerCase() === "pending"
  ).length;

  const pendingReceipts = data.receipts.filter(
    (r) => r.status?.toLowerCase() === "pending"
  ).length;

  const inventoryValue = data.inventory.reduce((sum, item) => {
    const price = item.price ?? (item.product as Product)?.price ?? 0;
    return sum + (item.quantity ?? 0) * price;
  }, 0);

  const kpis = [
    {
      title: "Total Products",
      value: fmt(totalProducts),
      subtitle: "Unique SKUs in system",
      icon: Package,
      variant: "default" as const,
    },
    {
      title: "Total Stock Qty",
      value: fmt(totalStockQty),
      subtitle: "Units across all warehouses",
      icon: Layers,
      variant: "default" as const,
    },
    {
      title: "Low Stock Products",
      value: fmt(lowStockCount),
      subtitle: "Below reorder level",
      icon: AlertCircle,
      variant: lowStockCount > 0 ? ("danger" as const) : ("success" as const),
    },
    {
      title: "Pending Deliveries",
      value: fmt(pendingDeliveries),
      subtitle: "Awaiting fulfillment",
      icon: Truck,
      variant: pendingDeliveries > 5 ? ("warning" as const) : ("default" as const),
    },
    {
      title: "Pending Receipts",
      value: fmt(pendingReceipts),
      subtitle: "Awaiting confirmation",
      icon: ClipboardList,
      variant: pendingReceipts > 5 ? ("warning" as const) : ("default" as const),
    },
    {
      title: "Inventory Value",
      value: fmtCurrency(inventoryValue),
      subtitle: "Total stock valuation",
      icon: IndianRupee,
      variant: "success" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#080c14] dark:text-slate-100 transition-colors">
      {/* Background texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ---- Header ---- */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-5 w-1 rounded-full bg-sky-500 dark:bg-sky-400" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Inventory Dashboard
              </h1>
            </div>
            <p className="text-sm text-slate-500 pl-3">
              {lastUpdated
                ? `Last updated ${lastUpdated.toLocaleTimeString()}`
                : "Loading data…"}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 sm:flex-nowrap">
            {error && (
              <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs text-rose-600 dark:text-rose-400">
                {error}
              </span>
            )}
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAll(true)}
              disabled={refreshing}
              className="border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 gap-2"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>
        </div>

        {/* ---- KPI Grid ---- */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {kpis.map((kpi) => (
            <KPICard key={kpi.title} {...kpi} loading={loading} />
          ))}
        </div>

        {/* ---- Stock Movement Chart ---- */}
        <div className="mb-6">
          <StockMovementChart data={data.movements} loading={loading} />
        </div>

        {/* ---- Pie + Bar Charts ---- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
          <CategoryPieChart data={data.products} loading={loading} />
          <WarehouseBarChart data={data.inventory} loading={loading} />
        </div>

        {/* ---- Smart Insights ---- */}
        <SmartInsights
          products={data.products}
          movements={data.movements}
          loading={loading}
        />

        {/* ---- Footer ---- */}
        <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-700">
          Inventory Management System &mdash; Analytics Dashboard
        </div>
      </div>
    </div>
  );
}
