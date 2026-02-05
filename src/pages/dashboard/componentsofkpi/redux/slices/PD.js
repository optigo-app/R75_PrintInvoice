import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const ProductDevelopmentAPI = createAsyncThunk('PD', async(obj) => {
    try {
        // const url = "http://zen/jo/api-lib/App/KPI_DashBoard";
        const url = obj?.apiUrl_kpi;
        const body = JSON.stringify({
          "Token" : `${obj?.token}`  
          ,"ReqData":`[{\"Token\":\"${obj?.token}\",\"Evt\":\"ProductDevelopment\",\"FDate\":\"${obj?.fdate}\",\"TDate\":\"${obj?.tdate}\"}]`
        });
        const headers = {
          "Content-Type":"application/json"
        }

        const response = await axios.post(url, body, headers);
        
        if (response?.data?.Status === '200') {
            if(response?.data?.Data?.DT?.length > 0){
                return response?.data?.Data?.DT[0];
            }else{
                return {};
            }
          // return  {DT:response.data.Data.DT, DT1:response.data.Data.DT1} ;
        } else {
          return {}; // Empty array if no data or status is not 200
        }
      } catch (error) {
        console.log("API Error:", error);
        return {}; // Return empty array on error
      }
})


export const PD = createSlice({
    name:'PD',
    initialState: {
        loading:false,
        data:null,
        error:null
    },
    reducers:{},
    extraReducers:(builder) => {
        builder.
            addCase(ProductDevelopmentAPI.pending, (state) => {
                state.loading = true;
            })
            .addCase(ProductDevelopmentAPI.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(ProductDevelopmentAPI.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
                state.error = action.error.message;
            });
    }
})

export default PD.reducer;