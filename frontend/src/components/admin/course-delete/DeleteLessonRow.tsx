import { LessonDeletePreview } from '@/lib/course-delete/course-delete.types';

interface DeleteLessonRowProps {
  lesson: LessonDeletePreview;
  isPreserved: boolean;
  onToggle: () => void;
}

export function DeleteLessonRow({ lesson, isPreserved, onToggle }: DeleteLessonRowProps) {
  if (lesson.isTemplate) {
    return (
      <div className="flex items-center gap-3 px-admin-md py-2.5 text-admin-sm text-admin-text-muted border-b border-admin-border">
        <div className="w-4 shrink-0" />
        <i className="ti ti-file text-[14px]" aria-hidden="true" />
        <span className="flex-1">{lesson.title}</span>
        <span className="text-admin-xs text-admin-text-muted">{lesson.blocksCount} bloků</span>
        <span className="text-admin-xs bg-admin-surface-2 border border-admin-border px-2 py-0.5 rounded-full">ŠABLONA</span>
      </div>
    );
  }

  return (
    <div
      onClick={onToggle}
      className={`flex items-center gap-3 px-admin-md py-2.5 text-admin-sm cursor-pointer border-b border-admin-border transition-colors ${
        isPreserved
          ? 'bg-admin-sidebar-active border-l-2 border-l-admin-primary text-admin-text'
          : 'hover:bg-admin-sidebar-hover border-l-2 border-l-transparent text-admin-text'
      }`}
    >
      <input
        type="checkbox"
        checked={isPreserved}
        onChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        className="accent-admin-primary shrink-0"
      />
      <i className="ti ti-file text-[14px] shrink-0" aria-hidden="true" />
      <span className="flex-1">{lesson.title}</span>
      <span className="text-admin-xs text-admin-text-muted">{lesson.blocksCount} bloků</span>
    </div>
  );
}
