"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDetails, resetDetails } from "@/store/slices/data";
import { Notify } from "@/lib/utils";

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
//
import useSWR from "swr";
import request, { fetcher } from "@/lib/request";

let Profile = () => {
  return (
    <Stack spacing={3} sx={{ padding: 8 }}>
      <Bio />
      <Divider />
      <Tabs />
    </Stack>
  );
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
        <Typography variant="h4">About Me</Typography>
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
            <Tab label="Posts" value="posts" />
            <Tab label="Comments" value="comments" />
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

let Comments = () => {
  let { data: comments } = useSWR(
    `comment/get?q=profile&rtf=body,votes,user`,
    fetcher
  );

  return (
    <Stack spacing={4}>
      {comments?.map((comment, index) => {
        return (
          <Box
            sx={{
              padding: 3,
              border: 1,
              borderRadius: 1,
              borderColor: "divider",
              backgroundColor: (theme) => theme.palette.background.white,
            }}
          >
            <Comment key={index} {...comment} />
          </Box>
        );
      })}
    </Stack>
  );
};

const Posts = () => {
  let { id, context } = useSelector((state) => state.unpersisted.data.details);

  let { data } = useSWR("post/get?q=profile", fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
  });

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
