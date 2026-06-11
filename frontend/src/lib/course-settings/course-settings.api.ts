/**
 * Loading and saving course settings (title, appearance).
 */
import apiClient from '@/lib/shared/api-client';
import { CourseSettings } from './course-settings.types';

export async function fetchCourseSettings(courseId: string): Promise<CourseSettings> {
  const { data } = await apiClient.get(`/courses/${courseId}/settings`);
  return data;
}

export async function updateCourseTitle(courseId: string, title: string): Promise<void> {
  await apiClient.patch(`/courses/${courseId}`, { title });
}

export async function updateCourseThumbnail(courseId: string, thumbnailColor: string, thumbnailUrl: string | null): Promise<void> {
  await apiClient.patch(`/courses/${courseId}`, { thumbnailColor, thumbnailUrl });
}
