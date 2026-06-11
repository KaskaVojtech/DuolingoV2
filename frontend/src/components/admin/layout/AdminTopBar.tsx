'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth.hooks';
import { decodeJwtPayload } from '@/lib/auth/auth.utils';
import { logout } from '@/lib/api/auth.api';
import { useThemeStore } from '@/lib/stores/theme.store';

export function AdminTopBar() {
  const router = useRouter();
  const { accessToken, clearAuth } = useAuth();
  const { theme, toggle } = useThemeStore();

  const payload = accessToken ? decodeJwtPayload(accessToken) : null;
  const email = typeof payload?.email === 'string' ? payload.email : null;

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      router.push('/admin/login');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[56px] z-50 bg-admin-surface border-b border-admin-border flex items-center justify-between px-admin-lg">
      <div className="flex items-center gap-2.5">
        <span
          className="w-7 h-7 rounded-[9px] flex items-center justify-center text-white shadow-[var(--shadow-accent-glow)]"
          style={{ backgroundImage: 'var(--gradient-brand)' }}
          aria-hidden="true"
        >
          <i className="ti ti-language text-[16px]" />
        </span>
        <span className="brand-gradient-text font-extrabold text-admin-lg tracking-tight">DELTALINGO</span>
      </div>

      <div className="flex items-center gap-admin-md">
        {email && (
          <span className="text-admin-text-muted text-admin-sm hidden sm:block">{email}</span>
        )}

        <button
          onClick={toggle}
          title={theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
          className="w-8 h-8 flex items-center justify-center rounded-admin-sm text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-2 transition-colors"
          aria-label="Přepnout téma"
        >
          <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'} text-[17px]`} />
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-admin-text-muted hover:text-admin-text text-admin-sm transition-colors px-admin-sm py-1 rounded-admin-sm hover:bg-admin-surface-2"
        >
          <i className="ti ti-logout text-[16px]" aria-hidden="true" />
          <span>Odhlásit</span>
        </button>
      </div>
    </header>
  );
}
