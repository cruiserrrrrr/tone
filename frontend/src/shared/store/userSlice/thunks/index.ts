import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthService, { LoginDto, RegisterDto } from "../../../services/AuthService";

export const loginThunk = createAsyncThunk(
    "user/login",
    async (data: LoginDto, { rejectWithValue }) => {
        try {
            const response = await AuthService.login(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Login failed");
        }
    },
);

export const registerThunk = createAsyncThunk(
    "user/register",
    async (data: RegisterDto, { rejectWithValue }) => {
        try {
            const response = await AuthService.register(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Registration failed");
        }
    },
);
