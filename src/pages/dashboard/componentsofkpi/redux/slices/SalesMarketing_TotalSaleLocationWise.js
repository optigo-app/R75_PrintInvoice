import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchKPIDashboardData } from "../../../GlobalFunctions";

export const SalesMarketing_TotalSaleLocationWiseApi = createAsyncThunk("SalesMarketing_TotalSaleLocationWise", async(obj) => {
    try {
        const response = await fetchKPIDashboardData(obj?.apiUrl_kpi, obj?.token, (obj?.fdate), (obj?.tdate), "SalesMarketing_TotalSaleLocationWise");
        
        if(response?.length > 0){
          return response;
        } else{
          return {}
        }
    } catch (error) {
        console.log(error);
    }
})

export const SalesMarketing_TotalSaleLocationWise = createSlice({
    name:'SalesMarketing_TotalSaleLocationWise',
    initialState: {
        loading:false,
        data:[],
        error:null
    },
    reducers:{},
    extraReducers:(builder) => {
        builder.
            addCase(SalesMarketing_TotalSaleLocationWiseApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(SalesMarketing_TotalSaleLocationWiseApi.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(SalesMarketing_TotalSaleLocationWiseApi.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
                state.error = action.error.message;
            });
    }
})
export default SalesMarketing_TotalSaleLocationWise.reducer;