"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

import { useDispatch } from "react-redux";
import { saveSession } from "@/store/slices/persisted";

import request from "@/lib/request";

import { Notify } from "@/lib/utils";

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
      <Login />
    </Stack>
  );
}

let Login = () => {
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
      dispatch(saveSession(user));
      router.push("/");
    } catch (error) {
      let msg = error?.response?.data?.msg ?? error?.message;
      Notify({ status: "error", content: msg });
    }
  }

  return (
    <Card sx={{ width: 446, padding: 2 }}>
      <CardHeader
        avatar={
          <Image
            src="/icons/logo.svg"
            width={46}
            height={46}
            alt={"Kleesia logo"}
          />
        }
      />

      <CardContent>
        <form onSubmit={submit}>
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={600}>
              Welcome back!
            </Typography>
            <Stack spacing={2}>
              <OutlinedInput
                id="email"
                onChange={handleChange}
                placeholder="Email"
                type="varchar"
                endAdornment={
                  <InputAdornment position="end">
                    <UserIcon size={20} />
                  </InputAdornment>
                }
              />
              <OutlinedInput
                id="password"
                onChange={handleChange}
                placeholder="Password"
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
            <Stack direction="row" justifyContent="end">
              <Link href={"/forget"}>Forgot password?</Link>
            </Stack>
            <Button variant="contained" type="submit">
              Login
            </Button>
          </Stack>
        </form>
      </CardContent>

      <Divider sx={{ padding: 2 }} />

      <CardActions
        sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
      >
        <Typography variant="p">
          New to kleesia? <Link href="/signup">Sign up</Link>
        </Typography>
      </CardActions>
    </Card>
  );
};
