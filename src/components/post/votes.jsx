import { useSWRConfig } from "swr";
import { useEffect, useState } from "react";

import request from "@/lib/request";
import { Notify } from "@/lib/utils";
import { useSelector } from "react-redux";

// Icon
import { BiSolidUpArrow as ArrowUp } from "react-icons/bi";
import { BiSolidDownArrow as ArrowDown } from "react-icons/bi";
// Material
import { Stack, IconButton, Typography } from "@mui/material";

let Votes = ({ id, context = "post", count, direction }) => {
  let { mutate } = useSWRConfig();
  let { context: store_context } = useSelector(
    (state) => state.unpersisted.data.details
  );

  let { active: isactive } = useSelector((state) => state.persisted.user);
  let [votes, setVote] = useState({ count, direction });

  async function castVote(orientation) {
    if (!isactive) return;

    try {
      let vote = orientation === "up" ? votes?.count + 1 : votes?.count - 1;
      let response = await request.put(`${context}/update?id=${id}`, {
        vote: true,
        votes: vote,
        direction: orientation,
      });

      let { votes: nw_votes } = response?.data;
      setVote({ count: nw_votes, direction: orientation });
      return;
    } catch (error) {
      let msg = error?.response?.data?.msg ?? error?.message;
      Notify({ status: "info", content: msg });
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
              : store_context !== "profile"
              ? "hover:text-green-500"
              : ""
          }
          onClick={() => castVote("up")}
        />
      </IconButton>
      <Typography>{votes?.count}</Typography>
      <IconButton disabled={!isactive}>
        <ArrowDown
          size={16}
          className={
            votes?.direction === "down"
              ? "text-red-500"
              : store_context !== "profile"
              ? "hover:text-red-500"
              : ""
          }
          onClick={() => castVote("down")}
        />
      </IconButton>
    </Stack>
  );
};

export default Votes;
