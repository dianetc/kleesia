"user client";
import { Notify } from "@/lib/utils";
import { createSlice } from "@reduxjs/toolkit";
import { hasCookie } from "cookies-next";
import { redirect } from "next/navigation";

let initialState = {
  user: {},
  settings: {},
  account: {},
};

let persisted = createSlice({
  name: "persisted",
  initialState,
  reducers: {
    destroy: (state, action) => {
      state.user = {};
      state.settings = {};
      state.account = {};
    },
    saveSession: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { saveSession, destroy } = persisted.actions;

export function logout(request) {
  return async (dispatch, getState) => {
    if (!hasCookie("ABywFrtD")) return;

    let { type } = getState().persisted.user;
    let user_type = type;

    await request
      .post("auth/signout")
      .then((response) => {
        if (!response?.status === 200) {
          Notify({ status: "error", content: "Something wrong here" });
          return;
        }

        dispatch({ type: "LOGOUT" });
        // user_type !== "client" && redirect("/");
      })
      .catch((error) => {
        Notify({ status: "error", content: error?.message });
      });
  };
}

export default persisted.reducer;
