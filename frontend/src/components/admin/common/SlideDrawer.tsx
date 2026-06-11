'use client';

import { useEffect } from 'react';

interface SlideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  width?: number;
  children: React.ReactNode;
}

export function SlideDrawer({ isOpen, onClose, title, width = 420, children }: SlideDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="drawer-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        role="dialog"
        aria-label={title}
        aria-modal="true"
        className={`slide-drawer ${isOpen ? 'slide-drawer--open' : ''}`}
        style={{ width }}
      >
        <div className="slide-drawer__header">
          <span className="text-admin-lg font-medium text-admin-text">{title}</span>
          <button
            onClick={onClose}
            aria-label="Zavřít panel"
            className="slide-drawer__close"
          >
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        <div className="slide-drawer__body">
          {children}
        </div>
      </aside>
    </>
  );
}
