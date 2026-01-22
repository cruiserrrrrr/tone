import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    ChatService,
    UserChatSetting,
    ServiceWithSetting,
} from "../../services/ChatSettingsService";
import { fetchServicesThunk, fetchUserSettingsThunk, updateUserSettingsThunk } from "./thunks";

interface ChatSettingsState {
    services: ChatService[];
    servicesWithSettings: ServiceWithSetting[];
    loading: boolean;
    error: string | null;
}

const initialState: ChatSettingsState = {
    services: [],
    servicesWithSettings: [],
    loading: false,
    error: null,
};

const chatSettingsSlice = createSlice({
    name: "chatSettings",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Services
            .addCase(fetchServicesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchServicesThunk.fulfilled,
                (state, action: PayloadAction<ChatService[]>) => {
                    state.loading = false;
                    state.services = action.payload;
                },
            )
            .addCase(fetchServicesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch User Settings
            .addCase(fetchUserSettingsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchUserSettingsThunk.fulfilled,
                (state, action: PayloadAction<ServiceWithSetting[]>) => {
                    state.loading = false;
                    state.servicesWithSettings = action.payload;
                },
            )
            .addCase(fetchUserSettingsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update User Settings
            .addCase(updateUserSettingsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                updateUserSettingsThunk.fulfilled,
                (state, action: PayloadAction<UserChatSetting>) => {
                    state.loading = false;
                    const index = state.servicesWithSettings.findIndex(
                        (s) => s.id === action.payload.serviceId,
                    );
                    if (index !== -1) {
                        state.servicesWithSettings[index].setting = action.payload;
                    }
                },
            )
            .addCase(updateUserSettingsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = chatSettingsSlice.actions;
export default chatSettingsSlice.reducer;
