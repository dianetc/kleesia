"use client";

import axios from "axios";

const request = axios.create({
  baseURL: "/api/",
  timeout: 3000,
});

function checkAuthorization(init) {
  init.interceptors.request.use(async (config) => {
    let token = getCookie("IjAjlYED");

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
