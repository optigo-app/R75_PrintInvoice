import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import LinearProgress from '@mui/material/LinearProgress'

import Icon from '../@core/components/icon'
import CustomChip from '../@core/components/mui/chip'
import OptionsMenu from '../@core/components/option-menu'
import CustomAvatar from '../@core/components/mui/avatar'
import ReactApexcharts from '../@core/components/react-apexcharts'
import "./chartcss/analytics.css"
import { hexToRGBA } from '../@core/utils/hex-to-rgba'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { fetchDashboardData, formatAmountKWise } from '../GlobalFunctions';

const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme?.breakpoints?.up('sm')]: {
    paddingTop: '0 !important',
    paddingLeft: '10px !important'
  }
}))

const AnalyticsEarningReports = ({ tkn, fdate, tdate, country, countryCodeSymbol, monthWiseSaleData, jobWisePriceRangeData, summaryData, IsEmpLogin, JobWisePriceRangeData }) => {
  const theme = useTheme();
  const [apiData, setApiData] = useState([]);
  const [apiData2, setApiData2] = useState(null);
  const [prAmount, setPrAmount] = useState(0);

  useEffect(() => {
    const totalCurrentCostSum = jobWisePriceRangeData?.DT1?.reduce((sum, item) => sum + (item.TotalCurrentCost || 0), 0);
    const totalSaleAmt = jobWisePriceRangeData?.DT1?.reduce((sum, item) => sum + (item.TotalSaleAmount || 0), 0);
    const resultAfterMultiplying = totalCurrentCostSum * 0.7;
    const finalData = totalSaleAmt - resultAfterMultiplying;
    setPrAmount(finalData);
    const fetchData = async () => {
      try {
        setApiData(monthWiseSaleData);
        setApiData2(summaryData?.length > 0 ? summaryData[0] : {});

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [monthWiseSaleData, summaryData]);

  const monthCategories = monthWiseSaleData?.map((e) => e?.Month_Name);
  const amountWise = monthWiseSaleData?.map((e) => e?.SaleAmount || 0);
  const series = [{ data: amountWise }]
  const maxSaleAmount = Math.max(...amountWise);
  const colors = amountWise?.map((amount) =>
    amount === maxSaleAmount
      ? hexToRGBA(theme?.palette?.customColors?.purple, 1)
      : hexToRGBA(theme?.palette?.customColors?.purple, 1)
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
        columnWidth: '35%',
        startingShape: 'rounded',
        dataLabels: { position: 'top' }
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: {
      offsetY: -15,
      // formatter: val => `${formatAmount(val)}`,
      formatter: val => `${formatAmountKWise((val / (+country)))}`,
      style: {
        fontWeight: 500,
        colors: [theme.palette.text.secondary],
        fontSize: theme.typography.body1.fontSize
      }
    },
    colors,
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
        top: 20,
        left: -5,
        right: -8,
        bottom: -12
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { color: theme.palette.divider },
      categories: monthCategories,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -15,
        formatter: val => `${formatAmountKWise(((val / (+country))))}`,
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    // yaxis:{show:false},
    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: { columnWidth: '60%' }
          },
          grid: {
            padding: { right: 20 }
          }
        }
      }
    ]
  }

  const data = [
    {
      progress: 100,
      stats: `${formatAmountKWise(((summaryData?.SaleAmount / (+country)) || 0))}`,
      title: 'Sales Amount',
      avatarColor: 'primary',
      progressColor: 'primary',
      avatarIcon: `${country == '7.8' ? 'tabler:currency-dollar' : 'tabler:currency-rupee'}`
    },
    ...(IsEmpLogin === 0 ? [{
      progress: 100,
      stats: `${formatAmountKWise(((prAmount / (+country)) || 0))}`,
      title: 'Profits Amount',
      avatarColor: 'info',
      progressColor: 'info',
      avatarIcon: `${country == '7.8' ? 'tabler:currency-dollar' : 'tabler:currency-rupee'}`
    }] : []),
    {
      progress: 100,
      stats: `${((summaryData?.NoOfCustomer)) || 0}`,
      title: 'Customers',
      avatarColor: 'error',
      progressColor: 'error',
      avatarIcon: 'tabler:user'
    }
  ];


  return (
    <Card className='fs_analytics_l' style={{ boxShadow: '0px 4px 18px 0px rgba(47, 43, 61, 0.1)' }}>
      <CardHeader
        sx={{ pb: 0 }}
        title='Summary'
        subheader=''
        className='fs_analytics_l'
      />
      <CardContent>

        <Box sx={{ borderRadius: 1, p: theme?.spacing(2, 3), border: `1px solid ${theme?.palette?.divider}` }}>
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
                    <Icon fontSize='1.125rem' icon={item.avatarIcon} />
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
        </Box>

        <Grid container spacing={6} sx={{ pt: 6.4 }}>
          <StyledGrid
            item
            sm={0.5}
            xs={12}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end' }}
          >
          </StyledGrid>
          <StyledGrid item xs={12} sm={11.5} >
            <ReactApexcharts type='bar' height={200} className='fs_analytics_l' series={series} options={options} />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsEarningReports
