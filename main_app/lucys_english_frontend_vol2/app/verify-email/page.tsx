'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ApiClient } from '@/lib/api/client';

type Status = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Chybí ověřovací token.');
      return;
    }

    const verify = async () => {
      try {
        await ApiClient.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setTimeout(() => router.push('/login?verified=true'), 3000);
      } catch (err: unknown) {
        setStatus('error');
        if (err instanceof Error) {
          setMessage(err.message);
        } else {
          setMessage('Token je neplatný nebo vypršel.');
        }
      }
    };

    verify();
  }, [token, router]);

  return (
    <main className="verify-page">
      <div className="verify-box">
        {status === 'loading' && (
          <>
            <div className="verify-spinner" />
            <h2 className="verify-title">Ověřování emailu...</h2>
            <p className="verify-sub">Prosím čekejte.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="verify-icon success">✓</div>
            <h2 className="verify-title">Email ověřen!</h2>
            <p className="verify-sub">
              Váš účet byl úspěšně aktivován. Za chvíli budete přesměrováni na přihlášení.
            </p>
            <Link href="/login" className="btn btn-pink" style={{ marginTop: '1.5rem' }}>
              Přihlásit se
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="verify-icon error">✕</div>
            <h2 className="verify-title">Ověření selhalo</h2>
            <p className="verify-sub">{message}</p>
            <Link href="/register" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
              Zkusit znovu
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className="verify-page">
        <div className="verify-box">
          <div className="verify-spinner" />
          <h2 className="verify-title">Načítání...</h2>
        </div>
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}