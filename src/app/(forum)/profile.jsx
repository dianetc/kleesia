"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDetails, resetDetails } from "@/store/slices/data";
import { Notify } from "@/lib/utils";
import { Skeleton} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';

import Post from "@/components/post";
import { Comment } from "@/components/comments";

import {
  Box,
  Tab,
  Stack,
  Select,
  Button,
  Divider,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  OutlinedInput,
} from "@mui/material";

import { TabContext, TabList, TabPanel } from "@mui/lab";

import useSWR from "swr";
import request, { fetcher } from "@/lib/request";

let Profile = () => {
  const { username } = useParams();
  const currentUser = useSelector((state) => state.persisted.user.name);
  const [isWrongUser, setIsWrongUser] = useState(false);

  useEffect(() => {
    if (username && username !== currentUser) {
      setIsWrongUser(true);
    }
  }, [username, currentUser]);

  if (isWrongUser) {
    return (
      <Stack spacing={3} sx={{ padding: 8, alignItems: 'center' }}>
        <Typography variant="h4">Oops! This isn&apos;t your profile</Typography>
        <Typography> Currently, you can only view your own profile.</Typography>
      </Stack>
    );
  }

  if (username === currentUser) {
    return (
      <Stack spacing={3} sx={{ padding: 8 }}>
        <Bio />
        <Divider />
        <Tabs />
      </Stack>
    );
  }

};

let Bio = () => {
  let [bio, setBio] = useState("");
  let [edit, setEdit] = useState(false);

  let { data, mutate } = useSWR("auth/user/get?rtf=bio", fetcher);

  async function submit(e) {
    e.preventDefault(e);

    try {
      let response = await request.put("auth/user/update", { bio });
      let { msg } = response?.data;
      Notify({ status: "success", content: msg });
      mutate("auth/user/get?rtf=bio");
      setEdit(false);
    } catch (error) {
      Notify({
        status: "error",
        content: "Experienced a problem, updating the bio",
      });
    }
  }

  useEffect(() => {
    data?.length > 0 && setBio(data[0]?.["bio"]);
  }, [data]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">About me</Typography>
        <Button
          onClick={() => {
            setEdit(!edit);
          }}
          size="small"
          variant="outlined"
        >
          Edit
        </Button>
      </Stack>

      <Box
        sx={{
          padding: 2,
          border: 1,
          borderColor: "divider",
          backgroundColor: (theme) => theme.palette.background.white,
        }}
      >
        {edit ? (
          <form onSubmit={submit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                type="textarea"
                onChange={(e) => {
                  setBio(e.target.value);
                }}
                multiline
                value={bio}
              />
              <Stack
                spacing={2}
                direction="row"
                alignItems="center"
                justifyContent="start"
              >
                <Button variant="contained" type="submit">
                  Update
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEdit(false);
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        ) : (
          <Typography variant="p">{bio}</Typography>
        )}
      </Box>
    </Stack>
  );
};

let Tabs = () => {
  let [active, setActive] = useState("posts");

  function handleChange(e, newValue) {
    setActive(newValue);
  }

  return (
    <Box sx={{ width: "100%" }}>
      <TabContext value={active}>
        <Box
          sx={{
            marginBottom: 3,
            border: 1,
            borderColor: "divider",
            backgroundColor: (theme) => theme.palette.background.white,
          }}
        >
          <TabList onChange={handleChange} aria-label="Profile Tabs">
            <Tab label="Posts" value="posts" sx={{ textTransform: 'none' }} />
            <Tab label="Comments" value="comments" sx={{ textTransform: 'none' }} />
          </TabList>
        </Box>
        <TabPanel value="posts" sx={{ p: 0 }}>
          <Posts />
        </TabPanel>
        <TabPanel value="comments" sx={{ p: 0 }}>
          <Comments />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

const findPostForComment = async (commentId) => {
  // Fetch all posts --> very hacky, in the future its better to change the comment api
  const posts = await fetcher('post/get?q=all&rtf=id,comments');
  for (let post of posts) {
    if (post.comments) {
      const postComments = await fetcher(`comment/get?context=post&context_id=${post.id}&rtf=id`);
      if (postComments.some(comment => comment.id === commentId)) {
          return post;
      }
    }
  }
};


let Comments = () => {
  const [commentsWithPosts, setCommentsWithPosts] = useState([]);
  let { data: comments } = useSWR(
    `comment/get?q=profile&rtf=id,body,votes,user`,
    fetcher
  );

  useEffect(() => {
    if (comments) {
      const fetchPostsForComments = async () => {
        const updatedComments = await Promise.all(comments.map(async (comment) => {
          const post = await findPostForComment(comment.id);
          return { ...comment, post };
        }));
        setCommentsWithPosts(updatedComments);

      };

      fetchPostsForComments();
    }
  }, [comments]);

  return (
    <Stack spacing={4}>
      {commentsWithPosts.map((comment, index) => (
        <Box
          key={index}
          sx={{
            padding: 3,
            border: 1,
            borderRadius: 1,
            borderColor: "divider",
            backgroundColor: (theme) => theme.palette.background.white,
          }}
        >
         {comment.post && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                pb: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
             <Typography
                  variant="h7"
                  component="a"
                  sx={{
                    color: '#424242',
                    textDecoration: 'none',
                    fontWeight: 'medium',
                  }}
                >
                  {comment.post.title}
                </Typography>
            </Box>
          )}
          <Comment {...comment} />
        </Box>
      ))}
    </Stack>
  );
};

const Posts = () => {
  let { id, context } = useSelector((state) => state.unpersisted.data.details);

  let { data, error, isLoading } = useSWR("post/get?q=profile", fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
  });

  if (isLoading) {
    return (
      <Stack spacing={3}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={200} />
        ))}
      </Stack>
    );
  }

  if (error) {
    return <Typography color="error">Error loading posts</Typography>;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Stack spacing={3}>
      {data?.map((post, index) => {
        return (
          <Post key={index} {...post}>
            <Post.Title id={post?.id} topic_id={post?.topic_id}>
              {post?.title}
            </Post.Title>
            {post?.user && (
              <Post.User created_at={post?.created_at} {...post?.user} />
            )}
            {post?.arxiv_link && <Post.Arxiv link={post?.arxiv_link} />}
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

export default Profile;
