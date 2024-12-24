import { createSlice } from "@reduxjs/toolkit";
import { POST_ApprovalPending } from "./thunk";

const ApprovalPending = createSlice({
    name: "ApprovalPending",
    initialState: {
        data: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetState: (state) => {
            state.loading = false;
            state.data = null;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(POST_ApprovalPending.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(POST_ApprovalPending.fulfilled, (state, action) => {
                state.success = true;
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(POST_ApprovalPending.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetState } = ApprovalPending.actions;
export default ApprovalPending.reducer;
