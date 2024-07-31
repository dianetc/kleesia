import CryptoJS from "crypto-js";
import prisma from "@/lib/prisma";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";

export default async function CREATE(request, response) {
  let { method, body } = request ?? {};

  if (method != "POST")
    return response.status(400).send({ msg: messages?.BAD_REQUEST });

  let validity = isPayloadValid({
    fields: ["name", "email", "password"],
    payload: body,
  });

  if (typeof validity === "string")
    return response.status(400).send({ msg: validity });

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
    });

    return response.status(200).send({ msg: `User ${body?.email} created` });
  } catch (error) {
    return response.status(400).send({ msg: messages?.FATAL });
  }
}
