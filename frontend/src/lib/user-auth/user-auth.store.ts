/**
 * Zustand store with the user's access token (in memory).
 */
import { create } from 'zustand';

interface UserAuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

export const useUserAuthStore = create<UserAuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: true }),
  clearAuth: () => set({ accessToken: null, isAuthenticated: false }),
}));
