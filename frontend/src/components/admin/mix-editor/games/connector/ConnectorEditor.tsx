'use client';

import React from 'react';
import { v4 as uuid } from 'uuid';
import { GameEditorProps } from '@/lib/mix-editor/mix-editor.types';
import { ConnectorData } from './connector.types';
import { GameEditorLayout } from '../shared/GameEditorLayout';
import { GameItemList } from '../shared/GameItemList';

const PAIR_COLORS = ['#1a7a6e', '#1a6fd4', '#c47c1a', '#c44a2a', '#6a3db8', '#2d7a4a', '#b43d6a'];

export default function ConnectorEditor({ data, onChange }: GameEditorProps<ConnectorData>) {
  function updatePair(id: string, field: 'left' | 'right', value: string) {
    onChange({
      ...data,
      pairs: data.pairs.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    });
  }

  function addPair() {
    const color = PAIR_COLORS[data.pairs.length % PAIR_COLORS.length];
    onChange({ ...data, pairs: [...data.pairs, { id: uuid(), left: '', right: '', color }] });
  }

  function removePair(id: string) {
    onChange({ ...data, pairs: data.pairs.filter((p) => p.id !== id) });
  }

  return (
    <GameEditorLayout title="Spojovačka" subtitle="Vytvořte páry slov k propojení">
      <div className="connector-editor">
        <div className="connector-editor__header">
          <input
            className="admin-input connector-editor__label-input"
            value={data.leftLabel}
            onChange={(e) => onChange({ ...data, leftLabel: e.target.value })}
            placeholder="Levý sloupec"
          />
          <input
            className="admin-input connector-editor__label-input"
            value={data.rightLabel}
            onChange={(e) => onChange({ ...data, rightLabel: e.target.value })}
            placeholder="Pravý sloupec"
          />
        </div>

        <div className="connector-editor__type-toggle">
          <label className="connector-editor__type-label">Pravá strana:</label>
          <label>
            <input
              type="radio"
              checked={data.rightType === 'text'}
              onChange={() => onChange({ ...data, rightType: 'text' })}
            />
            {' '}Text
          </label>
          <label>
            <input
              type="radio"
              checked={data.rightType === 'image'}
              onChange={() => onChange({ ...data, rightType: 'image' })}
            />
            {' '}Obrázek
          </label>
        </div>

        <GameItemList
          items={data.pairs}
          onAdd={addPair}
          onRemove={removePair}
          minItems={3}
          maxItems={8}
          addLabel="Přidat pár"
          renderItem={(pair) => (
            <div className="connector-pair" style={{ borderLeftColor: pair.color }}>
              <span className="connector-pair__dot" style={{ background: pair.color }} />
              <input
                className="admin-input"
                value={pair.left}
                onChange={(e) => updatePair(pair.id, 'left', e.target.value)}
                placeholder={data.leftLabel || 'Anglicky'}
              />
              <input
                className="admin-input"
                value={pair.right}
                onChange={(e) => updatePair(pair.id, 'right', e.target.value)}
                placeholder={data.rightLabel || 'Česky'}
              />
            </div>
          )}
        />

        <p className="connector-editor__note">
          Žák uvidí zamíchané páry a bude je spojovat. Barvy se při editaci zobrazují pro přehled, žák je neuvidí.
        </p>
      </div>
    </GameEditorLayout>
  );
}
