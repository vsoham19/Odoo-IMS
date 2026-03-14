"use client";

import { useInventoryStore } from "@/store/inventoryStore";
import { InventoryStats } from "@/types/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, ArrowUpRight, BellRing } from "lucide-react";

export function KpiCards({ stats }: { stats: InventoryStats | null }) {
  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white/50 border-gray-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-md transition-shadow border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
          <div className="p-2 bg-[#714B67]/10 rounded-lg">
            <Package className="h-4 w-4 text-[#714B67]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1 text-[#017E84] flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1" /> +20.1% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Low Stock Items</CardTitle>
          <div className="p-2 bg-orange-50 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.lowStockItems}</div>
          <p className="text-xs text-muted-foreground mt-1 text-gray-500">
            Needs attention soon
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          <div className="p-2 bg-[#017E84]/10 rounded-lg">
            <span className="text-[#017E84] font-bold">$</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1 text-[#017E84] flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1" /> +15.2% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Active Alerts</CardTitle>
          <div className="p-2 bg-rose-50 rounded-lg">
            <BellRing className="h-4 w-4 text-rose-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAlerts}</div>
          <p className="text-xs text-muted-foreground mt-1 text-rose-600">
            {stats.totalAlerts > 0 ? "Requires review" : "All good"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/* cache buster */