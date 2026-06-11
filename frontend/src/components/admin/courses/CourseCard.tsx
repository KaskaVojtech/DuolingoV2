'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/lib/courses/courses.types';
import { formatUpdatedAt } from '@/lib/courses/courses.utils';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
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
      className="course-card relative bg-course-card-bg border border-course-card-border rounded-admin-md overflow-hidden cursor-pointer hover:bg-course-card-hover"
      style={{ width: '220px', height: '260px' }}
    >

      <div
        className="relative"
        style={{ height: '55%', background: course.thumbnailColor }}
      >
        {course.thumbnailUrl && (
          <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/courses/${course.id}/settings`);
          }}
          aria-label="Nastavení kurzu"
          className="course-card__gear absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full text-white"
          style={{ background: 'rgba(0,0,0,0.45)' }}
        >
          <i className="ti ti-settings text-[14px]" aria-hidden="true" />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-1">
        <p className="font-semibold text-admin-text text-admin-sm line-clamp-2 leading-snug">{course.title}</p>
        <p className="text-admin-text-muted text-admin-xs">{course.lessonsCount} lekcí</p>
        <p className="text-admin-text-muted text-admin-xs">Upraveno {formatUpdatedAt(course.updatedAt)}</p>
      </div>
    </div>
  );
}
