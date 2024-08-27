import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import { useSWRConfig } from "swr";
import request from "@/lib/request";
import { Notify } from "@/lib/utils";

// Material
import { CardContent, CardActions, Button, TextField } from "@mui/material";

let Form = ({ cancel, context = "post", context_id }) => {
  let { mutate } = useSWRConfig();
  let [body, setComment] = useState("");

  let { active: isactive } = useSelector((state) => state.persisted.user);

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
    <form onSubmit={submit} className={isactive ? "block" : "hidden"}>
      <CardContent>
        <TextField
          sx={{ width: "100%", background: "#fff" }}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          value={body}
          multiline
          minRows={3}
        />
      </CardContent>
      <CardActions sx={{ padding: 2 }}>
        <Button variant="contained" type="submit">
          Reply
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            cancel();
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
