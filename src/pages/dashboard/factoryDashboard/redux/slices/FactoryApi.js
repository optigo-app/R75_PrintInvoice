import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const location = window.location;

let url = '';

if(location?.hostname?.toLowerCase() === "localhost" || location?.hostname?.toLowerCase() === "zen" || location?.hostname?.toLowerCase() === "nzen"){
    url = "http://nzen/jo/api-lib/App/Factory_DashBoard";
}else{
    url = "https://view.optigoapps.com/linkedapp/App/Factory_DashBoard";
}


export const fetchSummary_Purchase = createAsyncThunk('factory/Summary_Purchase', async(obj) => {
        
        try {

            const body = {
                "Token" : `${obj?.tkn}`  
                ,"ReqData":`[{\"Token\":\"${obj?.tkn}\",\"Evt\":\"Summary_Purchase\",\"FDate\":\"${obj?.fdate}\",\"TDate\":\"${obj?.tdate}\",\"MetalTypeId\":\"${obj?.metalType}\",\"CategoryId\":\"${obj?.category}\"}]`
              }

            const response = await axios.post(url, body);
            return response;


        } catch (error) {
            console.log(error);
            throw new Error(error.response ? error.response.data : error.message);
        }
});

export const fetchMaster = createAsyncThunk('fetch/Master', async(obj) => {
        try {
            const body = {
                "Token" : `${obj?.tkn}`  
                ,"ReqData":`[{\"Token\":\"${obj?.tkn}\",\"Evt\":\"Master\"}]`
              }

            const response = await axios.post(url, body);
            return response;
        } catch (error) {
            console.log(error);
            throw new Error(error.response ? error.response.data : error.message);
        }
});

export const fetchSummary_SaleData = createAsyncThunk('factory/Summary_Sale', async(obj) => {
        try {
            const body = {
                "Token" : `${obj?.tkn}`  
                ,"ReqData":`[{\"Token\":\"${obj?.tkn}\",\"Evt\":\"Summary_Sale\",\"FDate\":\"${obj?.fdate}\",\"TDate\":\"${obj?.tdate}\",\"MetalTypeId\":\"${obj?.metalType}\",\"CategoryId\":\"${obj?.category}\"}]`
              }

            const response = await axios.post(url, body);
            return response;
        } catch (error) {
            console.log(error);
            throw new Error(error.response ? error.response.data : error.message);
        }
});

export const fetchVendor_Margin_Per_CaratData = createAsyncThunk('factory/Vendor_Margin_Per_Carat', async(obj) => {
        try {
            const body = {
                "Token" : `${obj?.tkn}`    
                ,"ReqData":`[{\"Token\":\"${obj?.tkn}\",\"Evt\":\"Vendor_Margin_Per_Carat\",\"FDate\":\"${obj?.fdate}\",\"TDate\":\"${obj?.tdate}\",\"MetalTypeId\":\"${obj?.metalType}\",\"CategoryId\":\"${obj?.category}\"}]`
              }

            const response = await axios.post(url, body);
            return response;
        } catch (error) {
            console.log(error);
            throw new Error(error.response ? error.response.data : error.message);
        }
});

export const fetchVendor_In_Out_DurationData = createAsyncThunk('factory/Vendor_In_Out_Duration', async(obj) => {
        try {
            const body = {
                "Token" : `${obj?.tkn}`  
                ,"ReqData":`[{\"Token\":\"${obj?.tkn}\",\"Evt\":\"Vendor_In_Out_Duration\",\"FDate\":\"${obj?.fdate}\",\"TDate\":\"${obj?.tdate}\",\"MetalTypeId\":\"${obj?.metalType}\",\"CategoryId\":\"${obj?.category}\"}]`
              }

            const response = await axios.post(url, body);
            
            return response;
        } catch (error) {
            console.log(error);
            throw new Error(error.response ? error.response.data : error.message);
        }
});

