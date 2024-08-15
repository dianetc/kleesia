"use client";

import { useDispatch, useSelector } from "react-redux";

import { Posts } from "./data";
import Post from "@/components/post";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { setContext } from "@/store/slices/data";

let Page = () => {
  let dispatch = useDispatch();
  let { name, id } = useSelector((state) => state.unpersisted.data.context);

  return (
    <Stack spacing={6} sx={{ padding: 8 }}>
      <Stack spacing={4}>
        {name === "TOPIC" && (
          <Typography
            sx={{ width: "10%", cursor: "pointer" }}
            variant="text"
            color={"secondary"}
            fontWeight={600}
            onClick={() => {
              dispatch(setContext({ name: "", id: "" }));
            }}
          >
            Go back
          </Typography>
        )}
        <Typography variant="h4">
          {name === "TOPIC" ? "Trending" : "Recent Activity"}
        </Typography>
      </Stack>
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
