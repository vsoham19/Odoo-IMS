import { create } from "zustand";
import { Product, InventoryStats, TrendData, OperationMetrics, Warehouse, Location, StockMove } from "../types/inventory";

interface InventoryState {
  products: Product[];
  warehouses: Warehouse[];
  locations: Location[];
  movements: StockMove[];
  stats: InventoryStats | null;
  trends: TrendData[];
  operations: OperationMetrics | null;
  isLoading: boolean;
  error: string | null;
  
  // Setters
  setProducts: (products: Product[]) => void;
  setWarehouses: (warehouses: Warehouse[]) => void;
  setLocations: (locations: Location[]) => void;
  setMovements: (movements: StockMove[]) => void;
  setStats: (stats: InventoryStats) => void;
  setTrends: (trends: TrendData[]) => void;
  setOperations: (operations: OperationMetrics) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Actions
  updateProductStock: (id: string, newStock: number) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (product: Product) => void;
  
  addWarehouse: (warehouse: Warehouse) => void;
  addLocation: (location: Location) => void;
  addMovement: (movement: StockMove) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  products: [],
  warehouses: [],
  locations: [],
  movements: [],
  stats: null,
  trends: [],
  operations: null,
  isLoading: false,
  error: null,
  
  setProducts: (products) => set({ products }),
  setWarehouses: (warehouses) => set({ warehouses }),
  setLocations: (locations) => set({ locations }),
  setMovements: (movements) => set({ movements }),
  setStats: (stats) => set({ stats }),
  setTrends: (trends) => set({ trends }),
  setOperations: (operations) => set({ operations }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  updateProductStock: (id, newStock) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, stock: newStock } : p
      ),
    })),
    
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  updateProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) => p.id === product.id ? product : p),
    })),

  addWarehouse: (warehouse) =>
    set((state) => ({
      warehouses: [...state.warehouses, warehouse],
    })),

  addLocation: (location) =>
    set((state) => ({
      locations: [...state.locations, location],
    })),

  addMovement: (movement) =>
    set((state) => ({
      movements: [movement, ...state.movements],
    })),
}));
