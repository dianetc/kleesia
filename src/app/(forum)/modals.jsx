import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { toggle } from "@/store/slices/ui";

import request from "@/lib/request";

import { Notify, trimming } from "@/lib/utils";

import OutlinedInput from "@mui/material/OutlinedInput";

import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";

import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

let Modals = () => {
  let dispatch = useDispatch();
  let { active, id, size } = useSelector(
    (state) => state?.unpersisted?.ui?.modal
  );

  let content = {
    create_topic: <CreateTopic />,
  };

  let sizes = {
    small: 500,
    medium: 600,
    large: 700,
    extra_large: 800,
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: sizes[size],
    bgcolor: "background.paper",
    borderRadius: 1,
    p: 2,
  };

  return (
    <Modal
      open={active}
      onClose={() => {
        dispatch(toggle({ type: "MODAL", active: false, id: "", size: "" }));
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>{content[id]}</Box>
    </Modal>
  );
};

let CreateTopic = () => {
  let [topic, setTopic] = useState("");
  let [rule, setRule] = useState({ name: "", details: "" });
  let [rules, setRules] = useState([]);

  function handleChange(e) {
    let { id, value } = e.target;

    if (id === "topic") {
      setTopic(value);
    } else {
      let _id = id?.split("-")[1];
      setRule({ ...rule, [_id]: value });
    }
  }

  function addRule() {
    setRules((prev) => [...prev, rule]);
    setRule({});
  }

  async function submit(e) {
    e.preventDefault();

    let data = { name: topic, rules };

    try {
      await request.post("topic/create", data);
      Notify({ status: "success", content: `Topic ${topic} created` });
      //
      setTopic("");
      setRule({ name: "", details: "" });
      setRules([]);
    } catch (error) {
      let msg = error?.response?.data?.msg ?? error?.message;
      Notify({ status: "error", content: msg });
    }
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        <Typography variant="h1" fontWeight={600}>
          Create a new topic
        </Typography>
        <OutlinedInput
          id="topic"
          onChange={handleChange}
          size="small"
          value={topic}
          placeholder="Enter topic name"
        />
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h3" fontWeight={500}>
          Topic rules
        </Typography>

        {rules?.length > 0 && (
          <Grid container columns={4} spacing={1}>
            {rules.map((rule) => {
              return (
                <Grid key={rule?.name} item>
                  <Chip label={trimming(rule?.name, 20)} />
                </Grid>
              );
            })}
          </Grid>
        )}

        <OutlinedInput
          id="rule-name"
          onChange={handleChange}
          size="small"
          value={rule?.name}
          placeholder="Write a rule"
        />
        <TextField
          id="rule-details"
          onChange={handleChange}
          placeholder="Add rule details..."
          minRows={6}
          value={rule?.details}
          multiline
        />
        <Button
          size="medium"
          variant="outlined"
          type="button"
          onClick={() => addRule()}
        >
          Add Rule{" "}
        </Button>
      </Stack>

      <Stack direction="row" justifyContent="end">
        <Button variant="contained" size="large" onClick={submit}>
          <Typography variant="h5" fontWeight={600}>
            Create topic
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
};
export default Modals;
