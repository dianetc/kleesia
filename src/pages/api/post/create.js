import prisma from "@/lib/prisma";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "../auth/user/details";

export default async function CREATE(request, response) {
  let { method, headers, body } = request ?? {};

  if (method !== "POST")
    return response.status(405).send({ msg: messages.METHOD_NOT_ALLOWED });

  let status = isPayloadValid(["title", "body", "topic_id"], body);

  if (typeof status === "string")
    return response.status(500).send({ msg: status });

  let { id: user_id } = await getUserRole(headers);

  if (!user_id)
    return response.status(500).send({ msg: "User is not authorized" });

  let existing = await prisma.post.findMany({
    where: { title: { contains: body?.title } },
  });

  if (existing?.length > 0)
    return response.status(500).send({ msg: "This post already exists" });

  let conferences = await findSertConferences(body?.conferences, user_id);
  body.conferences = conferences;

  try {
    await prisma.post.create({ data: { ...body, user_id } });

    return response.status(200).send({ msg: `Post ${body?.title} created` });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ msg: messages.FATAL });
  }
}

// I know, the name is abit cliché..
async function findSertConferences(list, user_id) {
  let existing = await prisma.conference.findMany({
    where: { name: { in: list } },
    select: { id: true, name: true },
  });

  let not_found = list
    ?.filter((name) => !existing?.map((exist) => exist?.name).includes(name))
    .map((name) => {
      return { name, user_id };
    });

  await prisma.conference.createMany({
    data: not_found,
  });

  let created = await prisma.conference.findMany({
    where: { name: { in: not_found?.map((obj) => obj?.name) } },
    select: { id: true },
  });

  return existing.concat(created).map((obj) => obj?.id);
}
