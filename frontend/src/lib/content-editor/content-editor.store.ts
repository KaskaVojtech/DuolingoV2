/**
 * Zustand store of the content blocks editor.
 */
import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuid } from 'uuid';
import {
  BlockContent, ContentBlock, ContentBlockType, TableCell,
} from './content-editor.types';
import { createBlock } from './content-editor.utils';
import { saveBlockContent as apiSave } from './content-editor.api';

interface ContentEditorState {
  content: BlockContent;
  selectedBlockId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  previewMode: boolean;

  setContent: (content: BlockContent) => void;
  setTitle: (title: string) => void;
  selectBlock: (id: string | null) => void;

  addBlock: (type: ContentBlockType, afterId?: string) => void;
  updateBlock: (id: string, patch: Partial<ContentBlock>) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;

  reorderBlocks: (activeId: string, overId: string) => void;
  moveBlockUp: (id: string) => void;
  moveBlockDown: (id: string) => void;

  addTableRow: (blockId: string, afterIndex: number) => void;
  removeTableRow: (blockId: string, index: number) => void;
  addTableColumn: (blockId: string, afterIndex: number) => void;
  removeTableColumn: (blockId: string, index: number) => void;
  updateTableCell: (blockId: string, row: number, col: number, patch: Partial<TableCell>) => void;

  saveContent: () => Promise<void>;
  togglePreview: () => void;
}

const emptyContent: BlockContent = { id: '', lessonId: '', title: '', blocks: [] };

export const useContentEditorStore = create<ContentEditorState>((set, get) => ({
  content: emptyContent,
  selectedBlockId: null,
  isDirty: false,
  isSaving: false,
  previewMode: false,

  setContent: (content) => set({ content, isDirty: false }),

  setTitle: (title) =>
    set((s) => ({ content: { ...s.content, title }, isDirty: true })),

  selectBlock: (id) => set({ selectedBlockId: id }),

  addBlock: (type, afterId) => {
    const block = createBlock(type);
    set((s) => {
      const blocks = [...s.content.blocks];
      if (afterId) {
        const idx = blocks.findIndex((b) => b.id === afterId);
        blocks.splice(idx + 1, 0, block);
      } else {
        blocks.push(block);
      }
      return { content: { ...s.content, blocks }, isDirty: true, selectedBlockId: block.id };
    });
  },

  updateBlock: (id, patch) =>
    set((s) => ({
      content: { ...s.content, blocks: s.content.blocks.map((b) => b.id === id ? { ...b, ...patch } as ContentBlock : b) },
      isDirty: true,
    })),

  deleteBlock: (id) =>
    set((s) => ({
      content: { ...s.content, blocks: s.content.blocks.filter((b) => b.id !== id) },
      isDirty: true,
      selectedBlockId: s.selectedBlockId === id ? null : s.selectedBlockId,
    })),

  duplicateBlock: (id) => {
    set((s) => {
      const idx = s.content.blocks.findIndex((b) => b.id === id);
      if (idx === -1) return s;
      const copy = { ...s.content.blocks[idx], id: uuid() };
      const blocks = [...s.content.blocks];
      blocks.splice(idx + 1, 0, copy);
      return { content: { ...s.content, blocks }, isDirty: true, selectedBlockId: copy.id };
    });
  },

  reorderBlocks: (activeId, overId) => {
    const { content } = get();
    const oldIdx = content.blocks.findIndex((b) => b.id === activeId);
    const newIdx = content.blocks.findIndex((b) => b.id === overId);
    if (oldIdx === -1 || newIdx === -1) return;
    set({ content: { ...content, blocks: arrayMove(content.blocks, oldIdx, newIdx) }, isDirty: true });
  },

  moveBlockUp: (id) => {
    const { content, reorderBlocks } = get();
    const idx = content.blocks.findIndex((b) => b.id === id);
    if (idx <= 0) return;
    reorderBlocks(id, content.blocks[idx - 1].id);
  },

  moveBlockDown: (id) => {
    const { content, reorderBlocks } = get();
    const idx = content.blocks.findIndex((b) => b.id === id);
    if (idx === -1 || idx >= content.blocks.length - 1) return;
    reorderBlocks(id, content.blocks[idx + 1].id);
  },

  addTableRow: (blockId, afterIndex) => {
    set((s) => {
      const blocks = s.content.blocks.map((b) => {
        if (b.id !== blockId || b.type !== 'table') return b;
        const colCount = b.rows[0]?.length ?? 1;
        const newRow = Array.from({ length: colCount }, () => ({ html: '', textAlign: 'left' as const, fontWeight: 400 as const, backgroundColor: null, textColor: null }));
        const rows = [...b.rows];
        rows.splice(afterIndex + 1, 0, newRow);
        return { ...b, rows };
      });
      return { content: { ...s.content, blocks }, isDirty: true };
    });
  },

  removeTableRow: (blockId, index) => {
    set((s) => {
      const blocks = s.content.blocks.map((b) => {
        if (b.id !== blockId || b.type !== 'table') return b;
        return { ...b, rows: b.rows.filter((_, i) => i !== index) };
      });
      return { content: { ...s.content, blocks }, isDirty: true };
    });
  },

  addTableColumn: (blockId, afterIndex) => {
    set((s) => {
      const blocks = s.content.blocks.map((b) => {
        if (b.id !== blockId || b.type !== 'table') return b;
        const rows = b.rows.map((row) => {
          const newCell = { html: '', textAlign: 'left' as const, fontWeight: 400 as const, backgroundColor: null, textColor: null };
          const r = [...row];
          r.splice(afterIndex + 1, 0, newCell);
          return r;
        });
        return { ...b, rows };
      });
      return { content: { ...s.content, blocks }, isDirty: true };
    });
  },

  removeTableColumn: (blockId, colIndex) => {
    set((s) => {
      const blocks = s.content.blocks.map((b) => {
        if (b.id !== blockId || b.type !== 'table') return b;
        const rows = b.rows.map((row) => row.filter((_, i) => i !== colIndex));
        return { ...b, rows };
      });
      return { content: { ...s.content, blocks }, isDirty: true };
    });
  },

  updateTableCell: (blockId, row, col, patch) => {
    set((s) => {
      const blocks = s.content.blocks.map((b) => {
        if (b.id !== blockId || b.type !== 'table') return b;
        const rows = b.rows.map((r, ri) =>
          ri === row ? r.map((c, ci) => ci === col ? { ...c, ...patch } : c) : r
        );
        return { ...b, rows };
      });
      return { content: { ...s.content, blocks }, isDirty: true };
    });
  },

  saveContent: async () => {
    set({ isSaving: true });
    try {
      await apiSave(get().content);
      set({ isDirty: false });
    } finally {
      set({ isSaving: false });
    }
  },

  togglePreview: () => set((s) => ({ previewMode: !s.previewMode })),
}));
