-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'pending', 'notactive');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'pending';
