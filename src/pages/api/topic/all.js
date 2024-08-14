// Utils
import prisma from "@/lib/prisma";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "../auth/user/details";

export default async function ALL(request, response) {
  let { method, headers } = request ?? {};

  if (method !== "GET")
    return response.status(405).send({ msg: messages.METHOD_NOT_ALLOWED });

  // Filter individual

  try {
    // Get user role
    let user = await getUserRole(headers);

    // Fetch followed channels
    let followed_topics = await prisma.follows.findMany({
      where: { user_id: user?.id, context: "topic" },
      select: { context_id: true },
    });

    let followed_topics_list = followed_topics.map(
      (topic_id) => topic_id?.context_id
    );

    // Fetch all authored channels
    let all_topics = await prisma.topic.findMany({
      where: {
        OR: [{ user_id: user?.id }, { id: { in: followed_topics_list } }],
      },
      select: { id: true, name: true },
    });

    return response.status(200).send(all_topics);
  } catch (error) {
    return response.status(500).send({ msg: messages.FATAL });
  }
}
