/**
 * Calls to the admin authentication endpoints (login, refresh, logout).
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

interface LoginPayload  { email: string; password: string; }
interface TokenResponse { accessToken: string; }

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });

  if (!res.ok) {
    let message = 'Chyba serveru';
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {  }
    throw new ApiError(res.status, message);
  }

  if (res.status === 200 && res.headers.get('content-length') !== '0') {
    return res.json();
  }
  return undefined as T;
}

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  return request<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function refreshTokens(): Promise<TokenResponse> {
  return request<TokenResponse>('/auth/refresh', { method: 'POST', body: '{}' });
}

export async function logout(): Promise<void> {
  return request<void>('/auth/logout', { method: 'POST', body: '{}' });
}
