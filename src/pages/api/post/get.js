import prisma from "@/lib/prisma";
import { getParams } from "../lib";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "../auth/user/details";

export default async function GET(request, response) {
  let { method, headers, query } = request ?? {};

  if (method !== "GET")
    return response.status(400).send({ msg: messages?.BAD_REQUEST });

  let user = await getUserRole(headers);

  let options = getParams(query);

  options.select = {
    id: true,
    created_at: true,
    title: true,
    body: true,
    votes: true,
    conferences: true,
    user: { select: { id: true, name: true } },
    topic_id: true,
    co_authors: true,
  };

  var filter = "many";

  if (query?.id) {
    options.select = {
      ...options.select,
      arxiv_link: true,
    };

    filter = "unique";
  }

  if (query?.q === "recent") {
    if (!user) return response.status(500).send({ msg: messages.UNAUTHORIZED });

    let { topic_list, user_list } = await getFollowIDs(user);

    options.where = {
      ...options.where,
      OR: [{ user_id: { in: user_list } }, { topic_id: { in: topic_list } }],
    };
  }

  options.orderBy = {
    created_at: "desc",
  };

  try {
    let posts = await prisma.post.findMany(options);
    let data = await getPostDetails(filter, user, posts);
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

  let users = await prisma.follows.findMany({
    where: { user_id: user?.id, context: "user" },
    select: { context_id: true },
  });

  let user_list = users.map((user) => user?.context_id);

  return { topic_list, user_list };
}

export async function getPostDetails(filter, user, posts) {
  let cache = posts?.map(async (post) => {
    let isvoted = await prisma.user_Vote_Post.findFirst({
      where: {
        post_id: post?.id,
      },
      select: {
        id: true,
        direction: true,
      },
    });

    let comments = await prisma.comments.count({
      where: {
        context: "post",
        context_id: post?.id,
      },
    });

    let conferences_ids = await prisma.conference.findMany({
      where: {
        id: { in: post?.conferences },
      },
      select: {
        title: true,
      },
    });

    let follows = await prisma.follows.findMany({
      where: { user_id: user?.id, context: "user", context_id: post?.user_id },
      select: { context_id: true },
    });

    let followed = follows?.length > 0 && follows[0]?.context_id ? true : false;

    let conferences = conferences_ids?.map((conference) => conference?.title);

    let co_authors = [];

    if (filter === "unique") {
      let co_author_ids = await prisma.user.findMany({
        where: { id: { in: post?.co_authors } },
        select: { name: true },
      });

      co_authors = co_author_ids?.map((author) => author?.name);
    }

    return {
      ...post,
      user: { ...post?.user, followed },
      voted: isvoted?.id ? true : false,
      direction: isvoted?.direction || "",
      co_authors,
      conferences,
      comments,
    };
  });

  let data = await Promise.all(cache);

  return data;
}
