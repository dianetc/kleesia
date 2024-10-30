import { thunk } from "redux-thunk";
import { ui, persisted, data } from "./slices";
import storage from "redux-persist/lib/storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const unpersisted = combineReducers({
  ui,
  data,
});

const allreducers = combineReducers({
  unpersisted,
  persisted,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    state = undefined;
    storage.removeItem("persist:1j1q2pRR11L6ghHn");
  }

  return allreducers(state, action);
};

const persist = persistReducer(
  {
    key: "1j1q2pRR11L6ghHn",
    storage,
    whitelist: ["persisted"],
  },
  rootReducer
);

export const store = configureStore({
  reducer: persist,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
