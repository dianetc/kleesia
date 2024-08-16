/*
  Warnings:

  - You are about to drop the column `votes` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[arxix_link]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "votes",
ADD COLUMN     "arxix_link" TEXT,
ADD COLUMN     "co_authors" TEXT[],
ADD COLUMN     "downvote" INTEGER,
ADD COLUMN     "upvote" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Post_arxix_link_key" ON "Post"("arxix_link");
