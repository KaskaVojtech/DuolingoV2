'use client';

import { useRef, useState } from 'react';
import { applyFormat, getActiveFormats, saveSelection, restoreSelection } from '@/lib/shared/rich-text.utils';
import { ColorPicker } from '@/components/admin/common/ColorPicker';

interface Props {
  savedRange: Range | null;
}

export function InlineFormatSection({ savedRange }: Props) {
  const formats = getActiveFormats();
  const [linkVal, setLinkVal] = useState(formats.link ?? '');
  const [showColor, setShowColor] = useState(false);

  const apply = (format: Parameters<typeof applyFormat>[0], value?: string) => {
    restoreSelection(savedRange);
    applyFormat(format, value);
  };

  const FORMAT_BTNS = [
    { key: 'bold' as const, label: 'B', style: { fontWeight: 700 } },
    { key: 'italic' as const, label: 'I', style: { fontStyle: 'italic' as const } },
    { key: 'underline' as const, label: 'U', style: { textDecoration: 'underline' } },
    { key: 'strikethrough' as const, label: 'S', style: { textDecoration: 'line-through' } },
  ] as const;

  return (
    <div className="content-sidebar__section">
      <div className="content-sidebar__section-title">Inline formátování</div>

      <div className="flex gap-1 mb-3">
        {FORMAT_BTNS.map(({ key, label, style }) => (
          <button key={key} type="button"
            onMouseDown={(e) => { e.preventDefault(); apply(key); }}
            style={style}
            className={`w-8 h-8 flex items-center justify-center rounded border text-admin-sm transition-colors ${formats[key] ? 'bg-admin-primary text-white border-admin-primary' : 'border-admin-border text-admin-text-muted hover:text-admin-text'}`}
          >{label}</button>
        ))}
      </div>

      <div className="mb-3">
        <button type="button" onClick={() => setShowColor(!showColor)}
          className="text-admin-xs text-admin-text-muted hover:text-admin-text flex items-center gap-1 mb-2"
        >
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: formats.color ?? '#e8eaf2', border: '1px solid rgba(255,255,255,0.15)' }} />
          Barva textu
        </button>
        {showColor && (
          <ColorPicker
            value={formats.color}
            onChange={(c) => apply('color', c)}
          />
        )}
      </div>

      <div>
        <p className="text-admin-xs text-admin-text-muted mb-1">Odkaz</p>
        <div className="flex gap-1 mb-1">
          <input
            className="flex-1 bg-admin-surface border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text"
            value={linkVal}
            onChange={(e) => setLinkVal(e.target.value)}
            placeholder="https://..."
            onKeyDown={(e) => { if (e.key === 'Enter') apply('link', linkVal); }}
          />
          <button type="button" onMouseDown={(e) => { e.preventDefault(); apply('link', linkVal); }}
            className="px-2 py-1 text-admin-xs bg-admin-primary text-white rounded-admin-sm">Použít</button>
        </div>
        {formats.link && (
          <button type="button" onMouseDown={(e) => { e.preventDefault(); apply('link'); }}
            className="text-admin-xs text-admin-danger hover:opacity-80"
          >Odebrat odkaz</button>
        )}
      </div>
    </div>
  );
}
