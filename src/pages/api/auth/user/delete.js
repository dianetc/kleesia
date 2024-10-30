import prisma from "@/lib/prisma";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";

export default async function DELETE(request, response) {
  let { method, query } = request ?? {};

  if (method != "DELETE")
    return response.status(405).send({ msg: messages?.BAD_REQUEST });

  let validity = isPayloadValid({
    fields: ["q"],
    payload: query,
  });

  if (typeof validity === "string")
    return response.status(400).send({ msg: validity });

  try {
    let { q: user_id } = query ?? {};
    let user = await prisma.account.update({
      where: { user_id },
      data: {
        status: "deleted",
      },
      select: {
        status: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return response.status(200).send(user);
  } catch (error) {
    return response.status(500).send({ msg: messages.FATAL });
  }
}
