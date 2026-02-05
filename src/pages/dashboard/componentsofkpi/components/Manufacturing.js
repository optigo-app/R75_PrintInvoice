// ** React Imports
import { useState, useEffect } from 'react'
// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { CircularProgress } from '@mui/material';
import "../kpianalytics.css"
import {  formatAmountRound } from '../../GlobalFunctions';
import { useSelector } from 'react-redux';

const Manufacturning = ({bgColor, LWise, mfgTable, mfgLoader, LWiseLoader}) => {

  const state = useSelector(state => state?.SalesMarketing_TotalSaleLocationWise);
  const state2 = useSelector(state => state?.MFGTable);

  // ** State
  const [MFGData, setMFGData] = useState([]);
  const[columns, setColumns] = useState([]);

  //clone
  const [lWise, setLWise] = useState([]);
  const [mfgTableApi, setMfgTableApi] = useState([]);
  
    // useEffect(() => { 

    //   formateArray();

    // },[LWise, mfgTable]);

    useEffect(() => { 
        // if(lWise?.length >= 0 || mfgTableApi?.length >=0){
          if (Array.isArray(lWise) && lWise?.length >= 0 || Array.isArray(mfgTableApi) && mfgTableApi?.length >= 0) {
          formateArray();
        }
    },[lWise, mfgTableApi]);

    // useEffect(() => { 
    //   setLWise(state?.data);
    // },[state?.data]);

    useEffect(() => { 
      setLWise(Array.isArray(state?.data) ? state?.data : []);
    }, [state?.data]);

    useEffect(() => { 
      setMfgTableApi(Array.isArray(state2?.data) ? state2?.data : []);
    }, [state2?.data]);
    

    // useEffect(() => { 
    //   setMfgTableApi(state2?.data);
    // }, [state2?.data]);
    


  const formateArray = () => {
    // if(lWise?.length >= 0 || mfgTableApi?.length >= 0){
      if (Array.isArray(lWise) && lWise?.length > 0 || Array.isArray(mfgTableApi) && mfgTableApi?.length > 0) {
    
      try {
        const combinedData = {};
        const allLocations = new Set();
    
          // mfgTable?.forEach((item) => {
          mfgTableApi?.forEach((item) => {
          const location = item?.manufacturelocationname || "NoLocation";
      
          if (!combinedData[location]) {
            combinedData[location] = {};
          }
      
          // If manufacturelocationname is "-", merge with "NoLocation"
          if (location === "-") {
            combinedData["NoLocation"] = {
              ...combinedData["NoLocation"],
              "Production (gm)": (combinedData["NoLocation"]?.["Production (gm)"] || 0) + (item?.mfg_production_gms || 0),
              Jobs: (combinedData["NoLocation"]?.Jobs || 0) + (item?.mfg_jobs || 0),
              "Gross Loss (%)": (combinedData["NoLocation"]?.["Gross Loss (%)"] || 0) + (item?.mfg_grossloss || 0),
              "Rejection (%)": (combinedData["NoLocation"]?.["Rejection (%)"] || 0) + (item?.mfg_rejection || 0),
            };
          } else {
            combinedData[location] = {
              ...combinedData[location],
              "Production (gm)": (item?.mfg_production_gms)?.toFixed(3) || 0.000,
              Jobs: (item?.mfg_jobs) || 0.00,
              "Gross Loss (%)": (item?.mfg_grossloss)?.toFixed(3) || 0.000,
              "Rejection (%)": (item?.mfg_rejection)?.toFixed(3) || 0.000,
            };
          }
      
          allLocations.add(location);
        });
      
        // Merge data from SalesMarketing_TotalSaleLocationWise
          // LWise?.forEach((item) => {
            lWise?.forEach((item) => {
          const location = item?.locationname || "NoLocation";
      
          if (!combinedData[location]) {
            combinedData[location] = {};
          }
      
          // If locationname is "NoLocation", sum the respective fields
          if (location === "NoLocation") {
            combinedData["NoLocation"] = {
              ...combinedData["NoLocation"],
              "Labour Amount": (combinedData["NoLocation"]?.["Labour Amount"] || 0) + (item?.LabourAmount || 0),
            };
          } else {
            combinedData[location] = {
              ...combinedData[location],
              "Labour Amount": (item?.LabourAmount) || 0.00,
            };
          }
      
          allLocations?.add(location);
        });
      
        // Define KPIs
        const kpis = [
          "Production (gm)",
          "Jobs",
          "Labour Amount",
          "Gross Loss (%)",
          "Rejection (%)",
        ];
      
        // Create Rows for the Table
        const tableRows = kpis?.map((kpi, index) => {
          const row = { id: index + 1, KPI: kpi };
          allLocations?.forEach((location) => {
            // Apply conditional decimal formatting based on KPI name
            if (kpi === "Labour Amount") {
              row[location] = `₹ ${formatAmountRound(parseFloat(combinedData[location]?.[kpi] || 0.00)?.toFixed(2))}`; // 2 decimals for amount
            } else if (kpi === "Production (gm)" ) {
              row[location] = Math.round((combinedData[location]?.[kpi] || 0.000)); // 3 decimals for weight/loss
            } else if (kpi === "Gross Loss (%)" || kpi === "Rejection (%)") {
              row[location] = `${parseFloat(combinedData[location]?.[kpi] || 0.000)?.toFixed(2)} %`; // 3 decimals for weight/loss
            } else {
              row[location] = (combinedData[location]?.[kpi] || 0.00);
            }
          });
          return row;
        });
      
        // Define Columns for the Table
        const tableColumns = [
          { field: "KPI", headerName: "KPI", width: 200 },
          ...Array?.from(allLocations)?.map((location) => ({
            field: location,
            headerName: location,
            flex: 1,
            minWidth: 170,
            maxWidth: 300,
          })),
        ];

          // Remove the column for "-" (if it exists)
          tableColumns?.forEach((e, index) => {
            if (e.headerName === "-") {
              tableColumns?.splice(index, 1);
            }
          });
      
        // Rename NoLocation header if necessary
        tableColumns?.forEach((e) => {
          if (e?.headerName?.toLowerCase() === "nolocation") {
            e.headerName = "OutRight";
          }
        });
        
        setMFGData(tableRows);
        setColumns(tableColumns);
      } catch (error) {
        console.log(error);
      }
    }

  }

  return  (
    <Card className='fs_analytics_l' style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'206px', 

    display: "flex", // Ensure flexbox is applied to the card
      alignItems: "center", // Center items vertically
      justifyContent: "center", // Center items horizontally
     }}>

      { (state?.loading || state2?.loading) ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem',  }}>
              <CircularProgress sx={{color:'lightgrey'}} />
            </Box> : <DataGrid
             rows={MFGData}  // Use the sliced paginated data
             columns={columns}
             disableColumnMenu
             disableRowSelectionOnClick
             className="fs_analytics_l onlyDatagrid"
             rowHeight={35}
             getRowId={(row) => row?.KPI}   // Specify the unique identifier
             sx={{
              '& .MuiDataGrid-columnHeader': {
                // backgroundColor: '#2F2B3D', // Set the desired background color
                color: bgColor, // Set the text color (optional)
                fontWeight:'bolder !important',
                fontSize:'13px'
              },
              '& .MuiDataGrid-cell': {
                fontSize: '13px', // Set the font size for cell content
              },
              '& .MuiDataGrid-columnHeader:focus': {
                outline: 'none', // Remove outline when the header is focused
              },
              '& .MuiDataGrid-columnHeader:focus-within': {
                outline: 'none', // Remove outline when focus is within the header
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none', // Remove outline for cells as well
              },
            }}
      />}
    </Card>
  ) 
}

export default Manufacturning