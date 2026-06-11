import { Lesson, ConstraintImpact } from './lessons-list.types';

export function wouldCreateCycle(
  targetLessonId: string,
  sourceLessonId: string,
  allLessons: Lesson[]
): boolean {
  if (sourceLessonId === targetLessonId) return true;
  const visited = new Set<string>();
  const stack = [targetLessonId];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === sourceLessonId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    const lesson = allLessons.find((l) => l.id === current);
    if (!lesson) continue;
    for (const group of lesson.lockConfig.constraintGroups) {
      for (const rule of group.rules) {
        stack.push(rule.sourceLessonId);
      }
    }
  }
  return false;
}

export function getConstraintImpacts(
  deletedLessonId: string,
  allLessons: Lesson[]
): ConstraintImpact[] {
  const impacts: ConstraintImpact[] = [];
  const deleted = allLessons.find((l) => l.id === deletedLessonId);
  if (!deleted) return impacts;

  const maxOrder = Math.max(...allLessons.map((l) => l.order));
  const isLast = deleted.order === maxOrder;

  for (const lesson of allLessons) {
    if (lesson.id === deletedLessonId) continue;
    for (const group of lesson.lockConfig.constraintGroups) {
      for (const rule of group.rules) {
        if (rule.sourceLessonId !== deletedLessonId) continue;
        const prevLesson = isLast
          ? allLessons
              .filter((l) => l.id !== deletedLessonId)
              .sort((a, b) => b.order - a.order)[0]
          : null;
        impacts.push({
          affectedLessonId: lesson.id,
          affectedLessonTitle: lesson.title,
          constraintRuleId: rule.id,
          isAutoResolvable: isLast,
          autoResolveDescription: prevLesson
            ? `Podmínka se přesune na "${prevLesson.title}"`
            : undefined,
        });
      }
    }
  }
  return impacts;
}

export function resolveConstraintImpacts(
  impacts: ConstraintImpact[],
  deletedLessonId: string,
  allLessons: Lesson[]
): Lesson[] {
  const prevLesson = allLessons
    .filter((l) => l.id !== deletedLessonId)
    .sort((a, b) => b.order - a.order)[0];

  return allLessons.map((lesson) => {
    const hasImpact = impacts.some(
      (i) => i.affectedLessonId === lesson.id && i.isAutoResolvable
    );
    if (!hasImpact) {

      return {
        ...lesson,
        lockConfig: {
          ...lesson.lockConfig,
          constraintGroups: lesson.lockConfig.constraintGroups.map((g) => ({
            ...g,
            rules: g.rules.filter((r) => r.sourceLessonId !== deletedLessonId),
          })),
        },
      };
    }
    return {
      ...lesson,
      lockConfig: {
        ...lesson.lockConfig,
        constraintGroups: lesson.lockConfig.constraintGroups.map((g) => ({
          ...g,
          rules: g.rules.map((r) =>
            r.sourceLessonId === deletedLessonId && prevLesson
              ? { ...r, sourceLessonId: prevLesson.id, sourceLessonTitle: prevLesson.title }
              : r
          ),
        })),
      },
    };
  });
}
