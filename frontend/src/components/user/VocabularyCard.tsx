'use client';

/**
 * Flippable vocabulary card (EN ↔ CS) with pronunciation and an example.
 */

import { useRef, useState } from 'react';
import { UserVocabWord } from '@/lib/user-auth/user-lesson.api';

const POS_LABEL: Record<string, string> = {
  noun: 'podst. jméno',
  verb: 'sloveso',
  adjective: 'příd. jméno',
  adverb: 'příslovce',
  phrase: 'fráze',
  preposition: 'předložka',
  pronoun: 'zájmeno',
  other: 'jiné',
};

export function VocabularyCard({ word }: { word: UserVocabWord }) {
  const [flipped, setFlipped] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (e: React.MouseEvent) => { e.stopPropagation(); audioRef.current?.play(); };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped((f) => !f); } }}
      className={`flip-card admin-card cursor-pointer select-none ${flipped ? 'flip-card--flipped' : ''}`}
    >
      <div className="flip-card__inner">

        <div className="flip-card__face">
          <div className="flex items-start justify-between gap-2">
            <span className="text-admin-xs text-admin-text-muted uppercase tracking-wide">{POS_LABEL[word.pos] ?? word.pos}</span>
            <div className="flex items-center gap-2">
              {word.pronunciationUrl && (
                <button type="button" onClick={playAudio} className="text-admin-text-muted hover:text-admin-primary transition-colors" title="Přehrát výslovnost">
                  <i className="ti ti-volume text-[18px]" />
                </button>
              )}
              <i className="ti ti-rotate-2 text-admin-text-muted text-[14px]" />
            </div>
          </div>
          {word.imageUrl && (

            <img src={word.imageUrl} alt={word.wordEn} className="h-14 object-contain self-center my-1" />
          )}
          <p className="text-admin-lg font-extrabold text-admin-text mt-auto">{word.wordEn}</p>
          {word.exampleSentence && (
            <p className="text-admin-xs text-admin-text-muted italic mt-1 line-clamp-2">{word.exampleSentence}</p>
          )}
        </div>

        <div className="flip-card__face flip-card__face--back">
          <div className="flex items-start justify-between gap-2">
            <span className="text-admin-xs text-admin-text-muted uppercase tracking-wide">překlad</span>
            <i className="ti ti-rotate-2 text-admin-text-muted text-[14px]" />
          </div>
          <p className="text-admin-xl font-extrabold text-admin-text m-auto">{word.wordCs}</p>
          <p className="text-admin-xs text-admin-text-muted text-center">{word.wordEn}</p>
        </div>
      </div>

      {word.pronunciationUrl && (

        <audio ref={audioRef} src={word.pronunciationUrl} preload="none" />
      )}
    </div>
  );
}
