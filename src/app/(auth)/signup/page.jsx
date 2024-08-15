"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

import { useDispatch } from "react-redux";
import { saveSession } from "@/store/slices/persisted";

import request from "@/lib/request";

import { allowed_emails, Notify } from "@/lib/utils";

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
  let [view, setView] = useState({
    password: false,
    rp_password: false,
  });

  let [error, setError] = useState(false);

  let router = useRouter();
  let dispatch = useDispatch();

  let validateEmail = (email) => {
    setError(email?.length > 0 && !email.match(allowed_emails));
  };

  function handleChange(e) {
    let { id, value } = e.target;
    id === "email" && validateEmail(value);
    setData({ ...data, [id]: value });
  }

  let is_empty = () =>
    data?.name || data?.email || data?.password || data?.rp_password;

  let is_password_match = () => data?.password === data?.rp_password;

  async function submit(e) {
    e.preventDefault();

    if (!is_empty) {
      Notify({ status: "error", content: "Please fill all the fields" });
      return;
    }

    if (!is_password_match) {
      Notify({ status: "error", content: "Passwords dont match" });
      return;
    }

    let payload = data;
    delete payload?.rp_password;

    try {
      let response = await request.post("auth/user/create", payload);
      let { msg, data: user } = response?.data ?? {};
      Notify({ status: "success", content: msg });
      dispatch(saveSession(user));
      router.push("/");
    } catch (error) {
      let { data, status } = error?.response ?? {};
      Notify({
        status: status !== 400 ? "error" : "info",
        content: data?.msg ?? error?.message,
      });
      status === 400 && router.push("/");
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
            onClick={() => router.push("/")}
            alt={"Close Icon"}
          />
        }
      />

      <CardContent>
        <form onSubmit={submit}>
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={600}>
              Create your account
            </Typography>
            <Stack spacing={2}>
              <OutlinedInput
                id="name"
                size="medium"
                onChange={handleChange}
                placeholder="Username"
                type="text"
                required={true}
                endAdornment={
                  <InputAdornment position="end">
                    <UserIcon size={20} />
                  </InputAdornment>
                }
              />
              <OutlinedInput
                id="email"
                onChange={handleChange}
                placeholder="Email Address, eg: name@domain.edu"
                type="varchar"
                error={error}
                required={true}
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
                  placeholder="Password"
                  required={true}
                  type={view?.password ? "varchar" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <EyeIcon
                        size={25}
                        className="cursor-pointer"
                        onClick={() => setView({ password: !view?.password })}
                      />
                    </InputAdornment>
                  }
                />
                <OutlinedInput
                  id="rp_password"
                  sx={{ width: "100%" }}
                  onChange={handleChange}
                  placeholder="Repeat Password"
                  required={true}
                  type={view?.rp_password ? "varchar" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <EyeIcon
                        size={25}
                        className="cursor-pointer"
                        onClick={() =>
                          setView({ rp_password: !view?.rp_password })
                        }
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
