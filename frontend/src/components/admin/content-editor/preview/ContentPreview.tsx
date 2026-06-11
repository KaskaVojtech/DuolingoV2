'use client';

import { ContentBlock, ParagraphBlock, HeadingBlock, ImageBlock, VideoBlock, AudioBlock, TableBlock, EmbedBlock } from '@/lib/content-editor/content-editor.types';
import { resolveVideoType, getYouTubeEmbedUrl, getVimeoEmbedUrl, getHeadingFontSize } from '@/lib/content-editor/content-editor.utils';

function PreviewBlock({ block }: { block: ContentBlock }) {
  const baseStyle = {
    backgroundColor: block.backgroundColor ?? 'transparent',
    padding: `${block.paddingTop}px ${block.paddingRight}px ${block.paddingBottom}px ${block.paddingLeft}px`,
    border: block.borderWidth > 0 ? `${block.borderWidth}px solid ${block.borderColor}` : 'none',
    borderRadius: block.borderRadius,
    marginBottom: 8,
  };

  if (block.type === 'paragraph') {
    const b = block as ParagraphBlock;
    return (
      <p style={{ ...baseStyle, color: b.textColor, fontSize: b.fontSize, lineHeight: b.lineHeight, textAlign: b.textAlign, fontWeight: b.fontWeight, fontStyle: b.fontStyle }}
        dangerouslySetInnerHTML={{ __html: b.html }} />
    );
  }

  if (block.type === 'heading') {
    const b = block as HeadingBlock;
    const fontSize = (b as HeadingBlock & { fontSize?: number }).fontSize ?? getHeadingFontSize(b.level);
    const hStyle = { ...baseStyle, color: b.textColor, fontSize, textAlign: b.textAlign as 'left' | 'center' | 'right', fontWeight: b.fontWeight, fontStyle: b.fontStyle };
    const inner = { dangerouslySetInnerHTML: { __html: b.html } };
    if (b.level === 1) return <h1 style={hStyle} {...inner} />;
    if (b.level === 2) return <h2 style={hStyle} {...inner} />;
    if (b.level === 3) return <h3 style={hStyle} {...inner} />;
    if (b.level === 4) return <h4 style={hStyle} {...inner} />;
    if (b.level === 5) return <h5 style={hStyle} {...inner} />;
    return <h6 style={hStyle} {...inner} />;
  }

  if (block.type === 'image') {
    const b = block as ImageBlock;
    if (!b.url) return null;
    return (
      <figure style={baseStyle} className={{ left: 'text-left', center: 'text-center', right: 'text-right', full: '' }[b.alignment]}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={b.url} alt={b.alt} style={{ width: b.alignment === 'full' ? '100%' : b.width ? `${b.width}px` : 'auto', borderRadius: b.borderRadius }} />
        {b.caption && <figcaption className="block-caption">{b.caption}</figcaption>}
      </figure>
    );
  }

  if (block.type === 'video') {
    const b = block as VideoBlock;
    if (!b.url) return null;
    const vt = resolveVideoType(b.url);
    if (vt === 'youtube' || vt === 'vimeo') {
      const src = vt === 'youtube' ? getYouTubeEmbedUrl(b.url) : getVimeoEmbedUrl(b.url);
      return <figure style={baseStyle}><div className="embed-wrapper embed-wrapper--16-9"><iframe src={src} allowFullScreen title="Video" /></div>{b.caption && <figcaption className="block-caption">{b.caption}</figcaption>}</figure>;
    }
    return <figure style={baseStyle}><video src={b.url} controls autoPlay={b.autoplay} loop={b.loop} muted={b.muted} style={{ width: '100%' }} />{b.caption && <figcaption className="block-caption">{b.caption}</figcaption>}</figure>;
  }

  if (block.type === 'audio') {
    const b = block as AudioBlock;
    if (!b.url) return null;
    return <figure style={baseStyle}>{b.title && <p className="text-admin-sm mb-2">{b.title}</p>}<audio controls src={b.url} style={{ width: '100%' }} />{b.caption && <figcaption className="block-caption">{b.caption}</figcaption>}</figure>;
  }

  if (block.type === 'table') {
    const b = block as TableBlock;
    return (
      <div style={{ ...baseStyle, overflowX: 'auto' }}>
        <table className="content-table" style={{ fontSize: b.fontSize, color: b.textColor }}>
          <tbody>
            {b.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => {
                  const isHeader = (b.hasHeaderRow && ri === 0) || (b.hasHeaderColumn && ci === 0);
                  return <td key={ci} style={{ textAlign: cell.textAlign, fontWeight: isHeader ? 700 : cell.fontWeight, backgroundColor: cell.backgroundColor ?? (isHeader ? 'rgba(255,255,255,0.06)' : 'transparent'), color: cell.textColor ?? 'inherit' }} dangerouslySetInnerHTML={{ __html: cell.html }} />;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === 'embed') {
    const b = block as EmbedBlock;
    if (!b.url) return null;
    const cls = { '16:9': 'embed-wrapper--16-9', '4:3': 'embed-wrapper--4-3', '1:1': 'embed-wrapper--1-1' }[b.aspectRatio];
    return <figure style={baseStyle}><div className={`embed-wrapper ${cls}`}><iframe src={b.url} allowFullScreen title="Embed" /></div>{b.caption && <figcaption className="block-caption">{b.caption}</figcaption>}</figure>;
  }

  return null;
}

export function ContentPreview({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <article className="content-preview max-w-[800px] mx-auto p-admin-2xl">
      {blocks.map((block) => <PreviewBlock key={block.id} block={block} />)}
    </article>
  );
}
