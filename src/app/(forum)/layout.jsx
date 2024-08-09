"use client";

import Image from "next/image";

import request from "@/lib/request";

import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/persisted";

import Stack from "@mui/material/Stack";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

// Icons
import { IoIosSearch as SearchIcon } from "react-icons/io";
import { IoAddCircleSharp as PlusIcon } from "react-icons/io5";
import { FaArrowRight as RightArrowIcon } from "react-icons/fa6";
import { VscTriangleDown as DownArrowIcon } from "react-icons/vsc";

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
        <Button
          size="large"
          variant="outlined"
          endIcon={<RightArrowIcon size={20} />}
        >
          Login
        </Button>
        <Button
          size="large"
          variant="contained"
          endIcon={<RightArrowIcon size={20} />}
        >
          Sign up
        </Button>
      </Stack>
    </Stack>
  );
};

let Content = ({ children }) => {
  return (
    <Box
      sx={{
        width: "50%",
        background: (theme) => theme.palette.background.main,
        overflowY: "scroll",
      }}
    >
      {children}
    </Box>
  );
};

let LeftBar = () => {
  let dispatch = useDispatch();

  return (
    <Box sx={{ width: "25%", border: "1px solid #E8E8E8" }}>
      <Stack
        sx={{ width: "100%", height: "100%" }}
        direction="column"
        alignItems={"stretch"}
        justifyContent={"space-between"}
      >
        <Stack spacing={4} sx={{ padding: 3 }}>
          <Stack alignItems="start" spacing={2}>
            <Accordion sx={{ width: "100%" }}>
              <AccordionSummary
                expandIcon={<DownArrowIcon size={20} />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Stack direction={"row"} alignItems={"center"} spacing={4}>
                  <Image src="/icons/topics.svg" width={30} height={30} />
                  <Typography variant="secondary">Topics</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>...</AccordionDetails>
            </Accordion>
            <Button variant="secondary" startIcon={<PlusIcon size={20} />}>
              Create a new topic
            </Button>
          </Stack>
          <Stack alignItems="start" spacing={2}>
            <Accordion sx={{ width: "100%" }}>
              <AccordionSummary
                expandIcon={<DownArrowIcon size={20} />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Stack direction={"row"} alignItems={"center"} spacing={4}>
                  <Image src="/icons/conferences.svg" width={30} height={30} />
                  <Typography variant="secondary">Conferences</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>...</AccordionDetails>
            </Accordion>
          </Stack>
        </Stack>

        <Button variant="secondary" onClick={() => dispatch(logout(request))}>
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Image src={"/icons/log-out.svg"} width={40} height={40} />
            <Typography fontWeight={600}>Log Out</Typography>
          </Stack>
        </Button>
      </Stack>
    </Box>
  );
};

let RightBar = () => {
  return <Box sx={{ width: "25%", border: "1px solid #E8E8E8" }}></Box>;
};

export default Layout;
