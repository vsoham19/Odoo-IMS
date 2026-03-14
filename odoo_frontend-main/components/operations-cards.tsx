"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageOpen, Truck, Clock } from "lucide-react";
import { OperationMetrics } from "@/types/inventory";

interface OperationsCardsProps {
  metrics: OperationMetrics | null;
}

export function OperationsCards({ metrics }: OperationsCardsProps) {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse bg-gray-50 h-32 border-dashed" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="shadow-sm border-[#017E84]/20 bg-[#017E84]/5 transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-[#017E84] text-sm font-semibold flex items-center gap-2">
            <PackageOpen className="h-4 w-4" />
            Receipt Operations
          </CardTitle>
          <span className="text-xs bg-[#017E84]/10 text-[#017E84] px-2 py-1 rounded-full font-medium">
            {metrics.receipt.total} Total
          </span>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mt-2">
            <div>
              <p className="text-2xl font-bold text-[#017E84]">{metrics.receipt.toReceive}</p>
              <p className="text-xs text-[#017E84]/70 font-medium">To Receive</p>
            </div>
            <div className="h-8 w-px bg-[#017E84]/20" />
            <div className="flex items-center gap-2">
              <div className="p-1 bg-rose-100 rounded-full">
                <Clock className="w-3 h-3 text-rose-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-rose-600 leading-none">{metrics.receipt.late}</p>
                <p className="text-[10px] text-rose-600/70 font-semibold uppercase tracking-wider">Late</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-[#714B67]/20 bg-[#714B67]/5 transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-[#714B67] text-sm font-semibold flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Delivery Operations
          </CardTitle>
          <span className="text-xs bg-[#714B67]/10 text-[#714B67] px-2 py-1 rounded-full font-medium">
            {metrics.delivery.total} Total
          </span>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mt-2">
            <div>
              <p className="text-2xl font-bold text-[#714B67]">{metrics.delivery.toDeliver}</p>
              <p className="text-xs text-[#714B67]/70 font-medium">To Deliver</p>
            </div>
            <div className="h-8 w-px bg-[#714B67]/20" />
            <div className="flex items-center gap-2">
              <div className="p-1 bg-amber-100 rounded-full">
                <Clock className="w-3 h-3 text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-amber-600 leading-none">{metrics.delivery.waiting}</p>
                <p className="text-[10px] text-amber-600/70 font-semibold uppercase tracking-wider">Waiting</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
