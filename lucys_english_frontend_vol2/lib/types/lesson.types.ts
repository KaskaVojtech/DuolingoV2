export type LessonType = 'VOCABULARY' | 'GRAMMAR';

export interface Vocabulary {
  id: number;
  czech: string;
  english: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  lessonVocabulary?: { lesson: Lesson }[];
}

export interface LessonVocabulary {
  vocabularyId: number;
  lessonId: number;
  vocabulary: Vocabulary;
}

export interface Lesson {
  id: number;
  title: string;
  description?: string;
  type: LessonType;
  createdAt: string;
  updatedAt: string;
  lessonVocabulary: LessonVocabulary[];
  courseLessons?: { courseId: number; order: number }[];
}

export interface Course {
  id: number;
  title: string;
  description?: string;
}

export interface CreateLessonDto {
  title: string;
  type: LessonType;
  description?: string;
}

export interface UpdateLessonDto {
  title?: string;
  description?: string;
}

export interface CreateVocabularyDto {
  czech: string;
  english: string;
  note?: string;
}

export interface UpdateVocabularyDto {
  czech?: string;
  english?: string;
  note?: string;
}

export interface QueryLessonDto {
  search?: string;
  type?: string;
  courseId?: number;
}

export interface QueryVocabularyDto {
  search?: string;
  lessonId?: number;
}

// User types
export type UserStatus = 'ACTIVE' | 'PENDING' | 'NOTACTIVE';
export type UserRole = 'ADMIN' | 'LEARNER';

export interface UserCourse {
  courseId: number;
  course: Course;
}

export interface User {
  id: number;
  email: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
  userCourses: UserCourse[];
}
