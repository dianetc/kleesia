import CryptoJS from "crypto-js";
import prisma from "@/lib/prisma";
import { setCookie } from "cookies-next";
import { generateHash } from "../lib";
import { messages } from "@/lib/request/responses";
import { isPayloadValid, allowed_emails, getExpiry } from "@/lib/utils";

export default async function CREATE(request, response) {
  let { method, body } = request ?? {};

  if (method != "POST")
    return response.status(405).send({ msg: messages?.BAD_REQUEST });

  let validity = isPayloadValid({
    fields: ["name", "email", "password"],
    payload: body,
  });

  if (typeof validity === "string")
    return response.status(400).send({ msg: validity });

  if (!body?.email.match(allowed_emails))
    return response
      .status(500)
      .send({ msg: "Sorry, only .edu emails are allowed.. Try again" });

  let exists = await prisma.user.findUnique({
    where: { email: body?.email },
  });

  if (exists)
    return response.status(500).send({ msg: "This email already exists" });

  let user = body;
  let hash = CryptoJS.SHA3(body?.password).toString(CryptoJS.enc.Hex);

  delete user?.password;

  try {
    user = await prisma.user.create({
      data: {
        ...user,
        account: {
          create: {
            password: hash,
          },
        },
      },
      select: {
        name: true,
        email: true,
        account: {
          select: {
            id: true,
          },
        },
      },
    });

    let expiry = getExpiry(8);
    let nw_token = generateHash();
    let nw_refresh_tk = generateHash();

    await prisma.session.create({
      data: {
        expiry,
        token: nw_token,
        refresh_tk: nw_refresh_tk,
        account_id: user?.account?.id,
      },
    });

    let params = { req: request, res: response, maxAge: expiry };

    setCookie("ABywFrtD", nw_token, params);
    setCookie("qBJpvRne", nw_refresh_tk, params);

    delete user?.account;

    return response
      .status(200)
      .send({ msg: `User ${body?.email} created`, data: user });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ msg: messages?.FATAL });
  }
}
