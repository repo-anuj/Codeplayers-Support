import {  Daily_Post_Status,Daily_Patch_Status } from "../../../../helpers/fakebackend_helper";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const POST_DailyStatus = createAsyncThunk(
    "DailyStatus/post",
    async ({ body }, thunkAPI) => {
        try {
            
            if (!body) return("error");
            console.log(body);
            const payload={};
            payload.Support=body.SupportID;
            payload.SupportUser=body.SupportUser;
            payload.SupportStatus=body.CurrentStatus;
            payload.Remarks=body.solutionDetails;
            payload.DueDate=body.DueDate;
            console.log("pay ",payload);

            const response = await Daily_Post_Status(payload);

            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const PATCH_DailyStatus=createAsyncThunk(
    "DailyStatus/Patch",
    async({body},thunkAPI)=>{
        try{
            if (!body) return ("error");
            console.log(body);
            const payload = {};
            payload.DailyID=body.dailyID;
            payload.Support = body.SupportID;
            payload.SupportUser = body.SupportUser;
            payload.SupportStatus = body.CurrentStatus;
            payload.Remarks = body.solutionDetails;
            const date = new Date(body.DueDate);
            payload.DueDate = date.toISOString();
            console.log("pay ", payload);

            const response = await Daily_Patch_Status(payload);

            return response;
        }
        catch(error){
            console.log(error.response.data);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


