import prisma from "@/lib/prisma";
import { validateToken } from "./verify";
import { deleteCookie } from "cookies-next";
import { messages } from "@/lib/request/responses";
import { getUserRole } from "./user/details";

export default async function LOGOUT(request, response) {
  let { method, headers } = request;

  if (method !== "POST")
    return response.status(405).send({ msg: messages?.BAD_REQUEST });

  if (!headers?.authorization)
    return response.status(500).send({ msg: "Missing session id" });

  let { authorization } = headers;

  let token = authorization?.split(" ")[1];

  let user = await getUserRole(headers);

  let status = await validateToken(token);

  if (!status)
    return response.status(500).send({ msg: "Session Does not exist" });

  let now = new Date();

  try {
    await prisma.session.update({
      where: { token },
      data: {
        updated_at: now,
        expiry: now,
        status: "inactive",
      },
    });

    let params = { req: request, res: response };

    deleteCookie("ABywFrtD", params);
    deleteCookie("qBJpvRne", params);

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        status: "offline",
      },
    });

    return response.status(200).send({ msg: "Bye" });
  } catch (error) {
    console.log(error);
    return response?.status(500).send({ msg: messages?.FATAL });
  }
}
