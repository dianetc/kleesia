import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menu: { active: false, id: "" },
  tabs: { active: false, id: "" },
  modal: { active: false, id: "" },
  accordian: { active: false, id: "" },
  post: { readMore: { active: false, id: "" } },
};

const ui = createSlice({
  name: "ui",
  initialState,
  reducers: {
    destroy: (state, action) => {
      state.menu = { active: false, id: "" };
      state.tabs = { active: false, id: "" };
      state.modal = { active: false, id: "" };
      state.accordian = { active: false, id: "" };
    },
    toggle: (state, action) => {
      let { type } = action?.payload;

      delete action.payload.type;

      switch (type) {
        case "READMORE":
          state.post.readMore = action.payload;
        case "MENU":
          state.menu = action.payload;
          break;
        case "TAB":
          state.tabs = action.payload;
          break;
        case "MODAL":
          state.modal = action.payload;
          break;
        case "ACCORDIAN":
          state.accordian = action.payload;
          break;
      }
    },
  },
});

export const { toggle, destroy } = ui.actions;

export default ui.reducer;
