import prisma from "@/lib/prisma";
import { messages } from "@/lib/request/responses";

export default async function UPDATE(request, response) {
  let { method, query } = request ?? {};

  if (method != "PUT")
    return response.status(405).send({ msg: messages?.METHOD_NOT_ALLOWED });

  if (!query?.q || !query?.i || !query?.v)
    return response.status(400).send({ msg: "Missing required params" });

  let { q, i, v } = query;

  if (!i.match(/(name)/))
    return response.status(500).send({ msg: "Not allowed" });

  try {
    let user = await prisma.user.update({
      where: {
        id: q,
      },
      data: {
        updated_at: new Date(),
        [i]: v,
      },
      select: {
        email: true,
      },
    });

    return response.status(200).send({ msg: `${user?.email}'s ${i} updated` });
  } catch (error) {
    return response.status(500).send({ msg: messages?.FATAL });
  }
}
