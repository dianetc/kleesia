// Utils
import prisma from "@/lib/prisma";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "../auth/user/details";

export default async function GET(request, response) {
  let { method, query } = request ?? {};

  if (method !== "GET")
    return response.status(405).send({ msg: messages.METHOD_NOT_ALLOWED });

  // Filter individual

  try {
    // Get user role
    let { id } = query ?? {};

    let topic = await prisma.topic.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        rules: true,
        post: {
          select: {
            title: true,
          },
        },
      },
    });

    return response.status(200).send(topic);
  } catch (error) {
    return response.status(500).send({ msg: messages.FATAL });
  }
}
