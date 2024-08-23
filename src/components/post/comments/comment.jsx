import Image from "next/image";

import useSWR from "swr";
import { fetcher } from "@/lib/request";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDetails } from "@/store/slices/data";

import Form from "./form";
import Reply from "./reply";
import Votes from "../votes";
import Trigger from "./trigger";

// Icon
import { IoAdd as PlusIcon } from "react-icons/io5";
import { FaMinus as MinusIcon } from "react-icons/fa6";

// Material
import { Typography, Stack, Divider, Button } from "@mui/material";

let Comment = ({ id, topic, user, body = "", votes = 0 }) => {
  let [reply, setReply] = useState(false);
  let [collapse, setCollapse] = useState(false);

  let dispatch = useDispatch();

  let { context } = useSelector((state) => state.unpersisted.data.details);

  let { data: replies } = useSWR(
    `comment/get?context=reply&context_id=${id}&rtf=body,votes,user`,
    fetcher
  );

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
        {body}
      </Typography>

      <Divider />

      <Stack direction="row" spacing={2}>
        <Button
          variant="outline"
          onClick={() => {
            replies?.length > 0 && setCollapse(!collapse);
          }}
        >
          {!collapse ? <PlusIcon size={20} /> : <MinusIcon size={20} />}
        </Button>
        <Trigger
          toggle={() => {
            context === "post"
              ? setReply(!reply)
              : dispatch(setDetails({ context: "post", id, topic }));

            console.log(context, id, topic);
          }}
          count={1}
        />
        <Votes id={id} context="comment" count={votes} />
      </Stack>

      {reply && <Form context={"reply"} context_id={id} />}

      <Stack
        spacing={4}
        sx={{
          display: collapse ? "flex" : "none",
          padding: "1.5em",
          borderRadius: 1,
          borderLeft: "1px solid",
          borderColor: (theme) => theme.palette.background.paper,
          backgroundColor: (theme) => theme.palette.background.main,
        }}
      >
        {replies?.map((reply, index) => {
          return <Reply key={index} {...reply} />;
        })}
      </Stack>
    </Stack>
  );
};

export default Comment;
