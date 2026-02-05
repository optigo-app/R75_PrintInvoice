import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchKPIDashboardData } from "../../../GlobalFunctions";

export const SalesMarketing_TotalSaleBusinessClassWiseApi = createAsyncThunk("SalesMarketing_TotalSaleBusinessClassWise", async(obj) => {
    try {
        const response = await fetchKPIDashboardData(obj?.apiUrl_kpi, obj?.token, (obj?.fdate), (obj?.tdate), "SalesMarketing_TotalSaleBusinessClassWise");
        
        if(response?.length > 0){
          return response;
        } else{
          return {}
        }
    } catch (error) {
        console.log(error);
    }
})

export const SalesMarketing_TotalSaleBusinessClassWise = createSlice({
    name:'SalesMarketing_TotalSaleBusinessClassWise',
    initialState: {
        loading:false,
        data:null,
        error:null
    },
    reducers:{},
    extraReducers:(builder) => {
        builder.
            addCase(SalesMarketing_TotalSaleBusinessClassWiseApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(SalesMarketing_TotalSaleBusinessClassWiseApi.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(SalesMarketing_TotalSaleBusinessClassWiseApi.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
                state.error = action.error.message;
            });
    }
})
export default SalesMarketing_TotalSaleBusinessClassWise.reducer;