import { ApiClient } from './client';
import { Course, Lesson } from '../types/lesson.types';

export interface CourseLesson {
  courseId: number;
  lessonId: number;
  order: number;
  isUnlocked: boolean;
  lesson: Lesson;
}

export interface CourseWithLessons extends Course {
  courseLessons: CourseLesson[];
}

export class CoursesApi {
  static async findAll(): Promise<CourseWithLessons[]> {
    return ApiClient.get('/courses');
  }

  static async findOne(id: number): Promise<CourseWithLessons> {
    return ApiClient.get(`/courses/${id}`);
  }

  static async create(dto: { title: string; description?: string }): Promise<Course> {
    return ApiClient.post('/courses', dto);
  }

  static async update(id: number, dto: { title?: string; description?: string }): Promise<Course> {
    return ApiClient.patch(`/courses/${id}`, dto);
  }

  static async remove(id: number): Promise<void> {
    return ApiClient.delete(`/courses/${id}`);
  }

  static async addLesson(courseId: number, lessonId: number): Promise<void> {
    const lessons = await CoursesApi.findOne(courseId);
    const order = lessons.courseLessons.length;
    return ApiClient.post(`/courses/${courseId}/lessons/${lessonId}`, { order });
  }

  static async removeLesson(courseId: number, lessonId: number): Promise<void> {
    return ApiClient.delete(`/courses/${courseId}/lessons/${lessonId}`);
  }

  static async unlockLesson(courseId: number, lessonId: number, isUnlocked: boolean): Promise<void> {
    return ApiClient.patch(`/courses/${courseId}/lessons/${lessonId}/unlock`, { isUnlocked });
  }
}