import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const SaleMarketingTotalSaleApi = createAsyncThunk(("SaleMarketingTotalSale"), async(obj) => {
    try {
        const body2s = JSON.stringify({
            "Token" : `${obj?.token}`  
            ,"ReqData":`[{\"Token\":\"${obj?.token}\",\"Evt\":\"SalesMarketing_TotalSale\",\"FDate\":\"${(obj?.fdate)}\",\"TDate\":\"${(obj?.tdate)}\"}]`
          });
          const headers2s = {
            "Content-Type":"application/json"
          }
          const response = await axios.post(obj?.apiUrl_kpi, body2s, headers2s);
          const result = {
            DT:{},
            DT1:{},
          }
          if (response?.data?.Status === '200') {
            if(response?.data?.Data?.DT?.length > 0){
              result.DT = (response?.data?.Data?.DT[0]);
            }
            if(response?.data?.Data?.DT1?.length > 0){
              result.DT1 = (response?.data?.Data?.DT1[0]);
            }
            return result;
              // setSaleMTs2(response?.data?.Data?.DT1[0] || []);
              
              
              // return  {DT:response.data.Data.DT, DT1:response.data.Data.DT1} ;
          } else {
            return {}
            // return []; // Empty array if no data or status is not 200
          }  
    } catch (error) {
        console.log(error);
        
    }
})

export const SaleMarketingTotalSale = createSlice({
    name:'SaleMarketingTotalSale',
    initialState: {
        loading:false,
        data:{
            DT:{},
            DT1:{},
        },
        error:null
    },
    reducers:{},
    extraReducers:(builder) => {
        builder.
            addCase(SaleMarketingTotalSaleApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(SaleMarketingTotalSaleApi.fulfilled, (state, action) => {  
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(SaleMarketingTotalSaleApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default SaleMarketingTotalSale.reducer;