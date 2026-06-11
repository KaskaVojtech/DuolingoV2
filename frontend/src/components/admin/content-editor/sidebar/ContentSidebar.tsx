'use client';

import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';
import { ContentBlock, HeadingBlock, TableBlock, EmbedBlock, ImageBlock, VideoBlock, AudioBlock } from '@/lib/content-editor/content-editor.types';
import { TypographySection } from './sidebar-sections/TypographySection';
import { HeadingLevelSection } from './sidebar-sections/HeadingLevelSection';
import { BackgroundSection } from './sidebar-sections/BackgroundSection';
import { BorderSection } from './sidebar-sections/BorderSection';
import { SpacingSection } from './sidebar-sections/SpacingSection';
import { MediaSection } from './sidebar-sections/MediaSection';
import { TableSection } from './sidebar-sections/TableSection';
import { EmbedSection } from './sidebar-sections/EmbedSection';
import { InlineFormatSection } from './sidebar-sections/InlineFormatSection';

interface Props { savedRange: Range | null }

export function ContentSidebar({ savedRange }: Props) {
  const { content, selectedBlockId } = useContentEditorStore();
  const block = content.blocks.find((b) => b.id === selectedBlockId);

  if (!block) {
    return (
      <aside className="content-sidebar">
        <div className="content-sidebar__placeholder">
          <i className="ti ti-cursor-text text-[28px]" aria-hidden="true" />
          <p>Klikněte na blok pro úpravu</p>
        </div>
      </aside>
    );
  }

  const isText = block.type === 'paragraph' || block.type === 'heading' || block.type === 'table';
  const isMedia = block.type === 'image' || block.type === 'video' || block.type === 'audio';
  const hasBg = block.type !== 'audio';
  const hasBorder = block.type !== 'audio';

  return (
    <aside className="content-sidebar">

      {isText && savedRange && <InlineFormatSection savedRange={savedRange} />}

      {isText && <TypographySection block={block} />}

      {block.type === 'heading' && <HeadingLevelSection block={block as HeadingBlock} />}

      {isMedia && <MediaSection block={block} />}

      {block.type === 'embed' && <EmbedSection block={block as EmbedBlock} />}

      {block.type === 'table' && <TableSection block={block as TableBlock} />}

      {hasBg && <BackgroundSection block={block} />}

      {hasBorder && <BorderSection block={block} />}

      <SpacingSection block={block} />
    </aside>
  );
}
