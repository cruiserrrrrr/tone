import { createAsyncThunk } from "@reduxjs/toolkit";
import ChatSettingsService, {
    UpdateUserChatSettingDto,
} from "../../../services/ChatSettingsService";

export const fetchServicesThunk = createAsyncThunk(
    "chatSettings/fetchServices",
    async (_, { rejectWithValue }) => {
        try {
            return await ChatSettingsService.getServices();
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch services");
        }
    },
);

export const fetchUserSettingsThunk = createAsyncThunk(
    "chatSettings/fetchUserSettings",
    async (_, { rejectWithValue }) => {
        try {
            return await ChatSettingsService.getUserSettings();
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch user settings");
        }
    },
);

export const updateUserSettingsThunk = createAsyncThunk(
    "chatSettings/updateUserSettings",
    async (data: UpdateUserChatSettingDto, { rejectWithValue }) => {
        try {
            return await ChatSettingsService.updateUserSettings(data);
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update user settings");
        }
    },
);
