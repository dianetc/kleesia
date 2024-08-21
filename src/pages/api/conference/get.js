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

  options.select = {
    id: true,
    name: true,
  };

  if (query?.q === "recent") {
    let user = await getUserRole(headers);

    if (!user) return response.status(500).send({ msg: messages.UNAUTHORIZED });

    let { conference_list } = getFollowIDs(user);

    options.where = {
      ...options.where,
      OR: [{ user_id: user?.id }, { id: { in: conference_list } }],
    };
  }

  options.orderBy = {
    created_at: "desc",
  };

  try {
    let conference = await prisma.conference.findMany(options);
    return response.status(200).send(conference);
  } catch (error) {
    return response.status(500).send({ msg: messages?.FATAL });
  }
}

async function getFollowIDs(user) {
  // Fetch followed channels
  let conference = await prisma.follows.findMany({
    where: { user_id: user?.id, context: "conference" },
    select: { context_id: true },
  });

  let conference_list = conference.map((conference) => conference?.context_id);

  return { conference_list };
}
