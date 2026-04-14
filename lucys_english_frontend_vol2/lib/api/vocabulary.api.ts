import { ApiClient } from './client';
import { Vocabulary, CreateVocabularyDto, UpdateVocabularyDto, QueryVocabularyDto } from '../types/lesson.types';

export class VocabularyApi {
  static async findAll(query?: QueryVocabularyDto): Promise<Vocabulary[]> {
    const params = new URLSearchParams();
    if (query?.search) params.append('search', query.search);
    if (query?.lessonId) params.append('lessonId', String(query.lessonId));
    const qs = params.toString();
    return ApiClient.get(`/vocabulary${qs ? `?${qs}` : ''}`);
  }

  static async create(dto: CreateVocabularyDto): Promise<Vocabulary> {
    return ApiClient.post('/vocabulary', dto);
  }

  static async update(id: number, dto: UpdateVocabularyDto): Promise<Vocabulary> {
    return ApiClient.patch(`/vocabulary/${id}`, dto);
  }

  static async remove(id: number): Promise<void> {
    return ApiClient.delete(`/vocabulary/${id}`);
  }
}
