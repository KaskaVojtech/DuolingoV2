'use client';

/**
 * Top bar of the user side with the logo, navigation (courses, progress) and logout.
 */

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useUserAuthStore } from '@/lib/user-auth/user-auth.store';
import { userLogout } from '@/lib/user-auth/user-auth.api';

const NAV = [
  { href: '/dashboard', label: 'Kurzy', icon: 'ti-book' },
  { href: '/progress', label: 'Pokrok', icon: 'ti-chart-bar' },
];

export function UserTopBar() {
  const clearAuth = useUserAuthStore((s) => s.clearAuth);
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await userLogout();
    clearAuth();
    router.push('/login');
  }

  return (
    <header className="user-topbar border-b border-admin-border px-admin-lg py-admin-md flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-admin-lg">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="user-logo-badge w-8 h-8 rounded-admin-sm flex items-center justify-center">
            <i className="ti ti-language text-white text-[16px]" />
          </div>
          <span className="text-admin-text font-extrabold tracking-tight">DELTALINGO</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-1">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + '/');
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`user-nav-link ${active ? 'user-nav-link--active' : ''} flex items-center gap-1.5 px-3 py-1.5 rounded-admin-sm text-admin-sm font-semibold transition-colors ${
                  active ? 'text-admin-text' : 'text-admin-text-muted hover:text-admin-text'
                }`}
              >
                <i className={`ti ${n.icon} text-[16px]`} /> {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <button onClick={handleLogout} className="flex items-center gap-1.5 text-admin-sm text-admin-text-muted hover:text-admin-text hover:-translate-y-px transition-all">
        <i className="ti ti-logout text-[16px]" /> Odhlásit se
      </button>
    </header>
  );
}
