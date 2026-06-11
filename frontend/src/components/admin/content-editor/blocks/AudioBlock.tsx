'use client';

import { AudioBlock as ABlock } from '@/lib/content-editor/content-editor.types';

interface Props { block: ABlock }

export function AudioBlock({ block }: Props) {
  const wrapStyle = {
    padding: `${block.paddingTop}px ${block.paddingRight}px ${block.paddingBottom}px ${block.paddingLeft}px`,
  };

  if (!block.url) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-admin-border rounded-admin-md text-admin-text-muted" style={wrapStyle}>
        <i className="ti ti-music text-[28px]" aria-hidden="true" />
        <p className="text-admin-sm">Zadejte URL audia v pravém panelu</p>
      </div>
    );
  }

  return (
    <figure style={wrapStyle}>
      {block.title && <p className="text-admin-sm text-admin-text mb-2">{block.title}</p>}
      <audio controls src={block.url} style={{ width: '100%' }} />
      {block.caption && <figcaption className="block-caption">{block.caption}</figcaption>}
    </figure>
  );
}
