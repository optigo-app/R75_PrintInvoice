import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const baggingCompletedApi = createAsyncThunk('baggingCompletedApi', async(obj) => {
    try {
      const replacedUrl = (obj?.url)?.replace("M.asmx/Optigo", "report.aspx");
      const body2 = {
        "con":"{\"id\":\"\",\"mode\":\"kpidashboard_baggingcompleted\",\"appuserid\":\"admin@hs.com\"}",
        "p":`{\"fdate\":\"${(obj?.fdate)}\",\"tdate\":\"${(obj?.tdate)}\"}`,  
        "f":"m-test2.orail.co.in (ConversionDetail)"
      }

    const headers2 = {
      Authorization:`Bearer ${obj?.tkn}`,
      YearCode:"e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=",
      version:"v4",
      sv:obj?.sv
    }
    // const prdApi = await axios.post("http://zen/api/report.aspx", body2, { headers: headers2 });
    const response = await axios.post(replacedUrl, body2, { headers: headers2 });

      if(response?.data?.Status === '200'){
        
        if(response?.data?.Data?.rd?.length > 0){  
            return (response?.data?.Data?.rd[0]);
          }else{
            return {};
          }
      }
      } catch (error) {
          console.log(error);
      }
});

export const BaggingCompleted = createSlice({
    name:'BaggingCompleted',
    initialState: {
        loading:false,
        data:null,
        error:null
    },
    reducers:{},
    extraReducers:(builder) => {
        builder.
            addCase(baggingCompletedApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(baggingCompletedApi.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(baggingCompletedApi.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
                state.error = action.error.message;
            });
    }
})
export default BaggingCompleted.reducer;