import request from "../request";
import { Notify } from "../utils";

export async function createFollow({ context = "user", contx = "" }) {
  try {
    let response = await request.post("follows/create", { context, contx });
    return response?.data?.followed;
  } catch (error) {
    let msg = error?.response?.data?.msg ?? error?.message;
    Notify({ status: "info", content: msg });
  }
}
