'use client';

import { useEffect, useState } from 'react';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';
import { DeletedCoursesToolbar } from '@/components/admin/courses-deleted/DeletedCoursesToolbar';
import { DeletedCourseRow } from '@/components/admin/courses-deleted/DeletedCourseRow';
import {
  useDeletedCourses,
  useRestoreCourse,
  usePurgeCourse,
  DeletedCourse,
  DeletedCoursesSort,
} from '@/lib/courses/deleted-courses.api';
import { useUIStore } from '@/lib/stores/ui.store';

export default function DeletedCoursesPage() {
  const { isLoading } = useRequireAdmin();
  const showToast = useUIStore((s) => s.showToast);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState<DeletedCoursesSort>('deleted_desc');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: courses, isLoading: loadingCourses } = useDeletedCourses({ search: debouncedSearch, sort });
  const restore = useRestoreCourse();
  const purge = usePurgeCourse();
  const busy = restore.isPending || purge.isPending;

  if (isLoading) return null;

  const handleRestore = async (id: string) => {
    try {
      const res = await restore.mutateAsync(id);
      showToast(`Kurz „${res.title}" byl obnoven`, 'success');
    } catch {
      showToast('Obnovení kurzu se nezdařilo', 'error');
    }
  };

  const handlePurge = async (course: DeletedCourse) => {
    const ok = window.confirm(
      `Trvale smazat kurz „${course.title}"? Tuto akci nelze vrátit zpět.`,
    );
    if (!ok) return;
    try {
      await purge.mutateAsync(course.id);
      showToast(`Kurz „${course.title}" byl trvale smazán`, 'success');
    } catch {
      showToast('Trvalé smazání se nezdařilo', 'error');
    }
  };

  const list = courses ?? [];

  return (
    <AdminPageLayout
      title="Smazané kurzy"
      maxWidth="lg"
      breadcrumb={[{ label: 'Kurzy', href: '/admin/courses' }, { label: 'Smazané kurzy' }]}
    >
      <p className="text-admin-sm text-admin-text-muted mb-admin-lg -mt-admin-sm">
        Smazané kurzy zůstávají 30 dní obnovitelné. Po uplynutí termínu jsou trvale odstraněny.
      </p>

      <DeletedCoursesToolbar search={search} onSearch={setSearch} sort={sort} onSort={setSort} />

      {loadingCourses ? (
        <div className="flex items-center justify-center py-admin-2xl text-admin-text-muted">
          <i className="ti ti-loader-2 animate-spin text-[24px]" aria-hidden="true" />
        </div>
      ) : list.length === 0 ? (
        <div className="admin-card flex flex-col items-center justify-center gap-admin-sm py-admin-2xl text-center">
          <i className="ti ti-trash-off text-admin-text-muted" style={{ fontSize: 48 }} aria-hidden="true" />
          <p className="text-admin-base font-bold text-admin-text">
            {debouncedSearch ? 'Žádné smazané kurzy neodpovídají hledání' : 'Koš je prázdný'}
          </p>
          <p className="text-admin-sm text-admin-text-muted">
            {debouncedSearch ? 'Zkus upravit hledaný výraz.' : 'Smazané kurzy se zobrazí zde.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-admin-sm">
          {list.map((course) => (
            <DeletedCourseRow
              key={course.id}
              course={course}
              onRestore={handleRestore}
              onPurge={handlePurge}
              busy={busy}
            />
          ))}
        </div>
      )}
    </AdminPageLayout>
  );
}
