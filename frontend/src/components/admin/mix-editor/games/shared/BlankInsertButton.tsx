'use client';

import React from 'react';

interface BlankInsertButtonProps {
  targetRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  placeholder: '{blank}' | '{word}';
  onInsert: (newValue: string) => void;
}

export function BlankInsertButton({ targetRef, placeholder, onInsert }: BlankInsertButtonProps) {
  function handleInsert() {
    const el = targetRef.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const newValue = el.value.slice(0, start) + placeholder + el.value.slice(end);
    onInsert(newValue);
    setTimeout(() => {
      el.focus();
      const pos = start + placeholder.length;
      el.setSelectionRange(pos, pos);
    }, 0);
  }

  return (
    <button
      type="button"
      className="blank-insert-btn"
      onClick={handleInsert}
      title={`Vložit ${placeholder}`}
    >
      {placeholder === '{blank}' ? '[MEZERA]' : '{slovo}'}
    </button>
  );
}
