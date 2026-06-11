'use client';

import { useTemplateImportStore } from '@/lib/template-import/template-import.store';
import { useTemplates } from '@/lib/template-import/template-import.api';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { TemplateSearch } from './TemplateSearch';
import { TemplateListItem } from './TemplateListItem';

export function TemplateList() {
  const { searchQuery, selectedTemplateIds, startPlacing } = useTemplateImportStore();
  const { data: templates, isLoading } = useTemplates();

  const filtered = (templates ?? []).filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="template-list">
      <div className="template-list__search">
        <TemplateSearch />
      </div>

      <div className="template-list__items">
        {isLoading && (
          <p className="p-admin-md text-admin-sm text-admin-text-muted">Načítám šablony...</p>
        )}
        {!isLoading && filtered.length === 0 && (
          <p className="p-admin-md text-admin-sm text-admin-text-muted italic">
            {searchQuery ? 'Žádné šablony neodpovídají hledání.' : 'Žádné šablony nejsou k dispozici.'}
          </p>
        )}
        {filtered.map((t) => (
          <TemplateListItem key={t.id} template={t} />
        ))}
      </div>

      <div className="template-list__footer">
        <span className="text-admin-xs text-admin-text-muted">
          {selectedTemplateIds.length > 0
            ? `Vybráno: ${selectedTemplateIds.length} ${selectedTemplateIds.length === 1 ? 'šablona' : selectedTemplateIds.length < 5 ? 'šablony' : 'šablon'}`
            : 'Vyberte šablony ze seznamu'}
        </span>
        {selectedTemplateIds.length > 0 && (
          <AdminButton variant="primary" icon="ti-arrow-right" onClick={startPlacing}>
            Pokračovat
          </AdminButton>
        )}
      </div>
    </div>
  );
}
