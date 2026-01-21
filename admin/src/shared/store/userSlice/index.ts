import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, AuthResponse } from "../../services/AuthService";
import { loginThunk, checkAuthThunk } from "./thunks";

interface UserState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        initializeUser: (state) => {
            try {
                const user = localStorage.getItem("admin_user");
                const token = localStorage.getItem("admin_token");
                if (user && token) {
                    state.user = JSON.parse(user);
                    state.token = token;
                }
            } catch (e) {
                // Ignore
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("admin_user");
                localStorage.removeItem("admin_token");
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.access_token;
                if (typeof window !== "undefined") {
                    localStorage.setItem("admin_user", JSON.stringify(action.payload.user));
                    localStorage.setItem("admin_token", action.payload.access_token);
                }
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(checkAuthThunk.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addCase(checkAuthThunk.rejected, (state) => {
                state.user = null;
                state.token = null;
                if (typeof window !== "undefined") {
                    localStorage.removeItem("admin_user");
                    localStorage.removeItem("admin_token");
                }
            });
    },
});

export const { logout, clearError, initializeUser } = userSlice.actions;
export default userSlice.reducer;
