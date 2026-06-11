'use client';

/**
 * User registration page (via an access code).
 */

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserAuthStore } from '@/lib/user-auth/user-auth.store';
import { register, UserApiError } from '@/lib/user-auth/user-auth.api';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAccessToken = useUserAuthStore((s) => s.setAccessToken);

  const source = (searchParams.get('source') ?? 'email') as 'email' | 'code';
  const prefilledEmail = searchParams.get('email') ?? '';
  const code = searchParams.get('code') ?? '';

  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordMismatch = confirm.length > 0 && password !== confirm;
  const canSubmit = email.trim() && password.length >= 6 && password === confirm && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true); setError('');
    try {
      const { accessToken } = await register(email.trim(), password, source, code || undefined);
      setAccessToken(accessToken);
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof UserApiError ? err.message : 'Registrace se nezdařila.');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0f1a] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#4f6ef7] flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-language text-white text-[22px]" />
          </div>
          <h1 className="text-xl font-bold text-white">Vytvořit účet</h1>
          <p className="text-sm text-[#8891b0] mt-1">
            {source === 'code' ? `Registrace pomocí kódu ${code}` : 'Dokončete registraci zadáním hesla'}
          </p>
        </div>

        <div className="bg-[#1a1d2e] rounded-xl p-6 border border-[#2e3247]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-[#8891b0] mb-1.5">E-mail</label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={source === 'email' && !!prefilledEmail}
                placeholder="vas@email.cz"
                className={`w-full px-3 py-2.5 bg-[#0e0f1a] border border-[#2e3247] rounded-lg text-sm placeholder:text-[#5a6080] focus:outline-none focus:border-[#4f6ef7] ${source === 'email' && prefilledEmail ? 'text-[#8891b0] cursor-not-allowed' : 'text-white'}`}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8891b0] mb-1.5">Heslo <span className="text-[#5a6080]">(min. 6 znaků)</span></label>
              <input
                autoFocus={source === 'code'} type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Zvolte heslo"
                className="w-full px-3 py-2.5 bg-[#0e0f1a] border border-[#2e3247] rounded-lg text-white text-sm placeholder:text-[#5a6080] focus:outline-none focus:border-[#4f6ef7]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8891b0] mb-1.5">Potvrdit heslo</label>
              <input
                type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="Zadejte heslo znovu"
                className={`w-full px-3 py-2.5 bg-[#0e0f1a] border rounded-lg text-white text-sm placeholder:text-[#5a6080] focus:outline-none ${passwordMismatch ? 'border-red-500 focus:border-red-500' : 'border-[#2e3247] focus:border-[#4f6ef7]'}`}
              />
              {passwordMismatch && <p className="text-xs text-red-400 mt-1">Hesla se neshodují</p>}
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button type="submit" disabled={!canSubmit} className="w-full py-2.5 bg-[#4f6ef7] text-white text-sm font-medium rounded-lg disabled:opacity-50 hover:bg-[#3d5ce3] transition-colors">
              {loading ? 'Vytvářím účet…' : 'Vytvořit účet a přihlásit se'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#5a6080] mt-4">
          <button onClick={() => router.push('/login')} className="text-[#4f6ef7] hover:underline">← Zpět na přihlášení</button>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>;
}
