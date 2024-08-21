"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

import { toggle } from "@/store/slices/ui";
import { useDispatch, useSelector } from "react-redux";

import request from "@/lib/request";
import { Notify, trimming } from "@/lib/utils";
import { useSession } from "@/lib/hooks/auth";
import { createFollow } from "@/lib/features/follows";

// Icon
import { IoAdd as PlusIcon } from "react-icons/io5";
import { BiSolidUpArrow as ArrowUp } from "react-icons/bi";
import { BiSolidDownArrow as ArrowDown } from "react-icons/bi";

// Material
import {
  Link,
  Card,
  Chip,
  Stack,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
  CardContent,
  CardActions,
} from "@mui/material";

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
  let [viewComments, setViewComments] = useState(false);

  let Conferences = ({ list = [] }) => {
    return (
      <Stack direction="row" alignContent="center" spacing={1}>
        {list.map((conference, index) => {
          return <Chip key={index} label={conference} />;
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
              <Comment
                id={id}
                count={comments}
                toggle={() => setViewComments(!viewComments)}
              />
            </Stack>
            <Conferences list={conferences} />
          </Stack>
        </CardActions>
      </Card>
      {isactive && viewComments && <Comments count={comments} />}
    </Stack>
  );
};

let Comments = ({ id, count = 0 }) => {
  let [replies, setReplies] = useState([
    {
      user: { name: "aarosh", avatar: "", lastUpdated: "3h" },
      comment:
        "Can you break down your proof of theorem 1 a bit more? Like, how...",
    },
    {
      user: { name: "the_michaelLake", avatar: "", lastUpdated: "6h" },
      comment: "This paper reminds me of another from..",
    },
    {
      user: { name: "swatigup", avatar: "", lastUpdated: "7h" },
      comment: "Cool paper, do you man on extending to...?",
    },
  ]);

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Comments {`(${count})`}</Typography>
      <Card>
        <CardContent>
          <TextField sx={{ width: "100%" }} multiline />
        </CardContent>
        <CardActions sx={{ padding: 2 }}>
          <Button variant="contained">Reply</Button>
          <Button variant="outlined">Cancel</Button>
        </CardActions>

        {/* Replies */}
        <CardContent>
          <Stack spacing={4}>
            {replies.map((reply, index) => {
              return <Reply key={index} {...reply} />;
            })}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

let Votes = ({ id, count, isvoted, direction }) => {
  let { isactive } = useSession();
  let [votes, setVote] = useState({ count, direction, isvoted });

  async function castVote(orientation) {
    if (!isactive && votes?.isvoted) return;

    try {
      let vote = orientation === "up" ? count + 1 : count - 1;
      await request.put(`post/update?id=${id}`, {
        votes: vote,
        direction: orientation,
      });
      setVote({ count: vote, direction: orientation, isvoted });
      return;
    } catch (error) {
      return;
    }
  }

  return (
    <Stack
      spacing={2}
      direction={"row"}
      alignItems={"center"}
      sx={{
        padding: "4px 8px",
        border: "1px solid",
        borderRadius: "6px",
        borderColor: (theme) => theme.palette.background.slate,
      }}
    >
      <IconButton disabled={!isactive}>
        <ArrowUp
          size={16}
          className={
            votes?.direction === "up"
              ? "text-green-500"
              : "hover:text-green-500"
          }
          onClick={() => castVote("up")}
        />
      </IconButton>
      <Typography>{votes?.count}</Typography>
      <IconButton disabled={!isactive}>
        <ArrowDown
          size={16}
          className={
            votes?.direction === "down" ? "text-red-500" : "hover:text-red-500"
          }
          onClick={() => castVote("down")}
        />
      </IconButton>
    </Stack>
  );
};

let Comment = ({ toggle, count }) => {
  let { isactive } = useSession();

  return (
    <Stack
      spacing={2}
      direction={"row"}
      alignItems={"center"}
      sx={{
        padding: "4px 14px",
        border: "1px solid",
        borderRadius: "6px",
        borderColor: (theme) => theme.palette.background.slate,
      }}
    >
      <IconButton onClick={toggle} disabled={!isactive} size="small">
        <Image
          src={"/icons/comment.svg"}
          width={26}
          height={26}
          alt="Comment"
        />
      </IconButton>
      <Typography>{count}</Typography>
    </Stack>
  );
};

let Reply = ({ user, comment = "" }) => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Image
          src={"https://placehold.co/50"}
          className="rounded-full"
          width={50}
          height={50}
          alt={"avatar"}
        />
        <Typography fontWeight={600} variant="h6">
          @{user?.name}
        </Typography>
        <Typography fontWeight={200} variant="h6">
          {user?.lastUpdated} ago
        </Typography>
      </Stack>
      <Typography fontWeight={300} variant="p">
        {comment}
      </Typography>
      <Divider />
      <Stack direction="row" spacing={2}>
        <Button variant="outline">
          <PlusIcon size={20} />
        </Button>
        <Comment count={1} />
        <Votes count={3} />
      </Stack>
    </Stack>
  );
};

let Title = ({ children }) => {
  return (
    <Typography variant="h5" fontWeight={500}>
      {children}
    </Typography>
  );
};

let User = ({ name, date }) => {
  let { isactive } = useSession();

  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={3}>
        <Typography fontWeight={100}>{name}</Typography>
        <Button
          variant="contained"
          size="small"
          disabled={!isactive}
          onClick={() => {
            createFollow({ context: "user", contx: "" });
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Follow</Typography>
            <PlusIcon size={20} />
          </Stack>
        </Button>
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
