import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Plan } from "../../services/PlansService";
import { fetchPlansThunk, createPlanThunk, updatePlanThunk, deletePlanThunk } from "./thunks";

interface PlansState {
    items: Plan[];
    loading: boolean;
    error: string | null;
}

const initialState: PlansState = {
    items: [],
    loading: false,
    error: null,
};

const plansSlice = createSlice({
    name: "plans",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchPlansThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlansThunk.fulfilled, (state, action: PayloadAction<Plan[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchPlansThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createPlanThunk.fulfilled, (state, action: PayloadAction<Plan>) => {
                state.items.push(action.payload);
            })
            // Update
            .addCase(updatePlanThunk.fulfilled, (state, action: PayloadAction<Plan>) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete
            .addCase(deletePlanThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export const { clearError } = plansSlice.actions;
export default plansSlice.reducer;
