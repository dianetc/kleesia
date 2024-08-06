import prisma from "@/lib/prisma";
import { messages } from "@/lib/request/responses";
import { payloadMap } from "@/lib/request/lib";
import { isPayloadValid } from "@/lib/utils";
import { getUserRole } from "../auth/user/details";

export default async function CREATE(request, response) {
  let { method, headers, body } = request ?? {};

  if (method !== "POST")
    return response.status(405).send({ msg: messages.METHOD_NOT_ALLOWED });

  let validity = isPayloadValid({
    fields: ["name"],
    payload: body,
  });

  if (typeof validity === "string")
    return response.status(400).send({ msg: validity });

  let data = payloadMap(body);

  let user = await getUserRole(headers);

  if (!user) return response?.status(500).send({ msg: "" });

  data.user_id = user?.id;

  try {
    await prisma.channel.create({ data });
    return response
      .status(200)
      .send({ msg: `Channel ${data?.name} is created` });
  } catch (error) {
    return response.status(500).send({ msg: messages.FATAL });
  }
}
