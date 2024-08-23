import { useSWRConfig } from "swr";
import { useEffect, useState } from "react";

import request from "@/lib/request";
import { useSelector } from "react-redux";

// Icon
import { BiSolidUpArrow as ArrowUp } from "react-icons/bi";
import { BiSolidDownArrow as ArrowDown } from "react-icons/bi";
// Material
import { Stack, IconButton, Typography } from "@mui/material";

let Votes = ({ id, context = "post", count, isvoted, direction }) => {
  let { mutate } = useSWRConfig();
  let { active: isactive } = useSelector((state) => state.persisted.user);
  let [votes, setVote] = useState({ count, direction, isvoted });

  async function castVote(orientation) {
    if (!isactive && votes?.isvoted) return;

    try {
      let vote = orientation === "up" ? count + 1 : count - 1;
      await request.put(`${context}/update?id=${id}`, {
        votes: vote,
        direction: orientation,
      });
      mutate("/post/get");
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

export default Votes;
