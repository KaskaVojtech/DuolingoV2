'use client';

import React from 'react';
import { v4 as uuid } from 'uuid';
import { GameEditorProps } from '@/lib/mix-editor/mix-editor.types';
import { WordOrderData, WordOrderSentence } from './word-order.types';
import { GameEditorLayout } from '../shared/GameEditorLayout';
import { GameItemList } from '../shared/GameItemList';

function SentenceRow({
  sentence,
  onChange,
}: {
  sentence: WordOrderSentence;
  onChange: (s: WordOrderSentence) => void;
}) {
  const text = sentence.words.join(' ');

  function handleSentenceChange(value: string) {
    onChange({ ...sentence, words: value.split(' ').filter(Boolean) });
  }

  return (
    <div className="word-order-row">
      <div>
        <input
          className="admin-input"
          value={text}
          onChange={(e) => handleSentenceChange(e.target.value)}
          placeholder="Napište větu (automaticky se rozdělí na slova)"
        />
        {sentence.words.length > 0 && (
          <div className="word-order-row__chips">
            {sentence.words.map((w, i) => (
              <span key={i} className="word-order-row__chip">{w}</span>
            ))}
          </div>
        )}
      </div>
      <input
        className="admin-input"
        value={sentence.hint ?? ''}
        onChange={(e) => onChange({ ...sentence, hint: e.target.value || undefined })}
        placeholder="Překlad/nápověda (nepovinná)"
      />
    </div>
  );
}

export default function WordOrderEditor({ data, onChange }: GameEditorProps<WordOrderData>) {
  function updateSentence(id: string, updated: WordOrderSentence) {
    onChange({ ...data, sentences: data.sentences.map((s) => (s.id === id ? updated : s)) });
  }

  return (
    <GameEditorLayout title="Řazení slov" subtitle="Žák seřadí zamíchaná slova do správné věty">
      <GameItemList
        items={data.sentences}
        onAdd={() => onChange({ ...data, sentences: [...data.sentences, { id: uuid(), words: [] }] })}
        onRemove={(id) => onChange({ ...data, sentences: data.sentences.filter((s) => s.id !== id) })}
        minItems={1}
        maxItems={8}
        addLabel="Přidat větu"
        renderItem={(s) => (
          <SentenceRow sentence={s} onChange={(updated) => updateSentence(s.id, updated)} />
        )}
      />
      <label className="fill-in-toggle">
        <input
          type="checkbox"
          checked={data.showHint}
          onChange={(e) => onChange({ ...data, showHint: e.target.checked })}
        />
        {' '}Zobrazit nápovědy
      </label>
    </GameEditorLayout>
  );
}
