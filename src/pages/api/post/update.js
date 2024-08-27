import prisma from "@/lib/prisma";
import { isPayloadValid } from "@/lib/utils";
import { findSertConferences } from "./create";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "../auth/user/details";

export default async function UPDATE(request, response) {
  let { method, headers, query, body } = request ?? {};

  if (method !== "PUT")
    return response.status(405).send({ msg: messages?.METHOD_NOT_ALLOWED });

  let { id: user_id } = await getUserRole(headers);

  let status = isPayloadValid({
    fields: ["id"],
    payload: query,
  });

  if (typeof status === "string")
    return response.status(400).send({ msg: status });

  let { id } = query;

  let options = {};

  if (body?.vote) {
    let check = await isVoted(id, user_id, body?.direction);

    delete body?.vote;
    delete body?.direction;

    options = { select: { votes: true } };

    if (check)
      return response
        .status(500)
        .send({ msg: `You can only ${body?.direction}vote once` });

    delete body?.vote;
    delete body?.direction;
  } else {
    let arxiv_link = await prisma.post.findMany({
      where: { arxiv_link: body?.arxiv_link, NOT: { id: query?.id } },
    });

    if (arxiv_link?.length > 0)
      return response
        .status(500)
        .send({ msg: "This arxiv link has already been used" });

    let conferences = await findSertConferences(body?.conferences, user_id);
    body.conferences = conferences;

    body.co_authors = body.co_authors?.map((author) => author?.id);
  }

  options = {
    where: { id },
    data: {
      updated_at: new Date(),
      ...body,
    },
    ...options,
  };

  try {
    let data = await prisma.post.update(options);
    return response.status(200).send(data);
  } catch (error) {
    console.log(error);
    return response.status(500).send({ msg: messages?.FATAL });
  }
}

async function isVoted(post_id, user_id, direction) {
  try {
    let existing = await prisma.user_Vote_Post.findMany({
      where: { AND: [{ post_id }, { user_id }] },
      select: { id: true },
    });

    if (existing.length === 0) {
      await prisma.user_Vote_Post.create({
        data: { post_id, user_id, direction },
      });

      return false;
    } else {
      let samevote = await prisma.user_Vote_Post.findMany({
        where: { AND: [{ post_id }, { user_id }, { direction }] },
        select: { id: true },
      });

      if (samevote.length === 0) {
        let { id } = existing[0];
        await prisma.user_Vote_Post.update({
          where: { id },
          data: { direction },
        });
        return false;
      } else {
        return true;
      }
    }
  } catch (error) {
    return false;
  }
}
