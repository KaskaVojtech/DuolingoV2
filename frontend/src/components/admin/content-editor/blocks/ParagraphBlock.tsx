'use client';

import { useEffect, useRef } from 'react';
import { ParagraphBlock as PBlock } from '@/lib/content-editor/content-editor.types';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';

interface Props {
  block: PBlock;
  isSelected: boolean;
  onSelectionChange: (range: Range | null) => void;
}

export function ParagraphBlock({ block, isSelected, onSelectionChange }: Props) {
  const { updateBlock, addBlock, deleteBlock } = useContentEditorStore();
  const ref = useRef<HTMLDivElement>(null);
  const lastHtmlRef = useRef(block.html);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = block.html;
    lastHtmlRef.current = block.html;
    if (isSelected && block.html === '') {
      ref.current.focus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ref.current && block.html !== lastHtmlRef.current) {
      ref.current.innerHTML = block.html;
      lastHtmlRef.current = block.html;
    }
  }, [block.html]);

  const handleInput = () => {
    if (!ref.current) return;
    const html = ref.current.innerHTML;
    lastHtmlRef.current = html;
    updateBlock(block.id, { html });
  };

  const handleSelect = () => {
    const sel = window.getSelection();
    onSelectionChange(sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock('paragraph', block.id);
    }
    if (e.key === 'Backspace' && ref.current?.innerHTML === '') {
      e.preventDefault();
      deleteBlock(block.id);
    }
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onSelect={handleSelect}
      onKeyDown={handleKeyDown}
      style={{
        color: block.textColor,
        fontSize: block.fontSize,
        lineHeight: block.lineHeight,
        textAlign: block.textAlign,
        fontWeight: block.fontWeight,
        fontStyle: block.fontStyle,
        backgroundColor: block.backgroundColor ?? 'transparent',
        padding: `${block.paddingTop}px ${block.paddingRight}px ${block.paddingBottom}px ${block.paddingLeft}px`,
        border: block.borderWidth > 0 ? `${block.borderWidth}px solid ${block.borderColor}` : 'none',
        borderRadius: block.borderRadius,
        outline: 'none',
        minHeight: '1.5em',
      }}
      className="w-full"
      data-placeholder="Začněte psát..."
    />
  );
}
