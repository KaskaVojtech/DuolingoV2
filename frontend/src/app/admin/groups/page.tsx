'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { useGroups, useDeleteGroup } from '@/lib/groups/groups.api';
import { Group } from '@/lib/groups/groups.types';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';
import { CreateGroupModal } from '@/components/admin/groups/CreateGroupModal';

function GroupRow({ group, onDelete }: { group: Group; onDelete: (id: string) => void }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-admin-border hover:bg-admin-surface-2 transition-colors group">
      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: group.color }} />
      <Link href={`/admin/groups/${group.id}`} className="flex-1 text-admin-sm font-medium text-admin-text hover:text-admin-primary transition-colors truncate">
        {group.name}
      </Link>
      <span className="text-admin-xs text-admin-text-muted shrink-0">
        {group.memberCount ?? 0} {(group.memberCount ?? 0) === 1 ? 'člen' : (group.memberCount ?? 0) >= 2 && (group.memberCount ?? 0) <= 4 ? 'členové' : 'členů'}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link href={`/admin/groups/${group.id}`} className="p-1.5 rounded hover:bg-admin-surface text-admin-text-muted hover:text-admin-text transition-colors" title="Spravovat">
          <i className="ti ti-settings text-[15px]" />
        </Link>
        <button onClick={() => onDelete(group.id)} className="p-1.5 rounded hover:bg-admin-surface text-admin-text-muted hover:text-admin-danger transition-colors" title="Smazat">
          <i className="ti ti-trash text-[15px]" />
        </button>
      </div>
    </div>
  );
}

export default function GroupsPage() {
  const { isLoading } = useRequireAdmin();
  const { data: groups, isLoading: isGroupsLoading } = useGroups();
  const deleteGroup = useDeleteGroup();
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (isLoading) return null;

  function handleDelete(id: string) {
    setConfirmDeleteId(id);
  }

  async function confirmDelete() {
    if (!confirmDeleteId) return;
    await deleteGroup.mutateAsync(confirmDeleteId);
    setConfirmDeleteId(null);
  }

  const groupToDelete = groups?.find((g) => g.id === confirmDeleteId);

  return (
    <AdminPageLayout
      title="Skupiny uživatelů"
      breadcrumb={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Skupiny' }]}
    >
      <div className="bg-admin-surface border border-admin-border rounded-admin-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-admin-border">
          <span className="text-admin-xs text-admin-text-muted">
            {groups?.length ?? 0} {(groups?.length ?? 0) === 1 ? 'skupina' : 'skupin'}
          </span>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-admin-xs font-medium bg-admin-primary text-white rounded-admin-sm hover:opacity-90 transition-opacity"
          >
            <i className="ti ti-plus text-[13px]" /> Nová skupina
          </button>
        </div>

        {isGroupsLoading && (
          <p className="px-5 py-8 text-center text-admin-xs text-admin-text-muted">Načítání…</p>
        )}
        {!isGroupsLoading && (!groups || groups.length === 0) && (
          <div className="px-5 py-12 text-center">
            <i className="ti ti-users text-[32px] text-admin-text-muted block mb-3" />
            <p className="text-admin-sm text-admin-text-muted mb-1">Zatím žádné skupiny</p>
            <p className="text-admin-xs text-admin-text-muted">Vytvořte první skupinu tlačítkem výše</p>
          </div>
        )}
        {groups && groups.map((group) => (
          <GroupRow key={group.id} group={group} onDelete={handleDelete} />
        ))}
      </div>

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}

      {confirmDeleteId && groupToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }} onClick={() => setConfirmDeleteId(null)}>
          <div className="bg-admin-surface border border-admin-border rounded-admin-lg w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-admin-base font-semibold text-admin-text mb-2">Smazat skupinu?</h3>
            <p className="text-admin-sm text-admin-text-muted mb-5">
              Skupina <strong className="text-admin-text">"{groupToDelete.name}"</strong> bude trvale smazána včetně všech přiřazení členů.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 text-admin-sm border border-admin-border rounded-admin-sm text-admin-text-muted hover:text-admin-text">Zrušit</button>
              <button onClick={confirmDelete} disabled={deleteGroup.isPending} className="px-4 py-2 text-admin-sm font-medium bg-admin-danger text-white rounded-admin-sm hover:opacity-90 disabled:opacity-50">
                {deleteGroup.isPending ? 'Mazání…' : 'Smazat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
}
