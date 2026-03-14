export type AlertType = "low_stock" | "overstock" | "demand_spike";
export type AlertSeverity = "low" | "medium" | "high" | "critical";

export interface Alert {
  id: string;
  productId: string;
  productName: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  resolved: boolean;
}
