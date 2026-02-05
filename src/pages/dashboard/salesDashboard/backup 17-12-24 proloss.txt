// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
// import Icon from 'src/@core/components/icon'
// import OptionsMenu from 'src/@core/components/option-menu'
// import CustomAvatar from 'src/@core/components/mui/avatar'
// import ReactApexcharts from 'src/@core/components/react-apexcharts'
import Icon from '../@core/components/icon'
import OptionsMenu from '../@core/components/option-menu'
import CustomAvatar from '../@core/components/mui/avatar'
import ReactApexcharts from '../@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from '../@core/utils/hex-to-rgba'
import { useEffect } from 'react';
import { fetchDashboardData, formatAmount, formatAmountKWise } from '../GlobalFunctions';
import { useState } from 'react';

import "./chartcss/analytics.css"

// const series = [
//   { name: 'Earning', data: [15, 10, 20, 8, 12, 18, 12, 5] },
//   { name: 'Expense', data: [-7, -10, -7, -12, -6, -9, -5, -8] }
// ]

// const data = [
//   {
//     amount: 98,
//     subtitle: 'Refund',
//     title: 'Total Sales',
//     avatarColor: 'primary',
//     avatarIcon: 'tabler:currency-dollar'
//   },
//   {
//     amount: 126,
//     title: 'Total Revenue',
//     avatarColor: 'secondary',
//     subtitle: 'Client Payment',
//     avatarIcon: 'tabler:brand-paypal'
//   }
// ]

const AnalyticsTotalEarning = ({tkn,  fdate, tdate, CategoryWiseSaleAmountData}) => {
  // ** Hook
  const theme = useTheme();


  const [apiData, setApiData] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {

        // Fetch MonthWiseSaleAmount data
        // const CountryWiseSaleAmount = await fetchDashboardData(tkn,  fdate, tdate, "CategoryWiseSaleAmount");

        setApiData(CategoryWiseSaleAmountData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData(); 

  // },[fdate, tdate]);
},[CategoryWiseSaleAmountData]);

  const sortedData = CategoryWiseSaleAmountData?.sort((a, b) => {
    const saleAmountA = a?.SaleAmount || 0;  // Default to 0 if SaleAmount is missing
    const saleAmountB = b?.SaleAmount || 0;
    return saleAmountB - saleAmountA;
  });
  // Step 2: Get the top 10 objects
  const top10 = sortedData?.slice(0, 10);

  const sales = top10?.map((e) => e?.SaleAmount);
  const profit = top10?.map((e) => e?.Profit);
  const negativeArray = profit?.map(value => Math?.abs(value) * -1);
  const salesNames = top10?.map((e) => e?.Category)
  const totalSale = top10?.reduce((acc, num) => acc + num?.SaleAmount, 0);
  const totalProfit = top10?.reduce((acc, num) => acc + num?.Profit, 0);
  const series = [
    { name: 'Sales', data: sales },
    { name: 'Profit', data: negativeArray }
  ]

  const options = {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    legend: { show: true },
    tooltip: { enabled: true },

    // dataLabels: { enabled: false },
    
    dataLabels: {
      // offsetY: [10, 15],
      formatter: val => `${formatAmountKWise(val)}`,
      style: {
        fontWeight: 500,
        colors: [theme.palette.text.secondary],
        fontSize: theme.typography.body1.fontSize
      }
    },
    stroke: {
      width: 6,
      lineCap: 'round',
      colors: [theme.palette.background.paper]
    },
    // colors: [hexToRGBA(theme.palette.primary.main, 1), hexToRGBA(theme.palette.secondary.main, 1)],
    // colors: [hexToRGBA(theme.palette.customColors?.purple, 1), hexToRGBA(theme.palette.customColors?.grey, 1)],
    colors: [(theme.palette.customColors?.purple), (theme.palette.customColors?.grey)],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '40%',
        endingShape: 'rounded',
        startingShape: 'rounded',
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      yaxis: {
        lines: { show: false }
      },
      xaxis: {
        lines: { show: false }
      },
      padding: {
        top: -20,
        left: -5,
        right: -2,
        bottom: -12
      }
    },
    xaxis: {
      axisTicks: { show: false },
      categories: salesNames,
      crosshairs: { opacity: 0 },
      axisBorder: { show: false },
    },
    // yaxis: {
    //   labels: { show: true }
    // },
    yaxis: {
      labels: {
        show: true, // Display Y-axis labels
        formatter: function (value) {
          // return `${value?.toFixed(2)}`; // Format labels as currency (example)
          return `${formatAmountKWise(value)}`; // Format labels as currency (example)
        }
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        options: {
          plotOptions: {
            bar: { columnWidth: '50%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          plotOptions: {
            bar: { columnWidth: '40%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          plotOptions: {
            bar: { columnWidth: '25%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: { columnWidth: '42%' }
          }
        }
      }
    ]
  }

  const data = [
    {
      amount: formatAmountKWise(totalSale),
      subtitle: '',
      title: 'Total Sales',
      avatarColor: 'primary',
      avatarIcon: 'tabler:currency-rupee'
    },
    {
      amount: formatAmountKWise(totalProfit),
      title: 'Total Profit',
      avatarColor: 'secondary',
      subtitle: '',
      avatarIcon: 'tabler:currency-rupee'
    }
  ]


  

  return (
    <Card  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}} className='fs_analytics_l'>
      <CardHeader
        title='Category Wise Sales Amount'
        // action={
        //   <OptionsMenu
        //     options={['Refresh', 'Share', 'Update']}
        //     iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
        //   />
        // }
        subheader={
          <Box
            sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& svg': { mr: 1, color: 'success.main' } }}
          >
            {/* <Typography variant='h1' sx={{ mr: 2, mt:1.5 }}>
              87%
            </Typography>
            <Icon fontSize='1.25rem' icon='tabler:chevron-up' color={theme?.palette?.customColors?.green} />
            <Typography variant='h6' sx={{ color: `${theme?.palette?.customColors?.green}` , fontWeight:'bold' }}>
              25.8%
            </Typography> */}
          </Box>
        }
      />
      <CardContent>
        <ReactApexcharts type='bar' height={400} series={series} options={options} />
        {data?.map((item, index) => {
          const avatarColor = index === 0 ? theme.palette.customColors.purple : theme.palette.customColors.grey;
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(index === 0 && { mt: 0 }),
                // mb: index !== data.length - 1 ? 4 : undefined
                mb: index !== data.length - 1 ? 2.4 : undefined
              }}
            >
              <CustomAvatar
                skin='light'
                variant='rounded'
                // color={avatarColor}
                sx={{ mr: 4, width: 34, height: 34, color:avatarColor }}
              >
                <Icon icon={item.avatarIcon} />
              </CustomAvatar>
              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='h6'>{item.title}</Typography>
                  <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                    {item.subtitle}
                  </Typography>
                </Box>
                <Typography
                  sx={{ fontWeight: 500, color: item.amountDiff === 'negative' ? 'error.main' : 'success.main' }}
                  style={{color: item?.title?.toLowerCase() === 'total profit' ? theme?.palette?.customColors?.grey : theme?.palette?.customColors?.purple, fontWeight:'bold'}}
                >
                  {`${item.amountDiff === 'negative' ? '-' : ''}${item.amount}`}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default AnalyticsTotalEarning
