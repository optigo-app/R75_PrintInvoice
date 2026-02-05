// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Component Import
// import ReactApexcharts from 'src/@core/components/react-apexcharts'
import ReactApexcharts from '../../@core/components/react-apexcharts'

// ** Util Import
// import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { hexToRGBA } from '../../@core/utils/hex-to-rgba'
import { useState } from 'react';
import { useEffect } from 'react';
import { fetchDashboardData, formatAmount, formatAmountKWise } from '../../GlobalFunctions';
import { Box,  Tooltip, Typography } from '@mui/material';
import Icon from '../../@core/components/icon'

// const radialBarColors = {
//   series1: '#fdd835',
//   series2: '#1FD5EB',
//   series3: '#00d4bd',
//   series4: '#7367f0',
//   series5: '#FFA1A1'
// }
const radialBarColorsArr = [
   '#7367f0',
   '#A8AAAE',
   '#1FD5EB',
   '#2CC872',
   '#EA5455',
]

const ApexRadialBarChart = ({tkn,  fdate, tdate, country, CustomerTypeWiseSaleAmountData}) => {

  const [apiData, setApiData] = useState([]);
  useEffect(() => {

    const fetchData = async () => {
      try {
        // Fetch MonthWiseSaleAmount data
        // const monthWiseSaleData = await fetchDashboardData(tkn,  fdate, tdate, "CustomerTypeWiseSaleAmount");
        
        setApiData(CustomerTypeWiseSaleAmountData);
  
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData(); 

  // },[fdate, tdate]);
},[CustomerTypeWiseSaleAmountData]);

  
  const custTypeWiseArr = CustomerTypeWiseSaleAmountData?.sort((a, b) => b?.SaleAmount - a?.SaleAmount)
  const custTypeWise = custTypeWiseArr?.map((e, i) => capitalizeFirstLetter(e?.CustomerType))?.slice(0, 5)
  const amountWise = apiData?.map((e) => (e?.SaleAmount) || 0)?.sort((a, b) => b - a);

  const custTypeWiseArrNew = [];

  custTypeWiseArr?.slice(0, 5)?.forEach((e, i) => {
    let obj = {...e};
    radialBarColorsArr?.forEach((a, ind) => {
      if(i == ind){
        obj.color = a;
        custTypeWiseArrNew.push(obj);
      }
    })
  })

  // Calculate total and percentages
  const totalSales = amountWise.reduce((acc, value) => acc + value, 0)
  // const percentageData1 = amountWise.slice(0, 5).map((value) => ((value / totalSales) * 100)?.toFixed(2))
  const percentageData1 = amountWise.slice(0, 5)
  // const percentageData = percentageData1?.map((e) => Number(e));

  const totalSaleAmount = CustomerTypeWiseSaleAmountData?.reduce((acc, num) => acc + num?.SaleAmount, 0);

  const percentageData = amountWise?.slice(0, 5)?.map(value => (value / totalSaleAmount) * 100);
  

  // ** Hook
  const theme = useTheme();

  const radialBarColors = {
    series1: theme?.palette?.customColors?.red,
    series2: theme?.palette?.customColors?.green,
    series3: theme?.palette?.customColors?.info,
    series4: theme?.palette?.customColors?.grey,
    series5: theme?.palette?.customColors?.purple
  }
  function capitalizeFirstLetter(input) {
    if (!input) return ""; // Check for empty or undefined input
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }

  // const SCALE_FACTOR = 100000; // 1 Lakh
  // const scaledPercentageData = percentageData?.map(value => value / SCALE_FACTOR); 
  

  const options = {
    stroke: { lineCap: 'round' },
    // labels: ['Comments', 'Replies', 'Shares'],
    labels: custTypeWise,
    legend: {
      show: false,
      position: 'bottom',
      labels: {
        colors: theme.palette.text.secondary
      },
      markers: {
        offsetX: -3
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    
    colors: [radialBarColors.series5, radialBarColors.series4,radialBarColors.series3,radialBarColors.series2, radialBarColors.series1],
    plotOptions: {
      radialBar: {
        // hollow: { size: '20%' },
        hollow : { size: custTypeWise.length === 1 ? '40%' : '20%' }, 
        track: {
          margin: 15,
          background: hexToRGBA('#F1F0F2', 1),
        },
        dataLabels: {
          name: {
            fontSize: '2rem'
          },
          value: {
            fontSize: '2rem',
            color: theme.palette.text.secondary,
            // formatter: function (_, { seriesIndex }) {
            //   const saleAmount = amountWise[seriesIndex] || 0; // Get the amount from amountWise array
            //   return formatAmount(saleAmount); // Display formatted amount
            // },
            formatter: function (value) {
              // Display values in Lakhs or Crores if needed
              // return (formatAmount((value)?.toLocaleString())) + '%';


              let amt = Number(value);

              const saleAmt = ((amt / 100) * totalSaleAmount);

              return (formatAmountKWise(((saleAmt / (+country)))));
            },
          },
          tooltip: {
            enabled: true,
            custom: function ({ seriesIndex, dataPointIndex, w }) {
              // Show Sale Amount in Tooltip
              const saleAmount = amountWise[dataPointIndex];
              return `<div style="padding: 10px; font-size: 14px;">${custTypeWise[dataPointIndex]}: ${formatAmountKWise((saleAmount / (+country)))}</div>`;
            }
          },
          total: {
            show: false,
            fontWeight: 400,
            label: 'Comments',
            fontSize: '2.125rem',
            color: theme.palette.text.primary,
            formatter: function (w) {
              const totalValue =
                w?.globals?.seriesTotals?.reduce((a, b) => {
                  return a + b
                }, 0) / w?.globals?.series?.length
              if (totalValue % 1 === 0) {
                return totalValue + '%'
              } else {
                return totalValue?.toFixed(2) + '%'
              }
            }
          }
        }
      }
    },
    grid: {
      padding: {
        top: -35,
        bottom: -30
      }
    }
  }
  
  return (
    <Card className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'34.85rem'}}>
      <CardHeader title='Customer Type wise sales amount' />
      <CardContent>
        {/* <ReactApexcharts type='radialBar' height={440} options={options} series={[80, 50, 35]} /> */}
        <ReactApexcharts type='radialBar' height={440} options={options} series={percentageData} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: ``, mt:1.5, justifyContent: 'center' }}>
            {custTypeWiseArrNew?.map((item, index) => (
              <Box
                key={index}
                sx={{
                  mr: 5,
                  mt:2,
                  display: 'flex',
                  alignItems: 'center',
                  '& svg': { mr: 1, color: item?.color }
                }}
              >
            {/* <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2' sx={{
              cursor:'pointer',
              
            }} onMouseEnter={() => handleMouseEnter(item)}>{item?.name?.toUpperCase()}</Typography> */}
              <Tooltip sx={{
                  '& .MuiTooltip-tooltip': {
                    fontSize: '16px !important', // Force the font size change
                    fontWeight: 'bold !important', // Force bold text
                    backgroundColor: '#1976d2 !important', // Force background color change
                    color: 'white !important', // Force text color change
                  },
                // }} title={`Amount: ${formatAmount(item?.SaleAmount)}`} arrow>
                }} title={<Typography className='fs_analytics_l'  sx={{color:'white'}}>{`Amount: ${formatAmountKWise((item?.SaleAmount / (+country)))}`}</Typography>} arrow>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Icon icon="mdi:circle" fontSize="0.75rem" color={item?.color} />
                  <Typography variant="body2" >{item?.CustomerType?.toUpperCase()}</Typography>
                </Box>
              </Tooltip>
                </Box>
          ))}
        </Box>

      </CardContent>
    </Card>
  )
}

export default ApexRadialBarChart
