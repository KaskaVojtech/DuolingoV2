'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import apiClient from '@/lib/shared/api-client';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';

interface RegisteredUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface PaginatedResult {
  items: RegisteredUser[];
  totalCount: number;
  totalPages: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('cs-CZ');
}

function UserInitials({ email }: { email: string }) {
  return (
    <span className="w-7 h-7 rounded-full bg-admin-surface-2 border border-admin-border flex items-center justify-center text-[11px] font-semibold text-admin-text-muted shrink-0">
      {email.slice(0, 2).toUpperCase()}
    </span>
  );
}

export default function UsersPage() {
  const { isLoading } = useRequireAdmin();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isFetching } = useQuery<PaginatedResult>({
    queryKey: ['registered-users', search, page],
    queryFn: async () => {
      const { data } = await apiClient.get('/users', { params: { search, page, pageSize } });
      return data;
    },
  });

  if (isLoading) return null;

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  return (
    <AdminPageLayout
      title="Uživatelé"
      breadcrumb={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Uživatelé' }]}
    >
      <div className="bg-admin-surface border border-admin-border rounded-admin-md overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-admin-border">
          <div className="relative flex-1 max-w-xs">
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted text-admin-sm" />
            <input
              type="text"
              placeholder="Hledat podle emailu…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-8 pr-3 py-1.5 bg-admin-surface-2 border border-admin-border rounded-admin-sm text-admin-sm text-admin-text placeholder:text-admin-text-muted focus:outline-none focus:border-admin-primary"
            />
          </div>
          <span className="text-admin-xs text-admin-text-muted ml-auto">{totalCount} uživatelů</span>
        </div>

        <table className="w-full text-admin-xs">
          <thead>
            <tr className="border-b border-admin-border text-admin-text-muted text-left">
              <th className="px-4 py-2.5 font-medium">Uživatel</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Registrován</th>
              <th className="px-4 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {isFetching && items.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-admin-text-muted">Načítání…</td></tr>
            )}
            {!isFetching && items.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-admin-text-muted">Žádní uživatelé nenalezeni</td></tr>
            )}
            {items.map((user) => (
              <tr key={user.id} onClick={() => router.push(`/admin/users/${user.id}`)} className="border-b border-admin-border hover:bg-admin-surface-2 transition-colors cursor-pointer">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <UserInitials email={user.email} />
                    <span className="text-admin-text font-medium">{user.email}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${user.role === 'admin' ? 'bg-block-exercise-bg text-admin-primary border border-block-exercise-border' : 'bg-admin-surface-2 text-admin-text-muted border border-admin-border'}`}>
                    {user.role === 'admin' ? 'Admin' : 'Uživatel'}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-admin-text-muted">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-2.5">
                  <Link href={`/admin/users/${user.id}`} className="text-admin-primary hover:underline text-admin-xs">
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 px-4 py-3 border-t border-admin-border">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-2 py-1 rounded text-admin-xs disabled:opacity-40 hover:bg-admin-surface-2">‹</button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`px-2 py-1 rounded text-admin-xs ${p === page ? 'bg-admin-primary text-white' : 'hover:bg-admin-surface-2 text-admin-text-muted'}`}>{p}</button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="px-2 py-1 rounded text-admin-xs disabled:opacity-40 hover:bg-admin-surface-2">›</button>
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
}
