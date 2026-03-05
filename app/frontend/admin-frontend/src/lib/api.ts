const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed: ${res.status}`);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const authApi = {
  loginEmail: (email: string, password: string) =>
    request('/auth/login/email', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  loginCode: (code: string) =>
    request('/auth/login/code', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  logout: () => request('/auth/logout', { method: 'POST' }),

  registerEmail: (email: string, password: string) =>
    request('/auth/register/email', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  registerCode: () => request('/auth/register/code', { method: 'POST' }),
};
