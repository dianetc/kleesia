import prisma from "@/lib/prisma";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "../auth/user/details";

export default async function UPDATE(request, response) {
  let { method, headers, query, body } = request ?? {};

  if (method !== "PUT")
    return response.status(400).send({ msg: messages?.BAD_REQUEST });

  let validity = isPayloadValid({
    fields: ["id"],
    payload: query,
  });

  if (typeof validity === "string")
    return response.status(400).send({ msg: validity });

  try {
    let { id } = query;

    if (body?.votes) {
      let { id: user_id } = await getUserRole(headers);
      let check = await isVoted(id, user_id, body?.direction);

      delete body?.direction;

      if (check)
        return response.status(500).send({ msg: "You can only vote once" });
    }

    await prisma.post.update({
      where: { id },
      data: {
        updated_at: new Date(),
        ...body,
      },
    });

    return response.status(200).send({ msg: "Okay" });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ msg: messages?.FATAL });
  }
}

async function isVoted(post, user, direction) {
  try {
    let existing = await prisma.user_Vote_Post.findMany({
      where: {
        AND: [{ post_id: post }, { user_id: user }, { direction }],
      },
      select: {
        id: true,
      },
    });

    if (existing.length === 0) {
      await prisma.user_Vote_Post.create({
        data: {
          post_id: post,
          user_id: user,
          direction,
        },
      });

      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
