/*
  Warnings:

  - You are about to drop the `Conference_Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Conference_Post" DROP CONSTRAINT "Conference_Post_conference_id_fkey";

-- DropForeignKey
ALTER TABLE "Conference_Post" DROP CONSTRAINT "Conference_Post_post_id_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "conferences" TEXT[];

-- DropTable
DROP TABLE "Conference_Post";
