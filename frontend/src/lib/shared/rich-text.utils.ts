import { InlineFormat } from '@/lib/content-editor/content-editor.types';

export function getSelectionLink(): string | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const anchor = selection.anchorNode?.parentElement?.closest('a');
  return anchor?.href ?? null;
}

export function getActiveFormats(): InlineFormat {
  return {
    bold:          document.queryCommandState('bold'),
    italic:        document.queryCommandState('italic'),
    underline:     document.queryCommandState('underline'),
    strikethrough: document.queryCommandState('strikeThrough'),
    link:          getSelectionLink(),
    color:         document.queryCommandValue('foreColor') || null,
  };
}

export function applyFormat(format: keyof InlineFormat, value?: string): void {
  switch (format) {
    case 'bold':          document.execCommand('bold'); break;
    case 'italic':        document.execCommand('italic'); break;
    case 'underline':     document.execCommand('underline'); break;
    case 'strikethrough': document.execCommand('strikeThrough'); break;
    case 'color':         document.execCommand('foreColor', false, value ?? '#ffffff'); break;
    case 'link':
      if (value) document.execCommand('createLink', false, value);
      else document.execCommand('unlink');
      break;
  }
}

export function saveSelection(): Range | null {
  const sel = window.getSelection();
  return sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
}

export function restoreSelection(range: Range | null): void {
  if (!range) return;
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

export function hasActiveSelection(): boolean {
  const sel = window.getSelection();
  return !!sel && sel.toString().length > 0;
}
