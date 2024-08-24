import prisma from "@/lib/prisma";
import { getParams } from "../../lib";
import { getUserRole } from "./details";
import { messages } from "@/lib/request/responses";

export default async function GET(request, response) {
  let { method, headers, query } = request ?? {};

  if (method != "GET")
    return response.status(405).send({ msg: messages?.BAD_REQUEST });

  let user = await getUserRole(headers);
  if (!user) return response.status(500).send({ msg: messages.UNAUTHORIZED });

  let options = getParams(query);

  options.where = {
    ...options.where,
    id: user?.id,
  };

  try {
    let user = await prisma.user.findMany(options);
    return response.status(200).send(user);
  } catch (error) {
    return response.status(500).send({ msg: messages?.FATAL });
  }
}
