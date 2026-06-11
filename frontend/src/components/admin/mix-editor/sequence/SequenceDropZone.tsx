'use client';

import { useDroppable } from '@dnd-kit/core';

interface SequenceDropZoneProps {
  id: string;
}

export function SequenceDropZone({ id }: SequenceDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`sequence-drop-zone ${isOver ? 'sequence-drop-zone--active' : ''}`}
    >
      {isOver && <i className="ti ti-plus" />}
    </div>
  );
}
