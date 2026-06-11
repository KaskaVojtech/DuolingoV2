'use client';

import { useTemplateImportStore } from '@/lib/template-import/template-import.store';

interface Props {
  afterOrder: number;
  onInsert: (afterOrder: number) => void;
}

export function DropZoneIndicator({ afterOrder, onInsert }: Props) {
  const { activeDropZone, setActiveDropZone, selectedTemplateIds, isImporting } = useTemplateImportStore();
  const isActive = activeDropZone?.afterOrder === afterOrder;
  const count = selectedTemplateIds.length;
  const label = count === 1 ? '1 lekce' : count < 5 ? `${count} lekce` : `${count} lekcí`;

  return (
    <button
      type="button"
      disabled={isImporting}
      className={`drop-zone-indicator ${isActive ? 'drop-zone-indicator--active' : ''}`}
      onMouseEnter={() => setActiveDropZone({ afterOrder })}
      onMouseLeave={() => setActiveDropZone(null)}
      onClick={() => onInsert(afterOrder)}
    >
      <span className="drop-zone-indicator__label">
        <i className="ti ti-plus text-[14px]" aria-hidden="true" />
        Vložit zde ({label})
      </span>
    </button>
  );
}
