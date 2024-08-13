"use client";

import Image from "next/image";

import { toggle } from "@/store/slices/ui";
import { useDispatch, useSelector } from "react-redux";

import { trimming } from "@/lib/utils";

import { useSession } from "@/lib/hooks/auth";

// Icon
import { IoAdd as PlusIcon } from "react-icons/io5";

import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

let Post = ({ id, children, comments = 0, votes = 0, conferences = [] }) => {
  let { isactive } = useSession();

  let Votes = () => {
    return (
      <Stack
        direction={"row"}
        spacing={2}
        alignItems={"center"}
        sx={{
          border: "1px solid #bebebe",
          borderRadius: "6px",
          padding: "8px 14px",
        }}
      >
        <Image
          src={"/icons/arrow-up.svg"}
          width={26}
          height={26}
          alt="upvote"
        />
        <Typography>{votes}</Typography>
        <Image
          src={"/icons/arrow-down.svg"}
          width={26}
          height={26}
          alt="downvote"
        />
      </Stack>
    );
  };

  let Comments = () => {
    return (
      <Button
        variant="outline"
        sx={{ border: "1px solid #bebebe" }}
        disabled={!isactive}
      >
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Image
            src={"/icons/comment.svg"}
            width={26}
            height={26}
            alt="Comment"
          />
          <Typography>{comments}</Typography>
        </Stack>
      </Button>
    );
  };

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
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={4}>
            <Votes />
            <Comments />
          </Stack>
          <Conferences list={conferences} />
        </Stack>
      </CardActions>
    </Card>
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
        <Button variant="contained" size="small" disabled={!isactive}>
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
        color="secondary"
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
