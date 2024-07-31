import CryptoJS from "crypto-js";
import prisma from "@/lib/prisma";
import { generateHash } from "./lib";
import { setCookie } from "cookies-next";
import { messages } from "@/lib/request/responses";

export default async function SIGNIN(request, response) {
  let { method, body } = request;

  if (method !== "POST")
    return response.status(405).send({ msg: messages?.BAD_REQUEST });

  let { email, password } = body ?? {};

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user?.id)
    return response.status(500).send({ msg: "User does not exist" });

  let account = await prisma.account.findUnique({
    where: {
      user_id: user?.id,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!account?.password)
    return response.status(500).send({ msg: "User does not have an account" });

  let hash = CryptoJS.SHA3(password).toString(CryptoJS.enc.Hex);

  if (hash !== account?.password)
    return response
      .status(500)
      .send({ msg: "Sorry, email/password is incorrect.. please try again" });

  let token = generateHash();
  let refresh_tk = generateHash();

  let now = new Date();
  let expiry = new Date(now.setHours(now.getHours() + 8));

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

    setCookie("IjAjlYED", token, params);
    setCookie("rIrtcZzr", refresh_tk, params);

    return response
      .status(200)
      .send({ msg: `Welcome, ${user?.name}`, data: user });
  } catch (e) {
    return response.status(500).send({ msg: messages.FATAL });
  }
}
