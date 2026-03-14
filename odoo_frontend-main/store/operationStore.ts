import { create } from "zustand";
import { Operation, OperationStatus, OperationType } from "../types/inventory";

interface OperationState {
  operations: Operation[];
  isLoading: boolean;
  error: string | null;
  
  setOperations: (operations: Operation[]) => void;
  addOperation: (operation: Operation) => void;
  updateOperation: (operation: Operation) => void;
  updateStatus: (id: string, status: OperationStatus) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useOperationStore = create<OperationState>((set) => ({
  operations: [],
  isLoading: false,
  error: null,
  
  setOperations: (operations) => set((state) => {
    // Merge: replace operations of the same type, keep others
    const newTypes = new Set(operations.map(o => o.type));
    const kept = state.operations.filter(o => !newTypes.has(o.type));
    return { operations: [...kept, ...operations] };
  }),
  
  addOperation: (operation) =>
    set((state) => ({
      operations: [operation, ...state.operations],
    })),
    
  updateOperation: (operation) =>
    set((state) => ({
      operations: state.operations.map((o) => o.id === operation.id ? operation : o),
    })),
    
  updateStatus: (id, status) =>
    set((state) => ({
      operations: state.operations.map((o) =>
        o.id === id ? { ...o, status } : o
      ),
    })),
    
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
