import prisma from "@/lib/prisma";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "../auth/user/details";

export default async function UPDATE(request, response) {
  let { method, headers, query, body } = request ?? {};

  if (method !== "PUT")
    return response.status(400).send({ msg: messages?.BAD_REQUEST });

  let options = {};

  let validity = isPayloadValid({
    fields: ["id"],
    payload: query,
  });

  if (typeof validity === "string")
    return response.status(400).send({ msg: validity });

  let { id } = query;

  if (body?.vote) {
    let { id: user_id } = await getUserRole(headers);
    let check = await isVoted(id, user_id, body?.direction);

    options = { select: { votes: true } };

    if (check)
      return response
        .status(500)
        .send({ msg: `You can only ${body?.direction}vote once` });

    delete body?.vote;
    delete body?.direction;
  }

  options = {
    where: { id },
    data: {
      updated_at: new Date(),
      ...body,
    },
  };

  try {
    let comment = await prisma.comments.update(options);
    return response.status(200).send(comment);
  } catch (error) {
    return response.status(500).send({ msg: messages?.FATAL });
  }
}

async function isVoted(comment_id, user_id, direction) {
  try {
    let existing = await prisma.user_Vote_Comment.findMany({
      where: { AND: [{ comment_id }, { user_id }] },
      select: { id: true },
    });

    if (existing.length === 0) {
      await prisma.user_Vote_Comment.create({
        data: { comment_id, user_id, direction },
      });

      return false;
    } else {
      let samevote = await prisma.user_Vote_Comment.findMany({
        where: { AND: [{ comment_id }, { user_id }, { direction }] },
        select: { id: true },
      });

      if (samevote.length === 0) {
        let { id } = existing[0];
        await prisma.user_Vote_Comment.update({
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
