"use client";

import Link from "next/link";

import { useState, useEffect } from "react";
import { useSWRConfig } from "swr";

import { toggle } from "@/store/slices/ui";
import { setDetails } from "@/store/slices/data";
import { useDispatch, useSelector } from "react-redux";

import { trimming } from "@/lib/utils";
import { createFollow } from "@/lib/features/follows";

// Icon
import { IoAdd as PlusIcon } from "react-icons/io5";
import { FaCheck as TickIcon } from "react-icons/fa6";
import { BiEditAlt as EditIcon } from "react-icons/bi";

// latex
import LatexRenderer from "@/components/LatexRenderer";


// Material
import {
  Card,
  Chip,
  Stack,
  Button,
  Divider,
  Typography,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";

import Votes from "./votes";
import { Comments, Trigger } from "../comments";

let Post = ({
  id,
  votes,
  children,
  comments,
  topic_id,
  direction,
  conferences = [],
}) => {
  let { active: isactive } = useSelector((state) => state.persisted.user);
  let [viewComments, setViewComments] = useState(false);

  let dispatch = useDispatch();

  let { context, isComment } = useSelector(
    (state) => state.unpersisted.data.details
  );

  let Conferences = ({ list = [] }) => {
    return (
      <Stack direction="row" alignContent="center" spacing={1}>
        {list.map((conference, index) => {
          return (
            <Chip
              key={index}
              label={conference}
              sx={{ background: (theme) => theme.palette.chip[index] }}
            />
          );
        })}
      </Stack>
    );
  };

  useEffect(() => {
    setViewComments(context === "post" && isComment);
  }, [context, isComment]);

  return (
    <Stack direction="column" spacing={4}>
      <Card key={id}>
        <CardContent>
          <Stack spacing={3} sx={{ padding: 2 }}>
            {children}
          </Stack>
        </CardContent>

        <Divider sx={{ marginLeft: 3, marginRight: 3 }} />

        <CardActions sx={{ padding: 4 }}>
          <Stack
            sx={{ width: "100%" }}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={4}>
              <Votes id={id} count={votes} direction={direction} />
              <Trigger
                id={id}
                count={comments}
                toggle={() => {
                  dispatch(
                    setDetails({
                      context: "post",
                      id,
                      topic: topic_id,
                      isComment: true,
                    })
                  );
                  setViewComments(!viewComments);
                }}
              />
            </Stack>
            <Conferences list={conferences} />
          </Stack>
        </CardActions>
      </Card>
      {viewComments && (
        <Comments
          post={id}
          topic={topic_id}
          onClose={() => {
            setViewComments(!viewComments);
          }}
          count={comments}
        />
      )}
    </Stack>
  );
};

let Title = ({ id, user, topic_id, children }) => {
  let dispatch = useDispatch();

  let [editable, setEditable] = useState(false);

  let { name } = useSelector((state) => state.persisted.user);
  let { context } = useSelector((state) => state.unpersisted.data.details);

  useEffect(() => {
    setEditable(user === name && context === "post");
  }, [name, context, user]);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography
        variant="h5"
        fontWeight={500}
        sx={{ cursor: "pointer" }}
        onClick={() => {
          dispatch(setDetails({ context: "post", id, topic: topic_id }));
        }}
      >
        {children}
      </Typography>
      {editable && (
        <IconButton
          onClick={() => {
            dispatch(
              toggle({
                type: "MODAL",
                active: true,
                id: "edit_post",
                size: "medium",
              })
            );
          }}
        >
          <EditIcon />
        </IconButton>
      )}
    </Stack>
  );
};

let User = ({ id, name, followed, created_at }) => {
  let { mutate } = useSWRConfig();
  let [isFollowing, setIsFollowing] = useState(followed);

  let { active: isactive, name: store_user_name } = useSelector(
    (state) => state.persisted.user
  );

  let { id: post_id, context } = useSelector(
    (state) => state.unpersisted.data.details
  );

  let URL = () => (context === "post" ? `post/get?id=${post_id}` : "post/get");

  let date = created_at?.split("T")[0]?.replace(/-/g, ".");

  const handleFollow = async () => {
    if (!isactive) return;

    try {
      const result = await createFollow({ context: "user", contx: id });
      setIsFollowing(result);
      mutate(URL());
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  useEffect(() => {
    setIsFollowing(followed);
  }, [followed]);

  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={3}>
        <Typography fontWeight={600}>{name}</Typography>

        {isactive && name !== store_user_name && (
          <Button
            variant={isFollowing ? "outlined" : "contained"}
            size="small"
            disabled={!isactive}
            onClick={handleFollow}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="small">
                {isFollowing ? "Unfollow" : "Follow"}
              </Typography>
              {isFollowing ? <TickIcon size={13} /> : <PlusIcon size={20} />}
            </Stack>
          </Button>
        )}
      </Stack>
      <Typography fontWeight={100}>{date}</Typography>
    </Stack>
  );
};

let ArxivLink = ({ link = "..." }) => {
  return <Link href={link}>{link}</Link>;
};

let Description = ({ id, co_authors, children }) => {
  let dispatch = useDispatch();

  let { id: store_id, active } = useSelector(
    (state) => state?.unpersisted?.ui?.post?.readMore
  );

  useEffect(() => {
    dispatch(toggle({ type: "READMORE", id: id, active: true }));
  }, []);

  return (
    <Stack spacing={4}>
      <Typography variant="p">
        <LatexRenderer>
          {active && store_id === id ? children : trimming(children, 500)}
        </LatexRenderer>
      </Typography>

      {active && store_id === id && co_authors?.length > 0 && (
        <Stack direction="row" spacing={1}>
          <Typography>Co-Author{"(s)"}:</Typography>
          {co_authors?.map((co_author, index) => {
            return (
              <Typography key={index} fontWeight={200}>
                {co_author?.name}
              </Typography>
            );
          })}
        </Stack>
      )}

      <Typography
        sx={{ cursor: "pointer" }}
        color="text.secondary"
        fontWeight="bold"
        onClick={() => {
          dispatch(toggle({ type: "READMORE", id: id, active: !active }));
        }}
      >
        Read {active && store_id === id ? "Less" : "More"}
      </Typography>
    </Stack>
  );
};

Post.Title = Title;
Post.User = User;
Post.Arxiv = ArxivLink;
Post.Description = Description;

export default Post;
