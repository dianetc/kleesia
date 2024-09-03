"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setDetails } from "@/store/slices/data";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";

import { VscTriangleDown as DownArrowIcon } from "react-icons/vsc";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
} from "@mui/material";

let CheckboxSelector = ({ id = "", icon, list = [], label = "", children }) => {
  const [selectedValue, setSelectedValue] = useState("");
  let dispatch = useDispatch();

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    dispatch(setDetails({ context: id, id: value }));
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
        <RadioGroup
          value={selectedValue}
          onChange={handleChange}
          sx={{
            paddingX: 1.3,
            height: "100%",
            maxHeight: "10em",
            overflowY: "scroll",
          }}
        >
          {list?.length > 0 &&
            list?.map((child) => (
              <FormControlLabel
                key={child.id}
                value={child.id}
                control={<Radio />}
                label={<Typography variant="body2">{child?.title}</Typography>}
              />
            ))}
        </RadioGroup>
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

CheckboxSelector.Action = Action;

export default CheckboxSelector;
