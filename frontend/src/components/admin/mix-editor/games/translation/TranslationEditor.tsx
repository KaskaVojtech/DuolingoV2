'use client';

import React from 'react';
import { v4 as uuid } from 'uuid';
import { GameEditorProps } from '@/lib/mix-editor/mix-editor.types';
import { TranslationData, TranslationItem } from './translation.types';
import { GameEditorLayout } from '../shared/GameEditorLayout';
import { GameItemList } from '../shared/GameItemList';

function TranslationRow({
  item,
  onChange,
}: {
  item: TranslationItem;
  onChange: (i: TranslationItem) => void;
}) {
  return (
    <div className="translation-row">
      <input
        className="admin-input"
        value={item.source}
        onChange={(e) => onChange({ ...item, source: e.target.value })}
        placeholder={item.direction === 'en_to_cs' ? 'Anglicky' : 'Česky'}
      />
      <span className="translation-row__arrow">→</span>
      <input
        className="admin-input"
        value={item.answer}
        onChange={(e) => onChange({ ...item, answer: e.target.value })}
        placeholder={item.direction === 'en_to_cs' ? 'Česky' : 'Anglicky'}
      />
      <select
        className="admin-input translation-row__dir"
        value={item.direction}
        onChange={(e) => onChange({ ...item, direction: e.target.value as TranslationItem['direction'] })}
      >
        <option value="en_to_cs">EN→CS</option>
        <option value="cs_to_en">CS→EN</option>
      </select>
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

export default function TranslationEditor({ data, onChange }: GameEditorProps<TranslationData>) {
  function updateItem(id: string, updated: TranslationItem) {
    onChange({ ...data, items: data.items.map((i) => (i.id === id ? updated : i)) });
  }

  return (
    <GameEditorLayout title="Překlad" subtitle="Přeložte slova nebo fráze">
      <GameItemList
        items={data.items}
        onAdd={() =>
          onChange({
            ...data,
            items: [...data.items, { id: uuid(), source: '', answer: '', acceptAlso: [], direction: 'en_to_cs' }],
          })
        }
        onRemove={(id) => onChange({ ...data, items: data.items.filter((i) => i.id !== id) })}
        minItems={3}
        maxItems={10}
        addLabel="Přidat překlad"
        renderItem={(item) => (
          <TranslationRow item={item} onChange={(updated) => updateItem(item.id, updated)} />
        )}
      />
      <div className="translation-input-type">
        <label>Typ vstupu:</label>
        <label>
          <input
            type="radio"
            checked={data.inputType === 'text'}
            onChange={() => onChange({ ...data, inputType: 'text' })}
          />
          {' '}Psaní
        </label>
        <label>
          <input type="radio" disabled />
          {' '}Hlas (brzy)
        </label>
      </div>
    </GameEditorLayout>
  );
}
