import { create } from "zustand";
import { authService } from "@/services/auth";

type User = {
  $id: string;
  email: string;
  name?: string;
} | null;

interface AuthState {
  user: User;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await authService.loginUser({ email, password });
      const user = await authService.fetchUser();
      set({ user, loading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  logout: async () => {
    set({ loading: true, error: null });
    try {
      await authService.logoutUser();
      set({ user: null, loading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  register: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      await authService.registerUser({ email, password, name });
      const user = await authService.fetchUser();
      set({ user, loading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const user = await authService.fetchUser();
      set({ user, loading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
