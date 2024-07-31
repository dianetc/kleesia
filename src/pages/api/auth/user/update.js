import prisma from "@/lib/prisma";
import { messages } from "@/lib/request/responses";

export default async function UPDATE(request, response) {
  let { method, query } = request ?? {};

  if (method != "PUT")
    return response.status(405).send({ msg: messages?.BAD_REQUEST });

  if (!query?.email || !query?.q || !query?.v)
    return response.status(400).send({ msg: "Missing required params" });

  let { q, i, v } = query;

  if (!["name"].includes(q))
    return response.status(400).send({ msg: "Not allowed" });

  try {
    await prisma.user.update({
      where: {
        id: q,
      },
      data: {
        updated_at: new Date(),
        [i]: v,
      },
    });

    return response.status(200).send({ msg: `${email}'s ${q} updated` });
  } catch (error) {
    return response.status(500).send({ msg: messages?.FATAL });
  }
}
