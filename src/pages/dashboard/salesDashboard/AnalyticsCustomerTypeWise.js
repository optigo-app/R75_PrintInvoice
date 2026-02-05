// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import LinearProgress from '@mui/material/LinearProgress'

// ** Custom Components Imports
// import Icon from 'src/@core/components/icon'
import Icon from '../@core/components/icon'
import CustomChip from '../@core/components/mui/chip'
import OptionsMenu from '../@core/components/option-menu'
import CustomAvatar from '../@core/components/mui/avatar'
import ReactApexcharts from '../@core/components/react-apexcharts'

import "./chartcss/analytics.css"
// ** Util Import
// import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { hexToRGBA } from '../@core/utils/hex-to-rgba'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { fetchDashboardData, formatAmount } from '../GlobalFunctions';

// const series = [{ data: [37, 76, 65, 41, 99, 53, 70, 45, 30, 120] }]

// const data = [
//   {
//     progress: 64,
//     stats: '$545.69',
//     title: 'Earnings',
//     avatarColor: 'primary',
//     progressColor: 'primary',
//     avatarIcon: 'tabler:currency-dollar'
//   },
//   {
//     progress: 59,
//     title: 'Profit',
//     stats: '$256.34',
//     avatarColor: 'info',
//     progressColor: 'info',
//     avatarIcon: 'tabler:chart-pie-2'
//   },
//   {
//     progress: 22,
//     stats: '$74.19',
//     title: 'Expense',
//     avatarColor: 'error',
//     progressColor: 'error',
//     avatarIcon: 'tabler:brand-paypal'
//   }
// ]

const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme?.breakpoints?.up('sm')]: {
    paddingTop: '0 !important',
    paddingLeft:'10px !important'
  }
}))

