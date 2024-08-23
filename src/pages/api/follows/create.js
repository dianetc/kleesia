import prisma from "@/lib/prisma";
import { payloadMap } from "@/lib/request/lib";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "../auth/user/details";

export default async function CREATE(request, response) {
  let { method, headers, body } = request ?? {};

  if (method !== "POST")
    return response.status(405).send({ msg: messages.METHOD_NOT_ALLOWED });

  let validity = isPayloadValid({
    fields: ["context", "contx"],
    payload: body,
  });

  if (typeof validity === "string")
    return response.status(400).send({ msg: validity });

  let data = payloadMap(body);

  let user = await getUserRole(headers);

  if (!user) return response.status(500).send({ msg: messages.UNAUTHORIZED });

  data.user_id = user?.id;

  let exists = await prisma.follows.findMany({ where: data });

  if (exists.length > 0)
    return response
      .status(500)
      .send({ msg: `You have already followed this ${data?.context}` });

  try {
    await prisma.follows.create({ data });

    return response
      .status(200)
      .send({ msg: `You have followed ${data?.context}` });
  } catch (error) {
    return response.status(500).send({ msg: messages.FATAL });
  }
}
