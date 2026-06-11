'use client';

import { ContentBlock, ParagraphBlock as PBlock, HeadingBlock as HBlock, ImageBlock as IBlock, VideoBlock as VBlock, AudioBlock as ABlock, TableBlock as TBlock, EmbedBlock as EBlock } from '@/lib/content-editor/content-editor.types';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';
import { SortableItem } from '@/components/admin/common/sortable/SortableItem';
import { BlockActions } from './BlockActions';
import { AddBlockMenu } from './AddBlockMenu';
import { ParagraphBlock } from './blocks/ParagraphBlock';
import { HeadingBlock } from './blocks/HeadingBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { AudioBlock } from './blocks/AudioBlock';
import { TableBlock } from './blocks/TableBlock';
import { EmbedBlock } from './blocks/EmbedBlock';

interface Props {
  block: ContentBlock;
  isFirst: boolean;
  isLast: boolean;
  onSelectionChange: (range: Range | null) => void;
}

export function BlockWrapper({ block, isFirst, isLast, onSelectionChange }: Props) {
  const { selectedBlockId, selectBlock } = useContentEditorStore();
  const isSelected = selectedBlockId === block.id;

  const renderBlock = () => {
    switch (block.type) {
      case 'paragraph': return <ParagraphBlock block={block as PBlock} isSelected={isSelected} onSelectionChange={onSelectionChange} />;
      case 'heading':   return <HeadingBlock block={block as HBlock} isSelected={isSelected} onSelectionChange={onSelectionChange} />;
      case 'image':     return <ImageBlock block={block as IBlock} />;
      case 'video':     return <VideoBlock block={block as VBlock} />;
      case 'audio':     return <AudioBlock block={block as ABlock} />;
      case 'table':     return <TableBlock block={block as TBlock} />;
      case 'embed':     return <EmbedBlock block={block as EBlock} />;
    }
  };

  return (
    <SortableItem id={block.id}>
      {({ attributes, listeners, isDragging, setNodeRef, style }) => (
        <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-40' : ''}>
          <div
            className={`block-wrapper ${isSelected ? 'block-wrapper--selected' : ''}`}
            onClick={() => selectBlock(block.id)}
          >
            <BlockActions
              blockId={block.id}
              isFirst={isFirst}
              isLast={isLast}
              dragHandleProps={listeners}
              dragHandleAttributes={attributes}
            />
            <div className="p-2">{renderBlock()}</div>
          </div>
          <AddBlockMenu afterId={block.id} />
        </div>
      )}
    </SortableItem>
  );
}
