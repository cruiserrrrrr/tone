import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthService, { LoginDto } from "../../services/AuthService";

export const loginThunk = createAsyncThunk(
    "user/login",
    async (data: LoginDto, { rejectWithValue }) => {
        try {
            return await AuthService.adminLogin(data);
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to login");
        }
    },
);

export const checkAuthThunk = createAsyncThunk("user/checkAuth", async (_, { rejectWithValue }) => {
    try {
        return await AuthService.checkAuth();
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to check auth");
    }
});

export const logoutThunk = createAsyncThunk("user/logout", async () => {
    try {
        await AuthService.logout();
    } catch (e) {
        // Ignore
    }
});
