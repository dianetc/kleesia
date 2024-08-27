"use client";

import { useDispatch, useSelector } from "react-redux";
import { setDetails, resetDetails } from "@/store/slices/data";

import Post from "@/components/post";

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
//

let Main = () => {
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
    search: "Search",
    post: "Post",
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
  let { active: isactive } = useSelector((state) => state.persisted.user);
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
      case "post":
        return `post/get?id=${id}`;
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
      {data &&
        data?.map((post, index) => {
          return (
            <Post key={index} {...post}>
              <Post.Title
                id={post?.id}
                topic_id={post?.topic_id}
                user={post?.user?.name}
              >
                {post?.title}
              </Post.Title>
              {post?.user && (
                <Post.User created_at={post?.created_at} {...post?.user} />
              )}
              {post?.arxiv_link && (
                <Post.Arxiv id={post?.id} link={post?.arxiv_link} />
              )}
              {post?.body && (
                <Post.Description id={post?.id} co_authors={post?.co_authors}>
                  {post?.body}
                </Post.Description>
              )}
            </Post>
          );
        })}
    </Stack>
  );
};

export default Main;
