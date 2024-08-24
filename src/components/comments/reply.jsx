import Image from "next/image";

import { useState } from "react";

import Form from "./form";
import Votes from "../post/votes";
import Trigger from "./trigger";

// Icon
import { Typography, Stack, Divider } from "@mui/material";
import { useSelector } from "react-redux";

let Reply = ({ id, user, body = "", votes = 0 }) => {
  let [reply, setReply] = useState(false);
  let { context } = useSelector((state) => state.unpersisted.data.details);

  return (
    <Stack
      sx={{
        padding: "1.5em",
        borderLeft: "1px solid",
        borderColor: (theme) => theme.palette.background.slate,
      }}
      spacing={3}
    >
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
        {body}
      </Typography>

      <Divider />

      <Stack direction="row" spacing={2}>
        <Trigger
          toggle={() => {
            context !== "profile" ? setReply(!reply) : "hidden";
          }}
          count={1}
        />
        <Votes id={id} context="comment" count={votes} />
      </Stack>

      {reply && <Form context="reply" context_id={id} />}
    </Stack>
  );
};

export default Reply;
