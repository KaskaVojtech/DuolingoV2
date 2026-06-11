import { v4 as uuid } from 'uuid';
import { InlineContent, InlineComponent, DragTargetComponent, TextComponent } from './exercise.types';

export function createEmptyInlineContent(): InlineContent {
  return {
    type: 'inline',
    id: uuid(),
    nodes: [{ type: 'text', value: '' }],
  };
}

export function generateNodeId(): string {
  return uuid();
}

export function insertNodeAt(
  content: InlineContent,
  index: number,
  node: InlineComponent | DragTargetComponent
): InlineContent {
  const nodes = [...content.nodes];
  nodes.splice(index, 0, node);

  if (node.type !== 'text') {
    const before = nodes[index - 1];
    const after = nodes[index + 1];
    const result: typeof nodes = [];
    for (let i = 0; i < nodes.length; i++) {
      if (i === index) {
        if (!before || before.type !== 'text') result.push({ type: 'text', value: '' });
        result.push(node);
        if (!after || after.type !== 'text') result.push({ type: 'text', value: '' });
      } else {
        result.push(nodes[i]);
      }
    }
    return { ...content, nodes: result };
  }
  return { ...content, nodes };
}

export function appendNode(
  content: InlineContent,
  node: InlineComponent | DragTargetComponent
): InlineContent {
  const nodes = [...content.nodes];
  if (node.type !== 'text') {
    const last = nodes[nodes.length - 1];
    if (!last || last.type !== 'text') nodes.push({ type: 'text', value: '' } as TextComponent);
    nodes.push(node);
    nodes.push({ type: 'text', value: '' } as TextComponent);
  } else {
    nodes.push(node);
  }
  return { ...content, nodes };
}

export function deleteNode(content: InlineContent, nodeId: string): InlineContent {
  const nodes = content.nodes.filter((n) => {
    if (n.type === 'text') return true;
    return (n as { id: string }).id !== nodeId;
  });

  const merged: typeof nodes = [];
  for (const node of nodes) {
    const last = merged[merged.length - 1];
    if (node.type === 'text' && last && last.type === 'text') {
      merged[merged.length - 1] = { type: 'text', value: last.value + node.value };
    } else {
      merged.push(node);
    }
  }
  if (merged.length === 0) merged.push({ type: 'text', value: '' });
  return { ...content, nodes: merged };
}

export function inlineContentToText(content: InlineContent): string {
  return content.nodes.map((n) => {
    if (n.type === 'text') return n.value;
    if (n.type === 'input') return '[INPUT]';
    if (n.type === 'select') return `[SELECT: ${n.options.join('/')}]`;
    if (n.type === 'select_between') return `[${n.options.join('/')}]`;
    if (n.type === 'drag_target') return '[___]';
    return '';
  }).join('');
}
