export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  demand: number;
  reorderPoint: number;
  supplier: string;
  status: ProductStatus;
  price: number;
  cost?: number; // Added for product management
}

export interface InventoryStats {
  totalProducts: number;
  lowStockItems: number;
  totalRevenue: number;
  totalAlerts: number;
}

export interface TrendData {
  month: string;
  stockLevel: number;
  demand: number;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  warehouseId: string;
}

export type OperationType = "receipt" | "delivery";
export type OperationStatus = "draft" | "waiting" | "ready" | "done" | "cancel";

export interface OperationLine {
  id: string;
  productId: string;
  productName: string;
  demandQty: number;
  doneQty: number;
}

export interface Operation {
  id: string;
  reference: string;
  type: OperationType;
  partner: string; // "Receive From" or "Delivery Address"
  scheduleDate: string;
  responsible: string;
  status: OperationStatus;
  lines: OperationLine[];
  sourceLocation?: string;
  destLocation?: string;
}

export interface StockMove {
  id: string;
  productName: string;
  type: "In" | "Out";
  quantity: number;
  warehouse: string;
  location: string;
  date: string;
  reference: string;
  status: "Done" | "Draft";
}

export interface OperationMetrics {
  receipt: {
    toReceive: number;
    late: number;
    total: number;
  };
  delivery: {
    toDeliver: number;
    waiting: number;
    total: number;
  };
}

