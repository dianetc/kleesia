"use client";

import { useDispatch, useSelector } from "react-redux";
import { setContext, resetContext } from "@/store/slices/data";

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
  let { context, topic } = useSelector((state) => state.unpersisted.data);

  let mapping = {
    trending: "Trending",
    conference: "Trending",
    topic: "Recent Post",
    recent: "Recent Activity",
  };

  return (
    <Stack spacing={4}>
      {context?.name || topic?.id ? (
        <Typography
          variant="text"
          fontWeight={600}
          sx={{ width: "10%", cursor: "pointer", color: "#1976d2" }}
          onClick={() => {
            dispatch(resetContext());
          }}
        >
          Go back
        </Typography>
      ) : (
        ""
      )}

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">
          {mapping[topic?.id ? "topic" : context?.name || "trending"]}
        </Typography>
        <ContentFilter />
      </Stack>
    </Stack>
  );
};

const ContentFilter = () => {
  let { isactive } = useSession();
  let dispatch = useDispatch();

  let handleChange = (e) => {
    let { value } = e.target;
    let name = value !== "trending" ? value : "";
    dispatch(setContext({ type: "context", name }));
    dispatch(setContext({ type: "topic", id: "" }));
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
  let { context, topic, conference } = useSelector(
    (state) => state.unpersisted.data
  );

  let sort_filters = () =>
    `?${
      topic?.id
        ? `topic_id=${topic?.id}`
        : conference?.id
        ? `conferences[]=${conference?.id}`
        : context?.name === "recent"
        ? "q=recent"
        : ""
    }`;

  let { data } = useSWR(`post/get${sort_filters()}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
  });

  return (
    <Stack spacing={3}>
      {data?.map((post, index) => {
        return (
          <Post
            key={index}
            id={post?.id}
            votes={post?.votes}
            comments={post?.comments}
            conferences={post?.conferences}
          >
            <Post.Title>{post?.title}</Post.Title>
            <Post.User {...post?.user} />
            <Post.Description id={post?.title}>{post?.body}</Post.Description>
          </Post>
        );
      })}
    </Stack>
  );
};

export default Page;
