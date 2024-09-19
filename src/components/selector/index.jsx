"use client";

import { useDispatch } from "react-redux";
import { setDetails } from "@/store/slices/data";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

import Typography from "@mui/material/Typography";

// Icons
//import { BsSquareFill as BoxIcon } from "react-icons/bs";
import { RiCheckboxBlankFill as BoxIcon } from "react-icons/ri";
import { VscTriangleDown as DownArrowIcon } from "react-icons/vsc";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
} from "@mui/material";

let Selector = ({ id = "", icon, list = [], label = "", children }) => {
  let { active: isactive } = useSelector((state) => state.persisted.user);
  let dispatch = useDispatch();
  let router = useRouter();

  const handleItemClick = (child) => {
    dispatch(setDetails({ context: id, id: child?.id, title: child?.title }));
    if (id === "topic") {
      router.push(`/channel/${encodeURIComponent(child?.title)}`);
    }
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<DownArrowIcon size={20} />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Stack direction={"row"} alignItems={"center"} spacing={4}>
          {icon}
          <Typography variant="secondary" fontWeight="bold">
            {label}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack
          spacing={2}
          sx={{
            paddingX: 1.3,
            height: "100%",
            maxHeight: "10em",
            overflowY: "scroll",
          }}
        >
          {list?.length > 0 &&
            list?.map((child, index) => {
              return (
                <Stack
                  direction="row"
                  key={child.id}
                  onClick={() => handleItemClick(child)}
                  spacing={2}
                  sx={{ cursor: "pointer" }}
                >
                  <BoxIcon
                    size={20}
                    color="#A9A9A9"
                  />
                  <Typography variant="p">{child?.title}</Typography>
                </Stack>
              );
            })}
        </Stack>
      </AccordionDetails>
      <Divider sx={{ padding: 2 }} />
      {children}
    </Accordion>
  );
};

let Action = ({ children }) => {
  return (
    <AccordionActions sx={{ justifyContent: "start" }}>
      {children}
    </AccordionActions>
  );
};

Selector.Action = Action;

export default Selector;
