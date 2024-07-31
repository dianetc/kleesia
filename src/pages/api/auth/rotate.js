import prisma from "@/lib/prisma";
import { generateHash } from "./lib";
import { messages } from "@/lib/request/responses";

export default async function ROTATE(request, response) {
  let { method, headers, body } = request;

  if (method !== "POST")
    return response.status(405).send({ msg: messages?.BAD_REQUEST });

  let { authorization } = headers;
  let { tk: refresh_tk } = body;

  let token = authorization.split(" ")[1];

  let tk = generateHash();
  let rf = generateHash();

  try {
    let now = new Date();

    let session = await prisma.session.update({
      where: { token, refresh_tk },
      data: {
        updated_at: new Date(),
        expiry: new Date(now.setHours(now.getHours() + 8)),
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
    return response.status(400).send({ msg: messages.FATAL });
  }
}
