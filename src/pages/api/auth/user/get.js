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

  if (query?.q === "followers") {
    let { user_list } = await getFollowIDs(user);

    options.where = {
      ...options.where,
      OR: [{ id: { in: user_list } }],
    };
  } else if (query?.q === "details") {
    options.where = {
      ...options.where,
      id: user?.id,
    };
  }

  try {
    let users = await prisma.user.findMany(options);

    let data = [];

    switch (query?.q) {
      case "followers":
        data = users.map((user) => {
          return { title: user?.name };
        });
        break;
      case "details":
        let posts = await prisma.post.count({
          where: { user_id: user?.id },
        });

        let comments = await prisma.comments.count({
          where: { user_id: user?.id },
        });

        data = users[0];

        data.posts = posts;
        data.comments = comments;
        break;
      default:
        data = users;
        break;
    }

    return response.status(200).send(data);
  } catch (error) {
    console.log(error);
    return response.status(500).send({ msg: messages?.FATAL });
  }
}

async function getFollowIDs(user) {
  // Fetch followed channels
  let users = await prisma.follows.findMany({
    where: { user_id: user?.id, context: "user" },
    select: { context_id: true },
  });

  let user_list = users.map((user) => user?.context_id);

  return { user_list };
}
