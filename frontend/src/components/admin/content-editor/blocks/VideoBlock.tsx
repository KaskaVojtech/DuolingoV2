'use client';

import { VideoBlock as VBlock } from '@/lib/content-editor/content-editor.types';
import { resolveVideoType, getYouTubeEmbedUrl, getVimeoEmbedUrl } from '@/lib/content-editor/content-editor.utils';

interface Props { block: VBlock }

export function VideoBlock({ block }: Props) {
  if (!block.url) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 border-2 border-dashed border-admin-border rounded-admin-md text-admin-text-muted">
        <i className="ti ti-movie text-[32px]" aria-hidden="true" />
        <p className="text-admin-sm">Zadejte URL videa v pravém panelu</p>
      </div>
    );
  }

  const videoType = resolveVideoType(block.url);
  const wrapStyle = {
    backgroundColor: block.backgroundColor ?? 'transparent',
    padding: `${block.paddingTop}px ${block.paddingRight}px ${block.paddingBottom}px ${block.paddingLeft}px`,
    border: block.borderWidth > 0 ? `${block.borderWidth}px solid ${block.borderColor}` : 'none',
    borderRadius: block.borderRadius,
  };

  if (videoType === 'youtube') {
    return (
      <figure style={wrapStyle}>
        <div className="embed-wrapper embed-wrapper--16-9" style={{ borderRadius: block.borderRadius }}>
          <iframe src={getYouTubeEmbedUrl(block.url)} allowFullScreen title="YouTube video" />
        </div>
        {block.caption && <figcaption className="block-caption">{block.caption}</figcaption>}
      </figure>
    );
  }

  if (videoType === 'vimeo') {
    return (
      <figure style={wrapStyle}>
        <div className="embed-wrapper embed-wrapper--16-9" style={{ borderRadius: block.borderRadius }}>
          <iframe src={getVimeoEmbedUrl(block.url)} allowFullScreen title="Vimeo video" />
        </div>
        {block.caption && <figcaption className="block-caption">{block.caption}</figcaption>}
      </figure>
    );
  }

  return (
    <figure style={wrapStyle}>
      <video
        src={block.url}
        controls
        autoPlay={block.autoplay}
        loop={block.loop}
        muted={block.muted}
        style={{ width: '100%', borderRadius: block.borderRadius }}
      />
      {block.caption && <figcaption className="block-caption">{block.caption}</figcaption>}
    </figure>
  );
}
