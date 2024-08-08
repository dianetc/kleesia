"use client";

import { useState } from "react";

import { Posts } from "./data";
import { trimming } from "@/lib/utils";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

let Page = () => {
  let [readMore, setReadMore] = useState(0);

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
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography>{post?.user?.name}</Typography>
                    <Button variant="contained" disableElevation>
                      Follow
                    </Button>
                  </Stack>
                  <Typography fontWeight={100}>{post?.user?.date}</Typography>
                </Stack>
                {/* Description */}
                <Stack spacing={1}>
                  <Typography variant="p">
                    {readMore && readMore === post?.title
                      ? post?.description
                      : trimming(post?.description, 500)}
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => setReadMore(post?.title)}
                  >
                    Read full post
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
            <CardActions>{/*  */}</CardActions>
          </Card>
        );
      })}
    </Stack>
  );
};

export default Page;
