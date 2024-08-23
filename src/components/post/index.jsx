"use client";

import { useState } from "react";

import { toggle } from "@/store/slices/ui";
import { setDetails } from "@/store/slices/data";
import { useDispatch, useSelector } from "react-redux";

import { trimming } from "@/lib/utils";
import { useSession } from "@/lib/hooks/auth";
import { createFollow } from "@/lib/features/follows";

// Icon
import { IoAdd as PlusIcon } from "react-icons/io5";
import { FaCheck as TickIcon } from "react-icons/fa6";

// Material
import {
  Link,
  Card,
  Chip,
  Stack,
  Button,
  Divider,
  Typography,
  CardContent,
  CardActions,
} from "@mui/material";

import Votes from "./votes";
import { Comments, Trigger } from "./comments";

let Post = ({
  id,
  children,
  comments,
  votes,
  voted,
  direction,
  conferences = [],
}) => {
  let { isactive } = useSession();
  let dispatch = useDispatch();
  let [viewComments, setViewComments] = useState(false);

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
              <Votes
                id={id}
                count={votes}
                isvoted={voted}
                direction={direction}
              />
              <Trigger
                id={id}
                count={comments}
                toggle={() => {
                  setViewComments(!viewComments);
                }}
              />
            </Stack>
            <Conferences list={conferences} />
          </Stack>
        </CardActions>
      </Card>
      {isactive && viewComments && <Comments post={id} count={comments} />}
    </Stack>
  );
};

let Title = ({ id, children }) => {
  let dispatch = useDispatch();

  return (
    <Typography
      variant="h5"
      fontWeight={500}
      sx={{ cursor: "pointer" }}
      onClick={() => {
        dispatch(setDetails({ context: "post", id }));
      }}
    >
      {children}
    </Typography>
  );
};

let User = ({ id, name, followed, created_at }) => {
  let { isactive } = useSession();

  let { name: store_user_name } = useSelector(
    (state) => state?.persisted?.user
  );

  let date = created_at?.split("T")[0]?.replace(/-/g, ".");

  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={3}>
        <Typography fontWeight={100}>{name}</Typography>
        {isactive && name === store_user_name && (
          <Button
            variant={followed ? "outlined" : "contained"}
            size="small"
            disabled={!isactive}
            onClick={() => {
              !followed && createFollow({ context: "user", contx: id });
              mutate("post/get");
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="small">
                {followed ? "Followed" : "Follow"}
              </Typography>
              {followed ? <TickIcon size={13} /> : <PlusIcon size={20} />}
            </Stack>
          </Button>
        )}
      </Stack>
      <Typography fontWeight={100}>{date}</Typography>
    </Stack>
  );
};

let Description = ({ id, children }) => {
  let dispatch = useDispatch();

  let { id: store_id, active } = useSelector(
    (state) => state?.unpersisted?.ui?.post?.readMore
  );

  return (
    <Stack spacing={1}>
      <Typography variant="p">
        {active && store_id === id ? children : trimming(children, 500)}
      </Typography>
      <Link
        sx={{ cursor: "pointer" }}
        color="text.secondary"
        fontWeight="bold"
        onClick={() => {
          dispatch(toggle({ type: "READMORE", id: id, active: !active }));
        }}
      >
        Read {active && store_id === id ? "Less" : "More"}
      </Link>
    </Stack>
  );
};

Post.Title = Title;
Post.User = User;
Post.Description = Description;

export default Post;
