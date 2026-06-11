'use client';

import { useEffect, useState } from 'react';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { fetchCourses } from '@/lib/courses/courses.api';
import { filterCourses } from '@/lib/courses/courses.utils';
import { useCoursesStore } from '@/lib/courses/courses.store';
import { Course } from '@/lib/courses/courses.types';
import { CoursesToolbar } from '@/components/admin/courses/CoursesToolbar';
import { CourseGrid } from '@/components/admin/courses/CourseGrid';
import { SaveAsTemplateModal } from '@/components/admin/courses/SaveAsTemplateModal';

export default function CoursesPage() {
  const { isLoading } = useRequireAdmin();
  const { viewMode, searchQuery } = useCoursesStore();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses().then(setCourses);
  }, []);

  if (isLoading) return null;

  const filtered = filterCourses(courses, searchQuery);

  return (
    <div>
      <CoursesToolbar />
      <div className="p-admin-lg">
        <CourseGrid courses={filtered} viewMode={viewMode} />
      </div>
      <SaveAsTemplateModal />
    </div>
  );
}
