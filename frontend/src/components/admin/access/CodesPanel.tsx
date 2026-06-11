'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '@/lib/courses/courses.api';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import { useGroups } from '@/lib/groups/groups.api';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { useUIStore } from '@/lib/stores/ui.store';
import {
  useAccessCodes,
  useGenerateCodes,
  useRevokeCode,
  AccessCodeRecord,
} from '@/lib/access/access.api';

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  active:  { label: 'Aktivní',     cls: 'bg-block-mix-bg text-block-mix-primary border-block-mix-border' },
  used:    { label: 'Použitý',     cls: 'bg-block-exercise-bg text-admin-primary border-block-exercise-border' },
  revoked: { label: 'Zneplatněný', cls: 'bg-block-content-bg text-admin-danger border-block-content-border' },
};

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
}

export function CodesPanel() {
  const showToast = useUIStore((s) => s.showToast);
  const { data: courses = [] } = useQuery({ queryKey: QUERY_KEYS.courses(), queryFn: fetchCourses });
  const { data: groups = [] } = useGroups();

  const [courseId, setCourseId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [count, setCount] = useState(1);
  const [validUntil, setValidUntil] = useState('');
  const [search, setSearch] = useState('');
  const [generated, setGenerated] = useState<string[]>([]);

  const { data: codes = [], isLoading } = useAccessCodes({ search });
  const generate = useGenerateCodes();
  const revoke = useRevokeCode();

  const filtered = useMemo(
    () => codes.filter((c) => !search || c.code.toLowerCase().includes(search.toLowerCase()) || c.courseTitle.toLowerCase().includes(search.toLowerCase())),
    [codes, search],
  );

  const handleGenerate = async () => {
    if (!courseId) { showToast('Vyber kurz', 'error'); return; }
    try {
      const res = await generate.mutateAsync({
        courseId,
        groupId: groupId || null,
        count: Math.max(1, count),
        validUntil: validUntil || null,
      });
      setGenerated(res.map((r) => r.code));
      showToast(`Vygenerováno ${res.length} kódů`, 'success');
    } catch {
      showToast('Generování se nezdařilo', 'error');
    }
  };

  const handleRevoke = async (c: AccessCodeRecord) => {
    if (!window.confirm(`Zneplatnit kód ${c.code}? Už nepůjde uplatnit.`)) return;
    try {
      await revoke.mutateAsync(c.id);
      showToast('Kód zneplatněn', 'success');
    } catch {
      showToast('Akce se nezdařila', 'error');
    }
  };

  const copyAll = () => {
    navigator.clipboard?.writeText(generated.join('\n'));
    showToast('Kódy zkopírovány', 'success');
  };

  return (
    <div className="admin-card p-admin-xl">
      <h2 className="text-admin-lg font-extrabold text-admin-text mb-1">Přístupové kódy</h2>
      <p className="text-admin-sm text-admin-text-muted mb-admin-lg">
        Kód po uplatnění odemkne studentovi vybraný kurz. Volitelně ho přidá i do skupiny.
        Pravidla zámků lekcí zůstávají v platnosti.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-admin-sm items-end mb-admin-md">
        <label className="flex flex-col gap-1 lg:col-span-2">
          <span className="text-admin-xs font-semibold text-admin-text-muted">Kurz</span>
          <select className="admin-field" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">— vyber kurz —</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-admin-xs font-semibold text-admin-text-muted">Skupina (volitelně)</span>
          <select className="admin-field" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            <option value="">— bez skupiny —</option>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-admin-xs font-semibold text-admin-text-muted">Počet</span>
          <input type="number" min={1} max={200} className="admin-field" value={count}
                 onChange={(e) => setCount(parseInt(e.target.value || '1', 10))} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-admin-xs font-semibold text-admin-text-muted">Platí do (volitelně)</span>
          <input type="date" className="admin-field" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
        </label>
      </div>
      <AdminButton icon="ti-plus" loading={generate.isPending} onClick={handleGenerate}>
        Vygenerovat kódy
      </AdminButton>

      {generated.length > 0 && (
        <div className="mt-admin-md p-admin-md rounded-admin-md border border-admin-primary bg-[image:var(--gradient-brand-soft)]">
          <div className="flex items-center justify-between mb-admin-sm">
            <span className="text-admin-sm font-bold text-admin-text">Nově vygenerované kódy</span>
            <AdminButton size="sm" variant="ghost" icon="ti-copy" onClick={copyAll}>Kopírovat vše</AdminButton>
          </div>
          <div className="flex flex-wrap gap-admin-xs">
            {generated.map((code) => (
              <span key={code} className="font-mono text-admin-sm font-bold text-admin-text bg-admin-surface border border-admin-border rounded-admin-sm px-2 py-1">
                {code}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="relative mt-admin-xl mb-admin-md max-w-[320px]">
        <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted text-[15px]" />
        <input className="admin-field pl-9" placeholder="Hledat kód nebo kurz…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="overflow-x-auto">
        <table className="vocabulary-table">
          <thead>
            <tr>
              <th>Kód</th><th>Kurz</th><th>Skupina</th><th>Stav</th><th>Použil</th><th>Vytvořeno</th><th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="text-center text-admin-text-muted py-admin-lg">Načítání…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center text-admin-text-muted py-admin-lg">Žádné kódy</td></tr>
            ) : filtered.map((c) => {
              const badge = STATUS_BADGE[c.status] ?? STATUS_BADGE.active;
              return (
                <tr key={c.id}>
                  <td className="font-mono font-bold">{c.code}</td>
                  <td>{c.courseTitle}</td>
                  <td>{c.groupName ?? <span className="text-admin-text-muted">—</span>}</td>
                  <td><span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${badge.cls}`}>{badge.label}</span></td>
                  <td>{c.usedByEmail ?? <span className="text-admin-text-muted">—</span>}</td>
                  <td className="text-admin-text-muted">{fmtDate(c.createdAt)}</td>
                  <td className="text-right">
                    {c.status === 'active' && (
                      <button onClick={() => handleRevoke(c)} title="Zneplatnit kód"
                              className="w-8 h-8 rounded-admin-sm text-admin-text-muted hover:text-admin-danger hover:bg-admin-danger-bg transition-colors">
                        <i className="ti ti-ban text-[16px]" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
