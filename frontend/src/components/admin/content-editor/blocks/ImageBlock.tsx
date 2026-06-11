'use client';

import { ImageBlock as IBlock } from '@/lib/content-editor/content-editor.types';

interface Props { block: IBlock }

export function ImageBlock({ block }: Props) {
  if (!block.url) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 border-2 border-dashed border-admin-border rounded-admin-md text-admin-text-muted">
        <i className="ti ti-photo text-[32px]" aria-hidden="true" />
        <p className="text-admin-sm">Nahrajte obrázek v pravém panelu</p>
      </div>
    );
  }

  const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right', full: '' }[block.alignment];

  return (
    <figure
      className={alignClass}
      style={{
        backgroundColor: block.backgroundColor ?? 'transparent',
        padding: `${block.paddingTop}px ${block.paddingRight}px ${block.paddingBottom}px ${block.paddingLeft}px`,
        border: block.borderWidth > 0 ? `${block.borderWidth}px solid ${block.borderColor}` : 'none',
        borderRadius: block.borderRadius,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={block.url}
        alt={block.alt}
        style={{
          width: block.alignment === 'full' ? '100%' : block.width ? `${block.width}px` : 'auto',
          borderRadius: block.borderRadius,
          display: block.alignment === 'center' ? 'inline-block' : block.alignment === 'full' ? 'block' : undefined,
        }}
      />
      {block.caption && <figcaption className="block-caption">{block.caption}</figcaption>}
    </figure>
  );
}
