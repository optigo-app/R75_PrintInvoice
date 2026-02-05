import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const SaleMarketingOrderAPI = createAsyncThunk('SaleMarketingOrderAPI', async(obj) => {
    
    try {
        // const url = "http://zen/jo/api-lib/App/KPI_DashBoard";
        const url = obj?.apiUrl_kpi;
        const body = JSON.stringify({
          "Token" : `${obj?.token}`  
          ,"ReqData":`[{\"Token\":\"${obj?.token}\",\"Evt\":\"SalesMarketing_Order\",\"FDate\":\"${obj?.fdate}\",\"TDate\":\"${obj?.tdate}\"}]`
        });
        const headers = {
          "Content-Type":"application/json"
        }

        const response = await axios.post(url, body, headers);
        const result = {
            DT:null,
            DT1:null,
            popUpList:null
        }
        if (response?.data?.Status === '200') {
            if(response?.data?.Data?.DT?.length > 0){
                result.DT = response?.data?.Data?.DT[0];
                result.DT1 = response?.data?.Data?.DT1;
                result.popUpList = response?.data?.Data;
            }
            return result;
          // return  {DT:response.data.Data.DT, DT1:response.data.Data.DT1} ;
        }
      } catch (error) {
        console.log("API Error:", error);
        return {}; // Return empty array on error
      }
})


export const SaleMarketingOrder = createSlice({
    name:'SaleMarketingOrder',
    initialState: {
        loading:false,
        data:null,
        error:null
    },
    reducers:{},
    extraReducers:(builder) => {
        builder.
            addCase(SaleMarketingOrderAPI.pending, (state) => {
                state.loading = true;
            })
            .addCase(SaleMarketingOrderAPI.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(SaleMarketingOrderAPI.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
                state.error = action.error.message;
            });
    }
})
export default SaleMarketingOrder.reducer;