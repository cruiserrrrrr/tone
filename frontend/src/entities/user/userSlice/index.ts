import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, AuthResponse } from "../../../shared/services/AuthService";
import { loginThunk, registerThunk } from "./thunks";

interface UserState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const loadState = (): Partial<UserState> => {
    try {
        if (typeof window === "undefined") return {};
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        return {
            user: user ? JSON.parse(user) : null,
            token: token || null,
        };
    } catch (e) {
        return {};
    }
};

const initialState: UserState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    ...loadState(),
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.access_token;
                if (typeof window !== "undefined") {
                    localStorage.setItem("user", JSON.stringify(action.payload.user));
                    localStorage.setItem("token", action.payload.access_token);
                }
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(registerThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerThunk.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.access_token;
                if (typeof window !== "undefined") {
                    localStorage.setItem("user", JSON.stringify(action.payload.user));
                    localStorage.setItem("token", action.payload.access_token);
                }
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {logout, clearError} = userSlice.actions;
export default userSlice.reducer;
