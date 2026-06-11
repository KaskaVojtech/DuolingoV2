'use client';

import { useEffect, useRef } from 'react';
import { TableBlock as TBlock, TableCell } from '@/lib/content-editor/content-editor.types';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';

interface CellProps {
  cell: TableCell;
  isHeader: boolean;
  onInput: (html: string) => void;
}

function EditableCell({ cell, isHeader, onInput }: CellProps) {
  const ref = useRef<HTMLTableCellElement>(null);
  const lastHtmlRef = useRef(cell.html);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = cell.html;
    lastHtmlRef.current = cell.html;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ref.current && cell.html !== lastHtmlRef.current) {
      ref.current.innerHTML = cell.html;
      lastHtmlRef.current = cell.html;
    }
  }, [cell.html]);

  return (
    <td
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      style={{
        textAlign: cell.textAlign,
        fontWeight: isHeader ? 700 : cell.fontWeight,
        backgroundColor: cell.backgroundColor ?? (isHeader ? 'rgba(255,255,255,0.06)' : 'transparent'),
        color: cell.textColor ?? 'inherit',
      }}
      onInput={(e) => {
        const html = e.currentTarget.innerHTML;
        lastHtmlRef.current = html;
        onInput(html);
      }}
    />
  );
}

interface Props { block: TBlock }

export function TableBlock({ block }: Props) {
  const { updateTableCell, addTableRow, addTableColumn, removeTableRow, removeTableColumn } = useContentEditorStore();

  const wrapStyle = {
    backgroundColor: block.backgroundColor ?? 'transparent',
    padding: `${block.paddingTop}px ${block.paddingRight}px ${block.paddingBottom}px ${block.paddingLeft}px`,
    border: block.borderWidth > 0 ? `${block.borderWidth}px solid ${block.borderColor}` : 'none',
    borderRadius: block.borderRadius,
  };

  const colCount = block.rows[0]?.length ?? 0;

  return (
    <div style={wrapStyle} className="group/table overflow-x-auto">

      <div className="flex mb-1 pl-6">
        {Array.from({ length: colCount }, (_, ci) => (
          <div key={ci} className="flex-1 flex justify-center">
            <button
              type="button"
              onClick={() => removeTableColumn(block.id, ci)}
              className="content-table__add-col text-[10px] text-admin-danger opacity-0 group-hover/table:opacity-40 hover:!opacity-100"
              aria-label="Odebrat sloupec"
            >×</button>
          </div>
        ))}
      </div>

      <div className="flex gap-1">

        <div className="flex flex-col gap-0 justify-center">
          {block.rows.map((_, ri) => (
            <button key={ri} type="button"
              onClick={() => removeTableRow(block.id, ri)}
              className="content-table__add-row text-[10px] text-admin-danger opacity-0 group-hover/table:opacity-40 hover:!opacity-100 h-[33px] flex items-center"
              aria-label="Odebrat řádek"
            >×</button>
          ))}
        </div>

        <table className="content-table flex-1" style={{ fontSize: block.fontSize, color: block.textColor }}>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => {
                  const isHeader = (block.hasHeaderRow && ri === 0) || (block.hasHeaderColumn && ci === 0);
                  return (
                    <EditableCell
                      key={ci}
                      cell={cell}
                      isHeader={isHeader}
                      onInput={(html) => updateTableCell(block.id, ri, ci, { html })}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button"
          onClick={() => addTableColumn(block.id, colCount - 1)}
          className="content-table__add-col self-center px-1 text-admin-text-muted text-[18px]"
          aria-label="Přidat sloupec"
        >+</button>
      </div>

      <button type="button"
        onClick={() => addTableRow(block.id, block.rows.length - 1)}
        className="content-table__add-row mt-1 w-full text-admin-xs text-admin-text-muted text-center py-1"
        aria-label="Přidat řádek"
      >+ Přidat řádek</button>
    </div>
  );
}
