import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchKPIDashboardData } from "../../../GlobalFunctions";

export const SaleMarketingOrderCompleteApi = createAsyncThunk("SaleMarketingOrderComplete", async(obj) => {
    try {
        const response = await fetchKPIDashboardData(obj?.apiUrl_kpi, obj?.token, (obj?.fdate), (obj?.tdate), "SalesMarketing_OrderCompletion");
        
        if(response?.length > 0){
          return response[0];
        } else{
          return {}
        }
    } catch (error) {
        console.log(error);
        
    }
})

export const SaleMarketingOrderComplete = createSlice({
    name:'SaleMarketingOrderComplete',
    initialState: {
        loading:false,
        data:null,
        error:null
    },
    reducers:{},
    extraReducers:(builder) => {
        builder.
            addCase(SaleMarketingOrderCompleteApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(SaleMarketingOrderCompleteApi.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(SaleMarketingOrderCompleteApi.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
                state.error = action.error.message;
            });
    }
})
export default SaleMarketingOrderComplete.reducer;