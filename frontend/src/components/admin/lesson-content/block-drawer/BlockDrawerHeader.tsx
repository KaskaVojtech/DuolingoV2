'use client';

interface BlockDrawerHeaderProps {
  title: string;
  onClose: () => void;
}

export function BlockDrawerHeader({ title, onClose }: BlockDrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between px-admin-lg py-admin-md border-b border-admin-border shrink-0">
      <h2 className="text-admin-base font-semibold text-admin-text">{title}</h2>
      <button
        onClick={onClose}
        aria-label="Zavřít"
        className="w-7 h-7 flex items-center justify-center text-admin-text-muted hover:text-admin-text rounded-admin-sm hover:bg-admin-surface-2 transition-colors"
      >
        <i className="ti ti-x text-[16px]" aria-hidden="true" />
      </button>
    </div>
  );
}
