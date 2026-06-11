'use client';

import { useState } from 'react';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { AddItemMenu } from './AddItemMenu';

export function AddItemToolbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mt-admin-md">
      <AdminButton icon="ti-plus" onClick={() => setOpen(!open)}>
        Přidat blok
      </AdminButton>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute left-0 top-full mt-2 z-50">
            <AddItemMenu onClose={() => setOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
