/**
 * Zustand store with the admin access token (kept in memory only).
 */
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

const devInitToken =
  typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
    ? (sessionStorage.getItem('__dev_auth_token') ?? null)
    : null;

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: devInitToken,
  isAuthenticated: !!devInitToken,
  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: true }),
  clearAuth: () => { sessionStorage.removeItem('__dev_auth_token'); set({ accessToken: null, isAuthenticated: false }); },
}));
