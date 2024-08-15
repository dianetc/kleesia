"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import request, { fetcher } from "@/lib/request";
import { useSession } from "@/lib/hooks/auth";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/persisted";

import Modals from "./modals";

import { Topics, Conferences } from "@/modules/selector-list";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// Icons
import { IoIosSearch as SearchIcon } from "react-icons/io";
import { FaArrowRight as RightArrowIcon } from "react-icons/fa6";
import useSWR from "swr";
import { useEffect } from "react";

let Layout = ({ children }) => {
  return (
    <main>
      <Navigation />
      <Modals />
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
          <Topics />
          <Divider />
          <Conferences />
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
  let { isactive } = useSession();

  let { id, name } = useSelector((state) => state.unpersisted.data.context);

  let { data } = useSWR(
    name === "TOPIC" ? `topic/get?id=${id}` : undefined,
    fetcher
  );

  return (
    <Box sx={{ width: "25%", border: "1px solid #E8E8E8", padding: 4 }}>
      {data ? (
        <TopicDetails data={data} />
      ) : (
        <Stack
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="p">
            {isactive
              ? "Pick a topic to view details"
              : "Login in to participate in the conversation"}
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

let TopicDetails = ({ data }) => {
  return (
    <Stack spacing={4}>
      <Featured
        data={{
          name: data?.name,
          followers: 48839,
          online: 3930200,
        }}
      />
      <Rules list={data?.rules} />
    </Stack>
  );
};

let Featured = ({ data = {} }) => {
  return (
    <Box
      sx={{
        padding: 3,
        borderRadius: 1,
        background: (theme) => theme.palette.background.main,
      }}
    >
      <Stack spacing={4}>
        <Typography variant="h6" fontWeight={600}>
          {data?.name}
        </Typography>
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={100} variant="p">
              Followers
            </Typography>
            <Typography fontWeight={100} variant="p">
              {data?.followers}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={100} variant="p">
              Online
            </Typography>
            <Typography fontWeight={100} variant="p">
              {data?.online}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined">New post</Button>
          <Button variant="contained">Follow</Button>
        </Stack>
        <Divider />
        <Stack>
          <Typography>Tags:</Typography>
          <Stack direction="row" alignContent="center" spacing={1}>
            {data?.conferences?.map((conference) => {
              return <Chip key={conference?.id} label={conference} />;
            })}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

let Rules = ({ list = [] }) => {
  // Child
  let Rule = ({ children }) => <Stack spacing={0}>{children}</Stack>;
  let Name = ({ children }) => <Typography variant="h6">{children}</Typography>;
  let Details = ({ children }) => (
    <Typography variant="p" fontWeight={200}>
      {children}
    </Typography>
  );

  Rule.Name = Name;
  Rule.Details = Details;

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600}>
        Our Rules
      </Typography>
      {list?.map((rule, index) => {
        return (
          <Rule key={rule?.id}>
            <Rule.Name>
              {index + 1}. {rule?.name}
            </Rule.Name>
            <Rule.Details>{rule?.details}</Rule.Details>
          </Rule>
        );
      })}
    </Stack>
  );
};
export default Layout;
