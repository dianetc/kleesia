import prisma from "@/lib/prisma";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";

export async function getUserId({ email }) {
  try {
    let user = await prisma.User.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    return user?.id;
  } catch (e) {
    return false;
  }
}

export default async function GET(request, response) {
  let { method, query } = request ?? {};

  if (method != "GET")
    return response.status(400).send({ msg: messages?.BAD_REQUEST });

  let validity = isPayloadValid({
    fields: ["id"],
    payload: query,
  });

  if (typeof validity === "string")
    return response.status(400).send({ msg: validity });

  try {
    let { id } = query;

    let user = await prisma.user.findUnique({
      where: { id },
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
