import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const ITORAPI = createAsyncThunk('ITOR', async(obj) => {
    try {
        // const url = "http://zen/jo/api-lib/App/KPI_DashBoard";
        const url = obj?.apiUrl_kpi;
        const body = JSON.stringify({
          "Token" : `${obj?.token}`  
          ,"ReqData":`[{\"Token\":\"${obj?.token}\",\"Evt\":\"InventoryTurnOverRatio\",\"FDate\":\"${obj?.fdate}\",\"TDate\":\"${obj?.tdate}\"}]`
        });
        const headers = {
          "Content-Type":"application/json"
        }

        const ITOR_response = await axios.post(url, body, headers);
        let result = {
            DT:{},
            DT1:{},
            DT2:{},
            DT3:{},
        }
        if(ITOR_response?.data?.Data){
        //   setInventoryRatio(ITOR_response?.data?.Data);
          if(ITOR_response?.data?.Data?.DT?.length > 0){
            result.DT = (ITOR_response?.data?.Data?.DT[0]);
          }
          if(ITOR_response?.data?.Data?.DT1?.length > 0){
            result.DT1 = (ITOR_response?.data?.Data?.DT1[0]);
          }
          if(ITOR_response?.data?.Data?.DT2?.length > 0){
            result.DT2 = (ITOR_response?.data?.Data?.DT2[0]);
          }
          if(ITOR_response?.data?.Data?.DT3?.length > 0){
            result.DT3 = (ITOR_response?.data?.Data?.DT3[0]);
          }
          return result;
          // return  {DT:response.data.Data.DT, DT1:response.data.Data.DT1} ;
        } else {
          return {}; // Empty array if no data or status is not 200
        }
      } catch (error) {
        console.log("API Error:", error);
        return {}; // Return empty array on error
      }
})


export const InventoryRatio = createSlice({
    name:'InventoryRatio',
    initialState: {
        loading:false,
        data:{
            DT:{},
            DT1:{},
            DT2:{},
            DT3:{},
        },
        error:null
    },
    reducers:{},
    extraReducers:(builder) => {
        builder.
            addCase(ITORAPI.pending, (state) => {
                state.loading = true;
            })
            .addCase(ITORAPI.fulfilled, (state, action) => {  
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(ITORAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default InventoryRatio.reducer;