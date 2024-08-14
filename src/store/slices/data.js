import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  context: { name: "", id: "" },
};

const data = createSlice({
  name: "data",
  initialState,
  reducers: {
    destroy: (state, action) => {
      state.post = {};
    },
    setContext: (state, action) => {
      let { type: name, id } = action.payload;
      state.context = { name, id };
    },
  },
});

export const { setContext, destroy } = data.actions;

export default data.reducer;
