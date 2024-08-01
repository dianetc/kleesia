import prisma from "@/lib/prisma";
import { messages } from "@/lib/request/responses";
import { payloadMap } from "../auth/lib";
import { isPayloadValid } from "@/lib/utils";

export default async function CREATE(request, response) {
  let { method, body } = request ?? {};

  if (method !== "POST")
    return response.status(405).send({ msg: messages.METHOD_NOT_ALLOWED });

  let validity = isPayloadValid({
    fields: ["name"],
    payload: body,
  });

  if (typeof validity === "string")
    return response.status(400).send({ msg: validity });

  let data = payloadMap(body);

  try {
    await prisma.channel.create({ data });
    return response
      .status(200)
      .send({ msg: `Channel ${data?.name} is created` });
  } catch (error) {
    return response.status(500).send({ msg: messages.FATAL });
  }
}
