'use client';

import React, { useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { GameEditorProps } from '@/lib/mix-editor/mix-editor.types';
import { FillInData, FillInSentence } from './fill-in.types';
import { GameEditorLayout } from '../shared/GameEditorLayout';
import { GameItemList } from '../shared/GameItemList';
import { BlankInsertButton } from '../shared/BlankInsertButton';

function SentenceRow({
  sentence,
  onChange,
}: {
  sentence: FillInSentence;
  onChange: (s: FillInSentence) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null!);
  const hasBlank = sentence.sentence.includes('{blank}');

  return (
    <div className="fill-in-row">
      <div className="fill-in-row__sentence">
        <div className="fill-in-row__input-wrap">
          <input
            ref={inputRef}
            className={`admin-input fill-in-row__input ${!hasBlank && sentence.sentence ? 'fill-in-row__input--error' : ''}`}
            value={sentence.sentence}
            onChange={(e) => onChange({ ...sentence, sentence: e.target.value })}
            placeholder="Věta s {blank} (klikněte [MEZERA] pro vložení)"
          />
          <BlankInsertButton
            targetRef={inputRef}
            placeholder="{blank}"
            onInsert={(v) => onChange({ ...sentence, sentence: v })}
          />
        </div>
        {!hasBlank && sentence.sentence && (
          <p className="fill-in-row__error">Věta musí obsahovat mezeru — klikněte [MEZERA]</p>
        )}
      </div>
      <input
        className="admin-input"
        value={sentence.answer}
        onChange={(e) => onChange({ ...sentence, answer: e.target.value })}
        placeholder="Správná odpověď"
      />
      <input
        className="admin-input"
        value={sentence.hint ?? ''}
        onChange={(e) => onChange({ ...sentence, hint: e.target.value || undefined })}
        placeholder="Nápověda (nepovinná)"
      />
    </div>
  );
}

export default function FillInEditor({ data, onChange }: GameEditorProps<FillInData>) {
  function updateSentence(id: string, updated: FillInSentence) {
    onChange({ ...data, sentences: data.sentences.map((s) => (s.id === id ? updated : s)) });
  }

  function addSentence() {
    onChange({ ...data, sentences: [...data.sentences, { id: uuid(), sentence: '', answer: '' }] });
  }

  function removeSentence(id: string) {
    onChange({ ...data, sentences: data.sentences.filter((s) => s.id !== id) });
  }

  return (
    <GameEditorLayout title="Doplňovačka" subtitle="Věty s mezerou k doplnění">
      <GameItemList
        items={data.sentences}
        onAdd={addSentence}
        onRemove={removeSentence}
        minItems={1}
        maxItems={10}
        addLabel="Přidat větu"
        renderItem={(s) => (
          <SentenceRow sentence={s} onChange={(updated) => updateSentence(s.id, updated)} />
        )}
      />
      <label className="fill-in-toggle">
        <input
          type="checkbox"
          checked={data.showHints}
          onChange={(e) => onChange({ ...data, showHints: e.target.checked })}
        />
        {' '}Zobrazit nápovědy žákovi
      </label>
    </GameEditorLayout>
  );
}
