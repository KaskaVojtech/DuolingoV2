'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CoursesApi, CourseWithLessons } from '@/lib/api/courses.api';
import { DeleteConfirmModal } from '../lessons/DeleteConfirmModal';
import { CreateCourseModal } from './CreateCourseModal';
import { CourseEditor } from './CourseEditor';
import { Button } from '../../ui/Button';

export const CourseList: React.FC = () => {
    const [courses, setCourses] = useState<CourseWithLessons[]>([]);
    const [search, setSearch] = useState('');
    const [sortAsc, setSortAsc] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<CourseWithLessons | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<CourseWithLessons | null>(null);

    const loadCourses = useCallback(async () => {
        const data = await CoursesApi.findAll();
        setCourses(data);
    }, []);

    useEffect(() => {
        loadCourses();
    }, [loadCourses]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await CoursesApi.remove(deleteTarget.id);
            setDeleteTarget(null);
            loadCourses();
        } finally {
            setDeleting(false);
        }
    };

    const sorted = [...courses]
        .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) =>
            sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
        );

    if (editingCourse) {
        return (
            <CourseEditor
                course={editingCourse}
                onSaved={() => { setEditingCourse(null); loadCourses(); }}
                onCancel={() => setEditingCourse(null)}
            />
        );
    }

    return (
        <>
            <div className="admin-card">
                <div className="admin-card-header">
                    <h2 className="admin-card-title">Správa kurzů</h2>
                    <Button variant="pink" onClick={() => setCreateOpen(true)}>
                        + Vytvořit kurz
                    </Button>
                </div>

                <div className="admin-filters">
                    <input
                        className="input-field"
                        placeholder="Vyhledat podle názvu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button
                        className="btn btn-outline"
                        onClick={() => setSortAsc((v) => !v)}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {sortAsc ? 'A → Z' : 'Z → A'}
                    </button>
                </div>

                <div className="admin-list">
                    {sorted.length === 0 && (
                        <p className="admin-empty">Žádné kurzy nenalezeny.</p>
                    )}
                    {sorted.map((course) => (
                        <div key={course.id} className="admin-list-item">
                            <div className="admin-list-item-info">
                                <span className="admin-list-item-title">{course.title}</span>
                                <span className="admin-list-item-meta">
                                    {course.courseLessons?.length ?? 0} lekcí
                                </span>
                            </div>
                            <div className="admin-list-item-actions">
                                <button
                                    className="vocab-btn vocab-btn-edit"
                                    onClick={() => setEditingCourse(course)}
                                >
                                    upravit
                                </button>
                                <button
                                    className="vocab-btn vocab-btn-remove"
                                    onClick={() => setDeleteTarget(course)}
                                >
                                    smazat
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CreateCourseModal
                isOpen={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={async (course) => {
                    const full = await CoursesApi.findOne(course.id);
                    setEditingCourse(full);
                }}
            />

            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                title="Smazat kurz?"
                description={`Opravdu chcete smazat kurz "${deleteTarget?.title}"? Tato akce je nevratná.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                loading={deleting}
            />
        </>
    );
};