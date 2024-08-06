import Image from "next/image";

import Stack from "@mui/material/Stack";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

import Button from "@mui/material/Button";

import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import { FaUsers as UserIcon } from "react-icons/fa6";

import { IoIosSearch as SearchIcon } from "react-icons/io";

import { Box } from "@mui/material";

import { IoAddCircleSharp as PlusIcon } from "react-icons/io5";

let Layout = ({ children }) => {
  return (
    <main>
      <Navigation />
      <Stack direction="row" sx={{ height: "90vh" }}>
        <LeftBar />
        <Content>{children}</Content>
        <RightBar />
      </Stack>
    </main>
  );
};

let Navigation = () => {
  return (
    <Stack
      direction="row"
      justifyContent={"space-between"}
      sx={{ height: "10vh", padding: 3, border: "1px solid #E8E8E8" }}
      spacing={4}
    >
      <Image src="/icons/logo.svg" width={46} height={46} alt={"Kleesia"} />
      <OutlinedInput
        sx={{ width: "446px" }}
        placeholder="Start typing..."
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon size={20} />
          </InputAdornment>
        }
      />
      <Stack direction={"row"} spacing={2}>
        <Button variant="contained">Login</Button>
        <Button variant="contained">Sign up</Button>
      </Stack>
    </Stack>
  );
};

let Content = ({ children }) => {
  return (
    <Box sx={{ width: "60%", backgroundColor: "#E8E8E8", overflowY: "scroll" }}>
      {children}
    </Box>
  );
};

let LeftBar = () => {
  return (
    <Box sx={{ width: "20%", border: "1px solid #E8E8E8" }}>
      <Stack spacing={3} sx={{ padding: 3 }}>
        <Stack alignItems="start" spacing={2}>
          <Accordion>
            <AccordionSummary
              // startIcon={}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Topics
            </AccordionSummary>
            <AccordionDetails>...</AccordionDetails>
          </Accordion>
          <Button variant="text" startIcon={<PlusIcon size={20} />}>
            Create a new topic
          </Button>
        </Stack>
        <Stack alignItems="start" spacing={2}>
          <Accordion>
            <AccordionSummary
              startIcon={<UserIcon size={20} />}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Conferences
            </AccordionSummary>
            <AccordionDetails>...</AccordionDetails>
          </Accordion>
          <Button variant="text" startIcon={<PlusIcon size={20} />}>
            Create a new conference
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

let RightBar = () => {
  return <Box sx={{ width: "20%", border: "1px solid #E8E8E8" }}></Box>;
};

export default Layout;
