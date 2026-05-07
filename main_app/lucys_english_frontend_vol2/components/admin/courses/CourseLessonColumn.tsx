'use client';

import React, { useState } from 'react';
import { CourseLesson, CoursesApi } from '@/lib/api/courses.api';
import { useRouter } from 'next/navigation';

interface CourseLessonsColumnProps {
    courseId: number;
    courseLessons: CourseLesson[];
    onLessonsChange: () => void;
}

export const CourseLessonsColumn: React.FC<CourseLessonsColumnProps> = ({
    courseId,
    courseLessons,
    onLessonsChange,
}) => {
    const [removing, setRemoving] = useState<number | null>(null);
    const [toggling, setToggling] = useState<number | null>(null);
    const router = useRouter();

    const handleRemove = async (lessonId: number) => {
        setRemoving(lessonId);
        try {
            await CoursesApi.removeLesson(courseId, lessonId);
            onLessonsChange();
        } catch (err) {
            console.error(err);
        } finally {
            setRemoving(null);
        }
    };

    const handleToggleLock = async (lessonId: number, currentlyUnlocked: boolean) => {
        setToggling(lessonId);
        try {
            await CoursesApi.unlockLesson(courseId, lessonId, !currentlyUnlocked);
            onLessonsChange();
        } catch (err) {
            console.error(err);
        } finally {
            setToggling(null);
        }
    };

    return (
        <div className="admin-column">
            <div className="admin-column-header">
                <h3 className="admin-column-title">Lekce v kurzu</h3>
                <span className="admin-column-count">{courseLessons.length}</span>
            </div>
            <div className="admin-column-list">
                {courseLessons.length === 0 && (
                    <p className="admin-empty">Žádné lekce. Přidejte z pravého sloupce.</p>
                )}
                {courseLessons.map((cl) => (
                    <div key={cl.lessonId} className="vocab-item">
                        <div className="vocab-item-text">
                            <span className="vocab-english">{cl.lesson.title}</span>
                            <span className="vocab-czech">{cl.lesson.type === 'VOCABULARY' ? 'Slovíčka' : 'Gramatika'}</span>
                        </div>
                        <div className="vocab-item-actions">
                            <button
                                className="vocab-btn vocab-btn-edit"
                                onClick={() => router.push('/admin/lessons')}
                            >
                                editovat
                            </button>
                            <button
                                className="vocab-btn vocab-btn-remove"
                                onClick={() => handleRemove(cl.lessonId)}
                                disabled={removing === cl.lessonId}
                            >
                                {removing === cl.lessonId ? '...' : 'odebrat'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};