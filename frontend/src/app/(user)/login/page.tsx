'use client';

/**
 * User login page.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuthStore } from '@/lib/user-auth/user-auth.store';
import { checkEmail, checkCode, userLogin, UserApiError } from '@/lib/user-auth/user-auth.api';

type Method = 'email' | 'code';
type EmailStep = 'enter-email' | 'enter-password' | 'no-access';

export default function LoginPage() {
  const isAuthenticated = useUserAuthStore((s) => s.isAuthenticated);
  const setAccessToken = useUserAuthStore((s) => s.setAccessToken);
  const router = useRouter();

  const [method, setMethod] = useState<Method>('email');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailStep, setEmailStep] = useState<EmailStep>('enter-email');

  const [code, setCode] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  function resetEmail() {
    setEmailStep('enter-email');
    setPassword('');
    setError('');
  }

  async function handleCheckEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true); setError('');
    try {
      const result = await checkEmail(email.trim());
      if (!result.hasCourseAccess && !result.hasAccount) {
        setEmailStep('no-access');
      } else if (!result.hasAccount) {
        router.push(`/register?email=${encodeURIComponent(email.trim())}&source=email`);
      } else {
        setEmailStep('enter-password');
      }
    } catch { setError('Nepodařilo se ověřit email.'); }
    finally { setLoading(false); }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { accessToken } = await userLogin(email.trim(), password);
      setAccessToken(accessToken);
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof UserApiError ? err.message : 'Nesprávné přihlašovací údaje.');
    } finally { setLoading(false); }
  }

  async function handleCodeContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true); setError('');
    try {
      const result = await checkCode(code.trim().toUpperCase());
      if (!result.valid) { setError('Neplatný přístupový kód.'); return; }
      if (result.usedByEmail) {
        setError(`Tento kód byl již použit. Přihlaste se emailem: ${result.usedByEmail}`);
        return;
      }
      router.push(`/register?code=${encodeURIComponent(code.trim().toUpperCase())}&source=code`);
    } catch { setError('Nepodařilo se ověřit kód.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0f1a] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#4f6ef7] flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-language text-white text-[22px]" />
          </div>
          <h1 className="text-xl font-bold text-white">DELTALINGO</h1>
          <p className="text-sm text-[#8891b0] mt-1">Přihlaste se ke svému účtu</p>
        </div>

        <div className="flex rounded-lg bg-[#1a1d2e] p-1 mb-6">
          {(['email', 'code'] as Method[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMethod(m); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${method === m ? 'bg-[#4f6ef7] text-white' : 'text-[#8891b0] hover:text-white'}`}
            >
              {m === 'email' ? 'E-mail' : 'Přístupový kód'}
            </button>
          ))}
        </div>

        <div className="bg-[#1a1d2e] rounded-xl p-6 border border-[#2e3247]">
          {method === 'email' && (
            <>
              {emailStep === 'enter-email' && (
                <form onSubmit={handleCheckEmail} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#8891b0] mb-1.5">E-mail</label>
                    <input
                      autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="vas@email.cz"
                      className="w-full px-3 py-2.5 bg-[#0e0f1a] border border-[#2e3247] rounded-lg text-white text-sm placeholder:text-[#5a6080] focus:outline-none focus:border-[#4f6ef7]"
                    />
                  </div>
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  <button type="submit" disabled={!email.trim() || loading} className="w-full py-2.5 bg-[#4f6ef7] text-white text-sm font-medium rounded-lg disabled:opacity-50 hover:bg-[#3d5ce3] transition-colors">
                    {loading ? 'Ověřuji…' : 'Pokračovat'}
                  </button>
                </form>
              )}

              {emailStep === 'enter-password' && (
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-[#8891b0]">E-mail</label>
                      <button type="button" onClick={resetEmail} className="text-xs text-[#4f6ef7] hover:underline">Změnit</button>
                    </div>
                    <div className="px-3 py-2.5 bg-[#0e0f1a] border border-[#2e3247] rounded-lg text-[#8891b0] text-sm truncate">{email}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#8891b0] mb-1.5">Heslo</label>
                    <input
                      autoFocus type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Vaše heslo"
                      className="w-full px-3 py-2.5 bg-[#0e0f1a] border border-[#2e3247] rounded-lg text-white text-sm placeholder:text-[#5a6080] focus:outline-none focus:border-[#4f6ef7]"
                    />
                  </div>
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  <button type="submit" disabled={!password || loading} className="w-full py-2.5 bg-[#4f6ef7] text-white text-sm font-medium rounded-lg disabled:opacity-50 hover:bg-[#3d5ce3] transition-colors">
                    {loading ? 'Přihlašuji…' : 'Přihlásit se'}
                  </button>
                </form>
              )}

              {emailStep === 'no-access' && (
                <div className="text-center py-2">
                  <i className="ti ti-mail-off text-[32px] text-[#5a6080] block mb-3" />
                  <p className="text-sm text-white mb-1">Přístup nenalezen</p>
                  <p className="text-xs text-[#8891b0] mb-4">Email <strong className="text-white">{email}</strong> nemá přístup k žádnému kurzu. Zadejte přístupový kód nebo kontaktujte správce.</p>
                  <button onClick={resetEmail} className="text-xs text-[#4f6ef7] hover:underline">Zkusit jiný email</button>
                </div>
              )}
            </>
          )}

          {method === 'code' && (
            <form onSubmit={handleCodeContinue} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-[#8891b0] mb-1.5">Přístupový kód</label>
                <input
                  autoFocus type="text" value={code} onChange={(e) => setCode(e.target.value)}
                  placeholder="NAPŘ. ABC123"
                  className="w-full px-3 py-2.5 bg-[#0e0f1a] border border-[#2e3247] rounded-lg text-white text-sm placeholder:text-[#5a6080] focus:outline-none focus:border-[#4f6ef7] uppercase tracking-widest"
                  maxLength={50}
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button type="submit" disabled={!code.trim() || loading} className="w-full py-2.5 bg-[#4f6ef7] text-white text-sm font-medium rounded-lg disabled:opacity-50 hover:bg-[#3d5ce3] transition-colors">
                {loading ? 'Ověřuji…' : 'Pokračovat'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
