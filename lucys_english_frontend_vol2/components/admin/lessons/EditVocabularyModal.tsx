'use client';

import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Vocabulary } from '@/lib/types/lesson.types';

interface EditVocabularyModalProps {
  isOpen: boolean;
  vocabulary: Vocabulary | null;
  onEditGlobal: () => void;
  onEditLocal: () => void;
  onCancel: () => void;
}

export const EditVocabularyModal: React.FC<EditVocabularyModalProps> = ({
  isOpen,
  vocabulary,
  onEditGlobal,
  onEditLocal,
  onCancel,
}) => {
  if (!vocabulary) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <p className="auth-tag">Úprava slovíčka</p>
      <h2 className="modal-title">Jak chcete upravit?</h2>
      <p className="modal-subtitle">
        Slovíčko <strong style={{ color: 'var(--white)' }}>{vocabulary.english} / {vocabulary.czech}</strong> může být použito ve více lekcích.
      </p>

      <div className="modal-actions">
        <Button variant="pink" fullWidth onClick={onEditGlobal}>
          Změnit všude
        </Button>
        <Button variant="blue" fullWidth onClick={onEditLocal}>
          Změnit jen v této lekci
        </Button>
        <Button variant="outline" fullWidth onClick={onCancel}>
          Zrušit
        </Button>
      </div>
    </Modal>
  );
};
