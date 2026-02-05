import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import TabContext from '@mui/lab/TabContext'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import ReactApexcharts from '../@core/components/react-apexcharts'
import { hexToRGBA } from '../@core/utils/hex-to-rgba'
import { Tab } from '@mui/material';
import { TabList, TabPanel } from '@mui/lab';
import { capitalizeFirstLetter, fetchDashboardData, formatAmount, formatAmountKWise } from '../GlobalFunctions';

const CustWiseSalesProfitAmount = ({ tkn, fdate, tdate, country, CustomerWiseSaleAmountData, IsEmpLogin }) => {
  console.log('CustomerWiseSaleAmountData: ', CustomerWiseSaleAmountData);
  const theme = useTheme()
  const [value, setValue] = useState('sales');
  const [apiData, setApiData] = useState([]);
  console.log('apiData: ', apiData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transformedData = CustomerWiseSaleAmountData?.map(item => {
          const adjustedCost = ((item?.CurrentCost - item?.CurrentCost_SaleReturn) || 0) * 0.7;
          const adjustedProfit = (item?.SaleAmount || 0) - adjustedCost;

          return {
            CustomerDisplay: `${item.Customer} (${item.CompanyName})`,
            ...item,
            AdjustedProfit: adjustedProfit
          };
        });

        setApiData(transformedData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [CustomerWiseSaleAmountData]);


  const salesAmt = apiData?.map((e) => e?.SaleAmount);
  const ProfitAmt = apiData?.map((e) => e?.AdjustedProfit);
  const custNames = apiData?.map((e) => capitalizeFirstLetter(e?.CompanyName));

  const tabData = [
    {
      type: 'sales',
      avatarIcon: 'tabler:chart-bar',
      series: [{ data: salesAmt }]
    },
    ...(IsEmpLogin === 0 ? [{
      type: 'profit',
      avatarIcon: 'tabler:currency-dollar',
      series: [{ data: ProfitAmt }]
    }] : []),
  ]

  const renderTabs = (value, theme) => {
    return tabData?.map((item, index) => {
      const RenderAvatar = item.type === value ? Avatar : Avatar

      return (
        <Tab
          key={index}
          value={item.type}
          label={
            <Box
              sx={{
                width: 70,
                height: 54,
                borderWidth: 1,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '10px',
                flexDirection: 'column',
                justifyContent: 'center',
                borderStyle: item.type === value ? 'solid' : 'dashed',
                borderColor: item.type === value ? theme?.palette?.customColors?.purple : theme?.palette?.divider
              }}
            >
              <Typography sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
                {item.type}
              </Typography>
            </Box>
          }
        />
      )
    })
  }

  const renderTabPanels = (value, theme, options, colors) => {
    return tabData.map((item, index) => {
      const max = Math?.max(...item?.series[0]?.data)
      const seriesIndex = item?.series[0]?.data?.indexOf(max)
      const finalColors = colors?.map((color, i) => (seriesIndex === i ? hexToRGBA(theme?.palette?.customColors?.purple, 1) : color))

      return (
        <TabPanel key={index} value={item?.type} >
          <ReactApexcharts type='bar' height={300} options={{ ...options, colors: finalColors }} series={item?.series} />
        </TabPanel>
      )
    })
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const colors = Array(10)?.fill((theme?.palette?.customColors?.purple))

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
    legend: {
      show: false
    },

    tooltip: {
      enabled: true,
      shared: false,
      intersect: false,
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const customerName = w.globals.labels[dataPointIndex];
        const value = w.globals.series[seriesIndex][dataPointIndex];
        return `
          <div style="padding: 8px;">
        <span style="font-size: 14px; color: #333; display: block; margin-bottom: 5px;">
          <b>${customerName}</b>
        </span>
        <hr style="margin: 5px 0; border: 0; border-top: 1px solid #e0e0e0;">
        <span style="font-size: 12px; color: #888;">Sale Amt: </span>
        <span style="font-size: 12px; color: #333;"><b>${formatAmountKWise(value / (+country))}</b></span>
      </div>
        `;
      }
    },
    dataLabels: {
      offsetY: -15,
      formatter: val => `${formatAmountKWise((val / (+country)))}`,
      style: {
        fontWeight: 500,
        colors: [theme.palette.text.secondary],
        fontSize: theme.typography.body1.fontSize
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { color: theme.palette.divider },
      categories: custNames,
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
        formatter: val => `${formatAmountKWise((val / (+country)))}`,
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
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
    ],
  };

  return (
    <Card className='fs_analytics_l' style={{ boxShadow: '0px 4px 18px 0px rgba(47, 43, 61, 0.1)' }}>
      <CardHeader
        title='Top Customers'
        subheader='Sale Amount and Profit Amount'
      />
      <CardContent sx={{ '& .MuiTabPanel-root': { p: 0, pb: 0 } }}>
        <TabContext value={value}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='earning report tabs'
            sx={{
              border: '0 !important',
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': { p: 0, minWidth: 0, borderRadius: '10px', '&:not(:last-child)': { mr: 4 } }
            }}
          >
            {renderTabs(value, theme)}
          </TabList>
          {renderTabPanels(value, theme, options, colors)}
        </TabContext>
      </CardContent>
    </Card>
  )
}

export default CustWiseSalesProfitAmount
