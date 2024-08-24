"use client";

import { useSelector } from "react-redux";
//
import Main from "./main";
import Profile from "./profile";

let Page = () => {
  let { context } = useSelector((state) => state.unpersisted.data.details);

  switch (context) {
    case "profile":
      return <Profile />;
    default:
      return <Main />;
  }
};

export default Page;
