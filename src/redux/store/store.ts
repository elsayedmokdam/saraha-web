import { configureStore, combineReducers } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice/UserSlice";
import requestsReducer from "./slices/requestsSlice/RequestsSlice";

const rootReducer = combineReducers({
  user: userReducer,
  requests: requestsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState, // initial state
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
