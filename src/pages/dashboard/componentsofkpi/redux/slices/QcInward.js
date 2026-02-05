import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const QCInwardAPI = createAsyncThunk('QCInward', async(obj) => {
    
    try {
        // const url = "http://zen/jo/api-lib/App/KPI_DashBoard";
        const replacedUrl = (obj?.url)?.replace("M.asmx/Optigo", "report.aspx");
      
        const body_kpi_3 = {
            "con":"{\"id\":\"\",\"mode\":\"kpidashboard_qcinward\",\"appuserid\":\"admin@hs.com\"}",
            "p":`{\"fdate\":\"${(obj?.fdate)}\",\"tdate\":\"${(obj?.tdate)}\"}`,  
            "f":"m-test2.orail.co.in (ConversionDetail)"
          }
  
        const headers2_kpi_3 = {
          Authorization:`Bearer ${obj?.tkn}`,
          YearCode:"e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=",
          version:"v4",
          sv:obj?.sv
        }
        
        // const prdApi = await axios.post("http://zen/api/report.aspx", body2, { headers: headers2 });
        const kpidashboard_qcinward = await axios.post(replacedUrl, body_kpi_3, { headers: headers2_kpi_3 });
        
        const KQC = kpidashboard_qcinward?.data?.Data;
        
        if(KQC?.rd?.length > 0){
            return KQC?.rd[0];
        }else{
            return {};
        }

        // return [];
        // if(KQC?.rd){
        // //   setQcInward(KQC?.rd[0]);
        // //   setInwardLoader(false);
        // }else{
        // //   setInwardLoader(false);
        // }
      } catch (error) {
        console.log("API Error:", error);
        return {}; // Return empty array on error
      }
})


export const QcInward = createSlice({
    name:'QcInward',
    initialState: {
        loading:false,
        data:null,
        error:null
    },
    reducers:{},
    extraReducers:(builder) => {
        builder.
            addCase(QCInwardAPI.pending, (state) => {
                state.loading = true;
            })
            .addCase(QCInwardAPI.fulfilled, (state, action) => {  
                state.loading = false;
                state.data = action?.payload;
                state.error = null;
            })
            .addCase(QCInwardAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default QcInward.reducer;