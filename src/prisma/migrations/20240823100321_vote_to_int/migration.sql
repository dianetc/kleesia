/*
  Warnings:

  - The `votes` column on the `Comments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "votes",
ADD COLUMN     "votes" INTEGER DEFAULT 0;
