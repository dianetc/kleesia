"use client";

import { useDispatch, useSelector } from "react-redux";
import { setDetails, resetDetails } from "@/store/slices/data";

import Post from "@/components/post";
import { useSession } from "@/lib/hooks/auth";

import {
  Button,
  Stack,
  Select,
  Divider,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
  OutlinedInput,
} from "@mui/material";
//
import useSWR from "swr";
import { fetcher } from "@/lib/request";
import { useEffect } from "react";

let Page = () => {
  return (
    <Stack spacing={3} sx={{ padding: 8 }}>
      <Header />
      <Divider />
      <Content />
    </Stack>
  );
};

const Header = () => {
  let dispatch = useDispatch();
  let { context } = useSelector((state) => state.unpersisted.data.details);

  let mapping = {
    trending: "Trending",
    conference: "Recent Posts",
    topic: "Recent Posts",
    recent: "Recent Activity",
    search: "search",
  };

  return (
    <Stack spacing={4}>
      {context !== "trending" && (
        <Typography
          variant="text"
          fontWeight={600}
          sx={{ width: "10%", cursor: "pointer", color: "#1976d2" }}
          onClick={() => {
            dispatch(resetDetails());
          }}
        >
          Go back
        </Typography>
      )}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">{mapping[context]}</Typography>
        {context === "trending" && <ContentFilter />}
      </Stack>
    </Stack>
  );
};

const ContentFilter = () => {
  let { isactive } = useSession();
  let dispatch = useDispatch();

  let { details } = useSelector((state) => state.unpersisted.data);

  let handleChange = (e) => {
    let { value } = e.target;
    dispatch(setDetails({ ...details, context: value }));
  };

  return isactive ? (
    <FormControl sx={{ m: 1, maxWidth: "7.2em" }} size="small" fullWidth>
      <InputLabel>Filter</InputLabel>
      <Select id="content-filter" onChange={handleChange} label="Filter">
        <MenuItem value="recent">Recent</MenuItem>
        <MenuItem value="trending">Trending</MenuItem>
      </Select>
    </FormControl>
  ) : (
    ""
  );
};

const Content = () => {
  let { id, context } = useSelector((state) => state.unpersisted.data.details);

  let URL = () => {
    switch (context) {
      case "topic":
        return `post/get?topic_id=${id}`;
      case "conference":
        return `post/get?conferences[]=${id}`;
      case "recent":
        return "post/get?q=recent";
      case "search":
        return `search?q=${id}`;
      default:
        return "post/get";
    }
  };

  let { data } = useSWR(URL(), fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
  });

  return (
    <Stack spacing={3}>
      {data?.map((post, index) => {
        return (
          <Post key={index} {...post}>
            <Post.Title>{post?.title}</Post.Title>
            {post?.user && <Post.User {...post?.user} />}
            {post?.body && (
              <Post.Description id={post?.id}>{post?.body}</Post.Description>
            )}
          </Post>
        );
      })}
    </Stack>
  );
};

export default Page;
