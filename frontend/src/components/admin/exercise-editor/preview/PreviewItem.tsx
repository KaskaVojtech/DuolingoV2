'use client';

import { ExerciseItem } from '@/lib/exercise/exercise.types';
import { PreviewInlineContent } from './PreviewInlineContent';
import { PreviewMc } from './PreviewMc';
import { PreviewHighlight } from './PreviewHighlight';
import { PreviewTable } from './PreviewTable';
import { PreviewDragAndDrop } from './PreviewDragAndDrop';

interface Props {
  item: ExerciseItem;
  answers: Record<string, string>;
  mcSelected: Record<string, string[]>;
  hlSelected: Record<string, string[]>;
  onAnswer: (nodeId: string, value: string) => void;
  onMcToggle: (itemId: string, optionId: string) => void;
  onHlToggle: (itemId: string, word: string) => void;
  checked: boolean;
  results: Record<string, boolean | 'teacher'>;
}

export function PreviewItem({ item, answers, mcSelected, hlSelected, onAnswer, onMcToggle, onHlToggle, checked, results }: Props) {
  if (item.type === 'inline') {
    return (
      <PreviewInlineContent
        content={item}
        answers={answers}
        onAnswer={onAnswer}
        checked={checked}
        results={results}
      />
    );
  }

  if (item.type === 'image') {
    return (
      <figure>
        {item.url ? (

          <img src={item.url} alt={item.caption ?? ''} className="max-w-full rounded-admin-md" />
        ) : (
          <div className="w-full h-24 bg-admin-surface-2 rounded-admin-md flex items-center justify-center text-admin-xs text-admin-text-muted">
            Obrázek nebyl nahrán
          </div>
        )}
        {item.caption && <figcaption className="text-admin-xs text-admin-text-muted mt-1">{item.caption}</figcaption>}
      </figure>
    );
  }

  if (item.type === 'audio') {
    return (
      <div>
        {item.title && <p className="text-admin-sm text-admin-text-muted mb-2">{item.title}</p>}
        <audio src={item.url} controls className="w-full" />
      </div>
    );
  }

  if (item.type === 'video') {
    return (
      <div>
        {item.title && <p className="text-admin-sm text-admin-text-muted mb-2">{item.title}</p>}
        <video src={item.url} controls className="w-full rounded-admin-md" />
      </div>
    );
  }

  if (item.type === 'answer') {
    const val = answers[item.id] ?? '';
    return item.length === 'long'
      ? <textarea
          className="w-full preview-inline-input resize-none min-h-[80px] rounded-admin-sm"
          value={val}
          onChange={(e) => onAnswer(item.id, e.target.value)}
          placeholder={item.placeholder || 'Vaše odpověď...'}
        />
      : <input
          className="w-full preview-inline-input"
          value={val}
          onChange={(e) => onAnswer(item.id, e.target.value)}
          placeholder={item.placeholder || 'Vaše odpověď...'}
        />;
  }

  if (item.type === 'mc') {
    return (
      <PreviewMc
        item={item}
        selected={mcSelected[item.id] ?? []}
        onToggle={(optId) => onMcToggle(item.id, optId)}
        checked={checked}
      />
    );
  }

  if (item.type === 'highlight') {
    return (
      <PreviewHighlight
        item={item}
        selected={hlSelected[item.id] ?? []}
        onToggle={(word) => onHlToggle(item.id, word)}
        checked={checked}
      />
    );
  }

  if (item.type === 'table') {
    return <PreviewTable item={item} answers={answers} onAnswer={onAnswer} />;
  }

  if (item.type === 'drag_and_drop') {
    return (
      <PreviewDragAndDrop
        item={item}
        answers={answers}
        onAnswer={onAnswer}
        checked={checked}
      />
    );
  }

  return null;
}
