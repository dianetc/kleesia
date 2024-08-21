/*
  Warnings:

  - You are about to drop the column `name` on the `Conference` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Topic` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Conference` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Conference_name_key";

-- DropIndex
DROP INDEX "Topic_name_key";

-- AlterTable
ALTER TABLE "Conference" DROP COLUMN "name",
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "name",
ADD COLUMN     "title" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Conference_title_key" ON "Conference"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_title_key" ON "Topic"("title");
