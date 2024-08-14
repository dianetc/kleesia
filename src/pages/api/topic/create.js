import prisma from "@/lib/prisma";
import { messages } from "@/lib/request/responses";
import { payloadMap } from "@/lib/request/lib";
import { isPayloadValid } from "@/lib/utils";
import { getUserRole } from "../auth/user/details";

export default async function CREATE(request, response) {
  let { method, headers, body } = request ?? {};

  if (method !== "POST")
    return response.status(405).send({ msg: messages.METHOD_NOT_ALLOWED });

  let status = isPayloadValid(["name", "rules"]);

  if (typeof status === "string")
    return response.status(500).send({ msg: status });

  let { id: user_id } = await getUserRole(headers);

  if (!user_id)
    return response.status(500).send({ msg: "User is not authorized" });

  let existing = await prisma.topic.findMany({
    where: { name: { contains: body?.name } },
  });

  if (existing?.length > 0)
    return response.status(500).send({ msg: "This topic already exists" });

  try {
    await prisma.topic.create({ data: { ...body, user_id } });
    return response.status(200).send({ msg: `Topic ${body?.name} is created` });
  } catch (error) {
    return response.status(500).send({ msg: messages.FATAL });
  }
}
