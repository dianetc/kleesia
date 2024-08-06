"use client";

import { SWRConfig } from "swr";

let SWR = ({ children }) => {
  return (
    <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
  );
};

export default SWR;