const AnalyticsCustomerTypeWise = ({tkn}) => {

  const [apiData, setApiData] = useState([]);
  const [apiData2, setApiData2] = useState(null);
  useEffect(() => {

    const fetchData = async () => {
      try {
        // Fetch MonthWiseSaleAmount data
        const monthWiseSaleData = await fetchDashboardData(tkn, "CustomerTypeWiseSaleAmount");
        setApiData(monthWiseSaleData);
  
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData(); 

  },[]);

  // const fetchMonthWiseSaleAmountData = async() => {
  //   try {
  //     const url = "http://zen/jo/api-lib/App/DashBoard";
  //     const body = JSON.stringify({
  //       "Token" : "9065471700535651"  
  //       ,"ReqData":"[{\"Token\":\"9065471700535651\",\"Evt\":\"MonthWiseSaleAmount\"}]"
  //     });
  //     const body2 = JSON.stringify({
  //       "Token" : "9065471700535651"  
  //       ,"ReqData":"[{\"Token\":\"9065471700535651\",\"Evt\":\"Summary\"}]"
  //     });
  //     const response = await axios.post(url, body);
  //     if(response?.data?.Status === '200'){
  //       if(response?.data?.Data?.DT?.length > 0){
  //         setApiData(response?.data?.Data?.DT)
  //       }else{
  //         setApiData([]);
  //       }
  //     }
  //     const response2 = await axios.post(url, body2);
  //     if(response2?.data?.Status === '200'){
  //       if(response2?.data?.Data?.DT?.length > 0){
  //         setApiData2(response2?.data?.Data?.DT[0])
  //       }else{
  //         setApiData([]);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // ** Hook
  const theme = useTheme();

  const monthCategories = apiData?.map((e) => e?.CustomerType);
  const amountWise = apiData?.map((e) => e?.SaleAmount || 0);
  const series = [{ data: amountWise }]
  const maxSaleAmount = Math.max(...amountWise);
  const colors = amountWise?.map((amount) =>
    amount === maxSaleAmount
      ? hexToRGBA(theme?.palette?.customColors?.purple, 1) // Highlight color
      : hexToRGBA(theme?.palette?.customColors?.littlelightBgPurple, 0.16) // Default color
  );
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '42%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    legend: { show: false },
    // tooltip: { enabled: false },
    tooltip: { 
      enabled: false,
      // shared: true,
      y: {
        formatter: function (val) {
          return `$${val?.toFixed(2)}`; // Displays amount in tooltip
        },
        title: {
          formatter: function(seriesName) {
            return "Amount"; // Custom title if you need
          }
        }
      }
    },
    // dataLabels: { enabled: true },
    dataLabels: {
      enabled: false,
      style: {
        colors: [theme?.palette?.text?.primary], // Custom color
        fontSize: '12px',                      // Font size
        fontFamily: theme?.typography?.fontFamily,
        fontWeight: 'normal',
        position:"relative",
        top:0
      },
      formatter: function (val) {
        return `$${val.toFixed(2)}`;           // Format the label
      },
      offsetY: 50,                              // Position adjustment
      dropShadow: {
        enabled: false,                         // Adds shadow to data labels
        color: '#000',
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.45
      },
      // orientation: 'vertical',
      // transform: `rotate(180deg)`,
    },
    colors:colors,
    // colors: [
    //   hexToRGBA(theme?.palette?.customColors?.littlelightBgPurple, 0.16),
    //   hexToRGBA(theme?.palette?.customColors?.littlelightBgPurple, 0.16),
    //   hexToRGBA(theme?.palette?.customColors?.littlelightBgPurple, 0.16),
    //   hexToRGBA(theme?.palette?.customColors?.littlelightBgPurple, 0.16),
    //   hexToRGBA(theme?.palette?.customColors?.purple, 1),
    //   hexToRGBA(theme?.palette?.customColors?.littlelightBgPurple, 0.16),
    //   hexToRGBA(theme?.palette?.customColors?.littlelightBgPurple, 0.16),
    //   hexToRGBA(theme?.palette?.customColors?.littlelightBgPurple, 0.16),
    // ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -28,
        left: -9,
        right: -10,
        bottom: -12
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      // categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      categories: monthCategories,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    yaxis: { show: false }
  }
  
  const data = [
    {
      progress: 64,
      stats: `${formatAmount((apiData2?.SaleAmount || 0))}`,
      title: 'Sales Amount',
      avatarColor: 'primary',
      progressColor: 'primary',
      // avatarIcon: 'tabler:currency-dollar'
      avatarIcon: 'tabler:currency-rupee'
    },
    {
      progress: 59,
      stats: `${formatAmount((apiData2?.Profit || 0))}`,
      title: 'Profits Amount',
      avatarColor: 'info',
      progressColor: 'info',
      // avatarIcon: 'tabler:chart-pie-2'
      avatarIcon: 'tabler:sum'
    },
    {
      progress: 22,
      stats: `${apiData2?.NoOfCustomer || 0}`,
      title: 'Customers',
      avatarColor: 'error',
      progressColor: 'error',
      // avatarIcon: 'tabler:brand-paypal'
      avatarIcon: 'tabler:user'
    }
  ];

  return (
    <Card className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
      <CardHeader
        sx={{ pb: 0 }}
        title='Summary'
        subheader=''
        action={
          <OptionsMenu
            options={['Last Week', 'Last Month', 'Last Year']}
            className="fs_analytics_l"
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
        className='fs_analytics_l'
      />
      <CardContent>
        <Grid container spacing={6}>
          <StyledGrid
            item
            sm={3}
            xs={12}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end' }}
          >
            {/* <Box sx={{ mb: 1, rowGap: 1, columnGap: 2.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', width:'100%' }}>
              <Typography variant='h2' color={theme?.palette?.grey?.A700} sx={{fontWeight:'400', paddingLeft:'12%'}} className='fs_analytics_l'>$468</Typography>
              <CustomChip rounded size='small' skin='light' color='success' label='+4.2%' />
            </Box>
            <Typography variant='body2' className='fs_analytics_l fs_analytics_normal' sx={{paddingLeft:'12%'}}>this week compared to last week</Typography> */}
          </StyledGrid>
          <StyledGrid item xs={12} sm={9} >
            <ReactApexcharts type='bar'  height={435} className='fs_analytics_l' series={series} options={options} />
          </StyledGrid>
        </Grid>

        {/* <Box sx={{ mt: 4.5, borderRadius: 1, p: theme?.spacing(2, 3), border: `1px solid ${theme?.palette?.divider}` }}>
          <Grid container spacing={6}>
            {data?.map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color={item.avatarColor}
                    sx={{ mr: 2, width: 26, height: 26 }}
                  >
                    <Icon fontSize='1.125rem'  icon={item.avatarIcon} />
                  </CustomAvatar>
                  <Typography variant='h5' className='fs_analytics_l'>{item.title}</Typography>
                </Box>
                <Typography variant='h4' sx={{ pb: 1 }} className='fs_analytics_l'>
                  {item.stats}
                </Typography>
                <LinearProgress
                  variant='determinate'
                  value={item.progress}
                  color={item.progressColor}
                  sx={{ height: 4 }}
                  className='fs_analytics_l'
                />
              </Grid>
            ))}
          </Grid>
        </Box> */}
      </CardContent>
    </Card>
  )
}

export default AnalyticsCustomerTypeWise
