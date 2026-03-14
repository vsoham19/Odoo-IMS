import { create } from "zustand";
import { Alert } from "../types/alert";

interface AlertState {
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
  setAlerts: (alerts: Alert[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resolveAlert: (id: string) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  isLoading: false,
  error: null,
  setAlerts: (alerts) => set({ alerts }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  resolveAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, resolved: true } : a
      ),
    })),
}));
