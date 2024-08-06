-- CreateEnum
CREATE TYPE "Role" AS ENUM ('moderator', 'user');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" DEFAULT 'user';
