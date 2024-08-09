"use client";

import { useState } from "react";

import Image from "next/image";

import { Posts } from "./data";
import { trimming } from "@/lib/utils";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

let Page = () => {
  let [readMore, setReadMore] = useState({ id: "", active: false });

  return (
    <Stack spacing={3} sx={{ padding: 8 }}>
      {Posts?.map((post, index) => {
        return (
          <Card key={index}>
            <CardContent>
              <Stack spacing={3} sx={{ padding: 2 }}>
                <Typography variant="h4">{post?.title}</Typography>
                {/* Metadata */}
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={3}>
                    <Typography fontWeight={100}>{post?.user?.name}</Typography>
                    <Button variant="contained">Follow</Button>
                  </Stack>
                  <Typography fontWeight={100}>{post?.user?.date}</Typography>
                </Stack>
                {/* Description */}
                <Stack spacing={1}>
                  <Typography variant="p">
                    {readMore?.id === post?.title && readMore?.active
                      ? post?.description
                      : trimming(post?.description, 500)}
                  </Typography>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setReadMore({
                        id: post?.title,
                        active: true,
                      })
                    }
                    sx={{ width: "100%", maxWidth: "8vw" }}
                  >
                    Read full post
                  </Button>
                </Stack>
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
                  {/* Comments */}
                  <Button
                    variant="outline"
                    sx={{ border: "1px solid #bebebe" }}
                  >
                    <Stack direction={"row"} spacing={2} alignItems={"center"}>
                      <Image
                        src={"/icons/comment.svg"}
                        width={26}
                        height={26}
                      />
                      <Typography>256</Typography>
                    </Stack>
                  </Button>

                  {/* Up voting */}
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
                    <Image src={"/icons/arrow-up.svg"} width={26} height={26} />
                    <Typography>472</Typography>
                    <Image
                      src={"/icons/arrow-down.svg"}
                      width={26}
                      height={26}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </CardActions>
          </Card>
        );
      })}
    </Stack>
  );
};

export default Page;
