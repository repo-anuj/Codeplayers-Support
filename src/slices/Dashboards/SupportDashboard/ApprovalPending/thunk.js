import { Approval_Post_Status } from "../../../../helpers/fakebackend_helper";
import { createAsyncThunk } from "@reduxjs/toolkit";
/*
{
            public bool IsApproved { get; set; }
            public bool IsRejected { get; set; }
            public Guid ApprovedBy { get; set; }
            public DateTime ApprovedOn { get; set; }
            public string ApprovalRemarks { get; set; }
            public Guid SupportID { get; set; }
        }
*/


export const POST_ApprovalPending = createAsyncThunk(
    "ApprovalStatus/post",
    async ({ body }, thunkAPI) => {
        try {

            if (!body) return ("error");
           
            

            const response = await Approval_Post_Status(body);

            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);