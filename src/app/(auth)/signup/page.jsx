"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

import { useDispatch } from "react-redux";

import request from "@/lib/request";

import { Notify } from "@/lib/utils";

import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

import Divider from "@mui/material/Divider";

import Typography from "@mui/material/Typography";

import { useRouter } from "next/navigation";
// Icon
import { MdAlternateEmail as EmailIcon } from "react-icons/md";
import { IoMdEye as EyeIcon } from "react-icons/io";
import { FaUser as UserIcon } from "react-icons/fa6";

export default function Page() {
  return (
    <Stack
      direction="col"
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100%",
        height: "100vh",
        background: (theme) => theme?.palette?.background?.main,
      }}
    >
      <Signup />
    </Stack>
  );
}

let Signup = () => {
  let [data, setData] = useState({});
  let [view_password, setViewPassword] = useState(false);

  let router = useRouter();
  let dispatch = useDispatch();

  function handleChange(e) {
    let { id, value } = e.target;
    setData({ ...data, [id]: value });
  }

  let is_empty = () => !data?.email || !data?.password;

  async function submit(e) {
    e.preventDefault();

    if (is_empty()) {
      Notify({ status: "error", content: "Please fill all the fields" });
      return;
    }

    try {
      let response = await request.post("auth/signin", data);
      let { msg, data: user } = response?.data ?? {};
      Notify({ status: "success", content: msg });
      dispatch(saveSession(user?.data));
      router.push("/home");
    } catch (error) {
      let { data, status } = error?.response ?? {};
      Notify({
        status: status !== 400 ? "error" : "info",
        content: data?.msg ?? error?.message,
      });
      status === 400 && router.push("/home");
    }
  }

  return (
    <Card sx={{ width: 746, padding: 2 }}>
      <CardHeader
        avatar={
          <Image
            src="/icons/logo.svg"
            width={46}
            height={46}
            alt={"Kleesia logo"}
          />
        }
        action={
          <Image
            src="/icons/close.svg"
            width={46}
            height={46}
            alt={"Close Icon"}
          />
        }
      />

      <CardContent>
        <form onSubmit={submit}>
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={600}>
              Create a new Account
            </Typography>
            <Stack spacing={2}>
              <OutlinedInput
                id="name"
                size="medium"
                onChange={handleChange}
                placeholder="Enter your fullname"
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <UserIcon size={20} />
                  </InputAdornment>
                }
              />
              <OutlinedInput
                id="email"
                onChange={handleChange}
                placeholder="Email Address"
                type="varchar"
                endAdornment={
                  <InputAdornment position="end">
                    <EmailIcon size={20} />
                  </InputAdornment>
                }
              />
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <OutlinedInput
                  id="password"
                  sx={{ width: "100%" }}
                  onChange={handleChange}
                  placeholder="Create a New Password"
                  type={view_password ? "varchar" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <EyeIcon
                        size={25}
                        className="cursor-pointer"
                        onClick={() => setViewPassword(!view_password)}
                      />
                    </InputAdornment>
                  }
                />
                <OutlinedInput
                  id="rpt-password"
                  sx={{ width: "100%" }}
                  onChange={handleChange}
                  placeholder="Repeat the Password"
                  type={view_password ? "varchar" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <EyeIcon
                        size={25}
                        className="cursor-pointer"
                        onClick={() => setViewPassword(!view_password)}
                      />
                    </InputAdornment>
                  }
                />
              </Stack>
            </Stack>
            <Button variant={"contained"} type="submit" disableElevation>
              Sign up
            </Button>
          </Stack>
        </form>
      </CardContent>

      <Divider sx={{ padding: 2 }} />

      <CardActions
        sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
      >
        <Typography variant="p">
          Already have an account? <Link href="/login">Login</Link>
        </Typography>
      </CardActions>
    </Card>
  );
};
