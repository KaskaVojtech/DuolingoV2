'use client';

import React from 'react';
import { AdminButton } from '@/components/admin/common/AdminButton';

interface GameItemListProps<T extends { id: string }> {
  items: T[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  minItems: number;
  maxItems: number;
  addLabel: string;
}

export function GameItemList<T extends { id: string }>({
  items,
  onAdd,
  onRemove,
  renderItem,
  minItems,
  maxItems,
  addLabel,
}: GameItemListProps<T>) {
  return (
    <div className="game-item-list">
      {items.map((item, index) => (
        <div key={item.id} className="game-item-list__row">
          <div className="game-item-list__content">{renderItem(item, index)}</div>
          <button
            type="button"
            className="game-item-list__remove"
            onClick={() => onRemove(item.id)}
            disabled={items.length <= minItems}
            aria-label="Smazat"
            title="Smazat"
          >
            <i className="ti ti-x" />
          </button>
        </div>
      ))}
      {items.length < maxItems && (
        <AdminButton variant="ghost" size="sm" icon="ti-plus" onClick={onAdd} type="button">
          {addLabel}
        </AdminButton>
      )}
    </div>
  );
}
