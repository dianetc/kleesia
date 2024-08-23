import { useState } from "react";

import request from "@/lib/request";

import { Notify } from "@/lib/utils";
import { useSWRConfig } from "swr";

// Material
import { CardContent, CardActions, Button, TextField } from "@mui/material";

let Form = ({ context = "post", context_id }) => {
  let [body, setComment] = useState("");

  let { mutate } = useSWRConfig();

  async function submit(e) {
    e.preventDefault();

    try {
      await request.post("comment/create", { body, context, context_id });
      Notify({ status: "success", content: "Comment posted" });
      mutate(
        `comment/get?context=${context}&context_id=${context_id}&rtf=body,votes,user`
      );
    } catch (error) {
      Notify({ status: "error", content: "Please try again" });
    }

    setComment("");
  }
  return (
    <form onSubmit={submit}>
      <CardContent>
        <TextField
          sx={{ width: "100%", background: "#fff" }}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          value={body}
          multiline
        />
      </CardContent>
      <CardActions sx={{ padding: 2 }}>
        <Button variant="contained" type="submit">
          Reply
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setComment("");
          }}
        >
          Cancel
        </Button>
      </CardActions>
    </form>
  );
};

export default Form;
