'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/auth.store';
import { LoginForm } from '@/components/admin/auth/LoginForm';

export default function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div
      className="min-h-screen bg-admin-bg flex items-center justify-center p-admin-lg relative overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(40rem 40rem at 15% 10%, rgba(91,124,250,0.22), transparent 60%),' +
          'radial-gradient(38rem 38rem at 85% 90%, rgba(255,95,162,0.20), transparent 60%)',
      }}
    >
      <div className="admin-rise-in" style={{ width: 'min(480px, 90vw)' }}>
        <div className="flex items-center justify-center gap-2.5 mb-admin-lg">
          <span
            className="w-9 h-9 rounded-[12px] flex items-center justify-center text-white shadow-[var(--shadow-accent-glow)]"
            style={{ backgroundImage: 'var(--gradient-brand)' }}
            aria-hidden="true"
          >
            <i className="ti ti-language text-[20px]" />
          </span>
          <span className="brand-gradient-text font-extrabold text-admin-2xl tracking-tight">DELTALINGO</span>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
