'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User, Course } from '@/lib/types/lesson.types';
import { UsersApi } from '@/lib/api/users.api';
import { CoursesApi } from '@/lib/api/courses.api';
import { DeleteConfirmModal } from '../lessons/DeleteConfirmModal';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null);
  const [deactivating, setDeactivating] = useState(false);
  const [courseModalUser, setCourseModalUser] = useState<User | null>(null);
  const [assigning, setAssigning] = useState<number | null>(null);

  const loadUsers = useCallback(async () => {
    const data = await UsersApi.findAll(search || undefined);
    setUsers(data);
  }, [search]);

  useEffect(() => { loadUsers(); }, [loadUsers]);
  useEffect(() => { CoursesApi.findAll().then(setCourses); }, []);

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    setDeactivating(true);
    try {
      await UsersApi.deactivate(deactivateTarget.id);
      setDeactivateTarget(null);
      loadUsers();
    } finally {
      setDeactivating(false);
    }
  };

  const handleAssignCourse = async (courseId: number) => {
    if (!courseModalUser) return;
    setAssigning(courseId);
    try {
      await UsersApi.assignCourse(courseModalUser.id, courseId);
      loadUsers();
      const updated = await UsersApi.findAll();
      const updatedUser = updated.find(u => u.id === courseModalUser.id);
      if (updatedUser) setCourseModalUser(updatedUser);
    } catch (err) {
      console.error(err);
    } finally {
      setAssigning(null);
    }
  };

  const handleRemoveCourse = async (courseId: number) => {
    if (!courseModalUser) return;
    setAssigning(courseId);
    try {
      await UsersApi.removeCourse(courseModalUser.id, courseId);
      loadUsers();
      const updated = await UsersApi.findAll();
      const updatedUser = updated.find(u => u.id === courseModalUser.id);
      if (updatedUser) setCourseModalUser(updatedUser);
    } catch (err) {
      console.error(err);
    } finally {
      setAssigning(null);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return { label: 'Aktivní', color: 'var(--blue-light)' };
      case 'PENDING': return { label: 'Čeká na ověření', color: 'var(--gray)' };
      case 'NOTACTIVE': return { label: 'Deaktivován', color: 'var(--pink)' };
      default: return { label: status, color: 'var(--gray)' };
    }
  };

  const assignedCourseIds = courseModalUser?.userCourses.map(uc => uc.courseId) ?? [];

  return (
    <>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Správa uživatelů</h2>
        </div>

        <div className="admin-filters">
          <input
            className="input-field"
            placeholder="Vyhledat podle emailu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        <div className="admin-list">
          {users.length === 0 && (
            <p className="admin-empty">Žádní uživatelé nenalezeni.</p>
          )}
          {users.map((user) => {
            const { label, color } = getStatusLabel(user.status);
            return (
              <div key={user.id} className="admin-list-item">
                <div className="admin-list-item-info">
                  <span className="admin-list-item-title">{user.email}</span>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color }}>{label}</span>
                    <span className="admin-list-item-meta">
                      {user.userCourses.length} kurzů
                    </span>
                    <span className="admin-list-item-meta">
                      {user.role === 'ADMIN' ? '👑 Admin' : 'Žák'}
                    </span>
                  </div>
                </div>
                <div className="admin-list-item-actions">
                  <button
                    className="vocab-btn vocab-btn-edit"
                    onClick={() => setCourseModalUser(user)}
                  >
                    kurzy
                  </button>
                  {user.status !== 'NOTACTIVE' && user.role !== 'ADMIN' && (
                    <button
                      className="vocab-btn vocab-btn-remove"
                      onClick={() => setDeactivateTarget(user)}
                    >
                      deaktivovat
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal pro kurzy */}
      <Modal isOpen={!!courseModalUser} onClose={() => setCourseModalUser(null)}>
        <p className="auth-tag">Správa kurzů</p>
        <h2 className="modal-title">Kurzy uživatele</h2>
        <p className="modal-subtitle">{courseModalUser?.email}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1.5rem 0' }}>
          {courses.length === 0 && (
            <p className="admin-empty">Žádné kurzy k dispozici.</p>
          )}
          {courses.map((course) => {
            const isAssigned = assignedCourseIds.includes(course.id);
            return (
              <div key={course.id} className="vocab-item" style={{ padding: '0.75rem' }}>
                <div className="vocab-item-text">
                  <span className="vocab-english">{course.title}</span>
                  {course.description && (
                    <span className="vocab-czech">{course.description}</span>
                  )}
                </div>
                <button
                  className={`vocab-btn ${isAssigned ? 'vocab-btn-remove' : 'vocab-btn-add'}`}
                  onClick={() => isAssigned
                    ? handleRemoveCourse(course.id)
                    : handleAssignCourse(course.id)
                  }
                  disabled={assigning === course.id}
                >
                  {assigning === course.id ? '...' : isAssigned ? 'odebrat' : 'přidat'}
                </button>
              </div>
            );
          })}
        </div>

        <Button variant="outline" fullWidth onClick={() => setCourseModalUser(null)}>
          Zavřít
        </Button>
      </Modal>

      {/* Modal pro deaktivaci */}
      <DeleteConfirmModal
        isOpen={!!deactivateTarget}
        title="Deaktivovat uživatele?"
        description={`Opravdu chcete deaktivovat uživatele "${deactivateTarget?.email}"? Uživatel se nebude moci přihlásit.`}
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateTarget(null)}
        loading={deactivating}
      />
    </>
  );
};
