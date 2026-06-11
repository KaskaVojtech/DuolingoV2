'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateGroup } from '@/lib/groups/groups.api';
import { GROUP_COLOR_PRESETS } from '@/lib/groups/groups.types';

interface CreateGroupModalProps {
  onClose: () => void;
}

export function CreateGroupModal({ onClose }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(GROUP_COLOR_PRESETS[0]);
  const createGroup = useCreateGroup();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const group = await createGroup.mutateAsync({ name: name.trim(), color });
    router.push(`/admin/groups/${group.id}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="bg-admin-surface border border-admin-border rounded-admin-lg w-full max-w-sm mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
          <h2 className="text-admin-base font-semibold text-admin-text">Nová skupina</h2>
          <button onClick={onClose} className="text-admin-text-muted hover:text-admin-text">
            <i className="ti ti-x text-[18px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-admin-xs font-medium text-admin-text-muted uppercase tracking-wide">Název skupiny</label>
            <input
              autoFocus
              type="text"
              className="admin-input w-full"
              placeholder="Např. Skupina A — Angličtina B2"
              value={name}
              maxLength={255}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-admin-xs font-medium text-admin-text-muted uppercase tracking-wide">Barva</label>
            <div className="flex gap-2 flex-wrap">
              {GROUP_COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{ background: c, borderColor: color === c ? '#fff' : 'transparent', boxShadow: color === c ? `0 0 0 2px ${c}` : 'none' }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 text-admin-sm text-admin-text-muted hover:text-admin-text border border-admin-border rounded-admin-sm">
              Zrušit
            </button>
            <button
              type="submit"
              disabled={!name.trim() || createGroup.isPending}
              className="px-4 py-2 text-admin-sm font-medium rounded-admin-sm text-white disabled:opacity-50"
              style={{ background: color }}
            >
              {createGroup.isPending ? 'Vytváření…' : 'Vytvořit skupinu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
