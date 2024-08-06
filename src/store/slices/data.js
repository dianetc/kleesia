import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  details: {},
};

const data = createSlice({
  name: "data",
  initialState,
  reducers: {
    destroy: (state, action) => {
      state.details = {};
    },
    setDetailsContext: (state, action) => {
      state.details = action.payload;
    },
  },
});

export const { setDetailsContext, destroy } = data.actions;

export default data.reducer;
