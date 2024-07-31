import prisma from "@/lib/prisma";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";

export default async function DELETE(request, response) {
  let { method, query } = request ?? {};

  if (method != "DELETE")
    return response.status(400).send({ msg: messages?.BAD_REQUEST });

  let validity = isPayloadValid({
    fields: ["id"],
    payload: query,
  });

  if (typeof validity === "string")
    return response.status(400).send({ msg: validity });

  try {
    let { id } = query ?? {};
    let role = await prisma.User.update({
      where: { id },
      data: {
        status: "deleted",
      },
    });

    return response.status(200).send({ ...role });
  } catch (error) {
    return response.status(500).send({ msg: messages.FATAL });
  }
}
