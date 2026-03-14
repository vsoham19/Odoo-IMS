"use client";

import { TrendData } from "@/types/inventory";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function DemandForecastChart({ data }: { data: TrendData[] }) {
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-4 border-gray-100">
        <CardHeader>
          <CardTitle>Demand Forecast</CardTitle>
          <CardDescription>Stock vs Demand over the next 6 months</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center bg-gray-50/50 rounded-md mx-6 mb-6">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#714B67]" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-4 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-gray-800">Demand Forecast</CardTitle>
        <CardDescription>Predicted demand vs current stock levels</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#714B67" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#714B67" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#017E84" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#017E84" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Area type="monotone" dataKey="stockLevel" name="Stock Level" stroke="#714B67" strokeWidth={3} fillOpacity={1} fill="url(#colorStock)" />
            <Area type="monotone" dataKey="demand" name="Predicted Demand" stroke="#017E84" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function InventoryTurnoverChart({ data }: { data: TrendData[] }) {
  return (
    <Card className="col-span-4 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-gray-800">Inventory Turnover</CardTitle>
        <CardDescription>Monthly turnover rates</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend />
            <Bar dataKey="demand" name="Units Sold" fill="#017E84" radius={[4, 4, 0, 0]} />
            <Bar dataKey="stockLevel" name="Stock Remaining" fill="#8F8F8F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/* cache buster */