// Utils
import prisma from "@/lib/prisma";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "../auth/user/details";

export default async function GET(request, response) {
  let { method, headers } = request ?? {};

  if (method !== "GET")
    return response.status(405).send({ msg: messages.METHOD_NOT_ALLOWED });

  // Filter individual

  try {
    let options = { select: { id: true, name: true } };

    // Get user role
    let user = await getUserRole(headers);

    // Fetch followed channels
    let followed_conference = await prisma.follows.findMany({
      where: { user_id: user?.id, context: "conference" },
      select: { context_id: true },
    });

    let followed_conference_list = followed_conference.map(
      (topic_id) => topic_id?.context_id
    );

    if (user)
      options.where = {
        OR: [{ user_id: user?.id }, { id: { in: followed_conference_list } }],
      };

    // Fetch all authored channels
    let all_conference = await prisma.conference.findMany(options);

    return response.status(200).send(all_conference);
  } catch (error) {
    return response.status(500).send({ msg: messages.FATAL });
  }
}