export const FactoryApi = createSlice({
  name:'factory',
  initialState:{
    Summary_Purchase : {
        loading:false,
        data:null,
        error:null
    },
    Master : {
        loading:false,
        data:null,
        error:null
    },
    Summary_Sale:{
        loading:false,
        data:null,
        error:null
    },
    Vendor_Margin_Per_Carat:{
        loading:false,
        data:null,
        error:null
    },
    Vendor_In_Out_Duration:{
        loading:false,
        data:null,
        error:null
    }
  },
  reducers: {},
  extraReducers:(builder) => {
        builder
        .addCase(fetchSummary_Purchase.pending, (state) => {
            state.Summary_Purchase.loading = true;
            state.Summary_Purchase.data = null;
            state.Summary_Purchase.error = null;
        })
        .addCase(fetchSummary_Purchase.fulfilled, (state, action) => {
            const response = action?.payload;
        
            const data = response?.status === 200 && response?.data?.Status === '200'
                ? response?.data?.Data
                : { DT: [], DT1: [] };
        
            state.Summary_Purchase.loading = false;
            state.Summary_Purchase.data = data;
            state.Summary_Purchase.error = null;
        })
        .addCase(fetchSummary_Purchase.rejected, (state, action) => {
            state.Summary_Purchase.loading = false;
            state.Summary_Purchase.data = [];
            state.Summary_Purchase.error = action.error.message;
        })

        .addCase(fetchMaster.pending, (state) => {
            state.Master.loading = true;
            state.Master.data = null;
            state.Master.error = null;
        })
        .addCase(fetchMaster.fulfilled, (state, action) => {
            
            const response = action?.payload;
        
            const data = response?.status === 200 && response?.data?.Status === '200'
                ? response?.data?.Data
                : { DT: [], DT1: [], DT2: [] };
        
            state.Master.loading = false;
            state.Master.data = data;
            state.Master.error = null;
        })
        .addCase(fetchMaster.rejected, (state, action) => {
            state.Master.loading = false;
            state.Master.data = null;
            state.Master.error = action.error.message;
        })

        .addCase(fetchSummary_SaleData.pending, (state) => {
            state.Summary_Sale.loading = true;
            state.Summary_Sale.data = null;
            state.Summary_Sale.error = null;
        })
        .addCase(fetchSummary_SaleData.fulfilled, (state, action) => {
            const response = action?.payload;
            
            const data = response?.status === 200 && response?.data?.Status === '200'
                ? response?.data?.Data
                : { DT: [], DT1: [], DT2: [] };
        
            state.Summary_Sale.loading = false;
            state.Summary_Sale.data = data;
            state.Summary_Sale.error = null;
        })
        .addCase(fetchSummary_SaleData.rejected, (state, action) => {
            state.Summary_Sale.loading = false;
            state.Summary_Sale.data = null;
            state.Summary_Sale.error = action.error.message;
        })

        .addCase(fetchVendor_Margin_Per_CaratData.pending, (state) => {
            state.Vendor_Margin_Per_Carat.loading = true;
            state.Vendor_Margin_Per_Carat.data = null;
            state.Vendor_Margin_Per_Carat.error = null;
        })
        .addCase(fetchVendor_Margin_Per_CaratData.fulfilled, (state, action) => {
            const response = action?.payload;
            
            const data = response?.status === 200 && response?.data?.Status === '200'
                ? response?.data?.Data
                : { DT: [], DT1: [], DT2: [] };
        
            state.Vendor_Margin_Per_Carat.loading = false;
            state.Vendor_Margin_Per_Carat.data = data;
            state.Vendor_Margin_Per_Carat.error = null;
        })
        .addCase(fetchVendor_Margin_Per_CaratData.rejected, (state, action) => {
            state.Vendor_Margin_Per_Carat.loading = false;
            state.Vendor_Margin_Per_Carat.data = null;
            state.Vendor_Margin_Per_Carat.error = action.error.message;
        })

        .addCase(fetchVendor_In_Out_DurationData.pending, (state) => {
            state.Vendor_In_Out_Duration.loading = true;
            state.Vendor_In_Out_Duration.data = null;
            state.Vendor_In_Out_Duration.error = null;
        })
        .addCase(fetchVendor_In_Out_DurationData.fulfilled, (state, action) => {
            const response = action?.payload;
            
            const data = response?.status === 200 && response?.data?.Status === '200'
                ? response?.data?.Data
                : { DT: [], DT1: [], DT2: [] };
        
            state.Vendor_In_Out_Duration.loading = false;
            state.Vendor_In_Out_Duration.data = data;
            state.Vendor_In_Out_Duration.error = null;
        })
        .addCase(fetchVendor_In_Out_DurationData.rejected, (state, action) => {
            state.Vendor_In_Out_Duration.loading = false;
            state.Vendor_In_Out_Duration.data = null;
            state.Vendor_In_Out_Duration.error = action.error.message;
        })
  }
})

export default FactoryApi?.reducer;



        // .addCase(fetchSummary_Purchase.fulfilled, (state, action) => {
        //     console.log(action?.payload);
        //     const response = action?.payload;
        //     if(response?.status === 200){
        //         if(response?.data?.Status === '200'){
        //             state.Summary_Purchase.loading = false;
        //             state.Summary_Purchase.data = response?.data?.Data;
        //             state.Summary_Purchase.error = null;
        //             // return response?.data?.Data;
        //         }
        //         else{
        //             state.Summary_Purchase.loading = false;
        //             state.Summary_Purchase.data = {DT:[], DT1:[]};
        //             state.Summary_Purchase.error = null;
        //             // return ;
        //         }
        //     }
        //     else{
        //             state.Summary_Purchase.loading = false;
        //             state.Summary_Purchase.data = {DT:[], DT1:[]};
        //             state.Summary_Purchase.error = null;
        //         // return { DT:[], DT1:[] };
        //     }
            
        // })