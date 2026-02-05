import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const AvgCollectionRatioAPI = createAsyncThunk('AvgCollectionRatioAPI', async(obj) => {
    
    try {
        const body2s = JSON.stringify({
            "Token" : `${obj?.token}`  
            ,"ReqData":`[{\"Token\":\"${obj?.token}\",\"Evt\":\"AvgCollectionPeriod\",\"FDate\":\"${(obj?.fdate)}\",\"TDate\":\"${(obj?.tdate)}\"}]`
          });
          const headers2s = {
            "Content-Type":"application/json"
          }
          const response = await axios.post(obj?.apiUrl_kpi, body2s, headers2s);
          const result = {
            DT:{},
            DT1:{},
            DT2:{},
          }
          if (response?.data?.Status === '200') {
              if(response?.data?.Data?.DT?.length > 0){
                result.DT = response?.data?.Data?.DT[0];
              }
              if(response?.data?.Data?.DT1?.length > 0){
                result.DT1 = response?.data?.Data?.DT1[0];
              }
              if(response?.data?.Data?.DT2?.length > 0){
                result.DT2 = response?.data?.Data?.DT2[0];
              }
              // return  {DT:response.data.Data.DT, DT1:response.data.Data.DT1} ;
          }
          return result;
      } catch (error) {
        console.log("API Error:", error);
        return {}; // Return empty array on error
      }
})


export const AvgCollectionRatio = createSlice({
    name:'AvgCollectionRatio',
    initialState: {
        loading:false,
        data:null,
        error:null
    },
    reducers:{},
    extraReducers:(builder) => {
        builder.
            addCase(AvgCollectionRatioAPI.pending, (state) => {
                state.loading = true;
            })
            .addCase(AvgCollectionRatioAPI.fulfilled, (state, action) => {  
                state.loading = false;
                state.data = action?.payload;
                state.error = null;
            })
            .addCase(AvgCollectionRatioAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default AvgCollectionRatio.reducer;