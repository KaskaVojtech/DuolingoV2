'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '@/lib/courses/courses.api';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { useUIStore } from '@/lib/stores/ui.store';
import axios from 'axios';
import {
  useUserGrants,
  useGrantUser,
  useRevokeGrant,
  UserGrantRecord,
} from '@/lib/access/access.api';

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
}

export function UserAccessPanel() {
  const showToast = useUIStore((s) => s.showToast);
  const { data: courses = [] } = useQuery({ queryKey: QUERY_KEYS.courses(), queryFn: fetchCourses });

  const [email, setEmail] = useState('');
  const [courseId, setCourseId] = useState('');
  const [search, setSearch] = useState('');

  const { data: grants = [], isLoading } = useUserGrants({ search });
  const grant = useGrantUser();
  const revoke = useRevokeGrant();

  const filtered = useMemo(
    () => grants.filter((g) => !search || g.email.toLowerCase().includes(search.toLowerCase()) || g.courseTitle.toLowerCase().includes(search.toLowerCase())),
    [grants, search],
  );

  const handleGrant = async () => {
    if (!email.trim() || !courseId) { showToast('Zadej e-mail a kurz', 'error'); return; }
    try {
      await grant.mutateAsync({ email: email.trim(), courseId });
      showToast(`Přístup udělen: ${email.trim()}`, 'success');
      setEmail('');
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message
        ? String(err.response.data.message)
        : 'Udělení přístupu se nezdařilo';
      showToast(msg, 'error');
    }
  };

  const handleRevoke = async (g: UserGrantRecord) => {
    if (!window.confirm(`Odebrat ${g.email} přístup ke kurzu „${g.courseTitle}"?`)) return;
    try {
      await revoke.mutateAsync(g.id);
      showToast('Přístup odebrán', 'success');
    } catch {
      showToast('Akce se nezdařila', 'error');
    }
  };

  return (
    <div className="admin-card p-admin-xl">
      <h2 className="text-admin-lg font-extrabold text-admin-text mb-1">Individuální přístup uživatele</h2>
      <p className="text-admin-sm text-admin-text-muted mb-admin-lg">
        Udělí konkrétnímu (již zaregistrovanému) uživateli přímý přístup ke kurzu — nezávisle na skupinách.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-admin-sm items-end mb-admin-xl">
        <label className="flex flex-col gap-1">
          <span className="text-admin-xs font-semibold text-admin-text-muted">E-mail uživatele</span>
          <input type="email" className="admin-field" placeholder="student@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-admin-xs font-semibold text-admin-text-muted">Kurz</span>
          <select className="admin-field" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">— vyber kurz —</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </label>
        <AdminButton icon="ti-user-plus" loading={grant.isPending} onClick={handleGrant}>Udělit přístup</AdminButton>
      </div>

      <div className="relative mb-admin-md max-w-[320px]">
        <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted text-[15px]" />
        <input className="admin-field pl-9" placeholder="Hledat e-mail nebo kurz…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="overflow-x-auto">
        <table className="vocabulary-table">
          <thead>
            <tr><th>E-mail</th><th>Kurz</th><th>Uděleno</th><th></th></tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="text-center text-admin-text-muted py-admin-lg">Načítání…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-admin-text-muted py-admin-lg">Žádné individuální přístupy</td></tr>
            ) : filtered.map((g) => (
              <tr key={g.id}>
                <td className="font-semibold">{g.email}</td>
                <td>{g.courseTitle}</td>
                <td className="text-admin-text-muted">{fmtDate(g.assignedAt)}</td>
                <td className="text-right">
                  <button onClick={() => handleRevoke(g)} title="Odebrat přístup"
                          className="w-8 h-8 rounded-admin-sm text-admin-text-muted hover:text-admin-danger hover:bg-admin-danger-bg transition-colors">
                    <i className="ti ti-trash text-[16px]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
