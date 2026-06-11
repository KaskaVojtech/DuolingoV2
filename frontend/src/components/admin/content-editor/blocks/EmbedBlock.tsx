'use client';

import { EmbedBlock as EBlock } from '@/lib/content-editor/content-editor.types';

interface Props { block: EBlock }

const ASPECT_CLASS: Record<string, string> = {
  '16:9': 'embed-wrapper--16-9',
  '4:3':  'embed-wrapper--4-3',
  '1:1':  'embed-wrapper--1-1',
};

export function EmbedBlock({ block }: Props) {
  const wrapStyle = {
    backgroundColor: block.backgroundColor ?? 'transparent',
    padding: `${block.paddingTop}px ${block.paddingRight}px ${block.paddingBottom}px ${block.paddingLeft}px`,
    border: block.borderWidth > 0 ? `${block.borderWidth}px solid ${block.borderColor}` : 'none',
    borderRadius: block.borderRadius,
  };

  if (!block.url) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 border-2 border-dashed border-admin-border rounded-admin-md text-admin-text-muted" style={wrapStyle}>
        <i className="ti ti-code text-[32px]" aria-hidden="true" />
        <p className="text-admin-sm">Zadejte URL embedu v pravém panelu</p>
      </div>
    );
  }

  return (
    <figure style={wrapStyle}>
      <div className={`embed-wrapper ${ASPECT_CLASS[block.aspectRatio]}`} style={{ borderRadius: block.borderRadius }}>
        <iframe src={block.url} allowFullScreen title="Embed" />
      </div>
      {block.caption && <figcaption className="block-caption">{block.caption}</figcaption>}
    </figure>
  );
}
