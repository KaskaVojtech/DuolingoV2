'use client';

import { useState } from 'react';

const PRESET_COLORS = [
  '#2d4a7a', '#4a2d6a', '#1a6fd4', '#0f6e56',
  '#7a2d2d', '#7a6a2d', '#2d7a4a', '#4a4a7a',
  '#7a3d2d', '#2d5a7a', '#6a2d5a', '#3d7a2d',
];

interface Props {
  value: string;
  onChange: (color: string) => void;
}

export function CourseColorPicker({ value, onChange }: Props) {
  const [hexInput, setHexInput] = useState(value.replace('#', ''));

  const handlePreset = (color: string) => {
    onChange(color);
    setHexInput(color.replace('#', ''));
  };

  const handleHexInput = (raw: string) => {
    const clean = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    setHexInput(clean);
    if (clean.length === 6) onChange(`#${clean}`);
  };

  return (
    <div className="flex gap-admin-md items-start">

      <div
        className="shrink-0 rounded-admin-md border border-admin-border"
        style={{ width: 80, height: 80, background: value }}
        aria-label="Náhled barvy"
      />

      <div className="flex flex-col gap-admin-md">

        <div className="grid grid-cols-4 gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`color-swatch ${value === color ? 'color-swatch--active' : ''}`}
              style={{ background: color }}
              onClick={() => handlePreset(color)}
              aria-label={color}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-admin-sm text-admin-text-muted">#</span>
          <input
            className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-sm text-admin-text w-24 font-mono uppercase"
            value={hexInput}
            onChange={(e) => handleHexInput(e.target.value)}
            maxLength={6}
            placeholder="2d4a7a"
          />
        </div>
      </div>
    </div>
  );
}
