import Image from "next/image";

import { useDispatch } from "react-redux";
import { toggle } from "@/store/slices/ui";

import Button from "@mui/material/Button";
import Selector from "@/components/selector";

// Icons
import { FaCirclePlus as PlusIcon } from "react-icons/fa6";

// Fetch
import useSWR from "swr";
import { fetcher } from "@/lib/request";

export let Topics = () => {
  let dispatch = useDispatch();

  let { data } = useSWR("topic/all", fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
  });

  return (
    <Selector
      id="topic"
      icon={
        <Image
          src={"/icons/topics.svg"}
          width={40}
          height={40}
          alt={"topic icon"}
        />
      }
      list={data}
      label="Topics"
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
          startIcon={<PlusIcon size={20} />}
        >
          Create a new topic
        </Button>
      </Selector.Action>
    </Selector>
  );
};

export let Conferences = () => {
  let { data } = useSWR("conference/all", fetcher);

  return (
    <Selector
      id="conference"
      icon={
        <Image
          src={"/icons/conferences.svg"}
          width={40}
          height={40}
          alt={"topic icon"}
        />
      }
      list={data}
      label="Conferences"
    />
  );
};