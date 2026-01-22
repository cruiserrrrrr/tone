import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Plan } from "../../services/PlansService";
import { fetchPlansThunk } from "./thunks";

interface PlansState {
    plans: Plan[];
    loading: boolean;
    error: string | null;
}

const initialState: PlansState = {
    plans: [],
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
            .addCase(fetchPlansThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlansThunk.fulfilled, (state, action: PayloadAction<Plan[]>) => {
                state.loading = false;
                state.plans = action.payload;
            })
            .addCase(fetchPlansThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = plansSlice.actions;
export default plansSlice.reducer;
