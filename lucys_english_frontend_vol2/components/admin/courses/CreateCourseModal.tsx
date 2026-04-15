'use client';

import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { CoursesApi } from '@/lib/api/courses.api';
import { Course } from '@/lib/types/lesson.types';

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (course: Course) => void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
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
            const course = await CoursesApi.create({ title: title.trim() });
            onCreated(course);
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
            <p className="auth-tag">Nový kurz</p>
            <h2 className="modal-title">Vytvořit kurz</h2>
            <p className="modal-subtitle">Název kurzu lze později upravit v editaci.</p>
            {error && <div className="alert alert-error">{error}</div>}
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                    label="Název kurzu"
                    placeholder="např. Začátečníci A1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
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