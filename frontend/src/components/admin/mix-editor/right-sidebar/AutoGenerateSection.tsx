'use client';

import { useMixEditorStore } from '@/lib/mix-editor/mix-editor.store';
import { AdminButton } from '../../common/AdminButton';

export function AutoGenerateSection() {
  const { activeGameId, isGenerating, autoGenerateVariant, autoGenerateAll } = useMixEditorStore();

  return (
    <div className="mix-right-sidebar__section">
      <p className="mix-right-sidebar__section-title">Auto-generování</p>
      {activeGameId && (
        <div className="mix-right-sidebar__autogen">
          <AdminButton
            variant="ghost"
            size="sm"
            icon="ti-bolt"
            loading={isGenerating}
            onClick={() => autoGenerateVariant(activeGameId)}
          >
            Generovat variantu
          </AdminButton>
          <p className="mix-right-sidebar__autogen-desc">
            Vygeneruje novou variantu ze slovíček lekce a předchozích lekcí.
            Věty doplní AI (Ollama), pokud chybí vzorové věty.
          </p>
        </div>
      )}
      <div className="mix-right-sidebar__autogen">
        <AdminButton
          variant="ghost"
          size="sm"
          icon="ti-bolt"
          loading={isGenerating}
          onClick={autoGenerateAll}
        >
          Generovat vše
        </AdminButton>
        <p className="mix-right-sidebar__autogen-desc">
          Vytvoří celý mix automaticky.
        </p>
      </div>
    </div>
  );
}
