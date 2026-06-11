'use client';

import { useEffect, useRef, useState } from 'react';
import { useUserSearch, useAddMember } from '@/lib/groups/groups.api';
import { GroupMember, GroupUser } from '@/lib/groups/groups.types';

interface AddMemberModalProps {
  groupId: string;
  existingMembers: GroupMember[];
  onClose: () => void;
}

function UserInitials({ email }: { email: string }) {
  const initials = email.slice(0, 2).toUpperCase();
  return (
    <span className="w-8 h-8 rounded-full bg-admin-surface-2 border border-admin-border flex items-center justify-center text-admin-xs font-semibold text-admin-text-muted shrink-0">
      {initials}
    </span>
  );
}

export function AddMemberModal({ groupId, existingMembers, onClose }: AddMemberModalProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const addMember = useAddMember(groupId);

  const memberIds = new Set(existingMembers.map((m) => m.userId));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  const { data: users, isFetching } = useUserSearch(debouncedQuery);

  async function handleAdd(user: GroupUser) {
    if (memberIds.has(user.id)) return;
    await addMember.mutateAsync(user.id);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="bg-admin-surface border border-admin-border rounded-admin-lg w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
          <h2 className="text-admin-base font-semibold text-admin-text">Přidat člena</h2>
          <button onClick={onClose} className="text-admin-text-muted hover:text-admin-text">
            <i className="ti ti-x text-[18px]" />
          </button>
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted text-admin-sm" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Hledat uživatele podle emailu…"
              className="admin-input w-full pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
          {query.length === 0 && (
            <p className="px-6 py-8 text-center text-admin-xs text-admin-text-muted">
              Zadejte email pro vyhledání uživatele
            </p>
          )}
          {query.length > 0 && isFetching && (
            <p className="px-6 py-6 text-center text-admin-xs text-admin-text-muted">Hledám…</p>
          )}
          {query.length > 0 && !isFetching && users?.length === 0 && (
            <p className="px-6 py-8 text-center text-admin-xs text-admin-text-muted">Žádní uživatelé nenalezeni</p>
          )}
          {users && users.length > 0 && (
            <ul className="py-2">
              {users.map((user) => {
                const isMember = memberIds.has(user.id);
                return (
                  <li key={user.id} className="flex items-center gap-3 px-6 py-2.5 hover:bg-admin-surface-2 transition-colors">
                    <UserInitials email={user.email} />
                    <div className="flex-1 min-w-0">
                      <p className="text-admin-sm text-admin-text truncate">{user.email}</p>
                      {user.role === 'admin' && (
                        <p className="text-admin-xs text-admin-text-muted">Admin</p>
                      )}
                    </div>
                    {isMember ? (
                      <span className="flex items-center gap-1 text-admin-xs text-[#22c55e]">
                        <i className="ti ti-check" /> Člen
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAdd(user)}
                        disabled={addMember.isPending}
                        className="flex items-center gap-1 px-3 py-1 text-admin-xs font-medium rounded-admin-sm border border-admin-border hover:border-admin-primary hover:text-admin-primary transition-colors disabled:opacity-50"
                      >
                        <i className="ti ti-plus text-[13px]" /> Přidat
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="px-6 py-3 border-t border-admin-border">
          <button onClick={onClose} className="text-admin-sm text-admin-text-muted hover:text-admin-text">
            Zavřít
          </button>
        </div>
      </div>
    </div>
  );
}
