import prisma from "@/lib/prisma";
import { getParams } from "../lib";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "../auth/user/details";

export default async function GET(request, response) {
  let { method, headers, query } = request ?? {};

  if (method !== "GET")
    return response.status(400).send({ msg: messages?.BAD_REQUEST });

  let options = getParams(query);

  let user = await getUserRole(headers);

  if (query?.q?.match(/(recent|profile)/)) {
    if (!user) return response.status(500).send({ msg: messages.UNAUTHORIZED });

    let { topic_list } = await getFollowIDs(user);

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
    let data = await getTopicDetails(user, topics);
    return response.status(200).send(data);
  } catch (error) {
    console.log(error);
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

export async function getTopicDetails(user, topics) {
  let cache = topics?.map(async (topic) => {
    let follow = await prisma.follows.findMany({
      where: { user_id: user?.id, context: "topic", context_id: topic?.id },
      select: { context_id: true },
    });

    let followed = follow[0]?.context_id ? true : false;

    let followers = await prisma.follows.count({
      where: { context: "topic", context_id: topic?.id },
    });

    let online = await prisma.follows.count({
      where: {
        context: "topic",
        context_id: topic?.id,
        user: { status: "online" },
      },
    });

    return {
      ...topic,
      online,
      followed,
      followers,
    };
  });

  let data = await Promise.all(cache);

  return data;
}
