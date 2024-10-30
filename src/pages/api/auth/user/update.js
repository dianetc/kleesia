import prisma from "@/lib/prisma";
import { getUserRole } from "./details";
import { messages } from "@/lib/request/responses";

export default async function UPDATE(request, response) {
  let { method, headers, body } = request ?? {};

  if (method != "PUT")
    return response.status(405).send({ msg: messages?.METHOD_NOT_ALLOWED });

  let user = await getUserRole(headers);
  if (!user) return response.status(500).send({ msg: messages.UNAUTHORIZED });

  try {
    let updated = await prisma.user.update({
      where: { id: user?.id },
      data: { updated_at: new Date(), ...body },
      select: { email: true },
    });

    return response
      .status(200)
      .send({ msg: `${updated?.email}'s profile is updated` });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ msg: messages?.FATAL });
  }
}
