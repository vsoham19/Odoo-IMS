"use client";

import { useEffect, useState } from "react";
import { useInventoryStore } from "@/store/inventoryStore";
import { DemandForecastChart, InventoryTurnoverChart } from "@/components/charts";
import api from "@/lib/api";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const mockTrends = [
  { month: "Jan", stockLevel: 1400, demand: 800 },
  { month: "Feb", stockLevel: 1200, demand: 950 },
  { month: "Mar", stockLevel: 1500, demand: 1100 },
  { month: "Apr", stockLevel: 1300, demand: 1250 },
  { month: "May", stockLevel: 1600, demand: 1400 },
  { month: "Jun", stockLevel: 1800, demand: 1550 },
];

export default function AnalyticsPage() {
  const { trends, setTrends } = useInventoryStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard");
        const trends = res.data.trends;
        setTrends(trends && trends.length > 0 ? trends : mockTrends);
      } catch (error) {
        setTrends(mockTrends);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setTrends]);

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Analytics & Reports</h2>
          <p className="text-muted-foreground text-gray-500">Deep dive into your inventory data and trends.</p>
        </div>
        <Button 
          variant="outline" 
          className="bg-white"
          onClick={() => toast.success("Analytics report downlading started.")}
        >
          <Download className="mr-2 h-4 w-4" /> Download Report
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#714B67]" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DemandForecastChart data={trends} />
            <InventoryTurnoverChart data={trends} />
          </div>
        </div>
      )}
    </div>
  );
}
