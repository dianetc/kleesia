import prisma from "@/lib/prisma";
import { validateToken } from "./verify";
import { messages } from "@/lib/request/responses";

export default async function LOGOUT(request, response) {
  let { method, headers } = request;

  if (method !== "POST")
    return response.status(405).send({ msg: messages?.BAD_REQUEST });

  if (!headers?.authorization)
    return response.status(500).send({ msg: "Missing session id" });

  let { authorization } = headers;

  let token = authorization?.split(" ")[1];

  let status = await validateToken(token);

  if (!status) return response.status(500).send({ msg: "Invalid session" });

  let now = new Date();

  try {
    await prisma.session.update({
      where: { token },
      data: {
        updated_at: now,
        expiry: now,
        status: "inactive",
      },
    });
  } catch (error) {
    return response?.status(500).send({ msg: messages?.FATAL });
  }

  return response.status(200).send({ msg: "Bye" });
}
