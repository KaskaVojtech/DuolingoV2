/*
  Warnings:

  - You are about to drop the column `order` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `Vocabulary` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vocabulary" DROP CONSTRAINT "Vocabulary_lessonId_fkey";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "Vocabulary" DROP COLUMN "lessonId";

-- CreateTable
CREATE TABLE "CourseLesson" (
    "courseId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "CourseLesson_pkey" PRIMARY KEY ("courseId","lessonId")
);

-- CreateTable
CREATE TABLE "LessonVocabulary" (
    "lessonId" INTEGER NOT NULL,
    "vocabularyId" INTEGER NOT NULL,

    CONSTRAINT "LessonVocabulary_pkey" PRIMARY KEY ("lessonId","vocabularyId")
);

-- AddForeignKey
ALTER TABLE "CourseLesson" ADD CONSTRAINT "CourseLesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseLesson" ADD CONSTRAINT "CourseLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonVocabulary" ADD CONSTRAINT "LessonVocabulary_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonVocabulary" ADD CONSTRAINT "LessonVocabulary_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
