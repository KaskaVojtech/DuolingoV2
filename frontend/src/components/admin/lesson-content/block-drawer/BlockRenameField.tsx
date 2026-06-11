'use client';

import { useRef, useState, useEffect } from 'react';
import { useLessonContentStore } from '@/lib/lesson-content/lesson-content.store';
import { updateBlockConfig } from '@/lib/lesson-content/lesson-content.api';

export function BlockRenameField({ blockId, currentTitle }: { blockId: string; currentTitle: string }) {
  const [value, setValue] = useState(currentTitle);
  const [saved, setSaved] = useState(false);
  const { updateBlock } = useLessonContentStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { setValue(currentTitle); }, [currentTitle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!v.trim() || v.length > 200) return;
      updateBlock(blockId, { title: v.trim() });
      await updateBlockConfig(blockId, { title: v.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 1000);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-1 mb-admin-lg">
      <label className="text-admin-xs text-admin-text-muted">Název bloku</label>
      <input
        value={value}
        onChange={handleChange}
        maxLength={200}
        className={`w-full bg-admin-surface-2 border rounded-admin-sm px-admin-md py-2 text-admin-sm text-admin-text focus:outline-none focus:border-admin-primary transition-all ${saved ? 'border-[#2db868] shadow-[0_0_0_2px_rgba(45,184,104,0.2)]' : 'border-admin-border'}`}
      />
    </div>
  );
}
