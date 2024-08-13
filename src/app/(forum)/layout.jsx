"use client";

import Image from "next/image";

import request from "@/lib/request";

import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/persisted";

import Stack from "@mui/material/Stack";
import Input from "@mui/material/Input";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

import Divider from "@mui/material/Divider";

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
import { useSession } from "@/lib/hooks/auth";
import { useRouter } from "next/navigation";

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
  let { isactive } = useSession();

  let SessionActions = () => {
    const router = useRouter();

    if (!isactive) {
      return (
        <>
          <Button
            size="large"
            variant="fixed"
            onClick={() => {
              router.push("/login");
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Typography>Login</Typography>
              <RightArrowIcon size={20} />
            </Stack>
          </Button>
          <Button
            size="large"
            variant="contained"
            onClick={() => {
              router.push("/signup");
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Typography>Sign up</Typography>
              <RightArrowIcon size={20} />
            </Stack>
          </Button>
        </>
      );
    } else {
      return (
        <Button size="large" variant="outlined">
          <Stack direction="row" spacing={3} alignItems="center">
            <Typography>My Profile</Typography>
            <RightArrowIcon size={20} />
          </Stack>
        </Button>
      );
    }
  };

  return (
    <Stack
      direction="row"
      justifyContent={"space-between"}
      alignItems="center"
      sx={{
        width: "100vw",
        height: "10vh",
        padding: "0 1.45em",
        borderBottom: "1px solid #E8E8E8",
      }}
    >
      <Stack sx={{ width: "35%" }}>
        <Image src="/icons/logo.svg" width={46} height={46} alt={"Kleesia"} />
      </Stack>
      <Stack sx={{ width: "40%" }}>
        <OutlinedInput
          sx={{
            width: "446px",
            height: "46px",
            border: "none",
            background: (theme) => theme.palette.background.main,
          }}
          autoFocus={false}
          placeholder="Search Topic or Paper.."
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon size={20} />
            </InputAdornment>
          }
        />
      </Stack>
      <Stack
        sx={{ width: "25%", height: "100%", maxHeight: "46px" }}
        direction={"row"}
        justifyContent={"end"}
        spacing={2}
      >
        <SessionActions />
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
  let { isactive } = useSession();

  return (
    <Box sx={{ width: "25%", border: "1px solid #E8E8E8" }}>
      <Stack
        sx={{ width: "100%", height: "100%" }}
        direction="column"
        alignItems={"stretch"}
        justifyContent={"space-between"}
      >
        <Stack spacing={3} sx={{ padding: 3 }}>
          <Stack alignItems="start" spacing={2}>
            <Accordion sx={{ width: "100%" }} disabled={!isactive}>
              <AccordionSummary
                expandIcon={<DownArrowIcon size={20} />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Stack direction={"row"} alignItems={"center"} spacing={4}>
                  <Image src="/icons/topics.svg" width={30} height={30} />
                  <Typography variant="secondary" fontWeight="bold">
                    Topics
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>No topics yet..</AccordionDetails>
              <Divider sx={{ padding: 2 }} />
              <AccordionActions sx={{ justifyContent: "start" }}>
                <Button variant="secondary" startIcon={<PlusIcon size={20} />}>
                  Create a new topic
                </Button>
              </AccordionActions>
            </Accordion>
          </Stack>

          <Divider />

          <Stack alignItems="start" spacing={2}>
            <Accordion sx={{ width: "100%" }} disabled={!isactive}>
              <AccordionSummary
                expandIcon={<DownArrowIcon size={20} />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Stack direction={"row"} alignItems={"center"} spacing={4}>
                  <Image src="/icons/conferences.svg" width={30} height={30} />
                  <Typography variant="secondary" fontWeight="bold">
                    Conferences
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>No conferences yet</AccordionDetails>
            </Accordion>
          </Stack>
        </Stack>

        {isactive && (
          <Stack
            onClick={() => {
              dispatch(logout(request));
            }}
            direction={"row"}
            spacing={2}
            padding={4}
            alignItems={"center"}
            sx={{ cursor: "pointer" }}
          >
            <Image src={"/icons/log-out.svg"} width={40} height={40} />
            <Typography fontWeight={600}>Log Out</Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

let RightBar = () => {
  return <Box sx={{ width: "25%", border: "1px solid #E8E8E8" }}></Box>;
};

export default Layout;
