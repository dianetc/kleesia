import prisma from "@/lib/prisma";
import { payloadMap } from "@/lib/request/lib";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";

export default async function CREATE(request, response) {
  let { method, body } = request ?? {};

  if (method !== "POST")
    return response.status(405).send({ msg: messages.METHOD_NOT_ALLOWED });

  let validity = isPayloadValid({
    fields: ["title", "hex"],
    payload: body,
  });

  if (typeof validity === "string")
    return response.status(400).send({ msg: validity });

  let data = payloadMap(body);

  try {
    await prisma.conference.create({ data });
    return response
      .status(200)
      .send({ msg: `Conference: ${data?.name} is posted` });
  } catch (error) {
    return response.status(500).send({ msg: messages.FATAL });
  }
}
