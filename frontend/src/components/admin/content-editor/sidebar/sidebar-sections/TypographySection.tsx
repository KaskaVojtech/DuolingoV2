'use client';

import { ContentBlock, ParagraphBlock, HeadingBlock, TableBlock } from '@/lib/content-editor/content-editor.types';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';
import { ColorPicker } from '@/components/admin/common/ColorPicker';

type TypoBlock = ParagraphBlock | HeadingBlock | (TableBlock & { fontWeight?: 400 | 500 | 700; fontStyle?: 'normal' | 'italic' });

const ALIGN_ICONS: Record<string, string> = { left: 'ti-align-left', center: 'ti-align-center', right: 'ti-align-right', justify: 'ti-align-justified' };
const FONT_WEIGHTS = [{ v: 400, l: 'Normální' }, { v: 500, l: 'Střední' }, { v: 700, l: 'Tučné' }] as const;

export function TypographySection({ block }: { block: ContentBlock }) {
  const { updateBlock } = useContentEditorStore();
  const b = block as TypoBlock;
  const isParagraph = block.type === 'paragraph';
  const aligns = block.type === 'heading' ? ['left', 'center', 'right'] : ['left', 'center', 'right', 'justify'];

  return (
    <div className="content-sidebar__section">
      <div className="content-sidebar__section-title">Typografie</div>

      <div className="mb-3">
        <p className="text-admin-xs text-admin-text-muted mb-1">Barva textu</p>
        <ColorPicker value={b.textColor} onChange={(c) => updateBlock(block.id, { textColor: c } as Partial<ContentBlock>)} />
      </div>

      <div className="mb-3 flex items-center gap-2">
        <label className="text-admin-xs text-admin-text-muted">Velikost</label>
        <input
          type="number" min={10} max={48}
          className="w-16 bg-admin-surface border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text text-center"
          value={(b as ParagraphBlock).fontSize ?? 16}
          onChange={(e) => updateBlock(block.id, { fontSize: Number(e.target.value) } as Partial<ContentBlock>)}
        />
        <span className="text-admin-xs text-admin-text-muted">px</span>
      </div>

      <div className="mb-3">
        <p className="text-admin-xs text-admin-text-muted mb-1">Tloušťka</p>
        <div className="flex gap-1">
          {FONT_WEIGHTS.map(({ v, l }) => (
            <button key={v} type="button"
              onClick={() => updateBlock(block.id, { fontWeight: v } as Partial<ContentBlock>)}
              className={`flex-1 py-1 text-admin-xs rounded border transition-colors ${b.fontWeight === v ? 'bg-admin-primary text-white border-admin-primary' : 'border-admin-border text-admin-text-muted hover:text-admin-text'}`}
            >{l}</button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-admin-xs text-admin-text-muted mb-1">Styl</p>
        <div className="flex gap-1">
          {(['normal', 'italic'] as const).map((s) => (
            <button key={s} type="button"
              onClick={() => updateBlock(block.id, { fontStyle: s } as Partial<ContentBlock>)}
              className={`flex-1 py-1 text-admin-xs rounded border transition-colors ${b.fontStyle === s ? 'bg-admin-primary text-white border-admin-primary' : 'border-admin-border text-admin-text-muted hover:text-admin-text'}`}
              style={s === 'italic' ? { fontStyle: 'italic' } : {}}
            >{s === 'normal' ? 'Normální' : 'Kurzíva'}</button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-admin-xs text-admin-text-muted mb-1">Zarovnání</p>
        <div className="flex gap-1">
          {aligns.map((a) => (
            <button key={a} type="button"
              onClick={() => updateBlock(block.id, { textAlign: a } as Partial<ContentBlock>)}
              className={`flex-1 py-1.5 flex items-center justify-center rounded border transition-colors ${(b as ParagraphBlock).textAlign === a ? 'bg-admin-primary text-white border-admin-primary' : 'border-admin-border text-admin-text-muted hover:text-admin-text'}`}
            ><i className={`ti ${ALIGN_ICONS[a]} text-[13px]`} aria-hidden="true" /></button>
          ))}
        </div>
      </div>

      {isParagraph && (
        <div className="flex items-center gap-2">
          <label className="text-admin-xs text-admin-text-muted">Řádkování</label>
          <input
            type="range" min={1.0} max={3.0} step={0.1}
            className="flex-1 accent-admin-primary"
            value={(b as ParagraphBlock).lineHeight}
            onChange={(e) => updateBlock(block.id, { lineHeight: Number(e.target.value) } as Partial<ContentBlock>)}
          />
          <span className="text-admin-xs text-admin-text-muted w-8">{((b as ParagraphBlock).lineHeight ?? 1.6).toFixed(1)}</span>
        </div>
      )}
    </div>
  );
}
