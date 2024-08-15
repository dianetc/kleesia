import request from "../request";
import { Notify } from "../utils";

export async function createFollow({ context = "user", contx = "" }) {
  try {
    await request.post("follows/create", { context, contx });
    Notify({ status: "success", content: `You have followed ${context}` });
  } catch (error) {
    let msg = error?.response?.data?.msg ?? error?.message;
    Notify({ status: "info", content: msg });
  }
}
