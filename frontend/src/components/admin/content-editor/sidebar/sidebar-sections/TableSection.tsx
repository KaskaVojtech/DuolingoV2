'use client';

import { TableBlock } from '@/lib/content-editor/content-editor.types';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';

export function TableSection({ block }: { block: TableBlock }) {
  const { updateBlock, addTableRow, addTableColumn } = useContentEditorStore();
  const lastRowIndex = block.rows.length - 1;
  const lastColIndex = (block.rows[0]?.length ?? 1) - 1;

  return (
    <div className="content-sidebar__section">
      <div className="content-sidebar__section-title">Tabulka</div>

      <div className="flex flex-col gap-2 mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={block.hasHeaderRow}
            onChange={(e) => updateBlock(block.id, { hasHeaderRow: e.target.checked })}
            className="accent-admin-primary"
          />
          <span className="text-admin-xs text-admin-text">První řádek jako záhlaví</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={block.hasHeaderColumn}
            onChange={(e) => updateBlock(block.id, { hasHeaderColumn: e.target.checked })}
            className="accent-admin-primary"
          />
          <span className="text-admin-xs text-admin-text">První sloupec jako záhlaví</span>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <button type="button" onClick={() => addTableRow(block.id, lastRowIndex)}
          className="w-full py-1.5 text-admin-xs text-admin-primary border border-admin-border rounded-admin-sm hover:bg-admin-surface-2 flex items-center justify-center gap-1 transition-colors"
        >
          <i className="ti ti-plus text-[12px]" aria-hidden="true" /> Přidat řádek
        </button>
        <button type="button" onClick={() => addTableColumn(block.id, lastColIndex)}
          className="w-full py-1.5 text-admin-xs text-admin-primary border border-admin-border rounded-admin-sm hover:bg-admin-surface-2 flex items-center justify-center gap-1 transition-colors"
        >
          <i className="ti ti-plus text-[12px]" aria-hidden="true" /> Přidat sloupec
        </button>
      </div>
    </div>
  );
}
