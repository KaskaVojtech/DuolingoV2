import { ApiClient } from './client';
import { User, UserCourse } from '../types/lesson.types';

export class UsersApi {
  static async getMyCourses(): Promise<UserCourse[]> {
    return ApiClient.get('/me/courses');
  }
  static async findAll(search?: string): Promise<User[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return ApiClient.get(`/users${qs}`);
  }

  static async deactivate(id: number): Promise<User> {
    return ApiClient.patch(`/users/${id}/deactivate`, {});
  }

  static async assignCourse(userId: number, courseId: number): Promise<void> {
    return ApiClient.post(`/users/${userId}/courses/${courseId}`, {});
  }

  static async removeCourse(userId: number, courseId: number): Promise<void> {
    return ApiClient.delete(`/users/${userId}/courses/${courseId}`);
  }
}
