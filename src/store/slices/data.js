import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: { value: "" },
  post: { id: "" },
  topic: { id: "" },
  conference: { id: "" },
  context: { name: "" },
};

const data = createSlice({
  name: "data",
  initialState,
  reducers: {
    destroy: (state, action) => {
      state.post = {};
    },
    setContext: (state, action) => {
      let { type } = action.payload;
      delete action?.payload?.type;
      state[type] = action.payload;
    },
    resetContext: (state, action) => {
      state.context = { name: "" };
      state.topic = { id: "" };
      state.post = { id: "" };
      state.conference = { id: "" };
    },
  },
});

export const { setContext, resetContext, destroy } = data.actions;

export default data.reducer;
