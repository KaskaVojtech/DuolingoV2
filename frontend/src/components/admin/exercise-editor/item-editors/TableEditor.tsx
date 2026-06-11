'use client';

import { v4 as uuid } from 'uuid';
import { TableComponent, TableCell, InputComponent, SelectComponent, SelectBetweenComponent } from '@/lib/exercise/exercise.types';

interface Props {
  item: TableComponent;
  onChange: (updated: TableComponent) => void;
}

function createCell(type: TableCell['type']): TableCell {
  if (type === 'static') return { type: 'static', value: '' };
  if (type === 'input') return { type: 'input', component: { type: 'input', id: uuid(), correct: '', evaluation: 'auto' } };
  if (type === 'select') return { type: 'select', component: { type: 'select', id: uuid(), options: ['možnost 1', 'možnost 2'], correct: 'možnost 1' } };
  return { type: 'select_between', component: { type: 'select_between', id: uuid(), options: ['možnost 1', 'možnost 2'], correct: 'možnost 1' } };
}

export function TableEditor({ item, onChange }: Props) {
  const addColumn = () => {
    const columns = [...item.columns, `Sloupec ${item.columns.length + 1}`];
    const rows = item.rows.map((row) => [...row, { type: 'static' as const, value: '' }]);
    onChange({ ...item, columns, rows });
  };

  const removeColumn = (colIdx: number) => {
    if (item.columns.length <= 1) return;
    const columns = item.columns.filter((_, i) => i !== colIdx);
    const rows = item.rows.map((row) => row.filter((_, i) => i !== colIdx));
    onChange({ ...item, columns, rows });
  };

  const addRow = () => {
    const row: TableCell[] = item.columns.map(() => ({ type: 'static', value: '' }));
    onChange({ ...item, rows: [...item.rows, row] });
  };

  const removeRow = (rowIdx: number) => {
    onChange({ ...item, rows: item.rows.filter((_, i) => i !== rowIdx) });
  };

  const updateCell = (rowIdx: number, colIdx: number, cell: TableCell) => {
    const rows = item.rows.map((row, ri) =>
      ri === rowIdx ? row.map((c, ci) => ci === colIdx ? cell : c) : row
    );
    onChange({ ...item, rows });
  };

  const changeCellType = (rowIdx: number, colIdx: number, type: TableCell['type']) => {
    updateCell(rowIdx, colIdx, createCell(type));
  };

  const CELL_TYPES: { value: TableCell['type']; label: string }[] = [
    { value: 'static', label: 'Text' },
    { value: 'input', label: 'Input' },
    { value: 'select', label: 'Select' },
    { value: 'select_between', label: 'Select between' },
  ];

  return (
    <div className="flex flex-col gap-admin-md overflow-x-auto">

      <div className="flex items-center gap-2 flex-wrap">
        {item.columns.map((col, ci) => (
          <div key={ci} className="flex items-center gap-1">
            <input
              className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text w-28"
              value={col}
              onChange={(e) => onChange({ ...item, columns: item.columns.map((c, i) => i === ci ? e.target.value : c) })}
            />
            <button onClick={() => removeColumn(ci)} className="text-admin-text-muted hover:text-admin-danger" aria-label="Odebrat sloupec">
              <i className="ti ti-x text-[12px]" aria-hidden="true" />
            </button>
          </div>
        ))}
        <button onClick={addColumn} className="text-admin-xs text-admin-primary flex items-center gap-1">
          <i className="ti ti-plus text-[12px]" aria-hidden="true" />
          Přidat sloupec
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {item.rows.map((row, ri) => (
          <div key={ri} className="flex items-center gap-2">
            {row.map((cell, ci) => (
              <div key={ci} className="flex flex-col gap-1">
                <select
                  className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-1 py-0.5 text-[10px] text-admin-text-muted"
                  value={cell.type}
                  onChange={(e) => changeCellType(ri, ci, e.target.value as TableCell['type'])}
                >
                  {CELL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {cell.type === 'static' && (
                  <input
                    className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text w-28"
                    value={cell.value}
                    onChange={(e) => updateCell(ri, ci, { type: 'static', value: e.target.value })}
                    placeholder="Text..."
                  />
                )}
                {cell.type === 'input' && (
                  <input
                    className="bg-admin-surface-2 border border-block-exercise-border rounded-admin-sm px-2 py-1 text-admin-xs text-block-exercise-primary w-28"
                    value={(cell.component as InputComponent).correct}
                    onChange={(e) => updateCell(ri, ci, { type: 'input', component: { ...(cell.component as InputComponent), correct: e.target.value } })}
                    placeholder="Správná odpověď..."
                  />
                )}
                {(cell.type === 'select' || cell.type === 'select_between') && (
                  <input
                    className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text w-28"
                    value={(cell.component as SelectComponent | SelectBetweenComponent).options.join(', ')}
                    onChange={(e) => {
                      const options = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      const comp = cell.component as SelectComponent | SelectBetweenComponent;
                      updateCell(ri, ci, { ...cell, component: { ...comp, options, correct: options[0] ?? '' } } as TableCell);
                    }}
                    placeholder="možnost1, možnost2..."
                  />
                )}
              </div>
            ))}
            <button onClick={() => removeRow(ri)} className="text-admin-text-muted hover:text-admin-danger" aria-label="Odebrat řádek">
              <i className="ti ti-trash text-[12px]" aria-hidden="true" />
            </button>
          </div>
        ))}
        <button onClick={addRow} className="text-admin-xs text-admin-primary flex items-center gap-1">
          <i className="ti ti-plus text-[12px]" aria-hidden="true" />
          Přidat řádek
        </button>
      </div>
    </div>
  );
}
