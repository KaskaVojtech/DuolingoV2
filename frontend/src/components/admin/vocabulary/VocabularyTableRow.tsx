'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LessonVocabularyEntry } from '@/lib/vocabulary/vocabulary.types';
import { useUIStore } from '@/lib/stores/ui.store';
import { truncate, formatRelativeDate } from '@/lib/vocabulary/vocabulary.utils';
import { PosBadge } from './PosBadge';

interface Props { entry: LessonVocabularyEntry }

export function VocabularyTableRow({ entry }: Props) {
  const { word } = entry;
  const [expanded, setExpanded] = useState(false);
  const { openModal } = useUIStore();
  const hasDetail = !!(word.exampleSentence || word.note || word.imageUrl || word.pronunciationUrl);

  const handleRowClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    if (hasDetail) setExpanded(!expanded);
  };

  return (
    <>
      <tr
        className={hasDetail ? 'cursor-pointer' : ''}
        onClick={handleRowClick}
      >
        <td className="px-admin-md py-2 border-b border-admin-border font-medium text-admin-text">
          {word.wordEn}
        </td>
        <td className="px-admin-md py-2 border-b border-admin-border text-admin-text-muted">
          {word.wordCs}
        </td>
        <td className="px-admin-md py-2 border-b border-admin-border" style={{ width: 130 }}>
          <PosBadge pos={word.pos} />
        </td>
        <td className="px-admin-md py-2 border-b border-admin-border text-admin-text-muted" style={{ width: 200 }}>
          {word.exampleSentence ? truncate(word.exampleSentence, 40) : '—'}
        </td>
        <td className="px-admin-md py-2 border-b border-admin-border" style={{ width: 140 }}>
          {entry.importedFromLessonId ? (
            <Link
              href={`/admin/lessons/${entry.importedFromLessonId}/vocabulary`}
              onClick={(e) => e.stopPropagation()}
              className="import-source-badge"
            >
              <i className="ti ti-link text-[11px]" aria-hidden="true" />
              {entry.importedFromLessonTitle}
            </Link>
          ) : (
            <span className="text-admin-xs text-admin-text-muted">Vlastní</span>
          )}
        </td>
        <td className="px-admin-md py-2 border-b border-admin-border text-admin-text-muted" style={{ width: 100 }}>
          {formatRelativeDate(entry.addedAt)}
        </td>
        <td className="px-admin-md py-2 border-b border-admin-border" style={{ width: 80 }}>
          <div className="row-actions flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); openModal('editWord', { wordId: word.id, entryId: entry.id }); }}
              className="w-7 h-7 flex items-center justify-center text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-2 rounded-admin-sm transition-colors"
              aria-label="Upravit"
            >
              <i className="ti ti-edit text-[13px]" aria-hidden="true" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); openModal('deleteWord', { entryId: entry.id, wordEn: word.wordEn, wordCs: word.wordCs }); }}
              className="w-7 h-7 flex items-center justify-center text-admin-text-muted hover:text-admin-danger hover:bg-admin-danger-bg rounded-admin-sm transition-colors"
              aria-label="Smazat"
            >
              <i className="ti ti-trash text-[13px]" aria-hidden="true" />
            </button>
          </div>
        </td>
      </tr>

      {expanded && hasDetail && (
        <tr>
          <td colSpan={7} className="vocabulary-detail">
            <div className="vocabulary-detail__text">
              {word.exampleSentence && (
                <p className="mb-1"><span className="text-admin-text-muted">Příklad:</span> <span className="text-admin-text italic">&ldquo;{word.exampleSentence}&rdquo;</span></p>
              )}
              {word.note && (
                <p><span className="text-admin-text-muted">Poznámka:</span> <span className="text-admin-text">{word.note}</span></p>
              )}
            </div>
            {(word.imageUrl || word.pronunciationUrl) && (
              <div className="vocabulary-detail__media">
                {word.imageUrl && (

                  <img src={word.imageUrl} alt={word.wordEn} className="word-image" />
                )}
                {word.pronunciationUrl && (
                  <button
                    className="play-btn"
                    onClick={() => new Audio(word.pronunciationUrl!).play()}
                    aria-label="Přehrát výslovnost"
                  >
                    <i className="ti ti-volume text-[14px] text-admin-text-muted" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
