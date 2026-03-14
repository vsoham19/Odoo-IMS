import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthResponse } from "../types/user";

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (data) => set({ user: data.user, token: data.token, isAuthenticated: true }),
      logout: () => {
        // Also clear the cookie used for Next.js middleware
        document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
