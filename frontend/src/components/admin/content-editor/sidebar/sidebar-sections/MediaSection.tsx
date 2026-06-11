'use client';

import { useRef, useState } from 'react';
import { ContentBlock, ImageBlock, VideoBlock, AudioBlock } from '@/lib/content-editor/content-editor.types';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';

type MediaBlock = ImageBlock | VideoBlock | AudioBlock;

export function MediaSection({ block }: { block: ContentBlock }) {
  const { updateBlock } = useContentEditorStore();
  const b = block as MediaBlock;
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [urlVal, setUrlVal] = useState('');

  const isImage = block.type === 'image';
  const isAudio = block.type === 'audio';

  const handleFile = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    updateBlock(block.id, { url: objectUrl } as Partial<ContentBlock>);
  };

  const handleUrlConfirm = () => {
    if (urlVal.trim()) updateBlock(block.id, { url: urlVal.trim() } as Partial<ContentBlock>);
    setUrlMode(false);
  };

  const remove = () => updateBlock(block.id, { url: null } as Partial<ContentBlock>);

  return (
    <div className="content-sidebar__section">
      <div className="content-sidebar__section-title">Média</div>

      {!b.url ? (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full py-2 text-admin-xs text-admin-text-muted border border-dashed border-admin-border rounded-admin-sm hover:border-admin-primary hover:text-admin-primary transition-colors"
          >
            <i className="ti ti-upload text-[13px] mr-1" aria-hidden="true" />
            Nahrát soubor
          </button>
          <input
            ref={inputRef} type="file"
            accept={isImage ? 'image/*' : isAudio ? 'audio/*' : 'video/*'}
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <button type="button" onClick={() => setUrlMode(!urlMode)} className="text-admin-xs text-admin-text-muted hover:text-admin-text">
            nebo zadejte URL
          </button>
          {urlMode && (
            <div className="flex gap-1">
              <input
                className="flex-1 bg-admin-surface border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text"
                value={urlVal} onChange={(e) => setUrlVal(e.target.value)}
                placeholder="https://..."
                onKeyDown={(e) => e.key === 'Enter' && handleUrlConfirm()}
              />
              <button type="button" onClick={handleUrlConfirm} className="px-2 py-1 text-admin-xs bg-admin-primary text-white rounded-admin-sm">OK</button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-admin-surface-2 rounded-admin-sm px-2 py-1.5">
            <i className={`ti ${isImage ? 'ti-photo' : isAudio ? 'ti-music' : 'ti-movie'} text-[14px] text-admin-text-muted`} aria-hidden="true" />
            <span className="flex-1 text-admin-xs text-admin-text truncate">{b.url.split('/').pop()}</span>
            <button type="button" onClick={remove} className="text-admin-text-muted hover:text-admin-danger">
              <i className="ti ti-x text-[12px]" aria-hidden="true" />
            </button>
          </div>
          {isImage && b.url && (

            <img src={b.url} alt={(b as ImageBlock).alt} className="w-full rounded-admin-sm object-cover max-h-24" />
          )}
        </div>
      )}

      {isImage && (
        <div className="mt-3">
          <label className="text-admin-xs text-admin-text-muted block mb-1">Alt text</label>
          <input
            className="w-full bg-admin-surface border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text"
            value={(b as ImageBlock).alt}
            onChange={(e) => updateBlock(block.id, { alt: e.target.value } as Partial<ContentBlock>)}
            placeholder="Popis obrázku..."
          />
        </div>
      )}

      <div className="mt-3">
        <label className="text-admin-xs text-admin-text-muted block mb-1">Popisek</label>
        <input
          className="w-full bg-admin-surface border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text"
          value={(b as ImageBlock).caption ?? ''}
          onChange={(e) => updateBlock(block.id, { caption: e.target.value } as Partial<ContentBlock>)}
          placeholder="Popisek..."
        />
      </div>

      {isImage && (
        <>
          <div className="mt-3">
            <p className="text-admin-xs text-admin-text-muted mb-1">Zarovnání</p>
            <div className="flex gap-1">
              {(['left', 'center', 'right', 'full'] as const).map((a) => (
                <button key={a} type="button"
                  onClick={() => updateBlock(block.id, { alignment: a } as Partial<ContentBlock>)}
                  className={`flex-1 py-1 text-admin-xs rounded border transition-colors ${(b as ImageBlock).alignment === a ? 'bg-admin-primary text-white border-admin-primary' : 'border-admin-border text-admin-text-muted hover:text-admin-text'}`}
                >{a === 'full' ? '⬜' : a === 'left' ? '←' : a === 'center' ? '↔' : '→'}</button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <label className="text-admin-xs text-admin-text-muted">Šířka</label>
            <input type="number" min={50} max={2000}
              className="w-20 bg-admin-surface border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text text-center"
              value={(b as ImageBlock).width ?? ''}
              placeholder="Auto"
              onChange={(e) => updateBlock(block.id, { width: e.target.value ? Number(e.target.value) : null } as Partial<ContentBlock>)}
            />
            <span className="text-admin-xs text-admin-text-muted">px</span>
          </div>
        </>
      )}
    </div>
  );
}
