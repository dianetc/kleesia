import prisma from "@/lib/prisma";
import { isPayloadValid } from "@/lib/utils";
import { messages } from "@/lib/request/responses";
import { getParams } from "../../lib";

export default async function GET(request, response) {
  let { method, query } = request ?? {};

  if (method != "GET")
    return response.status(405).send({ msg: messages?.BAD_REQUEST });

  let options = getParams(query);

  try {
    let user = await prisma.user.findMany(options);

    return response.status(200).send(user);
  } catch (error) {
    return response.status(500).send({ msg: messages?.FATAL });
  }
}
