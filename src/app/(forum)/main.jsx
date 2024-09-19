"use client";

import { useDispatch, useSelector } from "react-redux";
import { setDetails, resetDetails } from "@/store/slices/data";

import Post from "@/components/post";
import { Comments } from "@/components/comments"; // Add this import

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
  CircularProgress,
  Box,
} from "@mui/material";

import useSWR from "swr";
import { fetcher } from "@/lib/request";

import { useRouter } from 'next/navigation';

let Main = () => {
  const { id, context } = useSelector((state) => state.unpersisted.data.details);

  const URL = () => {
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

  const { data, error, isLoading } = useSWR(URL(), fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error loading content</Typography>;
  }

  return (
    <Stack spacing={3} sx={{ padding: 8 }}>
      <Header />
      <Divider />
      <Content data={data} />
    </Stack>
  );
};

const Header = () => {
  let dispatch = useDispatch();
  let router = useRouter();
  let { context } = useSelector((state) => state.unpersisted.data.details);

  let mapping = {
    trending: "Trending",
    conference: "Recent Posts",
    topic: "Recent Posts",
    recent: "Recent Activity",
    search: "Search",
  };

  const handleGoBack = () => {
    dispatch(resetDetails());
    router.push('/');
  };

  return (
    <Stack spacing={4}>
      {context !== "trending" && (
        <Typography
          variant="text"
          fontWeight={600}
          sx={{ width: "10%", cursor: "pointer", color: "#1976d2" }}
          onClick={handleGoBack}
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
    <FormControl sx={{ m: 1, minWidth: 140 }} size="small">
      <InputLabel id="content-filter-label" sx={{ fontSize: '0.75rem' }}>Viewing Options</InputLabel>
      <Select
        labelId="content-filter-label"
        id="content-filter"
        value={details.context}
        onChange={handleChange}
        label="Viewing Options"
        sx={{ fontSize: '0.75rem' }}
      >
        <MenuItem value="recent" sx={{ fontSize: '0.75rem' }}>Recent</MenuItem>
        <MenuItem value="trending" sx={{ fontSize: '0.75rem' }}>Trending</MenuItem>
      </Select>
    </FormControl>
  ) : (
    ""
  );
};

const Content = (props) => {
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

  if (context === "post" && data && data.length === 1) {
    const post = data[0];
    return (
      <Stack spacing={3}>
        <Post key={post.id} {...post} isDetailedView={true}>
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
        <Comments
          post={post.id}
          topic={post.topic_id}
          count={post.comments}
        />
      </Stack>
    );
  }

  // List view (Trending or other contexts)
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
