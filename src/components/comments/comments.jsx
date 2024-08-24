import useSWR from "swr";
import { fetcher } from "@/lib/request";
//
import Form from "./form";
import Comment from "./comment";

// Material
import { Stack, Typography, Card, CardContent } from "@mui/material";
import { useEffect } from "react";

let Comments = ({ onClose, topic, post, count }) => {
  let { data: comments } = useSWR(
    `comment/get?context=post&context_id=${post}&rtf=body,votes,user`,
    fetcher
  );

  useEffect(() => {
    console.log(topic);
  }, [topic]);

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Comments {`(${count})`}</Typography>
      <Card>
        <Form context_id={post} cancel={onClose} />
        {/* Replies */}
        <CardContent>
          <Stack spacing={4}>
            {comments?.map((comment, index) => {
              return <Comment key={index} topic={topic} {...comment} />;
            })}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Comments;
