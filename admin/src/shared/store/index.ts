import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import serviceReducer from "./serviceSlice";
import plansReducer from "./plansSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        services: serviceReducer,
        plans: plansReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
