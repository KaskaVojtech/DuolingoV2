'use client';

import { useRef } from 'react';
import { ImageComponent } from '@/lib/exercise/exercise.types';

interface Props { item: ImageComponent; onChange: (updated: ImageComponent) => void; }

export function ImageEditor({ item, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    onChange({ ...item, url: URL.createObjectURL(file) });
  };

  return (
    <div className="flex flex-col gap-admin-md">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="px-3 py-1.5 text-admin-xs border border-dashed border-admin-border rounded-admin-sm text-admin-text-muted hover:border-admin-primary hover:text-admin-primary transition-colors"
        >
          <i className="ti ti-upload text-[13px] mr-1" aria-hidden="true" />
          Nahrát ze zařízení
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-admin-xs text-admin-text-muted">URL obrázku</span>
        <input
          className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-md py-2 text-admin-sm text-admin-text"
          value={item.url}
          onChange={(e) => onChange({ ...item, url: e.target.value })}
          placeholder="https://..."
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-admin-xs text-admin-text-muted">Popisek (volitelný)</span>
        <input
          className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-md py-2 text-admin-sm text-admin-text"
          value={item.caption ?? ''}
          onChange={(e) => onChange({ ...item, caption: e.target.value })}
          placeholder="Popisek obrázku..."
        />
      </label>
      {item.url && (

        <img src={item.url} alt={item.caption ?? ''} className="max-h-48 rounded-admin-md object-contain bg-admin-surface-2" />
      )}
    </div>
  );
}
