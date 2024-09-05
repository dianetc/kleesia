"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { forgotPassword, verifyTempPassword, resetPassword } from "@/lib/request";
import { Notify } from "@/lib/utils";

import {
  OutlinedInput,
  InputAdornment,
  Stack,
  Button,
  Divider,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from "@mui/material";

// Icons
import { MdAlternateEmail as EmailIcon } from "react-icons/md";
import { RiLockPasswordLine as PasswordIcon } from "react-icons/ri";
import { AiOutlineNumber as OtpIcon } from "react-icons/ai";

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
      <ForgotPassword />
    </Stack>
  );
}

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const router = useRouter();

  function handleChange(e) {
    const { id, value } = e.target;
    setData({ ...data, [id]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (step === 1) {
      try {
        await forgotPassword(data.email);
        Notify({ status: "success", content: "If the email address is valid, you will receive a one-time password." });
        setStep(2);
      } catch (error) {
        Notify({ status: "error", content: error.response?.data?.msg || error.message });
      }
    } else if (step === 2) {
      try {
        await verifyTempPassword(data.email, data.tempPassword);
        Notify({ status: "success", content: "verified successfully" });
        setStep(3);
      } catch (error) {
        Notify({ status: "error", content: error.response?.data?.msg || error.message });
      }
    } else if (step === 3) {
      if (data.newPassword !== data.confirmPassword) {
        Notify({ status: "error", content: "Passwords do not match" });
        return;
      }
      try {
        await resetPassword(data.email, data.otp, data.newPassword);
        Notify({ status: "success", content: "Password reset successfully" });
        router.push("/login");
      } catch (error) {
        Notify({ status: "error", content: error.response?.data?.msg || error.message });
      }
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
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={600}>
              {step === 1 ? "Forgot Password" : step === 2 ? "Enter OTP" : "Reset Password"}
            </Typography>
            <Stack spacing={2}>
              {step === 1 && (
                <OutlinedInput
                  id="email"
                  onChange={handleChange}
                  placeholder="Email Address"
                  type="email"
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <EmailIcon size={20} />
                    </InputAdornment>
                  }
                />
              )}
              {step === 2 && (
                <OutlinedInput
                  id="otp"
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  type="text"
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <OtpIcon size={20} />
                    </InputAdornment>
                  }
                />
              )}
              {step === 3 && (
                <>
                  <OutlinedInput
                    id="newPassword"
                    onChange={handleChange}
                    placeholder="New Password"
                    type="password"
                    required
                    endAdornment={
                      <InputAdornment position="end">
                        <PasswordIcon size={20} />
                      </InputAdornment>
                    }
                  />
                  <OutlinedInput
                    id="confirmPassword"
                    onChange={handleChange}
                    placeholder="Confirm New Password"
                    type="password"
                    required
                    endAdornment={
                      <InputAdornment position="end">
                        <PasswordIcon size={20} />
                      </InputAdornment>
                    }
                  />
                </>
              )}
            </Stack>
            <Button variant="contained" type="submit">
              {step === 1 ? "Get Temporary Password" : step === 2 ? "Submit Temporary Password" : "Reset Password"}
            </Button>
          </Stack>
        </form>
      </CardContent>

      <Divider sx={{ padding: 2 }} />

      <CardActions
        sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
      >
        <Typography variant="p">
          Remember your password? <Link href="/login">Login</Link>
        </Typography>
      </CardActions>
    </Card>
  );
};
