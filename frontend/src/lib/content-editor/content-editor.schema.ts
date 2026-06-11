import { z } from 'zod';

const BlockBaseSchema = z.object({
  id:              z.string().uuid(),
  backgroundColor: z.string().nullable(),
  paddingTop:      z.number().min(0).max(120),
  paddingBottom:   z.number().min(0).max(120),
  paddingLeft:     z.number().min(0).max(120),
  paddingRight:    z.number().min(0).max(120),
  borderWidth:     z.number().min(0).max(8),
  borderColor:     z.string().nullable(),
  borderRadius:    z.number().min(0).max(32),
});

const fontWeightSchema = z.union([z.literal(400), z.literal(500), z.literal(700)]);

const ParagraphBlockSchema = BlockBaseSchema.extend({
  type:       z.literal('paragraph'),
  html:       z.string(),
  textColor:  z.string(),
  fontSize:   z.number().min(10).max(48),
  lineHeight: z.number().min(1.0).max(3.0),
  textAlign:  z.enum(['left', 'center', 'right', 'justify']),
  fontWeight: fontWeightSchema,
  fontStyle:  z.enum(['normal', 'italic']),
});

const HeadingBlockSchema = BlockBaseSchema.extend({
  type:       z.literal('heading'),
  html:       z.string(),
  level:      z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
  textColor:  z.string(),
  textAlign:  z.enum(['left', 'center', 'right']),
  fontWeight: fontWeightSchema,
  fontStyle:  z.enum(['normal', 'italic']),
});

const ImageBlockSchema = BlockBaseSchema.extend({
  type:      z.literal('image'),
  url:       z.string().nullable(),
  alt:       z.string(),
  caption:   z.string(),
  alignment: z.enum(['left', 'center', 'right', 'full']),
  width:     z.number().nullable(),
});

const VideoBlockSchema = BlockBaseSchema.extend({
  type:     z.literal('video'),
  url:      z.string().nullable(),
  caption:  z.string(),
  autoplay: z.boolean(),
  loop:     z.boolean(),
  muted:    z.boolean(),
});

const AudioBlockSchema = BlockBaseSchema.extend({
  type:    z.literal('audio'),
  url:     z.string().nullable(),
  title:   z.string(),
  caption: z.string(),
});

const TableCellSchema = z.object({
  html:            z.string(),
  textAlign:       z.enum(['left', 'center', 'right']),
  fontWeight:      z.union([z.literal(400), z.literal(700)]),
  backgroundColor: z.string().nullable(),
  textColor:       z.string().nullable(),
});

const TableBlockSchema = BlockBaseSchema.extend({
  type:            z.literal('table'),
  rows:            z.array(z.array(TableCellSchema)),
  hasHeaderRow:    z.boolean(),
  hasHeaderColumn: z.boolean(),
  textColor:       z.string(),
  fontSize:        z.number().min(10).max(48),
});

const EmbedBlockSchema = BlockBaseSchema.extend({
  type:        z.literal('embed'),
  url:         z.string(),
  caption:     z.string(),
  aspectRatio: z.enum(['16:9', '4:3', '1:1']),
});

export const ContentBlockSchema = z.discriminatedUnion('type', [
  ParagraphBlockSchema,
  HeadingBlockSchema,
  ImageBlockSchema,
  VideoBlockSchema,
  AudioBlockSchema,
  TableBlockSchema,
  EmbedBlockSchema,
]);

export const BlockContentSchema = z.object({
  id:       z.string().uuid(),
  lessonId: z.string().uuid(),
  blocks:   z.array(ContentBlockSchema),
});
