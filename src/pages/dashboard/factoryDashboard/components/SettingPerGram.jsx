import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
import { Box, CircularProgress, Tab, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import { TabList, TabPanel } from '@mui/lab';

Chart.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const SettingPerGram = (props) => {
  const { info, warning, labelColor, borderColor, legendColor, selectMaterial, selectCurrency } = props;
  const { loading, data, error } = useSelector((state) => state?.Vendor_Margin_Per_Carat);
  const [vendorNameList, setVendorNameList] = useState([]);
  const [costPerCarat, setCostPerCarat] = useState([]);
  const [soldPerCarat, setSoldPerCarat] = useState([]);
  const [activeDataset, setActiveDataset] = useState('costPerCarat');

  const theme = useTheme();

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    elements: {
      bar: {
        borderRadius: {
          topRight: 15,
          bottomRight: 15,
        },
      },
    },
    layout: {
      padding: { top: -4 },
    },
    scales: {
      x: {
        min: 0,
        grid: {
          drawTicks: false,
          color: borderColor,
        },
        ticks: { color: theme?.palette?.customColors?.grey },
      },
      y: {
        grid: {
          display: false,
          color: borderColor,
        },
        ticks: { color: theme?.palette?.customColors?.grey },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  useEffect(() => {
    if (data?.DT?.length > 0) {
      let arr0, arr, arr2;

      if (selectMaterial == 1) {
        arr = data.DT.map((e) => e.Cost_Per_Carat_D / selectCurrency).sort((a, b) => b - a).slice(0, 8);
        arr2 = data.DT.map((e) => e.Sold_Per_Carat_D / selectCurrency).sort((a, b) => b - a).slice(0, 8);
      } else if (selectMaterial == 2) {
        arr = data.DT.map((e) => e.Cost_Per_Carat_CS / selectCurrency).sort((a, b) => b - a).slice(0, 8);
        arr2 = data.DT.map((e) => e.Sold_Per_Carat_CS / selectCurrency).sort((a, b) => b - a).slice(0, 8);
      } else if (selectMaterial == 3) {
        arr = data.DT.map((e) => e.Cost_Per_Carat_M / selectCurrency).sort((a, b) => b - a).slice(0, 8);
        arr2 = data.DT.map((e) => e.Sold_Per_Carat_M / selectCurrency).sort((a, b) => b - a).slice(0, 8);
      }

      if (activeDataset === 'costPerCarat') {
        arr0 = data.DT
          .slice()
          .sort((a, b) => b.Cost_Per_Carat_D - a.Cost_Per_Carat_D)
          .slice(0, 8)
          .map((e) => e.Vendor);
        setVendorNameList(arr0);
        setCostPerCarat(arr);
      } else {
        arr0 = data.DT
          .slice()
          .sort((a, b) => b.Sold_Per_Carat_D - a.Sold_Per_Carat_D)
          .slice(0, 8)
          .map((e) => e.Vendor);
        setVendorNameList(arr0);
        setSoldPerCarat(arr2);
      }
    } else {
      setVendorNameList([]);
      setCostPerCarat([]);
      setSoldPerCarat([]);
    }
  }, [data?.DT, selectMaterial, selectCurrency, activeDataset]);

  const handleChange = (event, newValue) => {
    setActiveDataset(newValue);
  };

  const comp_data = {
    labels: vendorNameList,
    datasets: [
      activeDataset === 'costPerCarat'
        ? {
          maxBarThickness: 15,
          backgroundColor: theme?.palette?.customColors?.orange,
          label: 'Cost Per Carat',
          borderColor: 'transparent',
          data: costPerCarat ?? [],
        }
        : {
          maxBarThickness: 15,
          label: 'Sold Per Carat',
          backgroundColor: theme?.palette?.customColors?.purple,
          borderColor: 'transparent',
          data: soldPerCarat ?? [],
        },
    ],
  };

  return (
    <Card className='fs_facd bs_facd' sx={{ boxShadow: '0px 4px 18px 0px rgba(47, 43, 61, 0.1)' }}>
      <CardHeader title='Vendorwise Margin/ctw ' />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '1rem', minHeight: '440px' }}>
          <CircularProgress sx={{ color: 'lightgrey' }} />
        </Box>
      ) : (
        <CardContent sx={{ paddingBottom: '0px !important' }}>
          <TabContext value={activeDataset}>
            <TabList
              variant='scrollable'
              scrollButtons='auto'
              onChange={handleChange}
              aria-label='earning report tabs'
              sx={{
                border: '0 !important',
                justifyContent: 'center',
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': { p: 0, minWidth: 0, borderRadius: '10px', '&:not(:last-child)': { mr: 4 } },
              }}
            >
              <Tab
                value='costPerCarat'
                label={
                  <Box
                    sx={{
                      width: 150,
                      height: 34,
                      borderWidth: 1,
                      ml: 4,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '10px',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      borderStyle: activeDataset === 'costPerCarat' ? 'solid' : 'dashed',
                      borderColor: activeDataset === 'costPerCarat' ? theme?.palette?.customColors?.orange : theme?.palette?.divider,
                    }}
                  >
                    <Typography sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
                      Cost Per Carat
                    </Typography>
                  </Box>
                }
              />
              <Tab
                value='soldPerCarat'
                label={
                  <Box
                    sx={{
                      width: 150,
                      height: 34,
                      borderWidth: 1,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '10px',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      borderStyle: activeDataset === 'soldPerCarat' ? 'solid' : 'dashed',
                      borderColor: activeDataset === 'soldPerCarat' ? theme?.palette?.customColors?.purple : theme?.palette?.divider,
                    }}
                  >
                    <Typography sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
                      Sold Per Carat
                    </Typography>
                  </Box>
                }
              />

            </TabList>
            <TabPanel sx={{ padding: '10px' }} value={activeDataset}>
              <Bar data={comp_data} height={400} options={options} />
            </TabPanel>
          </TabContext>
        </CardContent>
      )}
    </Card>
  );
};

