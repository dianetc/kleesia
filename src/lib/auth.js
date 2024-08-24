import request from "./request";

import { deleteCookie, hasCookie } from "cookies-next";

import { store } from "@/store";
import { destroy, saveSession } from "@/store/slices/persisted";

export let verifySession = () => {
  async function validateToken() {
    let state = store.getState();
    let { user } = state.persisted;

    if (user?.active) return;

    let cookie = hasCookie("ABywFrtD");

    if (!cookie) {
      setStatus(user, false);
      return;
    }

    try {
      await request.get("auth/verify");
      setStatus(user, true);
    } catch (error) {
      setStatus(user, false);
      // store.dispatch(destroy());
      // deleteCookie("ABywFrtD");
      // deleteCookie("qBJpvRne");
    }

    return;
  }

  validateToken();
};

let setStatus = (user, status) => {
  store.dispatch(saveSession({ ...user, active: status }));
};
