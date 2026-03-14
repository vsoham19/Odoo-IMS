"use client";

import { Alert } from "@/types/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell, AlertCircle, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAlertStore } from "@/store/alertStore";
import { toast } from "sonner";

export function AlertPanel({ alerts }: { alerts: Alert[] }) {
  const { resolveAlert } = useAlertStore();
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "overstock":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "demand_spike":
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "critical": return "border-rose-200 bg-rose-50";
      case "high": return "border-orange-200 bg-orange-50";
      case "medium": return "border-yellow-200 bg-yellow-50";
      default: return "border-blue-100 bg-blue-50";
    }
  };

  return (
    <Card className="col-span-3 border-gray-100 shadow-sm">
      <CardHeader className="pb-3 border-b border-gray-50 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#714B67]" />
          Recent Alerts
        </CardTitle>
        <span className="bg-[#714B67]/10 text-[#714B67] text-xs font-bold px-2 py-1 rounded-full">
          {alerts.filter(a => !a.resolved).length} New
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 transition flex gap-3 ${alert.resolved ? 'opacity-50 grayscale' : 'hover:bg-gray-50'}`}>
              <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{alert.productName}</p>
                    {alert.type === "low_stock" && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide">Waiting Stock</span>
                    )}
                    {alert.type === "demand_spike" && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide">Late Delivery</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{alert.timestamp}</span>
                </div>
                <p className="text-sm text-gray-500">{alert.message}</p>
                {!alert.resolved && (
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-xs font-medium"
                      onClick={() => {
                        resolveAlert(alert.id);
                        toast.success(`Alert "${alert.productName}" marked as reviewed.`);
                      }}
                    >
                      Review
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2" />
              <p>No active alerts</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
