'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface SortableItemProps {
  id: string;
  children: (props: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
    isDragging: boolean;
    setNodeRef: (el: HTMLElement | null) => void;
    style: React.CSSProperties;
  }) => React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return <>{children({ attributes, listeners, isDragging, setNodeRef, style })}</>;
}
