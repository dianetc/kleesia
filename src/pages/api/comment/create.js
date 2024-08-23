import prisma from "@/lib/prisma";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "../auth/user/details";

export default async function CREATE(request, response) {
  let { method, headers, body } = request ?? {};

  if (method !== "POST")
    return response.status(405).send({ msg: messages.METHOD_NOT_ALLOWED });

  let validity = isPayloadValid({
    fields: ["body", "context", "context_id"],
    payload: body,
  });

  if (typeof validity === "string")
    return response.status(400).send({ msg: validity });

  let { id: user_id } = await getUserRole(headers);

  if (!user_id)
    return response.status(500).send({ msg: "User is not authorized" });

  body.user_id = user_id;

  try {
    await prisma.comments.create({ data: body });
    return response.status(200).send({ msg: `Comment is posted` });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ msg: messages.FATAL });
  }
}
