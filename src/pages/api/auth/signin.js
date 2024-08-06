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
      status: true,
    },
  });

  let { status } = session ?? {};

  if (status === "active")
    return response.status(400).send({ msg: "You already logged in" });

  let token = generateHash();
  let refresh_tk = generateHash();

  let expiry = getExpiry(8);

  try {
    await prisma.session.create({
      data: {
        expiry,
        token,
        refresh_tk,
        account_id: account?.id,
      },
    });

    let params = { req: request, res: response, maxAge: expiry };

    setCookie("ABywFrtD", token, params);
    setCookie("qBJpvRne", refresh_tk, params);

    delete user?.account;

    return response.status(200).send({ msg: `Welcome, ${user?.name}`, user });
  } catch (e) {
    return response.status(500).send({ msg: messages.FATAL });
  }
}
