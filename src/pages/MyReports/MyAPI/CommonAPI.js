
import axios from "axios";

export const CommonAPI = async (body) => {
    
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("tkn");
    const sv = queryParams.get("sv");
    const report_api_url = queryParams.get("report_api_url");
    
    // const APIURL = 'http://zen/api/report.aspx'
    const APIURL = `${atob(report_api_url)}`
    
    const api2 = APIURL?.replace("M.asmx/Optigo", "report.aspx");
    try {
        const header = {
            Authorization: `Bearer ${atob(token)}`,
            Yearcode: '',
            version: "v4",
            sv: `${atob(sv)}`,
            sp: 'DynamicReport'
        };
        const response = await axios.post(api2, body, { headers: header });
        return response?.data;

    } catch (error) {
        console.error('error is..', error);
    }
};

//finalllllll  ;-  http://localhost:3001/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&pid=18149&sv=MA==&report_api_url=aHR0cDovL3plbi9hcGkvcmVwb3J0LmFzcHg=&LId=MTU5MzE=&LUId=dWRheUBhZG1pbi5jby5pbg==

// http://localhost:3001/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&pid=18149&sv=MA==&report_api_url=aHR0cDovL3plbi9hcGkvTS5hc214L09wdGlnbw==&LId=MTU5MzE=&LUId=dWRheUBhZG1pbi5jby5pbg==