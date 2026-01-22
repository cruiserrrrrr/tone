import { createAsyncThunk } from "@reduxjs/toolkit";
import PlansService, { CreatePlanDto, UpdatePlanDto } from "../../services/PlansService";

export const fetchPlansThunk = createAsyncThunk(
    "plans/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await PlansService.getAll();
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch plans");
        }
    },
);

export const createPlanThunk = createAsyncThunk(
    "plans/create",
    async (data: CreatePlanDto, { rejectWithValue }) => {
        try {
            return await PlansService.create(data);
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to create plan");
        }
    },
);

export const updatePlanThunk = createAsyncThunk(
    "plans/update",
    async ({ id, data }: { id: number; data: UpdatePlanDto }, { rejectWithValue }) => {
        try {
            return await PlansService.update(id, data);
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update plan");
        }
    },
);

export const deletePlanThunk = createAsyncThunk(
    "plans/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await PlansService.remove(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to delete plan");
        }
    },
);
