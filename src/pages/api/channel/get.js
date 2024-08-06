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
    // Get user role
    let user = await getUserRole(headers);

    // Fetch followed channels
    let followed_channels = await prisma.follows.findMany({
      where: { user_id: user?.id, context: "channel" },
      select: { context_id: true },
    });

    let followed_channels_list = followed_channels.map(
      (channel_id) => channel_id?.context_id
    );

    // Fetch all authored channels
    let all_channels = await prisma.channel.findMany({
      where: {
        OR: [{ user_id: user?.id }, { id: { in: followed_channels_list } }],
      },
      select: { id: true, name: true },
    });

    return response.status(200).send({ all_channels });
  } catch (error) {
    return response.status(500).send({ msg: messages.FATAL });
  }
}
