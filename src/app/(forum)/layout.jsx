"use client";

import useSWR, { useSWRConfig } from "swr";
import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { verifySession } from "@/lib/auth";
import request, { fetcher } from "@/lib/request";
import { createFollow } from "@/lib/features/follows";

import { toggle } from "@/store/slices/ui";
import { setDetails } from "@/store/slices/data";
import { logout } from "@/store/slices/persisted";
import { useDispatch, useSelector } from "react-redux";

import Modals from "./modals";
import { Topics, Conferences } from "@/modules/selector-list";

import {
  Box,
  Chip,
  Stack,
  Button,
  Divider,
  Typography,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";

// Icons
import { IoAdd as PlusIcon } from "react-icons/io5";
import { FaCheck as TickIcon } from "react-icons/fa6";
import { IoIosSearch as SearchIcon } from "react-icons/io";
import { FaPlusSquare as SquarePlusIcon } from "react-icons/fa";
import { FaArrowRight as RightArrowIcon } from "react-icons/fa6";

let Layout = ({ children }) => {
  useEffect(() => {
    verifySession();
  }, []);

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
  let dispatch = useDispatch();
  let [search, setSearch] = useState({});

  let { active: isactive } = useSelector((state) => state.persisted.user);

  let { context } = useSelector((state) => state.unpersisted.data.details);

  function handleSearch(e) {
    let { id, value } = e.target;
    setSearch({ ...search, [id]: value });
  }

  let SessionActions = () => {
    const router = useRouter();

    if (!isactive) {
      return (
        <>
          <Button
            size="large"
            variant="outlined"
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
        <Button
          size="large"
          variant="outlined"
          onClick={() => {
            // * Comment to disable access if the context is not complete
            dispatch(
              setDetails({
                context: context === "profile" ? "trending" : "profile",
              })
            );
            // * //
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Typography>
              {context === "profile" ? "Back Home" : "My Profile"}
            </Typography>
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
          id="value"
          onKeyDown={(e) => {
            e.key === "Enter"
              ? dispatch(setDetails({ context: "search", id: search?.value }))
              : "";
          }}
          onChange={handleSearch}
          autoFocus={false}
          placeholder="Search Topic or Paper.."
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon size={20} />
            </InputAdornment>
          }
          disabled={!isactive}
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
  let { active: isactive } = useSelector((state) => state.persisted.user);

  return (
    <Box sx={{ width: "25%", border: "1px solid #E8E8E8" }}>
      <Stack
        sx={{ width: "100%", height: "100%" }}
        direction="column"
        alignItems={"stretch"}
        justifyContent={"space-between"}
      >
        <Stack height="100%" spacing={3} sx={{ p: 3 }}>
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
            <Image
              src={"/icons/log-out.svg"}
              width={40}
              height={40}
              alt={"logout"}
            />
            <Typography fontWeight={600}>Log Out</Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

let RightBar = () => {
  let { context } = useSelector((state) => state.unpersisted.data.details);

  return (
    <Box sx={{ width: "25%", border: "1px solid #E8E8E8", padding: 4 }}>
      {context === "profile" ? <ProfileDetails /> : <TopicDetails />}
    </Box>
  );
};

let ProfileDetails = () => {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Your Profile:</Typography>
      <Box
        fullWidth
        sx={{
          padding: 3,
          border: 1,
          borderRadius: 1,
          borderColor: "divider",
          backgroundColor: (theme) => theme?.palette?.background?.main,
        }}
      >
        <Stack
          direction="row"
          alignItems="start"
          sx={{ marginBottom: 6 }}
          justifyContent="space-between"
        >
          <Image
            src="https://placehold.co/100"
            className="rounded-full"
            width={100}
            height={100}
            alt="User avatar"
          />
          <Button variant="outlined" size="small">
            Edit
          </Button>
        </Stack>
        <Stack spacing={1}>
          <Stack sx={{ marginY: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Username
            </Typography>
            <Typography variant="small" fontWeight={200}>
              @username
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="small" fontWeight={200}>
              Posts:
            </Typography>
            <Typography variant="small" fontWeight={200}>
              0
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="small" fontWeight={200}>
              Comments:
            </Typography>
            <Typography variant="small" fontWeight={200}>
              0
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

let TopicDetails = () => {
  let { active } = useSelector((state) => state.persisted.user);

  let { context, id, topic } = useSelector(
    (state) => state.unpersisted.data.details
  );

  function URL() {
    let _url = (id) => `topic/get?id=${id}&rtf=id,title,rules`;

    switch (context) {
      case "topic":
        return _url(id);
      case "post":
        return _url(topic);
      default:
        return undefined;
    }
  }

  let { data } = useSWR(URL(), fetcher);

  let [details, setDetails] = useState(undefined);

  useEffect(() => {
    data && setDetails(data[0]);
  }, [data]);

  return details ? (
    <Stack spacing={4}>
      <Featured {...details} />
      <Rules list={details?.rules} />
    </Stack>
  ) : (
    <Stack
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="p">
        {active
          ? "Enter a Topics channel to view pertinent posts. "
          : "Login in to like, comment on, or share papers. "}
      </Typography>
    </Stack>
  );
};

let Featured = ({
  id,
  title,
  followed,
  online = 0,
  followers = 0,
  conferences = [],
}) => {
  let { active: isactive } = useSelector((state) => state.persisted.user);
  let dispatch = useDispatch();

  let { name: store_user_name } = useSelector(
    (state) => state?.persisted?.user
  );

  let { mutate } = useSWRConfig();

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          backgroundColor: "#f5f5f5", // Grey background
          borderRadius: 1, // Rounded corners
          padding: 2, // Padding around the content
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight={300} variant="p" color="text.secondary">
                Followers
              </Typography>
              <Typography fontWeight={300} variant="p" color="text.secondary">
                {followers}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight={300} variant="p" color="text.secondary">
                Online
              </Typography>
              <Typography fontWeight={300} variant="p" color="text.secondary">
                {online}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Button
              fullWidth
              size="small"
              variant="outlined"
              disabled={!isactive}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
                onClick={() => {
                  dispatch(
                    toggle({
                      type: "MODAL",
                      active: true,
                      id: "create_post",
                      size: "medium",
                    })
                  );
                }}
              >
                <Typography>New Post</Typography>
                <SquarePlusIcon size={16} />
              </Stack>
            </Button>
            {isactive && (
              <Button
                variant={followed ? "outlined" : "contained"}
                fullWidth
                size="small"
                disabled={!isactive}
                onClick={() => {
                  !followed && createFollow({ context: "topic", contx: id });
                  mutate(`topic/get?id=${id}&rtf=id,title,rules`);
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="small">
                    {followed ? "Followed" : "Follow"}
                  </Typography>
                  {followed ? <TickIcon size={13} /> : <PlusIcon size={20} />}
                </Stack>
              </Button>
            )}
          </Stack>
        </Stack>
        <Divider sx={{ margin: "16px 0" }} />
        <Stack>
          <Typography fontWeight={600}>Tags:</Typography>
          <Stack direction="row" alignContent="center" spacing={1}>
            {conferences?.map((conference, index) => {
              return (
                <Chip
                  key={conference?.id}
                  label={conference}
                  color={`#${index * 3}${index * 7}${index * 8}`}
                />
              );
            })}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

let Rules = ({ list = [] }) => {
  // Child
  let Rule = ({ children }) => <Stack spacing={0}>{children}</Stack>;
  let Name = ({ children }) => (
    <Typography variant="p" fontWeight={600}>
      {children}
    </Typography>
  );
  let Details = ({ children }) => (
    <Typography variant="small" fontWeight={200}>
      {children}
    </Typography>
  );

  Rule.Name = Name;
  Rule.Details = Details;

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={500} color="text.secondary">
        Our Rules
      </Typography>
      <Stack
        sx={{ height: "100%", maxHeight: "30em", overflowY: "scroll" }}
        spacing={2}
      >
        {list?.map((rule, index) => {
          return (
            <Rule key={index}>
              <Rule.Name>
                {index + 1}. {rule?.name}
              </Rule.Name>
              <Rule.Details>{rule?.details}</Rule.Details>
            </Rule>
          );
        })}
      </Stack>
    </Stack>
  );
};
export default Layout;
