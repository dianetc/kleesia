-- CreateTable
CREATE TABLE "User_Vote_Comment" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "direction" TEXT,
    "comment_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "User_Vote_Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User_Vote_Comment" ADD CONSTRAINT "User_Vote_Comment_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Vote_Comment" ADD CONSTRAINT "User_Vote_Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
