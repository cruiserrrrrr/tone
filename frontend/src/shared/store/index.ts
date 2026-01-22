import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import chatSettingsReducer from "./chatSettingsSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        chatSettings: chatSettingsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
