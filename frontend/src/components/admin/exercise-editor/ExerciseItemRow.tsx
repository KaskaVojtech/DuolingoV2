'use client';

import { useState } from 'react';
import { ExerciseItem, DragAndDropComponent } from '@/lib/exercise/exercise.types';
import { useExerciseStore } from '@/lib/exercise/exercise.store';
import { getItemLabel } from '@/lib/exercise/exercise.utils';
import { inlineContentToText } from '@/lib/exercise/inline-parser';
import { SortableItem } from '@/components/admin/common/sortable/SortableItem';
import { ExerciseItemOrderButtons } from './ExerciseItemOrderButtons';
import { InlineContentEditor } from './item-editors/InlineContentEditor';
import { McEditor } from './item-editors/McEditor';
import { HighlightEditor } from './item-editors/HighlightEditor';
import { TableEditor } from './item-editors/TableEditor';
import { DragAndDropEditor } from './item-editors/DragAndDropEditor';
import { ImageEditor } from './item-editors/ImageEditor';
import { AudioEditor } from './item-editors/AudioEditor';
import { VideoEditor } from './item-editors/VideoEditor';
import { AnswerEditor } from './item-editors/AnswerEditor';

const TYPE_COLORS: Record<string, string> = {
  inline: '#8c91bd',
  image: '#2db868',
  audio: '#9b59f7',
  video: '#5b7cfa',
  answer: '#f5a623',
  mc: '#f7c948',
  highlight: '#f0566b',
  table: '#2db8b8',
  drag_and_drop: '#b464c8',
};

function getPreviewText(item: ExerciseItem): string {
  if (item.type === 'inline') return inlineContentToText(item) || '(prázdný text)';
  if (item.type === 'mc') return item.question || '(bez otázky)';
  if (item.type === 'highlight') return item.content.map((n) => n.value).join(' ') || '(bez textu)';
  if (item.type === 'image') return item.url || '(bez URL)';
  if (item.type === 'audio') return item.title || item.url || '(bez názvu)';
  if (item.type === 'video') return item.title || item.url || '(bez názvu)';
  if (item.type === 'answer') return `Odpověď (${item.length === 'short' ? 'krátká' : 'dlouhá'})`;
  if (item.type === 'table') return `Tabulka (${item.columns.length}×${item.rows.length})`;
  if (item.type === 'drag_and_drop') return `Přetahování (${(item as DragAndDropComponent).source.words.length} slov)`;
  return getItemLabel(item);
}

interface Props { item: ExerciseItem; isFirst: boolean; isLast: boolean; }

export function ExerciseItemRow({ item, isFirst, isLast }: Props) {
  const { activeItemId, setActiveItem, updateItem, deleteItem, exercise } = useExerciseStore();
  const isActive = activeItemId === item.id;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const color = TYPE_COLORS[item.type] ?? '#8c91bd';

  const dragSources = exercise.items.filter((i) => i.type === 'drag_and_drop') as DragAndDropComponent[];

  const handleDelete = () => {
    if (confirmDelete) { deleteItem(item.id); }
    else setConfirmDelete(true);
  };

  const renderEditor = () => {
    if (item.type === 'inline') {
      return <InlineContentEditor content={item} dragSources={dragSources} onChange={(u) => updateItem(item.id, u)} />;
    }
    if (item.type === 'mc') return <McEditor item={item} onChange={(u) => updateItem(item.id, u)} />;
    if (item.type === 'highlight') return <HighlightEditor item={item} onChange={(u) => updateItem(item.id, u)} />;
    if (item.type === 'table') return <TableEditor item={item} onChange={(u) => updateItem(item.id, u)} />;
    if (item.type === 'drag_and_drop') return <DragAndDropEditor item={item} onChange={(u) => updateItem(item.id, u)} />;
    if (item.type === 'image') return <ImageEditor item={item} onChange={(u) => updateItem(item.id, u)} />;
    if (item.type === 'audio') return <AudioEditor item={item} onChange={(u) => updateItem(item.id, u)} />;
    if (item.type === 'video') return <VideoEditor item={item} onChange={(u) => updateItem(item.id, u)} />;
    if (item.type === 'answer') return <AnswerEditor item={item} onChange={(u) => updateItem(item.id, u)} />;
    return null;
  };

  return (
    <SortableItem id={item.id}>
      {({ attributes, listeners, isDragging, setNodeRef, style }) => (
        <div
          ref={setNodeRef}
          style={style}
          className={`exercise-item-row mb-admin-sm ${isActive ? 'exercise-item-row--active' : ''} ${isDragging ? 'opacity-50' : ''}`}
        >

          <div
            className="flex items-center gap-3 px-admin-md py-2.5 cursor-pointer"
            onClick={() => setActiveItem(isActive ? null : item.id)}
          >
            <button {...listeners} {...attributes} className="block-drag-handle shrink-0" onClick={(e) => e.stopPropagation()} aria-label={`Přetáhnout ${getItemLabel(item)}`}>
              <i className="ti ti-grip-vertical text-[16px]" aria-hidden="true" />
            </button>
            <span
              className="shrink-0 px-2 py-0.5 rounded text-admin-xs font-medium border"
              style={{ color, borderColor: color + '55', background: color + '18' }}
            >
              {getItemLabel(item)}
            </span>
            <span className="flex-1 text-admin-sm text-admin-text-muted truncate">{getPreviewText(item)}</span>
            <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1">
              <ExerciseItemOrderButtons itemId={item.id} isFirst={isFirst} isLast={isLast} />
              {confirmDelete ? (
                <>
                  <button onClick={() => setConfirmDelete(false)} className="text-admin-xs text-admin-text-muted px-2 py-1 hover:text-admin-text">Zrušit</button>
                  <button onClick={handleDelete} className="text-admin-xs text-admin-danger px-2 py-1">Smazat?</button>
                </>
              ) : (
                <button onClick={handleDelete} className="w-7 h-7 flex items-center justify-center text-admin-text-muted hover:text-admin-danger hover:bg-admin-danger-bg rounded-admin-sm transition-colors" aria-label="Smazat">
                  <i className="ti ti-trash text-[14px]" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {isActive && (
            <div className="px-admin-md pb-admin-md pt-2 border-t border-admin-border">
              {renderEditor()}
            </div>
          )}
        </div>
      )}
    </SortableItem>
  );
}
