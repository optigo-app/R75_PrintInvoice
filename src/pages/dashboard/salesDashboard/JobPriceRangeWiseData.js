// import { Card, CardHeader, styled } from '@mui/material'
// import React from 'react'
// import ReactApexcharts from '../@core/components/react-apexcharts';
// const JobPriceRangeWiseData = ({tkn,  fdate, tdate, country, MetalTypeColorWiseSaleData, IsEmpLogin, jobWisePriceRangeData}) => {
    

//     // const series = [
//     //     {
//     //       name: "Event Timeline",
//     //       data: [
//     //         { x: "Task A", y: [1, 5] },
//     //         { x: "Task B", y: [2, 6] },
//     //         { x: "Task C", y: [4, 8] },
//     //         { x: "Task D", y: [7, 9] },
//     //       ],
//     //     },
//     // ];

//     const options = {
//         // chart: {
//         //   type: "rangeBar",
//         //   height: 350,
//         // },
//         chart: {
//             type: "rangeBar",
//             height: 350,
//             zoom: {
//               enabled: false, // Disables zooming
//             },
//             toolbar: {
//               tools: {
//                 download:false,
//                 zoom: false, // Disable zoom tool
//                 zoomin: false, // Disable zoom-in tool
//                 zoomout: false, // Disable zoom-out tool
//                 pan: false, // Disable pan tool
//                 reset: false, // Disable reset zoom tool
//               },
//             },
//           },
//         plotOptions: {
//           bar: {
//             horizontal: true, // Makes it a horizontal bar chart
//           },
//         },
//         xaxis: {
//           title: {
//             text: "Amount",
//             style:{
//                 fontSize:"15px"
//             }
//           },
//         },
//         yaxis: {
//           title: {
//             text: "Jobs",
//             style:{
//                 fontSize:"15px"
//             }
//           },
//         },
//         dataLabels: {
//           enabled: true,
//           formatter: (val) => `${val[0]} - ${val[1]}`,
//         },
//         // tooltip: {
//         //   enabled: true,
//         //   y: {
//         //     formatter: (val) => `${val}`,
//         //     title: {
//         //       formatter: () => "Duration",
//         //     },
//         //   },
//         // },
//         tooltip: {
//             enabled: false,
//             y: {
//               formatter: (val) => ` ${val}`,
//               title: {
//                 formatter: () => "Jobw With Price Range",
//               },
//             },
//             // followCursor: false, // Ensures the tooltip follows the cursor
//             theme: "light", // Optional: Set a theme for better visibility
//           },
//         title: {
//           text: "",
//           align: "center",
//           class:"fs_analytics_l",
//         },
//     };

//     const seriesData = jobWisePriceRangeData?.DT1?.sort((a, b) => b?.JobCnt - a?.JobCnt)?.map((item) => ({
//         x: ` ${item?.JobCnt}`, // Label with Job Count
//         y: [Math.round((+item?.PriceFrom) / (+country)), Math.round((+item?.PriceTo) / (+country))], // Range for y-axis
//     }));

//     const series = [
//         {
//           name: "Price Ranges",
//           data: seriesData,
//         },
//       ];

//   return (
//     <>
//     <Card className='fs_analytics_l tableHeight' style={{ boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)' }}>
//         <CardHeader
//             title='Jobs Count With Price Range'
//             titleTypographyProps={{ sx: { mb: [2, 0] } }}
//             sx={{
//             py: 2.5,
//             flexDirection: ['column', 'row'],
//             '& .MuiCardHeader-action': { m: 0 },
//             alignItems: ['flex-start', 'center']
//             }}
//         />
//         { jobWisePriceRangeData?.DT1?.length > 0 && <ReactApexcharts options={options} series={series} type="rangeBar" height={350} class="fs_analytics_l jobWisePR" />}
//     </Card>
//     </>
//   )
// }

// export default JobPriceRangeWiseData
