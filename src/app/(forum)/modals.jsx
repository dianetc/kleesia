import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { toggle } from "@/store/slices/ui";

import request, { fetcher } from "@/lib/request";

import useSWR, { useSWRConfig } from "swr";
import { allowed_arxiv_links, Notify, trimming } from "@/lib/utils";

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
    edit_post: <EditPost />,
    edit_topic: <EditTopic />,
  };

  let sizes = {
    small: 500,
    medium: 600,
    large: 700,
    extra_large: 800,
  };

  const style = {
    padding: 2,
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
      sx={{ overflowY: "scroll" }}
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
  let { active: isactive } = useSelector((state) => state.persisted.user);
  let { mutate } = useSWRConfig();

  let [topic, setTopic] = useState("");
  let [rule, setRule] = useState({ name: "", details: "" });
  let [rules, setRules] = useState([]);

  let { name } = useSelector((state) => state.unpersisted.data.details.context);

  let get_filter = () => (name === "recent" ? "?q=recent" : "");

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
    setRule({ name: "", details: "" });
  }

  async function submit(e) {
    e.preventDefault();

    let data = { title: topic, rules };

    try {
      await request.post("topic/create", data);
      Notify({ status: "success", content: `Topic ${topic} created` });
      //
      setTopic("");
      setRule({ name: "", details: "" });
      setRules([]);
      mutate(`topic/get${get_filter()}`);
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
                  <Chip
                    label={trimming(rule?.name, 20)}
                    onDelete={() => {
                      setRules(rules.filter((rl) => rl?.name !== rule?.name));
                    }}
                  />
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
        <Button
          variant="contained"
          size="large"
          onClick={submit}
          disabled={!isactive}
        >
          <Typography variant="p" fontWeight={500}>
            Create topic
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
};

let EditTopic = () => {
  let { active: isactive } = useSelector((state) => state.persisted.user);
  let { mutate } = useSWRConfig();

  let [topic, setTopic] = useState("");
  let [rule, setRule] = useState({ name: "", details: "" });
  let [rules, setRules] = useState([]);

  let { name } = useSelector((state) => state.unpersisted.data.details.context);
  let { id, context } = useSelector((state) => state.unpersisted.data.details);

  let { data } = useSWR(
    context === "topic"
      ? `topic/get?id=${id}&rtf=title,rules,user=name`
      : false,
    fetcher
  );

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
    setRule({ name: "", details: "" });
  }

  async function submit(e) {
    e.preventDefault();

    let data = { title: topic, rules };

    try {
      let response = await request.put(`topic/update?id=${id}`, data);
      let { msg } = response?.data?.msg;
      Notify({ status: "success", content: msg });
      //
      setTopic("");
      setRule({ name: "", details: "" });
      setRules([]);
      mutate(`topic/get?id=${id}&rtf=title,rules`);
    } catch (error) {
      let msg = error?.response?.data?.msg ?? error?.message;
      Notify({ status: "error", content: msg });
    }
  }

  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(toggle({ type: "MODAL", active: false, id: "", size: "" }));
  };

  useEffect(() => {
    let length = data && data.length > 0 ? Object.keys(data[0]).length > 0 : "";

    if (length) {
      let payload = data[0];
      setTopic(payload?.title);
      setRules(payload.rules);
    }
  }, [data]);

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
                  <Chip
                    label={trimming(rule?.name, 20)}
                    onDelete={() => {
                      setRules(rules.filter((rl) => rl?.name !== rule?.name));
                    }}
                  />
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
        <Button
          variant="contained"
          size="large"
          onClick={submit}
          disabled={!isactive}
        >
          <Typography variant="p" fontWeight={500}>
            Update topic
          </Typography>
        </Button>
      </Stack>
    </Stack>
  );
};

