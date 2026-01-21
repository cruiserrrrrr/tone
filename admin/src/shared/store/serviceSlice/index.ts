import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatService } from "../../services/ServiceService";
import {
    fetchServicesThunk,
    createServiceThunk,
    updateServiceThunk,
    deleteServiceThunk,
} from "./thunks";

interface ServiceState {
    items: ChatService[];
    loading: boolean;
    error: string | null;
}

const initialState: ServiceState = {
    items: [],
    loading: false,
    error: null,
};

const serviceSlice = createSlice({
    name: "services",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchServicesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchServicesThunk.fulfilled,
                (state, action: PayloadAction<ChatService[]>) => {
                    state.loading = false;
                    state.items = action.payload;
                },
            )
            .addCase(fetchServicesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createServiceThunk.fulfilled, (state, action: PayloadAction<ChatService>) => {
                state.items.push(action.payload);
            })
            // Update
            .addCase(updateServiceThunk.fulfilled, (state, action: PayloadAction<ChatService>) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteServiceThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export const { clearError } = serviceSlice.actions;
export default serviceSlice.reducer;
