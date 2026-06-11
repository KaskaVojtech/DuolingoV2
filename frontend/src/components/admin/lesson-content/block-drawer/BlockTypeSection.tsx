import { Block } from '@/lib/lesson-content/lesson-content.types';
import { ContentBlockSection } from './ContentBlockSection';
import { ExerciseBlockSection } from './ExerciseBlockSection';

export function BlockTypeSection({ block }: { block: Block }) {
  return block.type === 'content'
    ? <ContentBlockSection block={block} />
    : <ExerciseBlockSection block={block} />;
}
