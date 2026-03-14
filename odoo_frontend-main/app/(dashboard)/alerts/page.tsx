"use client";

import { useEffect, useState } from "react";
import { useAlertStore } from "@/store/alertStore";
import { AlertPanel } from "@/components/alert-panel";
import api from "@/lib/api";
import { Loader2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockAlerts = [
  { id: "1", productId: "PROD-001", productName: "Wireless Headphones", type: "low_stock", severity: "high", message: "Stock is below reorder point (5 < 10)", timestamp: "2 hours ago", resolved: false },
  { id: "2", productId: "PROD-002", productName: "Mechanical Keyboard", type: "demand_spike", severity: "medium", message: "Demand increased by 40% this week", timestamp: "5 hours ago", resolved: false },
  { id: "3", productId: "PROD-003", productName: "Webcam 1080p", type: "overstock", severity: "low", message: "Excess inventory based on recent sales", timestamp: "1 day ago", resolved: false },
  { id: "4", productId: "PROD-004", productName: "USB-C Hub", type: "low_stock", severity: "critical", message: "Out of stock! Demand is high.", timestamp: "2 days ago", resolved: true },
] as any;

export default function AlertsPage() {
  const { alerts, setAlerts } = useAlertStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get("/alerts");
        setAlerts(res.data);
      } catch (error) {
        // Mock fallback
        setAlerts(mockAlerts);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [setAlerts]);

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Alerts & Notifications</h2>
          <p className="text-muted-foreground text-gray-500">Review stock warnings, demand anomalies, and reorder notices.</p>
        </div>
        <Button variant="outline" className="bg-white">
          <Settings2 className="mr-2 h-4 w-4" /> Configure Rules
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#714B67]" />
        </div>
      ) : (
        <div className="max-w-3xl">
          <AlertPanel alerts={alerts} />
        </div>
      )}
    </div>
  );
}
