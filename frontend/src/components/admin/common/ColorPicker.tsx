'use client';

import { useState } from 'react';

const PRESET_COLORS = [
  '#e8eaf2', '#8c91bd', '#f0566b', '#f5a623',
  '#f7c948', '#2db868', '#2db8b8', '#5b7cfa',
  '#9b59f7', '#b464c8', '#1a6fd4', '#0f6e56',
  '#7a2d2d', '#7a6a2d', '#2d4a7a', '#4a2d6a',
];

interface ColorPickerProps {
  value: string | null;
  onChange: (color: string) => void;
  onNull?: () => void;
  allowNull?: boolean;
  nullLabel?: string;
}

export function ColorPicker({ value, onChange, onNull, allowNull, nullLabel = 'Průhledné' }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState((value ?? '').replace('#', ''));

  const handlePreset = (color: string) => {
    onChange(color);
    setHexInput(color.replace('#', ''));
  };

  const handleHex = (raw: string) => {
    const clean = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    setHexInput(clean);
    if (clean.length === 6) onChange(`#${clean}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-8 gap-1">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            style={{ background: c, width: 22, height: 22, borderRadius: 4, border: value === c ? '2px solid #e8eaf2' : '2px solid transparent' }}
            onClick={() => handlePreset(c)}
            aria-label={c}
          />
        ))}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-admin-xs text-admin-text-muted">#</span>
        <input
          className="flex-1 bg-admin-surface border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text font-mono uppercase"
          value={hexInput}
          onChange={(e) => handleHex(e.target.value)}
          maxLength={6}
          placeholder="e8eaf2"
        />
        {value && (
          <div style={{ width: 20, height: 20, borderRadius: 3, background: value, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
        )}
      </div>
      {allowNull && (
        <button
          type="button"
          onClick={onNull}
          className="text-admin-xs text-admin-text-muted hover:text-admin-text text-left"
        >
          {nullLabel}
        </button>
      )}
    </div>
  );
}
