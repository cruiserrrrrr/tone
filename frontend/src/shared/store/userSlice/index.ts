import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, AuthResponse } from "../../services/AuthService";
import { loginThunk, registerThunk, checkAuthThunk } from "./thunks";

declare const chrome: any;

interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const loadState = (): Partial<UserState> => {
    try {
        if (typeof window === "undefined") return {};
        const user = localStorage.getItem("user");
        return {
            user: user ? JSON.parse(user) : null,
        };
    } catch (e) {
        return {};
    }
};

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
    // ...loadState(),
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.error = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("user");
            }
            if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
                chrome.storage.local.remove(["user", "token"]);
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
                if (typeof window !== "undefined") {
                    localStorage.setItem("user", JSON.stringify(action.payload.user));
                    window.postMessage(
                        {
                            type: "SEND_TOKEN",
                            user: action.payload.user,
                        },
                        "*",
                    );
                }
                if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
                    chrome.storage.local.set({
                        user: action.payload.user,
                    });
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
                if (typeof window !== "undefined") {
                    localStorage.setItem("user", JSON.stringify(action.payload.user));
                    window.postMessage(
                        {
                            type: "SEND_TOKEN",
                            user: action.payload.user,
                        },
                        "*",
                    );
                }
                if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
                    chrome.storage.local.set({
                        user: action.payload.user,
                    });
                }
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(checkAuthThunk.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addCase(checkAuthThunk.rejected, (state) => {
                state.user = null;
                if (typeof window !== "undefined") {
                    localStorage.removeItem("user");
                }
            });
    },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
