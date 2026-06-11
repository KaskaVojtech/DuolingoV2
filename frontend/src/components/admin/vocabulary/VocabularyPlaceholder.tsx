'use client';

import { useUIStore } from '@/lib/stores/ui.store';

export function VocabularyPlaceholder() {
  const { openModal } = useUIStore();
  return (
    <button
      onClick={() => openModal('addWord', {})}
      className="flex items-center justify-center gap-2 w-full py-4 border-t border-dashed border-admin-border text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-2 transition-colors"
    >
      <i className="ti ti-plus text-[16px]" aria-hidden="true" />
      <span className="text-admin-sm">Přidat slovíčko</span>
    </button>
  );
}
