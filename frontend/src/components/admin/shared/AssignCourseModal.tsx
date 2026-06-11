'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/shared/api-client';

interface Course {
  id: string;
  title: string;
  thumbnailColor: string;
}

interface Props {
  assignedCourseIds: string[];
  onAssign: (courseId: string) => void;
  onClose: () => void;
}

export function AssignCourseModal({ assignedCourseIds, onAssign, onClose }: Props) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const { data: allCourses = [] } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => (await apiClient.get('/courses')).data,
  });

  const filtered = allCourses.filter(
    (c) =>
      !assignedCourseIds.includes(c.id) &&
      c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="bg-admin-surface border border-admin-border rounded-admin-lg w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-admin-border">
          <h3 className="text-admin-sm font-semibold text-admin-text">Přiřadit kurz</h3>
          <button onClick={onClose} className="text-admin-text-muted hover:text-admin-text">
            <i className="ti ti-x text-[16px]" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-admin-border">
          <div className="relative">
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted text-admin-sm" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Hledat kurz…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-admin-surface-2 border border-admin-border rounded-admin-sm text-admin-sm text-admin-text placeholder:text-admin-text-muted focus:outline-none focus:border-admin-primary"
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-72">
          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center text-admin-sm text-admin-text-muted">
              {search ? 'Žádný kurz nenalezen' : 'Všechny kurzy jsou již přiřazeny'}
            </div>
          )}
          {filtered.map((course) => (
            <button
              key={course.id}
              onClick={() => { onAssign(course.id); onClose(); }}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-admin-surface-2 transition-colors border-b border-admin-border last:border-b-0 text-left"
            >
              <span
                className="w-7 h-7 rounded-admin-sm shrink-0 flex items-center justify-center"
                style={{ background: course.thumbnailColor ?? '#5b7cfa' }}
              >
                <i className="ti ti-book text-white text-[13px]" />
              </span>
              <span className="text-admin-sm text-admin-text truncate">{course.title}</span>
              <i className="ti ti-plus text-admin-text-muted text-[14px] ml-auto shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
