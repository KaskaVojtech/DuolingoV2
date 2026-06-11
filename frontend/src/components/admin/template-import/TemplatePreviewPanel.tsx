'use client';

import { useEffect, useState } from 'react';
import { useTemplateImportStore } from '@/lib/template-import/template-import.store';
import { useTemplates, fetchTemplateBlocks } from '@/lib/template-import/template-import.api';
import type { TemplateBlock } from '@/lib/template-import/template-import.types';

export function TemplatePreviewPanel() {
  const { previewTemplateId } = useTemplateImportStore();
  const { data: templates } = useTemplates();
  const template = templates?.find((t) => t.id === previewTemplateId);
  const [blocks, setBlocks] = useState<TemplateBlock[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!previewTemplateId) { setBlocks([]); return; }
    setLoading(true);
    fetchTemplateBlocks(previewTemplateId).then((b) => { setBlocks(b); setLoading(false); });
  }, [previewTemplateId]);

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-admin-text-muted p-admin-2xl text-center">
        <i className="ti ti-eye text-[36px] mb-admin-md" aria-hidden="true" />
        <p className="text-admin-sm">Vyberte šablonu pro zobrazení náhledu</p>
      </div>
    );
  }

  const date = new Date(template.createdAt).toLocaleDateString('cs-CZ', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="p-admin-xl h-full overflow-y-auto">
      <h2 className="text-admin-lg font-semibold text-admin-text mb-1">{template.title}</h2>
      <div className="h-px bg-admin-border mb-admin-lg" />

      {loading ? (
        <p className="text-admin-sm text-admin-text-muted">Načítám bloky...</p>
      ) : (
        <div className="mb-admin-lg">
          <p className="text-admin-xs text-admin-text-muted uppercase tracking-wide mb-admin-sm">
            Bloky ({blocks.length})
          </p>
          <div className="flex flex-col gap-1">
            {blocks.map((block) => (
              <div key={block.id} className="flex items-start gap-2 py-1.5">
                <i
                  className={`ti ${block.type === 'content' ? 'ti-file-text text-admin-text-muted' : 'ti-dumbbell text-block-exercise-primary'} text-[14px] mt-0.5 shrink-0`}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-admin-sm text-admin-text truncate block">{block.title}</span>
                  <span className="text-admin-xs text-admin-text-muted">
                    {block.type === 'content' ? 'obsah' : 'cvičení'}
                    {block.isMandatory && ' · povinné'}
                    {block.requiresReadConfirmation && ' · potvrdit přečtení'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {template.usedInCourses.length > 0 && (
        <div className="mb-admin-lg">
          <p className="text-admin-xs text-admin-text-muted uppercase tracking-wide mb-admin-sm">
            Použita v kurzech
          </p>
          <ul className="flex flex-col gap-1">
            {template.usedInCourses.map((course) => (
              <li key={course} className="text-admin-sm text-admin-text flex items-center gap-1">
                <span className="text-admin-text-muted">·</span> {course}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-admin-xs text-admin-text-muted">Vytvořena: {date}</p>
    </div>
  );
}
