/**
 * User-side Axios client: adds the access token and on 401 refreshes it via /auth/user-refresh.
 */
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useUserAuthStore } from './user-auth.store';
import { userRefresh } from './user-auth.api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const userApiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

userApiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = useUserAuthStore.getState();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

userApiClient.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { accessToken } = await userRefresh();
        useUserAuthStore.getState().setAccessToken(accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return userApiClient(original);
      } catch {
        useUserAuthStore.getState().clearAuth();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default userApiClient;