let CreatePost = () => {
  let { mutate } = useSWRConfig();
  let { active: isactive } = useSelector((state) => state.persisted.user);
  //
  let [post, setPost] = useState({});
  let [error, setError] = useState(false);
  //
  let [co_authors, setAuthors] = useState([]);
  let [conferences, setConferences] = useState([]);

  let { id, context } = useSelector((state) => state.unpersisted.data.details);

  let URL = () => {
    switch (context) {
      case "topic":
        return `post/get?topic_id=${id}`;
      case "conference":
        return `post/get?conferences[]=${id}`;
      case "recent":
        return "post/get?q=recent";
      case "search":
        return `search?q=${id}`;
      default:
        return "post/get";
    }
  };

  function handleChange(e) {
    let { id, value } = e.target;
    id === "arxiv_link" && validateArxiv(value);
    setPost({ ...post, [id]: value });
  }

  let validateArxiv = (link) => {
    setError(link?.length > 0 && !link.match(allowed_arxiv_links));
  };

  function handleConferences(value) {
    setConferences(value);
  }

  const getUsername = async (name) => {
    try {
      let response = await request.get(
        `auth/user/get?name*=${name}&rtf=id,name`
      );
      return response?.data[0];
    } catch (error) {
      console.log(error);
    }
  };

  async function handleAuthors(value) {
    if (value?.length === 0 || value.length < co_authors.length) {
      setAuthors(value);
    } else if (value?.length > co_authors?.length) {
      let newUsers = value.filter(
        (prev) => !co_authors?.map((authors) => authors?.name).includes(prev)
      );

      let newUser = newUsers[0] || value[0];

      let user = await getUsername(newUser);

      if (user?.name) {
        if (user?.name === name) {
          Notify({ status: "error", content: "You can't co-author your self" });
          return;
        }

        setAuthors((prev) => [...prev, user]);
      } else {
        Notify({ status: "error", content: "User does not exist" });
      }
    }
  }

  async function submit(e) {
    e.preventDefault();

    if (error)
      return Notify({
        status: "error",
        content: "Please check your Arxiv link",
      });

    let data = { ...post, co_authors, conferences, topic_id: id };

    try {
      await request.post("post/create", data);
      Notify({ status: "success", content: `Post ${post?.title} created` });
      mutate(URL());
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
    <form onSubmit={submit}>
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
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
            required
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
            maxRows={12}
            required
            multiline
          />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="label">Arxiv Abstract Link *</Typography>
          <OutlinedInput
            id="arxiv_link"
            onChange={handleChange}
            size="small"
            error={error}
            required
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
            value={co_authors?.map((author) => author?.name)}
            onChange={handleAuthors}
          />
        </Stack>

        <Stack direction="row" justifyContent="end">
          <Button
            variant="contained"
            size="large"
            type="submit"
            disabled={!isactive}
          >
            Publish Post
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

let EditPost = () => {
  let { mutate } = useSWRConfig();
  const dispatch = useDispatch();

  let { active: isactive, name } = useSelector((state) => state.persisted.user);
  //
  let [post, setPost] = useState({});
  let [error, setError] = useState(false);
  //
  let [co_authors, setAuthors] = useState([]);
  let [conferences, setConferences] = useState([]);
  //
  let { id, context } = useSelector((state) => state.unpersisted.data.details);

  let { data } = useSWR(
    context === "post" ? `post/get?id=${id}` : false,
    fetcher
  );

  function handleChange(e) {
    let { id, value } = e.target;
    id === "arxiv_link" && validateArxiv(value);
    setPost({ ...post, [id]: value });
  }

  let validateArxiv = (link) => {
    setError(link?.length > 0 && !link.match(allowed_arxiv_links));
  };

  function handleConferences(value) {
    setConferences(value);
  }

  const getUsername = async (name) => {
    try {
      let response = await request.get(
        `auth/user/get?name*=${name}&rtf=id,name`
      );
      return response?.data[0];
    } catch (error) {
      console.log(error);
    }
  };

  async function handleAuthors(value) {
    if (value?.length === 0 || value.length < co_authors.length) {
      setAuthors(value);
    } else if (value?.length > co_authors?.length) {
      let newUsers = value.filter(
        (prev) => !co_authors?.map((authors) => authors?.name).includes(prev)
      );

      let newUser = newUsers[0] || value[0];

      let user = await getUsername(newUser);

      if (user?.name) {
        if (user?.name === name) {
          Notify({ status: "error", content: "You can't co-author your self" });
          return;
        }

        setAuthors((prev) => [...prev, user]);
      } else {
        Notify({ status: "error", content: "User does not exist" });
      }
    }
  }

  async function submit(e) {
    e.preventDefault();

    if (error)
      return Notify({
        status: "error",
        content: "Please check your Arxiv link",
      });

    let payload = { ...post, co_authors, conferences };

    try {
      let response = await request.put(`post/update?id=${id}`, payload);
      let { msg } = response?.data;
      Notify({ status: "success", content: msg });
      mutate(`post/get?id=${id}`);
    } catch (error) {
      let msg = error?.response?.data?.msg ?? error?.message;
      Notify({ status: "error", content: msg });
    }
  }

  const handleClose = () => {
    dispatch(toggle({ type: "MODAL", active: false, id: "", size: "" }));
  };

  useEffect(() => {
    let length = data && data.length > 0 ? Object.keys(data[0]).length > 0 : "";

    let cache = {};

    if (length)
      Object.entries(data[0]).forEach(([key, values]) => {
        if (
          !key.match(/(comments|voted|user|topic_id|id|direction|topic_id)/)
        ) {
          cache[key] = values;
        }
      });

    data && setPost(cache);
  }, [data]);

  useEffect(() => {
    setConferences(post?.conferences);
    setAuthors(post?.co_authors);
  }, [post]);

  return (
    <form onSubmit={submit}>
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight={500}>
            Edit the post
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
            value={post?.title}
            size="small"
            required
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
            value={post?.body}
            required
            multiline
          />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="label">Arxiv Abstract Link *</Typography>
          <OutlinedInput
            id="arxiv_link"
            onChange={handleChange}
            size="small"
            error={error}
            value={post?.arxiv_link}
            required
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
            value={co_authors?.map((author) => author?.name)}
            onChange={handleAuthors}
          />
        </Stack>

        <Stack direction="row" justifyContent="end">
          <Button
            variant="contained"
            size="large"
            type="submit"
            disabled={!isactive}
          >
            Update Post
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default Modals;
