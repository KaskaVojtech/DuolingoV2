'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/lib/courses/courses.types';
import { formatUpdatedAt } from '@/lib/courses/courses.utils';

interface CourseListRowProps {
  course: Course;
}

export function CourseListRow({ course }: CourseListRowProps) {
  const router = useRouter();
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      router.push(`/admin/courses/${course.id}/lessons`);
    } else {
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
      }, 250);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="course-card flex items-center gap-admin-md px-admin-md cursor-pointer hover:bg-admin-sidebar-hover border-b border-admin-border"
      style={{ height: '64px' }}
    >

      <div
        className="shrink-0 rounded-admin-sm overflow-hidden"
        style={{ width: 48, height: 48, background: course.thumbnailColor }}
      >
        {course.thumbnailUrl && (
          <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-admin-sm font-medium text-admin-text truncate">{course.title}</p>
        <p className="text-admin-xs text-admin-text-muted truncate">{course.description}</p>
      </div>

      <div className="text-admin-xs text-admin-text-muted w-24 text-right shrink-0">
        {course.lessonsCount} lekcí
      </div>

      <div className="text-admin-xs text-admin-text-muted w-28 text-right shrink-0">
        {formatUpdatedAt(course.updatedAt)}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/admin/courses/${course.id}/settings`);
        }}
        aria-label="Nastavení kurzu"
        className="course-card__gear shrink-0 w-8 h-8 flex items-center justify-center rounded-admin-sm text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-2 transition-colors"
      >
        <i className="ti ti-settings text-[16px]" aria-hidden="true" />
      </button>
    </div>
  );
}
