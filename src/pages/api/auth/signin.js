import CryptoJS from "crypto-js";
import prisma from "@/lib/prisma";
import { generateHash } from "./lib";
import { setCookie } from "cookies-next";
import { getExpiry } from "@/lib/utils";
import { messages } from "@/lib/request/responses";

export default async function SIGNIN(request, response) {
  let { method, body } = request;

  if (method !== "POST")
    return response.status(405).send({ msg: messages?.METHOD_NOT_ALLOWED });

  let { email, password } = body ?? {};

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      account: {
        select: {
          id: true,
          password: true,
        },
      },
    },
  });

  if (!user?.id)
    return response.status(500).send({ msg: "User does not exist" });

  let { account } = user;

  if (!account?.password)
    return response.status(500).send({ msg: "User does not have an account" });

  let hash = CryptoJS.SHA3(password).toString(CryptoJS.enc.Hex);

  if (hash !== account?.password)
    return response
      .status(500)
      .send({ msg: "Sorry, email/password is incorrect.. please try again" });

  let { id: account_id } = user?.account;

  let session = await prisma.session.findFirst({
    where: { account_id },
    orderBy: {
      created_at: "desc",
    },
    select: {
      token: true,
      refresh_tk: true,
      status: true,
    },
  });

  let { status, token, refresh_tk } = session ?? {};

  let expiry = getExpiry(8);

  let params = { req: request, res: response, maxAge: expiry };

  if (status === "active") {
    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        status: "online",
      },
    });

    delete user?.id;
    delete user?.account;

    setCookie("ABywFrtD", token, params);
    setCookie("qBJpvRne", refresh_tk, params);

    return response
      .status(200)
      .send({ msg: "You already logged in", data: user });
  }

  let nw_token = generateHash();
  let nw_refresh_tk = generateHash();

  try {
    await prisma.session.create({
      data: {
        expiry,
        token: nw_token,
        refresh_tk: nw_refresh_tk,
        account_id: account?.id,
      },
    });

    setCookie("ABywFrtD", nw_token, params);
    setCookie("qBJpvRne", nw_refresh_tk, params);

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        status: "online",
      },
    });

    delete user?.id;
    delete user?.account;

    return response
      .status(200)
      .send({ msg: `Welcome, ${user?.name}`, data: user });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ msg: messages.FATAL });
  }
}
