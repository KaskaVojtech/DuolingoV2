-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('vocabulary', 'grammar');

-- AlterTable
ALTER TABLE "CourseLesson" ADD COLUMN     "isUnlocked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "type" "LessonType" NOT NULL DEFAULT 'vocabulary';
