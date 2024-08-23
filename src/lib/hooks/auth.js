import { deleteCookie, hasCookie } from "cookies-next";

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import request from "../request";

import { store } from "@/store";
import { destroy } from "@/store/slices/persisted";

export let useSession = () => {
  let [isactive, setActive] = useState(false);

  let cookie = hasCookie("ABywFrtD");
  let { user } = useSelector((state) => state.persisted);

  async function validateToken() {
    if (isactive) return;

    if (!cookie) {
      setActive(false);
      return;
    }

    try {
      await request.get("auth/verify");
      setActive(true);
    } catch (error) {
      // store.dispatch(destroy());
      // deleteCookie("ABywFrtD");
      // deleteCookie("qBJpvRne");
    }

    return;
  }

  useEffect(() => {
    validateToken();
  }, [user?.email]);

  return { isactive };
};
