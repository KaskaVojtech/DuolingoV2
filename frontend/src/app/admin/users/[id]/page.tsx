'use client';

import { use, useState } from 'react';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { useUserDetail, useUserCourses, useAssignCourseToUser, useRevokeUserCourseAccess } from '@/lib/users/users.api';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';
import { AssignCourseModal } from '@/components/admin/shared/AssignCourseModal';
import type { UserCourseAccess } from '@/lib/users/users.types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

function UserInitials({ email }: { email: string }) {
  return (
    <span className="w-12 h-12 rounded-full bg-admin-surface-2 border border-admin-border flex items-center justify-center text-admin-sm font-semibold text-admin-text-muted shrink-0">
      {email.slice(0, 2).toUpperCase()}
    </span>
  );
}

function AccessTypeBadge({ item }: { item: UserCourseAccess }) {
  if (item.type === 'code') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-admin-surface-2 text-admin-text-muted border border-admin-border shrink-0">
        <i className="ti ti-key text-[11px]" />
        Kód {item.code ? `· ${item.code}` : ''}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-block-exercise-bg text-admin-primary border border-block-exercise-border shrink-0">
      <i className="ti ti-mail text-[11px]" />
      Email
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: '#22c55e',
    inactive: '#64748b',
    expired: '#f59e0b',
    never_used: '#94a3b8',
  };
  return (
    <span
      className="w-1.5 h-1.5 rounded-full shrink-0"
      style={{ background: colors[status] ?? '#64748b' }}
      title={status}
    />
  );
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading } = useRequireAdmin();
  const { data: user, isLoading: userLoading } = useUserDetail(id);
  const { data: courses = [], isLoading: coursesLoading } = useUserCourses(id);
  const assignCourse = useAssignCourseToUser(id);
  const revokeAccess = useRevokeUserCourseAccess(id);
  const [showAssignModal, setShowAssignModal] = useState(false);

  if (isLoading || userLoading || !user) return null;

  const assignedCourseIds = courses.map((c) => c.courseId);

  return (
    <AdminPageLayout
      title={user.email}
      breadcrumb={[
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Uživatelé', href: '/admin/users' },
        { label: user.email },
      ]}
    >

      <div className="bg-admin-surface border border-admin-border rounded-admin-md p-5 mb-4">
        <div className="flex items-center gap-4">
          <UserInitials email={user.email} />
          <div className="flex-1 min-w-0">
            <p className="text-admin-base font-semibold text-admin-text truncate">{user.email}</p>
            <p className="text-admin-xs text-admin-text-muted mt-0.5">Registrován {formatDate(user.createdAt)}</p>
          </div>
          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 ${user.role === 'admin' ? 'bg-block-exercise-bg text-admin-primary border border-block-exercise-border' : 'bg-admin-surface-2 text-admin-text-muted border border-admin-border'}`}>
            {user.role === 'admin' ? 'Admin' : 'Uživatel'}
          </span>
        </div>
      </div>

      <div className="bg-admin-surface border border-admin-border rounded-admin-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-admin-border">
          <div>
            <h2 className="text-admin-sm font-semibold text-admin-text">Přístup ke kurzům</h2>
            {courses.length > 0 && (
              <p className="text-admin-xs text-admin-text-muted mt-0.5">{courses.length} {courses.length === 1 ? 'kurz' : courses.length >= 2 && courses.length <= 4 ? 'kurzy' : 'kurzů'}</p>
            )}
          </div>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-admin-xs font-medium bg-admin-primary text-white rounded-admin-sm hover:opacity-90 transition-opacity"
          >
            <i className="ti ti-plus text-[13px]" /> Přiřadit kurz
          </button>
        </div>

        {coursesLoading && (
          <div className="px-5 py-8 text-center text-admin-sm text-admin-text-muted">Načítání…</div>
        )}

        {!coursesLoading && courses.length === 0 && (
          <div className="px-5 py-10 text-center">
            <i className="ti ti-book-off text-[28px] text-admin-text-muted block mb-2" />
            <p className="text-admin-sm text-admin-text-muted">Uživatel nemá přístup k žádnému kurzu</p>
            <button onClick={() => setShowAssignModal(true)} className="mt-3 text-admin-xs text-admin-primary hover:underline">
              Přiřadit první kurz
            </button>
          </div>
        )}

        {courses.map((item) => (
          <div
            key={item.accessId}
            className="flex items-center gap-3 px-5 py-3 border-b border-admin-border last:border-b-0 hover:bg-admin-surface-2 transition-colors group"
          >
            <span
              className="w-8 h-8 rounded-admin-sm shrink-0 flex items-center justify-center"
              style={{ background: item.thumbnailColor ?? '#5b7cfa' }}
            >
              <i className="ti ti-book text-white text-[14px]" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-admin-sm text-admin-text truncate">{item.courseTitle}</p>
              <p className="text-admin-xs text-admin-text-muted">
                Přidáno {formatDate(item.createdAt)}
                {item.lastLoginAt && ` · Naposledy přihlášen ${formatDate(item.lastLoginAt)}`}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusDot status={item.status} />
              <AccessTypeBadge item={item} />
            </div>
            <button
              onClick={() => revokeAccess.mutate(item.accessId)}
              disabled={revokeAccess.isPending}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-admin-surface text-admin-text-muted hover:text-admin-danger transition-all ml-1"
              title="Odebrat přístup"
            >
              <i className="ti ti-x text-[15px]" />
            </button>
          </div>
        ))}
      </div>

      {showAssignModal && (
        <AssignCourseModal
          assignedCourseIds={assignedCourseIds}
          onAssign={(courseId) => assignCourse.mutate(courseId)}
          onClose={() => setShowAssignModal(false)}
        />
      )}
    </AdminPageLayout>
  );
}