export default SettingPerGram;




// import Card from '@mui/material/Card'
// import CardHeader from '@mui/material/CardHeader'
// import CardContent from '@mui/material/CardContent'
// import { Bar } from 'react-chartjs-2'
// import { Chart, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
// import { Box, CircularProgress, useTheme } from '@mui/material';
// import { useSelector } from 'react-redux';
// import { useEffect, useState } from 'react';

// Chart.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

// const SettingPerGram = props => {
//   const { info, warning, labelColor, borderColor, legendColor, selectMaterial, selectCurrency } = props;
//   const { loading, data, error } = useSelector(state => state?.Vendor_Margin_Per_Carat);
//   const [vendorNameList, setVendorNameList] = useState([]);
//   const [costPerCarat, setCostperCarat] = useState([]);
//   const [soldPerCarat, setSoldperCarat] = useState([]);
//   const [activeDatasets, setActiveDatasets] = useState({ costPerCarat: true, soldPerCarat: true });

//   const theme = useTheme();

//   const options = {
//     indexAxis: 'y',
//     responsive: true,
//     maintainAspectRatio: false,
//     animation: { duration: 500 },
//     elements: {
//       bar: {
//         borderRadius: {
//           topRight: 15,
//           bottomRight: 15
//         }
//       }
//     },
//     layout: {
//       padding: { top: -4 }
//     },
//     scales: {
//       x: {
//         min: 0,
//         grid: {
//           drawTicks: false,
//           color: borderColor
//         },
//         ticks: { color: theme?.palette?.customColors?.grey }
//       },
//       y: {
//         grid: {
//           display: false,
//           color: borderColor
//         },
//         ticks: { color: theme?.palette?.customColors?.grey }
//       }
//     },
//     plugins: {
//       legend: {
//         align: 'end',
//         position: 'top',
//         labels: { color: legendColor },
//         onClick: (e, legendItem, chart) => {
//           const index = legendItem.datasetIndex;
//           const datasetKey = index === 1 ? 'costPerCarat' : 'soldPerCarat';

//           setActiveDatasets((prev) => {
//             let newState = { ...prev, [datasetKey]: !prev[datasetKey] };

//             // If both become false, reset both to true
//             if (!newState.costPerCarat && !newState.soldPerCarat) {
//               newState = { costPerCarat: true, soldPerCarat: true };
//             }

