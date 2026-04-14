import { ApiClient } from './client';
import { Course } from '../types/lesson.types';

export class CoursesApi {
  static async findAll(): Promise<Course[]> {
    return ApiClient.get('/courses');
  }
}
