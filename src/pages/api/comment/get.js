import prisma from "@/lib/prisma";
import { getParams } from "../lib";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "../auth/user/details";

export default async function GET(request, response) {
  let { method, headers, query } = request ?? {};

  if (method !== "GET")
    return response.status(400).send({ msg: messages?.BAD_REQUEST });

  let user = await getUserRole(headers);
  // if (!user) return response.status(500).send({ msg: messages.UNAUTHORIZED });

  let options = getParams(query);

  options.select = {
    id: true,
    created_at: true,
    body: true,
    votes: true,
    user: { select: { id: true, name: true } },
  };

  options.where = {
    ...options.where,
    user_id: user?.id,
  };

  options.orderBy = {
    created_at: "desc",
  };

  try {
    let comments = await prisma.comments.findMany(options);
    return response.status(200).send(comments);
  } catch (error) {
    return response.status(500).send({ msg: messages?.FATAL });
  }
}
