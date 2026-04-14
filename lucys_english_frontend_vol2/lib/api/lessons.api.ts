import { ApiClient } from './client';
import {
  Lesson,
  CreateLessonDto,
  UpdateLessonDto,
  QueryLessonDto,
  CreateVocabularyDto,
  Vocabulary,
} from '../types/lesson.types';

export class LessonsApi {
  static async findAll(query?: QueryLessonDto): Promise<Lesson[]> {
    const params = new URLSearchParams();
    if (query?.search) params.append('search', query.search);
    if (query?.type) params.append('type', query.type);
    if (query?.courseId) params.append('courseId', String(query.courseId));
    const qs = params.toString();
    return ApiClient.get(`/lessons${qs ? `?${qs}` : ''}`);
  }

  static async findOne(id: number): Promise<Lesson> {
    return ApiClient.get(`/lessons/${id}`);
  }

  static async create(dto: CreateLessonDto): Promise<Lesson> {
    return ApiClient.post('/lessons', dto);
  }

  static async update(id: number, dto: UpdateLessonDto): Promise<Lesson> {
    return ApiClient.patch(`/lessons/${id}`, dto);
  }

  static async remove(id: number): Promise<void> {
    return ApiClient.delete(`/lessons/${id}`);
  }

  static async getVocabulary(lessonId: number): Promise<{ vocabulary: Vocabulary }[]> {
    return ApiClient.get(`/lessons/${lessonId}/vocabulary`);
  }

  static async addVocabulary(lessonId: number, vocabularyId: number): Promise<void> {
    return ApiClient.post(`/lessons/${lessonId}/vocabulary/${vocabularyId}`, {});
  }

  static async removeVocabulary(lessonId: number, vocabularyId: number): Promise<void> {
    return ApiClient.delete(`/lessons/${lessonId}/vocabulary/${vocabularyId}`);
  }

  static async createAndAddVocabulary(lessonId: number, dto: CreateVocabularyDto): Promise<Vocabulary> {
    return ApiClient.post(`/lessons/${lessonId}/vocabulary/new`, dto);
  }
}
