import prisma from "@/lib/prisma";
import { validateToken } from "../verify";

export async function getUserRole(headers) {
  let { authorization } = headers;
  let token = authorization?.split(" ")[1];

  let status = await validateToken(token);
  if (!status) return false;

  try {
    let data = await prisma.session.findUnique({
      where: { token },
      select: {
        account: {
          select: {
            user: {
              select: {
                id: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return data?.account?.user;
  } catch (error) {
    return false;
  }
}
