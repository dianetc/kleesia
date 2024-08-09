import { hasCookie } from "cookies-next";
import { useState, useEffect } from "react";

export let useSession = () => {
  let [isactive, setActive] = useState(false);
  let cookie = hasCookie("ABywFrtD");

  useEffect(() => {
    setActive(cookie);
  }, [cookie]);

  return { isactive };
};
