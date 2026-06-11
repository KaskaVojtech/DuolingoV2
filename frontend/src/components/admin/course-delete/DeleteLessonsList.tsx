import { LessonDeletePreview } from '@/lib/course-delete/course-delete.types';
import { DeleteLessonRow } from './DeleteLessonRow';

interface DeleteLessonsListProps {
  lessons: LessonDeletePreview[];
  preservedIds: Set<string>;
  onToggle: (id: string) => void;
  onPreserveAll: () => void;
}

export function DeleteLessonsList({ lessons, preservedIds, onToggle, onPreserveAll }: DeleteLessonsListProps) {
  const nonTemplates = lessons.filter((l) => !l.isTemplate);
  const templates = lessons.filter((l) => l.isTemplate);
  const toDelete = nonTemplates.filter((l) => !preservedIds.has(l.id)).length;
  const preserved = preservedIds.size;

  return (
    <div className="mb-admin-lg">
      <p className="text-admin-sm text-admin-text-muted mb-admin-sm">
        Lekce uložené jako šablony nebudou smazány. Ostatní lekce budou odstraněny — zaškrtněte ty které chcete zachovat.
      </p>
      <label className="flex items-center gap-2 text-admin-sm text-admin-text mb-2 cursor-pointer">
        <input
          type="checkbox"
          checked={nonTemplates.length > 0 && nonTemplates.every((l) => preservedIds.has(l.id))}
          onChange={onPreserveAll}
          className="accent-admin-primary"
        />
        Zachovat všechny
      </label>
      <div className="border border-admin-border rounded-admin-md overflow-hidden">
        {lessons.map((l) => (
          <DeleteLessonRow
            key={l.id}
            lesson={l}
            isPreserved={preservedIds.has(l.id)}
            onToggle={() => onToggle(l.id)}
          />
        ))}
      </div>
      <p className="text-admin-xs text-admin-text-muted mt-2">
        Bude smazáno: <strong className="text-admin-danger">{toDelete} lekcí</strong> &nbsp;|&nbsp;
        Zachováno: <strong className="text-admin-text">{preserved} lekcí</strong> &nbsp;|&nbsp;
        Šablony (přežijí): <strong className="text-admin-text">{templates.length}</strong>
      </p>
    </div>
  );
}
