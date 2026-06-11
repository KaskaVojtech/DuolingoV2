'use client';

import { useEffect, useState } from 'react';
import { useTemplateImportStore } from '@/lib/template-import/template-import.store';
import { useTemplates } from '@/lib/template-import/template-import.api';

const MAX_VISIBLE = 5;

export function FloatingLessonCursor() {
  const { selectedTemplateIds, isImporting } = useTemplateImportStore();
  const { data: templates } = useTemplates();
  const [pos, setPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const selected = (templates ?? []).filter((t) => selectedTemplateIds.includes(t.id));
  const visible = selected.slice(0, MAX_VISIBLE);
  const extra = selected.length - MAX_VISIBLE;

  return (
    <div
      className="floating-cursor"
      style={{ left: pos.x + 16, top: pos.y + 8, opacity: isImporting ? 0.6 : 0.9 }}
    >
      {isImporting ? (
        <div className="floating-cursor__item text-admin-text-muted">
          <i className="ti ti-loader-2 animate-spin text-admin-primary" aria-hidden="true" />
          Importuji lekce...
        </div>
      ) : (
        <>
          {visible.map((t) => (
            <div key={t.id} className="floating-cursor__item">
              <i className="ti ti-file-text text-[13px] text-admin-text-muted shrink-0" aria-hidden="true" />
              <span className="truncate">{t.title}</span>
            </div>
          ))}
          {extra > 0 && (
            <div className="floating-cursor__more">+{extra} dalších</div>
          )}
        </>
      )}
    </div>
  );
}
