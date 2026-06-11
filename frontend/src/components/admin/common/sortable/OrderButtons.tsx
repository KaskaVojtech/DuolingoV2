'use client';

interface OrderButtonsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  label: string;
}

export function OrderButtons({ onMoveUp, onMoveDown, isFirst, isLast, label }: OrderButtonsProps) {
  return (
    <div className="flex flex-col">
      <button
        onClick={onMoveUp}
        disabled={isFirst}
        aria-label={`${label} nahoru`}
        className="disabled:opacity-30"
      >
        <i className="ti ti-chevron-up" aria-hidden="true" />
      </button>
      <button
        onClick={onMoveDown}
        disabled={isLast}
        aria-label={`${label} dolů`}
        className="disabled:opacity-30"
      >
        <i className="ti ti-chevron-down" aria-hidden="true" />
      </button>
    </div>
  );
}
