"use client";

import axios from "axios";
import { getCookie } from "cookies-next";

const request = axios.create({
  baseURL: "/api/",
  timeout: 3000,
});

function checkAuthorization(init) {
  init.interceptors.request.use(async (config) => {
    let token = getCookie("ABywFrtD");

    if (token)
      config.headers = {
        Authorization: `Bearer ${token}`,
      };

    return config;
  });
}

checkAuthorization(request);

export const fetcher = async (...args) => {
  let response = await request.get(...args);
  if (!response?.status === 200) return;
  return response?.data;
};

export default request;
