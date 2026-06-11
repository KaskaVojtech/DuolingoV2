'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/lib/courses/courses.types';

interface CourseCardSmallProps {
  course: Course;
}

export function CourseCardSmall({ course }: CourseCardSmallProps) {
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
      style={{ width: '140px', height: '160px' }}
    >

      <div
        className="relative"
        style={{ height: '60%', background: course.thumbnailColor }}
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
          className="course-card__gear absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full text-white"
          style={{ background: 'rgba(0,0,0,0.45)' }}
        >
          <i className="ti ti-settings text-[12px]" aria-hidden="true" />
        </button>
      </div>

      <div className="p-2">
        <p className="text-admin-text text-admin-sm font-medium line-clamp-1 leading-snug">{course.title}</p>
      </div>
    </div>
  );
}
