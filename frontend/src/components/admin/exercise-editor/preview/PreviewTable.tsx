'use client';

import { TableComponent, TableCell, InputComponent, SelectComponent, SelectBetweenComponent } from '@/lib/exercise/exercise.types';

interface Props {
  item: TableComponent;
  answers: Record<string, string>;
  onAnswer: (id: string, value: string) => void;
}

export function PreviewTable({ item, answers, onAnswer }: Props) {
  const renderCell = (cell: TableCell) => {
    if (cell.type === 'static') return <span className="text-admin-sm text-admin-text">{cell.value}</span>;
    if (cell.type === 'input') {
      const comp = cell.component as InputComponent;
      return (
        <input
          className="preview-inline-input w-full"
          value={answers[comp.id] ?? ''}
          onChange={(e) => onAnswer(comp.id, e.target.value)}
          placeholder="___"
        />
      );
    }
    if (cell.type === 'select') {
      const comp = cell.component as SelectComponent;
      return (
        <select
          className="preview-inline-select w-full"
          value={answers[comp.id] ?? ''}
          onChange={(e) => onAnswer(comp.id, e.target.value)}
        >
          <option value="">—</option>
          {comp.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    if (cell.type === 'select_between') {
      const comp = cell.component as SelectBetweenComponent;
      return (
        <div className="flex gap-1 flex-wrap">
          {comp.options.map((o) => (
            <button
              key={o}
              onClick={() => onAnswer(comp.id, o)}
              className={`px-2 py-0.5 rounded text-admin-xs border transition-colors ${answers[comp.id] === o ? 'bg-admin-primary border-admin-primary text-white' : 'bg-admin-surface border-admin-border text-admin-text'}`}
            >
              {o}
            </button>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-admin-sm">
        <thead>
          <tr>
            {item.columns.map((col, ci) => (
              <th key={ci} className="px-admin-md py-2 text-left text-admin-text border border-admin-border bg-admin-surface-2 font-medium">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {item.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-admin-md py-2 border border-admin-border">{renderCell(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
