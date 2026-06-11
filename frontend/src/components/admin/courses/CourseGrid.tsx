import { Course, ViewMode } from '@/lib/courses/courses.types';
import { CourseCard } from './CourseCard';
import { CourseCardSmall } from './CourseCardSmall';
import { CourseListRow } from './CourseListRow';
import { CourseCardPlaceholder } from './CourseCardPlaceholder';

interface CourseGridProps {
  courses: Course[];
  viewMode: ViewMode;
}

export function CourseGrid({ courses, viewMode }: CourseGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col course-grid-enter border-t border-admin-border">
        {courses.map((c) => (
          <CourseListRow key={c.id} course={c} />
        ))}
        <CourseCardPlaceholder viewMode="list" />
      </div>
    );
  }

  const gridStyle =
    viewMode === 'grid-large'
      ? { gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'clamp(12px, 1.2vw, 20px)' }
      : { gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'clamp(8px, 1vw, 14px)' };

  return (
    <div className="grid course-grid-enter" style={gridStyle}>
      {courses.map((c) =>
        viewMode === 'grid-large'
          ? <CourseCard key={c.id} course={c} />
          : <CourseCardSmall key={c.id} course={c} />
      )}
      <CourseCardPlaceholder viewMode={viewMode} />
    </div>
  );
}
