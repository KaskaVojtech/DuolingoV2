'use client';

import { InlineContent } from '@/lib/exercise/exercise.types';

interface CheckResult { [nodeId: string]: boolean | 'teacher' }

interface Props {
  content: InlineContent;
  answers: Record<string, string>;
  onAnswer: (nodeId: string, value: string) => void;
  checked: boolean;
  results: CheckResult;
}

export function PreviewInlineContent({ content, answers, onAnswer, checked, results }: Props) {
  return (
    <p className="flex flex-wrap items-center gap-1">
      {content.nodes.map((node, idx) => {
        if (node.type === 'text') {
          return <span key={idx}>{node.value}</span>;
        }

        if (node.type === 'input') {
          const val = answers[node.id] ?? '';
          const resultClass = checked
            ? results[node.id] === true ? 'preview-result--correct' : results[node.id] === false ? 'preview-result--wrong' : ''
            : '';
          return (
            <span key={node.id} className="inline-flex flex-col items-start">
              <input
                className={`preview-inline-input ${resultClass}`}
                value={val}
                onChange={(e) => onAnswer(node.id, e.target.value)}
                placeholder="___"
              />
              {checked && results[node.id] === false && node.hint && (
                <span className="text-admin-xs text-admin-danger">{node.hint}</span>
              )}
            </span>
          );
        }

        if (node.type === 'select') {
          const resultClass = checked
            ? results[node.id] === true ? 'preview-result--correct' : 'preview-result--wrong'
            : '';
          return (
            <select
              key={node.id}
              className={`preview-inline-select ${resultClass}`}
              value={answers[node.id] ?? ''}
              onChange={(e) => onAnswer(node.id, e.target.value)}
            >
              <option value="">—</option>
              {node.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          );
        }

        if (node.type === 'select_between') {
          return (
            <span key={node.id} className="inline-flex gap-1">
              {node.options.map((o) => (
                <button
                  key={o}
                  onClick={() => onAnswer(node.id, o)}
                  className={`px-2 py-0.5 rounded text-admin-sm border transition-colors ${answers[node.id] === o
                    ? 'bg-admin-primary border-admin-primary text-white'
                    : 'bg-admin-surface-2 border-admin-border text-admin-text hover:border-admin-primary'}`}
                >
                  {o}
                </button>
              ))}
            </span>
          );
        }

        if (node.type === 'drag_target') {
          const filled = answers[node.id];
          return (
            <span
              key={node.id}
              className={`preview-drag-target ${filled ? 'preview-drag-target--filled' : ''} ${checked && results[node.id] === true ? 'preview-result--correct' : checked && results[node.id] === false ? 'preview-result--wrong' : ''}`}
            >
              {filled || ''}
            </span>
          );
        }

        return null;
      })}
    </p>
  );
}
