"use client";

import axios from "axios";
import { getCookie } from "cookies-next";

const request = axios.create({
  baseURL: "/api/",
  timeout: 5000,
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

// Add these new functions for the forget password flow
export const forgotPassword = async (email) => {
  return request.post("auth/forget-password", { email });
};

export const verifyTempPassword = async (email, tempPassword) => {
  return request.post("auth/verify-temp-password", { email, tempPassword });
};

export const resetPassword = async (email, tempPassword, newPassword) => {
  return request.post("auth/reset-password", { email, tempPassword, newPassword });
};

export const fetcher = async (...args) => {
  let response = await request.get(...args);
  if (!response?.status === 200) return;
  return response?.data;
};

export default request;
