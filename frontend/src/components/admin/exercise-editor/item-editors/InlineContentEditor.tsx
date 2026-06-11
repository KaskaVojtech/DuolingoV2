'use client';

import { useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { InlineContent, DragAndDropComponent } from '@/lib/exercise/exercise.types';
import { appendNode, deleteNode } from '@/lib/exercise/inline-parser';
import { InlineToolbar } from './InlineToolbar';
import { InlineInputNode } from '../inline-components/InlineInputNode';
import { InlineSelectNode } from '../inline-components/InlineSelectNode';
import { InlineSelectBetweenNode } from '../inline-components/InlineSelectBetweenNode';
import { InlineDragTargetNode } from '../inline-components/InlineDragTargetNode';

interface Props {
  content: InlineContent;
  dragSources: DragAndDropComponent[];
  onChange: (updated: InlineContent) => void;
}

export function InlineContentEditor({ content, dragSources, onChange }: Props) {
  const lastSourceIdRef = useRef<string>(dragSources[0]?.source.id ?? '');
  if (dragSources[0]) lastSourceIdRef.current = dragSources[0].source.id;

  const handleInsert = (type: 'input' | 'select' | 'select_between' | 'drag_target') => {
    if (type === 'input') {
      const node = { type: 'input' as const, id: uuid(), correct: '', evaluation: 'auto' as const };
      onChange(appendNode(content, node));
    } else if (type === 'select') {
      const node = { type: 'select' as const, id: uuid(), options: ['možnost 1', 'možnost 2'], correct: 'možnost 1' };
      onChange(appendNode(content, node));
    } else if (type === 'select_between') {
      const node = { type: 'select_between' as const, id: uuid(), options: ['možnost 1', 'možnost 2'], correct: 'možnost 1' };
      onChange(appendNode(content, node));
    } else if (type === 'drag_target') {
      const node = { type: 'drag_target' as const, id: uuid(), sourceId: lastSourceIdRef.current, correct: '' };
      onChange(appendNode(content, node));
    }
  };

  const updateNode = (index: number, updated: typeof content.nodes[number]) => {
    const nodes = [...content.nodes];
    nodes[index] = updated;
    onChange({ ...content, nodes });
  };

  return (
    <div>
      <InlineToolbar onInsert={handleInsert} hasDragSource={dragSources.length > 0} />
      <div className="inline-content-editor">
        {content.nodes.map((node, idx) => {
          if (node.type === 'text') {
            return (
              <input
                key={idx}
                className="inline-text-node"
                style={{ width: Math.max(40, node.value.length * 8 + 16) }}
                value={node.value}
                onChange={(e) => updateNode(idx, { type: 'text', value: e.target.value })}
                placeholder={idx === 0 && content.nodes.length === 1 ? 'Zadejte text...' : ''}
              />
            );
          }
          if (node.type === 'input') {
            return (
              <InlineInputNode
                key={node.id}
                node={node}
                onChange={(u) => updateNode(idx, u)}
                onDelete={() => onChange(deleteNode(content, node.id))}
              />
            );
          }
          if (node.type === 'select') {
            return (
              <InlineSelectNode
                key={node.id}
                node={node}
                onChange={(u) => updateNode(idx, u)}
                onDelete={() => onChange(deleteNode(content, node.id))}
              />
            );
          }
          if (node.type === 'select_between') {
            return (
              <InlineSelectBetweenNode
                key={node.id}
                node={node}
                onChange={(u) => updateNode(idx, u)}
                onDelete={() => onChange(deleteNode(content, node.id))}
              />
            );
          }
          if (node.type === 'drag_target') {
            return (
              <InlineDragTargetNode
                key={node.id}
                node={node}
                dragSources={dragSources}
                onChange={(u) => updateNode(idx, u)}
                onDelete={() => onChange(deleteNode(content, node.id))}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
