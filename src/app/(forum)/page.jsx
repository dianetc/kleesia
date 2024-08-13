"use client";

import { Posts } from "./data";
import Post from "@/components/post";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

let Page = () => {
  return (
    <Stack spacing={6} sx={{ padding: 8 }}>
      <Typography variant="h4">Trending</Typography>
      {Posts?.map((post, index) => {
        return (
          <Post
            key={index}
            votes={post?.votes}
            comments={post?.comments}
            conferences={post?.conferences}
          >
            <Post.Title>{post?.title}</Post.Title>
            <Post.User {...post?.user} />
            <Post.Description id={post?.title}>
              {post?.description}
            </Post.Description>
          </Post>
        );
      })}
    </Stack>
  );
};

export default Page;
