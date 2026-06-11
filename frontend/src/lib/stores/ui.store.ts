/**
 * Global admin UI store (toasts, modals and other UI state).
 */
import { create } from 'zustand';
import { v4 as uuid } from 'uuid';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export type ModalKey =
  | 'deleteLesson'
  | 'deleteCourse'
  | 'deleteBlock'
  | 'saveTemplate'
  | 'addLesson'
  | 'addBlock'
  | 'deleteAccess'
  | 'editAccessStatus'
  | 'addWord'
  | 'editWord'
  | 'deleteWord'
  | 'importVocabulary';

export interface ModalState {
  isOpen: boolean;
  payload: Record<string, unknown>;
}

interface UIState {
  toasts: Toast[];
  modals: Record<ModalKey, ModalState>;

  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;

  openModal: (key: ModalKey, payload?: Record<string, unknown>) => void;
  closeModal: (key: ModalKey) => void;
  getModal: (key: ModalKey) => ModalState;
}

const defaultModalState: ModalState = { isOpen: false, payload: {} };

const initialModals: Record<ModalKey, ModalState> = {
  deleteLesson:      defaultModalState,
  deleteCourse:      defaultModalState,
  deleteBlock:       defaultModalState,
  saveTemplate:      defaultModalState,
  addLesson:         defaultModalState,
  addBlock:          defaultModalState,
  deleteAccess:      defaultModalState,
  editAccessStatus:  defaultModalState,
  addWord:           defaultModalState,
  editWord:          defaultModalState,
  deleteWord:        defaultModalState,
  importVocabulary:  defaultModalState,
};

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  modals: initialModals,

  showToast: (message, type = 'success') => {
    const id = uuid();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => get().dismissToast(id), 3500);
  },

  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  openModal: (key, payload = {}) =>
    set((s) => ({
      modals: { ...s.modals, [key]: { isOpen: true, payload } },
    })),

  closeModal: (key) =>
    set((s) => ({
      modals: { ...s.modals, [key]: { isOpen: false, payload: {} } },
    })),

  getModal: (key) => get().modals[key],
}));
