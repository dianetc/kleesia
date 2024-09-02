import prisma from "@/lib/prisma";
import { isPayloadValid, escapeSearchString} from "@/lib/utils";
import { messages } from "@/lib/request/responses";

import { getPostDetails } from "../post/get";
import { getUserRole } from "../auth/user/details";

export default async function GET(request, response) {
  let { method, headers, query } = request ?? {};

  if (method !== "GET")
    return response.status(400).send({ msg: messages?.BAD_REQUEST });

  let status = isPayloadValid(["q"]);

  if (typeof status === "string")
    return response.status(500).send({ msg: status });

  // Remove the user authentication check
  let user = await getUserRole(headers);
  // if (!user) return response.status(500).send({ msg: messages.UNAUTHORIZED });

  let { q } = query;

  const formattedSearch = escapeSearchString(q);

  try {
    let options = {
      where: {
        title: {
          search: formattedSearch,
          mode: 'insensitive',
        },
      },
      select: { id: true, created_at: true, title: true },
    };

    let topics = await prisma.topic.findMany(options);

    // * Un-comment the line below to include search with post body
    // options.where = { OR: [options.where, { body: { contains: q } }] };
    // *

    options.select = {
      ...options.select,
      body: true,
      votes: true,
      conferences: true,
      user: { select: { name: true } },
      co_authors: true, 
    };

    let posts = await prisma.post.findMany(options);
    let post_details = await getPostDetails(user, posts);

    let data = [];

    if (topics?.length > 0) topics?.forEach((topic) => data.push(topic));
    if (post_details) post_details?.forEach((post) => data.push(post));

    return response.status(200).send(data);
  } catch (error) {
    console.log(error);
    return response.status(500).send({ msg: messages?.FATAL });
  }
}
