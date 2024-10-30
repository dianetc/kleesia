import prisma from "@/lib/prisma";
import { generateHash } from "./lib";
import { messages } from "@/lib/request/responses";
import { getExpiry } from "@/lib/utils";

export default async function ROTATE(request, response) {
  let { method, headers, body } = request;

  if (method !== "POST")
    return response.status(405).send({ msg: messages?.METHOD_NOT_ALLOWED });

  let { authorization } = headers;
  let { tk: refresh_tk } = body;

  let token = authorization.split(" ")[1];

  let tk = generateHash();
  let rf = generateHash();

  try {
    let now = new Date();
    let expiry = getExpiry(8);

    let session = await prisma.session.update({
      where: { token, refresh_tk },
      data: {
        updated_at: now,
        expiry,
        token: tk,
        refresh_tk: rf,
      },
      select: {
        expiry: true,
        token: true,
        refresh_tk: true,
      },
    });

    return response.status(200).send(session);
  } catch (e) {
    return response.status(500).send({ msg: messages.FATAL });
  }
}
