import prisma from "@/lib/prisma";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";

export default async function UPDATE(request, response) {
  let { method, query, body } = request ?? {};

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
