import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { toggle } from "@/store/slices/ui";

import Button from "@mui/material/Button";
import Selector from "@/components/selector";

// Materials
import Typography from "@mui/material/Typography"; // Add this import statement

// Icons
import { FaCirclePlus as PlusIcon } from "react-icons/fa6";

// Fetch
import useSWR from "swr";
import { fetcher } from "@/lib/request";

export let Topics = () => {
  let dispatch = useDispatch();
  let { name } = useSelector((state) => state.unpersisted.data.context);

  let get_filter = () => (name === "recent" ? "?q=recent" : "");

  let { data } = useSWR(`topic/get${get_filter()}`, fetcher, {
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
          <Typography variant="body2" fontWeight={600}>
            Create Topic
          </Typography>
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
