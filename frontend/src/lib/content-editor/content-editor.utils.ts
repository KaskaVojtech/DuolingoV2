import { v4 as uuid } from 'uuid';
import {
  ContentBlock, ContentBlockType, ParagraphBlock, HeadingBlock,
  ImageBlock, VideoBlock, AudioBlock, TableBlock, EmbedBlock, TableCell,
} from './content-editor.types';

const BASE_DEFAULTS = {
  backgroundColor: null,
  paddingTop: 8, paddingBottom: 8, paddingLeft: 0, paddingRight: 0,
  borderWidth: 0, borderColor: null, borderRadius: 0,
};

const HEADING_FONT_SIZES: Record<number, number> = { 1: 32, 2: 26, 3: 22, 4: 18, 5: 16, 6: 14 };

export function createBlock(type: ContentBlockType): ContentBlock {
  const id = uuid();
  switch (type) {
    case 'paragraph':
      return { ...BASE_DEFAULTS, id, type: 'paragraph', html: '', textColor: '#e8eaf2', fontSize: 16, lineHeight: 1.6, textAlign: 'left', fontWeight: 400, fontStyle: 'normal' } as ParagraphBlock;
    case 'heading':
      return { ...BASE_DEFAULTS, id, type: 'heading', html: '', level: 2, textColor: '#e8eaf2', textAlign: 'left', fontWeight: 700, fontStyle: 'normal' } as HeadingBlock;
    case 'image':
      return { ...BASE_DEFAULTS, id, type: 'image', url: null, alt: '', caption: '', alignment: 'center', width: null } as ImageBlock;
    case 'video':
      return { ...BASE_DEFAULTS, id, type: 'video', url: null, caption: '', autoplay: false, loop: false, muted: false } as VideoBlock;
    case 'audio':
      return { ...BASE_DEFAULTS, id, type: 'audio', url: null, title: '', caption: '' } as AudioBlock;
    case 'table': {
      const emptyCell = (): TableCell => ({ html: '', textAlign: 'left', fontWeight: 400, backgroundColor: null, textColor: null });
      return { ...BASE_DEFAULTS, id, type: 'table', rows: [[emptyCell(), emptyCell()], [emptyCell(), emptyCell()]], hasHeaderRow: true, hasHeaderColumn: false, textColor: '#e8eaf2', fontSize: 14 } as TableBlock;
    }
    case 'embed':
      return { ...BASE_DEFAULTS, id, type: 'embed', url: '', caption: '', aspectRatio: '16:9' } as EmbedBlock;
  }
}

export function getHeadingFontSize(level: number): number {
  return HEADING_FONT_SIZES[level] ?? 16;
}

export function resolveVideoType(url: string): 'youtube' | 'vimeo' | 'direct' | null {
  if (!url) return null;
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('vimeo.com')) return 'vimeo';
  if (/\.(mp4|webm|ogg)$/i.test(url)) return 'direct';
  return null;
}

export function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export function getVimeoEmbedUrl(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : url;
}

export function getBlockLabel(type: ContentBlockType): string {
  const labels: Record<ContentBlockType, string> = {
    paragraph: 'Odstavec', heading: 'Nadpis', image: 'Obrázek',
    video: 'Video', audio: 'Audio', table: 'Tabulka', embed: 'Embed',
  };
  return labels[type];
}
