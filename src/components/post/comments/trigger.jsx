import Image from "next/image";

import { useSession } from "@/lib/hooks/auth";

import { IconButton, Stack, Typography } from "@mui/material";

let Trigger = ({ toggle, count }) => {
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

export default Trigger;
