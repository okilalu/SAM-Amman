// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import deviceReducer from "./slices/deviceSlice";
import dataReducer from "./slices/dataSlicer";

const store = configureStore({
  reducer: {
    user: userReducer,
    device: deviceReducer,
    data: dataReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
