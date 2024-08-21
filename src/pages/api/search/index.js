import prisma from "@/lib/prisma";
import { isPayloadValid } from "@/lib/utils";
import { getPostDetails } from "../post/get";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "../auth/user/details";

export default async function GET(request, response) {
  let { method, headers, query } = request ?? {};

  if (method !== "GET")
    return response.status(400).send({ msg: messages?.BAD_REQUEST });

  let status = isPayloadValid(["q"]);

  if (typeof status === "string")
    return response.status(500).send({ msg: status });

  let user = await getUserRole(headers);

  if (!user) return response.status(500).send({ msg: messages.UNAUTHORIZED });

  let { q } = query;

  try {
    let topics = await prisma.topic.findMany({
      where: {
        title: {
          contains: q,
        },
      },
      select: {
        id: true,
        created_at: true,
        title: true,
      },
    });

    let posts = await prisma.post.findMany({
      where: {
        title: {
          contains: q,
        },
      },
      select: {
        id: true,
        created_at: true,
        title: true,
        body: true,
        votes: true,
        conferences: true,
        user: { select: { name: true } },
      },
    });

    let data = await getPostDetails(posts);
    let results = topics.concat(data);

    return response.status(200).send(results);
  } catch (error) {
    return response.status(500).send({ msg: messages?.FATAL });
  }
}
