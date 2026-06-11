'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { useGroup, useUpdateGroup, useRemoveMember, useDeleteGroup, useGroupCourses, useAssignCourseToGroup, useUnassignCourseFromGroup } from '@/lib/groups/groups.api';
import { GROUP_COLOR_PRESETS } from '@/lib/groups/groups.types';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';
import { AddMemberModal } from '@/components/admin/groups/AddMemberModal';
import { AssignCourseModal } from '@/components/admin/shared/AssignCourseModal';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

function UserInitials({ email }: { email: string }) {
  return (
    <span className="w-9 h-9 rounded-full bg-admin-surface-2 border border-admin-border flex items-center justify-center text-admin-xs font-semibold text-admin-text-muted shrink-0">
      {email.slice(0, 2).toUpperCase()}
    </span>
  );
}

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading } = useRequireAdmin();
  const { data: group, isLoading: isGroupLoading } = useGroup(id);
  const updateGroup = useUpdateGroup(id);
  const removeMember = useRemoveMember(id);
  const deleteGroup = useDeleteGroup();
  const { data: groupCourses = [] } = useGroupCourses(id);
  const assignCourse = useAssignCourseToGroup(id);
  const unassignCourse = useUnassignCourseFromGroup(id);
  const router = useRouter();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAssignCourse, setShowAssignCourse] = useState(false);

  if (isLoading || isGroupLoading || !group) return null;

  function startEditName() {
    setNameInput(group!.name);
    setEditingName(true);
  }

  async function saveName() {
    if (nameInput.trim() && nameInput.trim() !== group!.name) {
      await updateGroup.mutateAsync({ name: nameInput.trim() });
    }
    setEditingName(false);
  }

  async function handleDeleteGroup() {
    await deleteGroup.mutateAsync(id);
    router.push('/admin/groups');
  }

  return (
    <AdminPageLayout
      title={group.name}
      breadcrumb={[
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Skupiny', href: '/admin/groups' },
        { label: group.name },
      ]}
    >

      <div className="bg-admin-surface border border-admin-border rounded-admin-md p-5 mb-4">
        <div className="flex items-start gap-4">
          <span className="w-5 h-5 rounded-full shrink-0 mt-0.5" style={{ background: group.color }} />

          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  className="admin-input flex-1"
                  value={nameInput}
                  maxLength={255}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                  onBlur={saveName}
                />
              </div>
            ) : (
              <button onClick={startEditName} className="text-left group flex items-center gap-2" title="Přejmenovat">
                <h1 className="text-admin-lg font-semibold text-admin-text group-hover:text-admin-primary transition-colors">{group.name}</h1>
                <i className="ti ti-pencil text-[13px] text-admin-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
            <p className="text-admin-xs text-admin-text-muted mt-0.5">
              {group.members.length} {group.members.length === 1 ? 'člen' : group.members.length >= 2 && group.members.length <= 4 ? 'členové' : 'členů'} · Vytvořeno {formatDate(group.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">

            <div className="flex gap-1.5 items-center px-2">
              {GROUP_COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => updateGroup.mutate({ color: c })}
                  className="w-5 h-5 rounded-full border-2 transition-all"
                  style={{ background: c, borderColor: group.color === c ? '#fff' : 'transparent', boxShadow: group.color === c ? `0 0 0 2px ${c}` : 'none' }}
                  title={c}
                />
              ))}
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded hover:bg-admin-surface-2 text-admin-text-muted hover:text-admin-danger transition-colors"
              title="Smazat skupinu"
            >
              <i className="ti ti-trash text-[16px]" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-admin-surface border border-admin-border rounded-admin-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-admin-border">
          <h2 className="text-admin-sm font-semibold text-admin-text">Členové</h2>
          <button
            onClick={() => setShowAddMember(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-admin-xs font-medium bg-admin-primary text-white rounded-admin-sm hover:opacity-90 transition-opacity"
          >
            <i className="ti ti-user-plus text-[13px]" /> Přidat člena
          </button>
        </div>

        {group.members.length === 0 && (
          <div className="px-5 py-10 text-center">
            <i className="ti ti-user-off text-[28px] text-admin-text-muted block mb-2" />
            <p className="text-admin-sm text-admin-text-muted">Skupina zatím nemá žádné členy</p>
            <button onClick={() => setShowAddMember(true)} className="mt-3 text-admin-xs text-admin-primary hover:underline">
              Přidat prvního člena
            </button>
          </div>
        )}

        {group.members.map((member) => (
          <div key={member.userId} className="flex items-center gap-3 px-5 py-3 border-b border-admin-border last:border-b-0 hover:bg-admin-surface-2 transition-colors group">
            <UserInitials email={member.email} />
            <div className="flex-1 min-w-0">
              <p className="text-admin-sm text-admin-text truncate">{member.email}</p>
              <p className="text-admin-xs text-admin-text-muted">Přidán {formatDate(member.addedAt)}</p>
            </div>
            <button
              onClick={() => removeMember.mutate(member.userId)}
              disabled={removeMember.isPending}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-admin-surface text-admin-text-muted hover:text-admin-danger transition-all"
              title="Odebrat ze skupiny"
            >
              <i className="ti ti-user-minus text-[15px]" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-admin-surface border border-admin-border rounded-admin-md overflow-hidden mt-4">
        <div className="flex items-center justify-between px-5 py-3 border-b border-admin-border">
          <h2 className="text-admin-sm font-semibold text-admin-text">Přiřazené kurzy</h2>
          <button
            onClick={() => setShowAssignCourse(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-admin-xs font-medium bg-admin-primary text-white rounded-admin-sm hover:opacity-90 transition-opacity"
          >
            <i className="ti ti-plus text-[13px]" /> Přiřadit kurz
          </button>
        </div>

        {groupCourses.length === 0 && (
          <div className="px-5 py-10 text-center">
            <i className="ti ti-book-off text-[28px] text-admin-text-muted block mb-2" />
            <p className="text-admin-sm text-admin-text-muted">Skupina nemá přiřazen žádný kurz</p>
            <button onClick={() => setShowAssignCourse(true)} className="mt-3 text-admin-xs text-admin-primary hover:underline">
              Přiřadit první kurz
            </button>
          </div>
        )}

        {groupCourses.map((assignment) => (
          <div
            key={assignment.id}
            className="flex items-center gap-3 px-5 py-3 border-b border-admin-border last:border-b-0 hover:bg-admin-surface-2 transition-colors group"
          >
            <span
              className="w-8 h-8 rounded-admin-sm shrink-0 flex items-center justify-center"
              style={{ background: assignment.thumbnailColor ?? '#5b7cfa' }}
            >
              <i className="ti ti-book text-white text-[14px]" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-admin-sm text-admin-text truncate">{assignment.courseTitle}</p>
              <p className="text-admin-xs text-admin-text-muted">
                Přiřazen {new Date(assignment.assignedAt).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => unassignCourse.mutate(assignment.courseId)}
              disabled={unassignCourse.isPending}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-admin-surface text-admin-text-muted hover:text-admin-danger transition-all"
              title="Odebrat kurz"
            >
              <i className="ti ti-x text-[15px]" />
            </button>
          </div>
        ))}
      </div>

      {showAddMember && (
        <AddMemberModal
          groupId={id}
          existingMembers={group.members}
          onClose={() => setShowAddMember(false)}
        />
      )}

      {showAssignCourse && (
        <AssignCourseModal
          assignedCourseIds={groupCourses.map((c) => c.courseId)}
          onAssign={(courseId) => assignCourse.mutate(courseId)}
          onClose={() => setShowAssignCourse(false)}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-admin-surface border border-admin-border rounded-admin-lg w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-admin-base font-semibold text-admin-text mb-2">Smazat skupinu?</h3>
            <p className="text-admin-sm text-admin-text-muted mb-5">
              Skupina <strong className="text-admin-text">"{group.name}"</strong> bude trvale smazána.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-admin-sm border border-admin-border rounded-admin-sm text-admin-text-muted hover:text-admin-text">Zrušit</button>
              <button onClick={handleDeleteGroup} disabled={deleteGroup.isPending} className="px-4 py-2 text-admin-sm font-medium bg-admin-danger text-white rounded-admin-sm hover:opacity-90 disabled:opacity-50">
                {deleteGroup.isPending ? 'Mazání…' : 'Smazat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
}
