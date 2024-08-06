"use client";

import { store } from "@/store";
import { Provider } from "react-redux";

let StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
