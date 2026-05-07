'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CoursesApi, CourseWithLessons, CourseLesson } from '@/lib/api/courses.api';
import { CourseLessonsColumn } from './CourseLessonColumn';
import { AllLessonsColumn } from './AllLessonsColumn';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface CourseEditorProps {
    course: CourseWithLessons;
    onSaved: () => void;
    onCancel: () => void;
}

export const CourseEditor: React.FC<CourseEditorProps> = ({ course, onSaved, onCancel }) => {
    const [title, setTitle] = useState(course.title);
    const [courseLessons, setCourseLessons] = useState<CourseLesson[]>(course.courseLessons ?? []);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const loadLessons = useCallback(async () => {
        const data = await CoursesApi.findOne(course.id);
        setCourseLessons(data.courseLessons ?? []);
    }, [course.id]);

    useEffect(() => {
        loadLessons();
    }, [loadLessons]);

    const handleSave = async () => {
        if (!title.trim()) {
            setError('Název je povinný');
            return;
        }
        setSaving(true);
        setError('');
        try {
            await CoursesApi.update(course.id, { title: title.trim() });
            onSaved();
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const lessonIds = courseLessons.map((cl) => cl.lessonId);

    return (
        <div className="lesson-editor">
            <div className="lesson-editor-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, maxWidth: '400px' }}>
                        <Input
                            label="Název kurzu"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', paddingBottom: '2px' }}>
                        <Button variant="pink" loading={saving} onClick={handleSave}>
                            Uložit kurz
                        </Button>
                        <Button variant="outline" onClick={onCancel}>
                            Zpět
                        </Button>
                    </div>
                </div>
                {error && <div className="alert alert-error" style={{ marginTop: '0.5rem' }}>{error}</div>}
            </div>

            <div className="course-editor-columns">
                <CourseLessonsColumn
                    courseId={course.id}
                    courseLessons={courseLessons}
                    onLessonsChange={loadLessons}
                />
                <AllLessonsColumn
                    courseId={course.id}
                    courseLessonIds={lessonIds}
                    onLessonAdded={loadLessons}
                />
            </div>
        </div>
    );
};