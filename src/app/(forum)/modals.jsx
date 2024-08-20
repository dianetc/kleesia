import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { toggle } from "@/store/slices/ui";

import request from "@/lib/request";

import { Notify, trimming } from "@/lib/utils";

import OutlinedInput from "@mui/material/OutlinedInput";

import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import { IoAdd as PlusIcon } from "react-icons/io5";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { MuiChipsInput } from "mui-chips-input";

let Modals = () => {
  let dispatch = useDispatch();
  let { active, id, size } = useSelector(
    (state) => state?.unpersisted?.ui?.modal
  );

  let content = {
    create_topic: <CreateTopic />,
    create_post: <CreatePost />,
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
    p: 3,
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

  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(toggle({ type: "MODAL", active: false, id: "", size: "" }));
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={500}>
          Create a New Topic
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Stack spacing={2}>
        <OutlinedInput
          id="topic"
          onChange={handleChange}
          size="small"
          value={topic}
          placeholder="Enter topic name"
        />
      </Stack>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={500}>
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
          sx={{
            alignSelf: "flex-start",
            width: "30%",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography> Add Rule</Typography>
            <PlusIcon size={20} />
          </Stack>
        </Button>
      </Stack>

      <Stack direction="row" justifyContent="end">
        <Button variant="contained" size="large" onClick={submit}>
          <Typography variant="p" fontWeight={500}>
            Create topic
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
};

let CreatePost = () => {
  let [post, setPost] = useState({});
  let [co_authors, setAuthors] = useState([]);
  let [conferences, setConferences] = useState([]);

  let { id: topic_id } = useSelector((state) => state.unpersisted.data.topic);

  function handleChange(e) {
    let { id, value } = e.target;
    setPost({ ...post, [id]: value });
  }

  function handleConferences(value) {
    setConferences(value);
  }

  const getUsername = async (name) => {
    try {
      let response = await request.get(`auth/user/get?q=name=${name}&rtf=name`);
      console.log(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  function handleAuthors(value) {
    console.log(value);
    // let name = getUsername(value);
    // setAuthors(value);
  }

  async function submit(e) {
    e.preventDefault();

    let data = { ...post, co_authors, conferences, topic_id };

    try {
      await request.post("post/create", data);
      Notify({ status: "success", content: `Post ${post?.title} created` });
      //
    } catch (error) {
      let msg = error?.response?.data?.msg ?? error?.message;
      Notify({ status: "error", content: msg });
    }
  }
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(toggle({ type: "MODAL", active: false, id: "", size: "" }));
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={500}>
          Create a new post
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Stack spacing={1}>
        <Typography variant="label">Title *</Typography>
        <OutlinedInput
          id="title"
          onChange={handleChange}
          size="small"
          placeholder="Enter post title"
        />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="label">Summary *</Typography>
        <TextField
          id="body"
          onChange={handleChange}
          placeholder="Enter post summary"
          minRows={6}
          multiline
        />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="label">Arxiv Abstract Link *</Typography>
        <OutlinedInput
          id="arxix_link"
          onChange={handleChange}
          size="small"
          placeholder="Enter abstract link, e.g, arxiv.org/abs/<id>"
        />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="label">Conference{"(s)"}</Typography>
        <MuiChipsInput
          size="small"
          value={conferences}
          onChange={handleConferences}
        />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="label">Co-author{"(s)"}</Typography>
        <MuiChipsInput
          size="small"
          value={co_authors}
          onInputChange={handleAuthors}
          // onChange={handleAuthors}
        />
      </Stack>

      <Stack direction="row" justifyContent="end">
        <Button variant="contained" size="large" onClick={submit}>
          <Typography variant="p" fontWeight={500}>
            Publish Post
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
};

export default Modals;
