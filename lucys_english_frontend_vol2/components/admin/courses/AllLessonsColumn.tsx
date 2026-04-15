'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LessonsApi } from '@/lib/api/lessons.api';
import { CoursesApi } from '@/lib/api/courses.api';
import { Lesson, Course } from '@/lib/types/lesson.types';
import { CoursesApi as CoursesApiType } from '@/lib/api/courses.api';

interface AllLessonsColumnProps {
    courseId: number;
    courseLessonIds: number[];
    onLessonAdded: () => void;
}

export const AllLessonsColumn: React.FC<AllLessonsColumnProps> = ({
    courseId,
    courseLessonIds,
    onLessonAdded,
}) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
    const [adding, setAdding] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const loadLessons = useCallback(async () => {
        setLoading(true);
        try {
            const data = await LessonsApi.findAll({
                search: search || undefined,
                type: 'VOCABULARY',
            });
            setLessons(data);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        loadLessons();
    }, [loadLessons]);

    useEffect(() => {
        CoursesApi.findAll().then(setCourses);
    }, []);

    const handleAdd = async (lessonId: number) => {
        setAdding(lessonId);
        try {
            await CoursesApi.addLesson(courseId, lessonId);
            onLessonAdded();
        } catch (err) {
            console.error(err);
        } finally {
            setAdding(null);
        }
    };

    const toggleCourse = (id: number) => {
        setSelectedCourseIds((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const filtered = lessons.filter((lesson) => {
        if (selectedCourseIds.length === 0) return true;
        return lesson.courseLessons?.some((cl) => selectedCourseIds.includes(cl.courseId));
    });

    return (
        <div className="admin-column">
            <div className="admin-column-header">
                <h3 className="admin-column-title">Existující lekce</h3>
            </div>

            <div className="admin-column-search">
                <input
                    className="input-field"
                    placeholder="Vyhledat lekci..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                />
                {courses.length > 0 && (
                    <div className="lesson-filter">
                        <p className="input-label" style={{ marginBottom: '0.4rem' }}>Filtrovat podle kurzu:</p>
                        <div className="lesson-filter-list">
                            {courses.filter((c) => c.id !== courseId).map((course) => (
                                <label key={course.id} className="lesson-filter-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedCourseIds.includes(course.id)}
                                        onChange={() => toggleCourse(course.id)}
                                    />
                                    <span>{course.title}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="admin-column-list">
                {loading && <p className="admin-empty">Načítání...</p>}
                {!loading && filtered.length === 0 && (
                    <p className="admin-empty">Žádné lekce nenalezeny.</p>
                )}
                {filtered.map((lesson) => {
                    const alreadyAdded = courseLessonIds.includes(lesson.id);
                    return (
                        <div key={lesson.id} className={`vocab-item ${alreadyAdded ? 'vocab-item-added' : ''}`}>
                            <div className="vocab-item-text">
                                <span className="vocab-english">{lesson.title}</span>
                                <span className="vocab-czech">{lesson.type === 'VOCABULARY' ? 'Slovíčka' : 'Gramatika'}</span>
                            </div>
                            <button
                                className="vocab-btn vocab-btn-add"
                                onClick={() => handleAdd(lesson.id)}
                                disabled={alreadyAdded || adding === lesson.id}
                            >
                                {alreadyAdded ? '✓' : adding === lesson.id ? '...' : 'přidat'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};