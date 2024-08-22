import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: { value: "" },
  details: { context: "trending", id: "" },
};

const data = createSlice({
  name: "data",
  initialState,
  reducers: {
    destroy: (state, action) => {
      state.post = {};
    },
    setDetails: (state, action) => {
      state.details = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    resetDetails: (state, action) => {
      state.details = { context: "trending", id: "" };
    },
  },
});

export const { setDetails, setSearch, resetDetails, destroy } = data.actions;

export default data.reducer;
