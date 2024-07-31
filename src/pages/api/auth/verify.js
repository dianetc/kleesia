import prisma from "@/lib/prisma";
import { messages } from "@/lib/request/responses";

export default async function VERIFY(request, response) {
  let { method, headers } = request;

  if (method !== "GET")
    return response.status(405).send({ msg: messages?.METHOD_NOT_ALLOWED });

  let { authorization } = headers;

  let token = authorization.split(" ")[1];

  let status = await validateToken(token);

  return response.status(status ? 200 : 400).send({ status });
}

export async function validateToken(token) {
  let now = new Date();

  if (!token) return false;

  try {
    let check = [];

    check = await prisma.session.findMany({
      where: {
        AND: [{ token }, { expiry: { gt: now } }, { status: "active" }],
      },
    });

    return check?.length > 0;
  } catch (error) {
    return false;
  }
}
