-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'learner');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'learner';
