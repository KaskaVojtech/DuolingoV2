'use client';

import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { DraggableAttributes } from '@dnd-kit/core';

interface HandleProps {
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
}

export function SortableHandle({ listeners, attributes }: HandleProps) {
  return (
    <button
      {...listeners}
      {...attributes}
      className="sortable-handle"
      aria-label="Přetáhnout pro změnu pořadí"
    >
      <i className="ti ti-grip-vertical" aria-hidden="true" />
    </button>
  );
}
