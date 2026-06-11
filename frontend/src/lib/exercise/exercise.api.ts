/**
 * Loading and saving an exercise.
 */
import apiClient from '@/lib/shared/api-client';
import { Exercise } from './exercise.types';
import { ExerciseSchema } from './exercise.schema';
import { getExerciseValidationMessage } from './exercise.errors';

export async function fetchExercise(exerciseId: string): Promise<Exercise> {
  const { data } = await apiClient.get(`/exercises/${exerciseId}`);
  return data;
}

export async function createExercise(lessonId: string): Promise<Exercise> {
  const { data } = await apiClient.post(`/lessons/${lessonId}/exercises`);
  return data;
}

export async function saveExercise(exercise: Exercise): Promise<void> {
  const toValidate = { ...exercise, instructions: exercise.instructions ?? undefined };
  const result = ExerciseSchema.safeParse(toValidate);
  if (!result.success) {
    throw new Error(getExerciseValidationMessage(result.error));
  }
  await apiClient.patch(`/exercises/${exercise.id}`, exercise);
}
