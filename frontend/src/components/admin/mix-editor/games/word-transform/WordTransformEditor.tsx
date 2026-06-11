'use client';

import React, { useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { GameEditorProps } from '@/lib/mix-editor/mix-editor.types';
import { WordTransformData, WordTransformItem } from './word-transform.types';
import { GameEditorLayout } from '../shared/GameEditorLayout';
import { GameItemList } from '../shared/GameItemList';
import { BlankInsertButton } from '../shared/BlankInsertButton';

function TransformRow({
  item,
  onChange,
}: {
  item: WordTransformItem;
  onChange: (i: WordTransformItem) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null!);
  const hasWord = item.sentence.includes('{word}');

  return (
    <div className="word-transform-row">
      <div>
        <div className="fill-in-row__input-wrap">
          <input
            ref={inputRef}
            className={`admin-input ${!hasWord && item.sentence ? 'fill-in-row__input--error' : ''}`}
            value={item.sentence}
            onChange={(e) => onChange({ ...item, sentence: e.target.value })}
            placeholder="Věta s {word} placeholder..."
          />
          <BlankInsertButton
            targetRef={inputRef}
            placeholder="{word}"
            onInsert={(v) => onChange({ ...item, sentence: v })}
          />
        </div>
        {!hasWord && item.sentence && (
          <p className="fill-in-row__error">Věta musí obsahovat {'{word}'} — klikněte {'{slovo}'}</p>
        )}
      </div>
      <input
        className="admin-input"
        value={item.baseWord}
        onChange={(e) => onChange({ ...item, baseWord: e.target.value })}
        placeholder="Základní tvar (žák dostane)"
      />
      <input
        className="admin-input"
        value={item.answer}
        onChange={(e) => onChange({ ...item, answer: e.target.value })}
        placeholder="Správný tvar ve větě"
      />
      <input
        className="admin-input"
        value={item.instruction}
        onChange={(e) => onChange({ ...item, instruction: e.target.value })}
        placeholder="Instrukce (např. Dej do minulého času)"
      />
      <input
        className="admin-input"
        value={item.acceptAlso.join(', ')}
        onChange={(e) =>
          onChange({
            ...item,
            acceptAlso: e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
        placeholder="Alternativy (oddělené čárkou)"
      />
    </div>
  );
}

export default function WordTransformEditor({ data, onChange }: GameEditorProps<WordTransformData>) {
  function updateItem(id: string, updated: WordTransformItem) {
    onChange({ ...data, items: data.items.map((i) => (i.id === id ? updated : i)) });
  }

  return (
    <GameEditorLayout title="Přepis do správného tvaru" subtitle="Žák změní základní tvar slova na správný tvar ve větě">
      <GameItemList
        items={data.items}
        onAdd={() =>
          onChange({
            ...data,
            items: [
              ...data.items,
              { id: uuid(), sentence: '', baseWord: '', answer: '', instruction: '', acceptAlso: [] },
            ],
          })
        }
        onRemove={(id) => onChange({ ...data, items: data.items.filter((i) => i.id !== id) })}
        minItems={1}
        maxItems={8}
        addLabel="Přidat položku"
        renderItem={(item) => (
          <TransformRow item={item} onChange={(updated) => updateItem(item.id, updated)} />
        )}
      />
    </GameEditorLayout>
  );
}
