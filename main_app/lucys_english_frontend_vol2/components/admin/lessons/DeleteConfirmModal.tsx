'use client';

import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  loading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="verify-icon error" style={{ margin: '0 auto 1rem' }}>✕</div>
      <h2 className="modal-title" style={{ textAlign: 'center' }}>{title}</h2>
      <p className="modal-subtitle" style={{ textAlign: 'center' }}>{description}</p>
      <div className="modal-actions">
        <Button variant="pink" fullWidth loading={loading} onClick={onConfirm}>
          Ano, smazat
        </Button>
        <Button variant="outline" fullWidth onClick={onCancel}>
          Zrušit
        </Button>
      </div>
    </Modal>
  );
};
