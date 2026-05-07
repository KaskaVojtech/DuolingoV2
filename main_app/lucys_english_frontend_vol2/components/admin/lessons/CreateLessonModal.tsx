'use client';

import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { LessonsApi } from '@/lib/api/lessons.api';
import { Lesson } from '@/lib/types/lesson.types';

interface CreateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (lesson: Lesson) => void;
}

export const CreateLessonModal: React.FC<CreateLessonModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Název je povinný');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const lesson = await LessonsApi.create({ title: title.trim(), type: 'VOCABULARY' });
      onCreated(lesson);
      setTitle('');
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <p className="auth-tag">Nová lekce</p>
      <h2 className="modal-title">Vytvořit lekci</h2>
      <p className="modal-subtitle">Typ lekce nelze po vytvoření změnit.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          label="Název lekce"
          placeholder="např. Pozdravy"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="input-wrapper">
          <label className="input-label">Typ lekce</label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-pink" style={{ flex: 1 }}>Slovíčka</button>
            <button className="btn btn-outline" style={{ flex: 1, opacity: 0.4, cursor: 'not-allowed' }} disabled>
              Gramatika (brzy)
            </button>
          </div>
        </div>
      </div>

      <div className="modal-actions">
        <Button variant="pink" fullWidth loading={loading} onClick={handleCreate}>
          Vytvořit a editovat
        </Button>
        <Button variant="outline" fullWidth onClick={onClose}>Zrušit</Button>
      </div>
    </Modal>
  );
};
