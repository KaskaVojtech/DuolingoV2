'use client';

import { DeletedCourse } from '@/lib/courses/deleted-courses.api';
import { AdminButton } from '@/components/admin/common/AdminButton';

interface Props {
  course: DeletedCourse;
  onRestore: (id: string) => void;
  onPurge: (course: DeletedCourse) => void;
  busy: boolean;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

function daysLeft(iso: string | null): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export function DeletedCourseRow({ course, onRestore, onPurge, busy }: Props) {
  const left = daysLeft(course.scheduledDeleteAt);
  const urgent = left !== null && left <= 3;

  return (
    <div className="admin-card admin-card--interactive admin-rise-in flex items-center gap-admin-lg p-admin-md">

      <div
        className="w-12 h-12 rounded-admin-md shrink-0 flex items-center justify-center overflow-hidden"
        style={{ background: course.thumbnailColor }}
      >
        {course.thumbnailUrl ? (

          <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <i className="ti ti-book text-white text-[22px]" aria-hidden="true" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-admin-base font-extrabold text-admin-text truncate">{course.title}</p>
        <p className="text-admin-xs text-admin-text-muted flex flex-wrap items-center gap-x-admin-md gap-y-1 mt-0.5">
          <span className="inline-flex items-center gap-1">
            <i className="ti ti-trash text-[13px]" aria-hidden="true" />
            Smazáno {formatDate(course.deletedAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="ti ti-list text-[13px]" aria-hidden="true" />
            {course.lessonsCount} lekcí
          </span>
        </p>
      </div>

      <div className="hidden sm:flex flex-col items-end text-right shrink-0">
        <span className="text-admin-xs text-admin-text-muted">Trvale smazáno</span>
        <span className="text-admin-sm font-bold text-admin-text">{formatDate(course.scheduledDeleteAt)}</span>
        {left !== null && (
          <span className={`text-admin-xs font-bold ${urgent ? 'text-admin-danger' : 'text-admin-text-muted'}`}>
            {left === 0 ? 'dnes' : `za ${left} dní`}
          </span>
        )}
      </div>

      <div className="flex items-center gap-admin-xs shrink-0">
        <AdminButton variant="primary" size="sm" icon="ti-restore" disabled={busy} onClick={() => onRestore(course.id)}>
          Obnovit
        </AdminButton>
        <button
          onClick={() => onPurge(course)}
          disabled={busy}
          title="Smazat trvale hned"
          aria-label="Smazat trvale hned"
          className="w-8 h-8 flex items-center justify-center rounded-admin-sm text-admin-text-muted hover:text-admin-danger hover:bg-admin-danger-bg transition-colors disabled:opacity-50"
        >
          <i className="ti ti-trash-x text-[16px]" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
