"user client";
import { Notify } from "@/lib/utils";
import { createSlice } from "@reduxjs/toolkit";
import { hasCookie } from "cookies-next";

let initialState = {
  user: {},
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

    await request
      .post("auth/signout")
      .then((response) => {
        if (!response?.status === 200) {
          Notify({ status: "error", content: "Something wrong here" });
          return;
        }

        dispatch({ type: "LOGOUT" });
      })
      .catch((error) => {
        let { msg } = error?.response?.data ?? error?.message;
        Notify({ status: "error", content: msg });
        dispatch({ type: "LOGOUT" });
      });
  };
}

export default persisted.reducer;
