import { messages } from "@/lib/request/responses";

export default async function CREATE(request, response) {
  let { method, body } = request ?? {};

  if (method !== "POST")
    return response.status(405).send({ msg: messages.METHOD_NOT_ALLOWED });

  return response.status(200).send({ msg: "" });
}
