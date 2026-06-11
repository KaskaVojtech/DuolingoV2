export type ContentBlockType =
  | 'paragraph'
  | 'heading'
  | 'image'
  | 'video'
  | 'audio'
  | 'table'
  | 'embed';

export interface BlockBase {
  id: string;
  type: ContentBlockType;
  backgroundColor: string | null;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  borderWidth: number;
  borderColor: string | null;
  borderRadius: number;
}

export interface InlineFormat {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  link: string | null;
  color: string | null;
}

export interface ParagraphBlock extends BlockBase {
  type: 'paragraph';
  html: string;
  textColor: string;
  fontSize: number;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  fontWeight: 400 | 500 | 700;
  fontStyle: 'normal' | 'italic';
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingBlock extends BlockBase {
  type: 'heading';
  html: string;
  level: HeadingLevel;
  textColor: string;
  textAlign: 'left' | 'center' | 'right';
  fontWeight: 400 | 500 | 700;
  fontStyle: 'normal' | 'italic';
}

export interface ImageBlock extends BlockBase {
  type: 'image';
  url: string | null;
  alt: string;
  caption: string;
  alignment: 'left' | 'center' | 'right' | 'full';
  width: number | null;
}

export interface VideoBlock extends BlockBase {
  type: 'video';
  url: string | null;
  caption: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
}

export interface AudioBlock extends BlockBase {
  type: 'audio';
  url: string | null;
  title: string;
  caption: string;
}

export interface TableCell {
  html: string;
  textAlign: 'left' | 'center' | 'right';
  fontWeight: 400 | 700;
  backgroundColor: string | null;
  textColor: string | null;
}

export interface TableBlock extends BlockBase {
  type: 'table';
  rows: TableCell[][];
  hasHeaderRow: boolean;
  hasHeaderColumn: boolean;
  textColor: string;
  fontSize: number;
}

export interface EmbedBlock extends BlockBase {
  type: 'embed';
  url: string;
  caption: string;
  aspectRatio: '16:9' | '4:3' | '1:1';
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ImageBlock
  | VideoBlock
  | AudioBlock
  | TableBlock
  | EmbedBlock;

export interface BlockContent {
  id: string;
  lessonId: string;
  title: string;
  blocks: ContentBlock[];
}
