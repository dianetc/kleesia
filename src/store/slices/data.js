import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  post: { id: "" },
};

const data = createSlice({
  name: "data",
  initialState,
  reducers: {
    destroy: (state, action) => {
      state.post = {};
    },
    setDetailsContext: (state, action) => {
      state.post = action.payload;
    },
  },
});

export const { setDetailsContext, destroy } = data.actions;

export default data.reducer;
