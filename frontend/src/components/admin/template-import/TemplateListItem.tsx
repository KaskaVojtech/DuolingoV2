'use client';

import { LessonTemplate } from '@/lib/template-import/template-import.types';
import { useTemplateImportStore } from '@/lib/template-import/template-import.store';

interface Props { template: LessonTemplate }

export function TemplateListItem({ template }: Props) {
  const { selectedTemplateIds, previewTemplateId, toggleTemplate, setPreviewTemplate } = useTemplateImportStore();
  const isSelected = selectedTemplateIds.includes(template.id);
  const isPreviewing = previewTemplateId === template.id;

  const date = new Date(template.createdAt).toLocaleDateString('cs-CZ', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div
      className={`template-list-item ${isSelected ? 'template-list-item--selected' : ''}`}
      onClick={() => setPreviewTemplate(isPreviewing ? null : template.id)}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => { e.stopPropagation(); toggleTemplate(template.id); }}
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5 accent-admin-primary shrink-0"
          aria-label={`Vybrat šablonu ${template.title}`}
        />
        <div className="flex-1 min-w-0">
          <p className="template-list-item__title truncate">{template.title}</p>
          <p className="template-list-item__meta">
            {template.blocksCount} {template.blocksCount === 1 ? 'blok' : template.blocksCount < 5 ? 'bloky' : 'bloků'}
            {' '}({template.contentBlocksCount} obsah, {template.exerciseBlocksCount} cvičení)
            {template.usedInCourses.length > 0 && (
              <> · Použita: {template.usedInCourses.length} {template.usedInCourses.length === 1 ? 'kurz' : template.usedInCourses.length < 5 ? 'kurzy' : 'kurzů'}</>
            )}
          </p>
          <p className="template-list-item__meta">Vytvořena: {date}</p>
        </div>
      </div>
    </div>
  );
}
