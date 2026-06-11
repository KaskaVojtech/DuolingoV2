'use client';

import { useUIStore } from '@/lib/stores/ui.store';

export function ToastContainer() {
  const { toasts, dismissToast } = useUIStore();

  return (
    <div
      aria-live="polite"
      aria-label="Notifikace"
      className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`toast toast--${toast.type}`}
          onClick={() => dismissToast(toast.id)}
        >
          <i
            className={`ti ${
              toast.type === 'success' ? 'ti-check' :
              toast.type === 'error'   ? 'ti-alert-circle' :
              'ti-info-circle'
            }`}
            aria-hidden="true"
          />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
