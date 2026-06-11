/**
 * Admin course data layer (overview, creation, update, deletion).
 */
import apiClient from '@/lib/shared/api-client';
import { Course, CourseTemplate, SaveAsTemplatePayload } from './courses.types';

export async function fetchCourses(): Promise<Course[]> {
  const { data } = await apiClient.get('/courses');
  return data;
}

export async function saveAsTemplate(payload: SaveAsTemplatePayload): Promise<CourseTemplate> {
  const { data } = await apiClient.post(`/courses/${payload.courseId}/save-as-template`, { templateName: payload.templateName });
  return data;
}
