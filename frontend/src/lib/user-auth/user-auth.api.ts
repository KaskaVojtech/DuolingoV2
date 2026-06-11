/**
 * Calls to the user authentication endpoints (registration, login, refresh, logout).
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class UserApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function req<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
  if (!res.ok) {
    let message = 'Chyba serveru';
    try { const b = await res.json(); message = b.message ?? message; } catch {  }
    throw new UserApiError(res.status, message);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}

export interface TokenResponse { accessToken: string }

export function checkEmail(email: string): Promise<{ hasAccount: boolean; hasCourseAccess: boolean }> {
  return req('/auth/check-email', { method: 'POST', body: JSON.stringify({ email }) });
}

export function checkCode(code: string): Promise<{ valid: boolean; usedByEmail?: string | null }> {
  return req('/auth/check-code', { method: 'POST', body: JSON.stringify({ code }) });
}

export function register(email: string, password: string, source: 'email' | 'code', code?: string): Promise<TokenResponse> {
  return req('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, source, code }) });
}

export function userLogin(email: string, password: string): Promise<TokenResponse> {
  return req('/auth/user-login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function userRefresh(): Promise<TokenResponse> {
  return req('/auth/user-refresh', { method: 'POST', body: '{}' });
}

export function userLogout(): Promise<void> {
  return req('/auth/user-logout', { method: 'POST', body: '{}' });
}
