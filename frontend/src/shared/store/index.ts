import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import chatSettingsReducer from "./chatSettingsSlice";
import plansReducer from "./plansSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        chatSettings: chatSettingsReducer,
        plans: plansReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
