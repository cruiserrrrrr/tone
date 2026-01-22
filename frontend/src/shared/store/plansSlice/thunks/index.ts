import { createAsyncThunk } from "@reduxjs/toolkit";
import PlansService from "../../../services/PlansService";

export const fetchPlansThunk = createAsyncThunk(
    "plans/fetchPlans",
    async (_, { rejectWithValue }) => {
        try {
            return await PlansService.getPlans();
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch plans");
        }
    },
);
