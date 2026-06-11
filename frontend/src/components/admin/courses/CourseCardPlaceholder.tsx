'use client';

import { useRouter } from 'next/navigation';
import { ViewMode } from '@/lib/courses/courses.types';

interface CourseCardPlaceholderProps {
  viewMode: ViewMode;
}

export function CourseCardPlaceholder({ viewMode }: CourseCardPlaceholderProps) {
  const router = useRouter();

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => router.push('/admin/courses/new')}
        className="course-placeholder flex items-center gap-admin-md px-admin-md cursor-pointer border-b border-dashed border-course-placeholder-border hover:border-admin-border"
        style={{ height: '64px' }}
      >
        <div className="w-12 h-12 flex items-center justify-center rounded-admin-sm border-2 border-dashed border-course-placeholder-border">
          <i className="ti ti-plus text-[20px] course-placeholder__icon text-course-placeholder-icon" aria-hidden="true" />
        </div>
        <span className="text-admin-sm text-admin-text-muted">Nový kurz</span>
      </div>
    );
  }

  const dimensions =
    viewMode === 'grid-large'
      ? { width: '220px', height: '260px' }
      : { width: '140px', height: '160px' };

  return (
    <div
      onClick={() => router.push('/admin/courses/new')}
      className="course-placeholder flex flex-col items-center justify-center gap-2 bg-course-placeholder-bg border-2 border-dashed border-course-placeholder-border rounded-admin-md cursor-pointer"
      style={dimensions}
    >
      <i className="ti ti-plus course-placeholder__icon text-course-placeholder-icon" style={{ fontSize: 32 }} aria-hidden="true" />
      <span className="text-admin-xs text-admin-text-muted">Nový kurz</span>
    </div>
  );
}
