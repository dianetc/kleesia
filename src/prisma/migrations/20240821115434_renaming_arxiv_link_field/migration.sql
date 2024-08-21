/*
  Warnings:

  - You are about to drop the column `arxix_link` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[arxiv_link]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Post_arxix_link_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "arxix_link",
ADD COLUMN     "arxiv_link" TEXT;

-- CreateTable
CREATE TABLE "User_Vote_Post" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "post_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "User_Vote_Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_arxiv_link_key" ON "Post"("arxiv_link");

-- AddForeignKey
ALTER TABLE "User_Vote_Post" ADD CONSTRAINT "User_Vote_Post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Vote_Post" ADD CONSTRAINT "User_Vote_Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
