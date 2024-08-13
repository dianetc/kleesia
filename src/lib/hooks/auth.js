import { hasCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export let useSession = () => {
  let [isactive, setActive] = useState(false);

  let cookie = hasCookie("ABywFrtD");
  let { user } = useSelector((state) => state.persisted);

  useEffect(() => {
    setActive(cookie);
  }, [user, cookie]);

  return { isactive };
};
