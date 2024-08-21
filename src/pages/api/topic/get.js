import prisma from "@/lib/prisma";
import { getParams } from "../lib";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "../auth/user/details";

export default async function GET(request, response) {
  let { method, headers, query } = request ?? {};

  if (method !== "GET")
    return response.status(400).send({ msg: messages?.BAD_REQUEST });

  let options = getParams(query);

  if (query?.q === "recent") {
    let user = await getUserRole(headers);

    if (!user) return response.status(500).send({ msg: messages.UNAUTHORIZED });

    let { topic_list } = getFollowIDs(user);

    options.where = {
      ...options.where,
      OR: [{ user_id: user?.id }, { id: { in: topic_list } }],
    };
  }

  options.orderBy = {
    created_at: "desc",
  };

  try {
    let topics = await prisma.topic.findMany(options);
    return response.status(200).send(topics);
  } catch (error) {
    return response.status(500).send({ msg: messages?.FATAL });
  }
}

async function getFollowIDs(user) {
  // Fetch followed channels
  let topics = await prisma.follows.findMany({
    where: { user_id: user?.id, context: "topic" },
    select: { context_id: true },
  });

  let topic_list = topics.map((topic_id) => topic_id?.context_id);

  return { topic_list };
}
