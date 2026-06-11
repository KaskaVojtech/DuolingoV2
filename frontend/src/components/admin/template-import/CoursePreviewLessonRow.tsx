import { CourseLesson } from '@/lib/template-import/template-import.types';

interface Props { lesson: CourseLesson }

export function CoursePreviewLessonRow({ lesson }: Props) {
  return (
    <div className="course-preview__lesson-row">
      <div className="course-preview__lesson-title">
        {lesson.isLocked && (
          <i className="ti ti-lock text-admin-danger text-[13px]" aria-hidden="true" />
        )}
        <span>{lesson.title}</span>
      </div>
      <span className="course-preview__lesson-meta">
        {lesson.blocksCount} {lesson.blocksCount === 1 ? 'blok' : lesson.blocksCount < 5 ? 'bloky' : 'bloků'}
      </span>
    </div>
  );
}
