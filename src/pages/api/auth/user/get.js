import prisma from "@/lib/prisma";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";

export default async function GET(request, response) {
  let { method, query } = request ?? {};

  if (method != "GET")
    return response.status(405).send({ msg: messages?.BAD_REQUEST });

  let validity = isPayloadValid({
    fields: ["q"],
    payload: query,
  });

  if (typeof validity === "string")
    return response.status(400).send({ msg: validity });

  try {
    let { q } = query;

    let user = await prisma.user.findUnique({
      where: { id: q },
      select: {
        name: true,
        email: true,
      },
    });

    return response.status(200).send({ user });
  } catch (error) {
    return response.status(500).send({ msg: messages?.FATAL });
  }
}
