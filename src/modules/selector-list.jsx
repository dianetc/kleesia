import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { toggle } from "@/store/slices/ui";

import Selector from "@/components/selector";

// Materials
import { Button, Typography } from "@mui/material";

// Icons
import { FaCirclePlus as PlusIcon } from "react-icons/fa6";

// Fetch
import useSWR from "swr";
import { fetcher } from "@/lib/request";

export let Topics = () => {
  let dispatch = useDispatch();
  let { active: isactive } = useSelector((state) => state.persisted.user);
  let { context } = useSelector((state) => state.unpersisted.data.details);

  let URL = () => (context === "profile" ? "topic/get?q=profile" : "topic/get");

  let { data } = useSWR(URL(), fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
  });

  return (
    <Selector
      id="topic"
      icon={
        <Image
          src={"/icons/topics.svg"}
          width={30}
          height={30}
          alt={"topic icon"}
        />
      }
      list={data}
      label="Channels"
      callToAction={{ name: "Create new topics", action: () => {} }}
    >
      <Selector.Action>
        <Button
          variant="secondary"
          onClick={() => {
            dispatch(
              toggle({
                type: "MODAL",
                active: true,
                id: "create_topic",
                size: "medium",
              })
            );
          }}
          disabled={!isactive}
          startIcon={<PlusIcon size={20} />}
        >
          <Typography variant="body2" fontWeight={600}>
            Create Channel
          </Typography>
        </Button>
      </Selector.Action>
    </Selector>
  );
};

export let Conferences = () => {
  let { context } = useSelector((state) => state.unpersisted.data.details);

  let URL = () =>
    context === "profile" ? "conference/get?q=profile" : "conference/get";

  let { data } = useSWR(URL(), fetcher);

  return (
    <Selector
      id="conference"
      icon={
        <Image
          src={"/icons/conferences.svg"}
          width={30}
          height={30}
          alt={"topic icon"}
        />
      }
      list={data}
      label="Conferences"
    ></Selector>
  );
};

export let Followers = () => {
  let { context } = useSelector((state) => state.unpersisted.data.details);

  let URL = () =>
    context === "profile" ? "auth/user/get?q=followers&rtf=name" : "";

  let { data } = useSWR(URL(), fetcher);

  return (
    <Selector
      id="profile"
      icon={
        <Image
          src={"/icons/conferences.svg"}
          width={30}
          height={30}
          alt={"topic icon"}
        />
      }
      list={data}
      label="Following"
    ></Selector>
  );
};
