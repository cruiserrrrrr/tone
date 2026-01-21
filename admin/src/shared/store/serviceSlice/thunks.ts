import { createAsyncThunk } from "@reduxjs/toolkit";
import ServiceService, {
    CreateChatServiceDto,
    UpdateChatServiceDto,
} from "../../services/ServiceService";

export const fetchServicesThunk = createAsyncThunk(
    "services/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await ServiceService.getAll();
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch services");
        }
    },
);

export const createServiceThunk = createAsyncThunk(
    "services/create",
    async (data: CreateChatServiceDto, { rejectWithValue }) => {
        try {
            return await ServiceService.create(data);
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to create service");
        }
    },
);

export const updateServiceThunk = createAsyncThunk(
    "services/update",
    async ({ id, data }: { id: number; data: UpdateChatServiceDto }, { rejectWithValue }) => {
        try {
            return await ServiceService.update(id, data);
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update service");
        }
    },
);

export const deleteServiceThunk = createAsyncThunk(
    "services/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await ServiceService.remove(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to delete service");
        }
    },
);