//             // Recalculate vendor list based on active datasets
//             let newVendorList = [];
//             if (newState.costPerCarat && newState.soldPerCarat) {
//               newVendorList = vendorNameList;
//             } else if (newState.costPerCarat) {
//               newVendorList = data?.DT?.slice()
//                 ?.sort((a, b) => b?.Cost_Per_Carat_D - a?.Cost_Per_Carat_D)
//                 ?.slice(0, 10)?.map((e) => e?.Vendor);
//             } else if (newState.soldPerCarat) {
//               newVendorList = data?.DT?.slice()
//                 ?.sort((a, b) => b?.Sold_Per_Carat_D - a?.Sold_Per_Carat_D)
//                 ?.slice(0, 10)?.map((e) => e?.Vendor);
//             }

//             setVendorNameList(newVendorList);
//             return newState;
//           });
//         }
//       }
//     }
//   };


//   const comp_data = {
//     labels: vendorNameList,
//     datasets: [
//       activeDatasets.costPerCarat && {
//         maxBarThickness: 15,
//         backgroundColor: theme?.palette?.customColors?.orange,
//         label: 'Cost Per Carat',
//         borderColor: 'transparent',
//         data: costPerCarat ?? []
//       },
//       activeDatasets.soldPerCarat && {
//         maxBarThickness: 15,
//         label: 'Sold Per Carat',
//         backgroundColor: theme?.palette?.customColors?.purple,
//         borderColor: 'transparent',
//         data: soldPerCarat ?? []
//       }
//     ].filter(Boolean) // Remove hidden datasets
//   };

//   useEffect(() => {

//     if (data?.DT?.length > 0) {
//       if (selectMaterial === 1 || selectMaterial === '1') {
//         let arr0 = data?.DT?.slice()?.sort((a, b) => b?.Cost_Per_Carat_D - a?.Cost_Per_Carat_D)?.slice(0, 10)?.map((e) => e?.Vendor);
//         setVendorNameList(arr0);
//         let arr = data?.DT?.map((e) => (e?.Cost_Per_Carat_D / selectCurrency))?.sort((a, b) => b - a)?.slice(0, 10);
//         let arr2 = data?.DT?.map((e) => (e?.Sold_Per_Carat_D / selectCurrency))?.sort((a, b) => b - a)?.slice(0, 10);
//         setCostperCarat(arr);
//         setSoldperCarat(arr2);
//       }
//       if (selectMaterial === 2 || selectMaterial === '2') {
//         let arr0 = data?.DT?.slice()?.sort((a, b) => b?.Cost_Per_Carat_CS - a?.Cost_Per_Carat_CS)?.slice(0, 10)?.map((e) => e?.Vendor);
//         setVendorNameList(arr0);
//         let arr = data?.DT?.map((e) => (e?.Cost_Per_Carat_CS / selectCurrency))?.sort((a, b) => b - a)?.slice(0, 10);
//         let arr2 = data?.DT?.map((e) => (e?.Sold_Per_Carat_CS / selectCurrency))?.sort((a, b) => b - a)?.slice(0, 10);
//         setCostperCarat(arr);
//         setSoldperCarat(arr2);
//       }
//       if (selectMaterial === 3 || selectMaterial === '3') {
//         let arr0 = data?.DT?.slice()?.sort((a, b) => b?.Cost_Per_Carat_M - a?.Cost_Per_Carat_M)?.slice(0, 10)?.map((e) => e?.Vendor);
//         setVendorNameList(arr0);
//         let arr = data?.DT?.map((e) => (e?.Cost_Per_Carat_M / selectCurrency))?.sort((a, b) => b - a)?.slice(0, 10);
//         let arr2 = data?.DT?.map((e) => (e?.Sold_Per_Carat_M / selectCurrency))?.sort((a, b) => b - a)?.slice(0, 10);
//         setCostperCarat(arr);
//         setSoldperCarat(arr2);
//       }
//     } else {
//       setCostperCarat([]);
//       setSoldperCarat([]);
//     }

//   }, [data?.DT, selectMaterial, selectCurrency]);

//   return (
//     <Card className='fs_facd bs_facd' sx={{ boxShadow: '0px 4px 18px 0px rgba(47, 43, 61, 0.1)' }}>
//       <CardHeader title='Vendorwise Margin/ctw ' />
//       {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '1rem', minHeight: '440px' }}>
//         <CircularProgress sx={{ color: 'lightgrey' }} />
//       </Box> : <CardContent>
//         <Bar data={comp_data} height={400} options={options} />
//       </CardContent>}
//     </Card>
//   )
// }

// export default SettingPerGram
