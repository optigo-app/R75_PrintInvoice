// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
// import Tab from '@mui/material/Tab'
// import TabList from '@mui/lab/TabList'
// import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import TabContext from '@mui/lab/TabContext'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// ** Custom Components Import
// import Icon from 'src/@core/components/icon'
// import OptionsMenu from 'src/@core/components/option-menu'
// import CustomAvatar from 'src/@core/components/mui/avatar'
// import ReactApexcharts from 'src/@core/components/react-apexcharts'
import Icon from '../../@core/components/option-menu'
import OptionsMenu from '../../@core/components/option-menu'

import ReactApexcharts from '../../@core/components/react-apexcharts'

// ** Util Import
// import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { hexToRGBA } from '../../@core/utils/hex-to-rgba'
import { CircularProgress, Tab } from '@mui/material';
import { TabList, TabPanel } from '@mui/lab';
import { capitalizeFirstLetter, fetchDashboardData, formatAmount, formatAmountKWise } from '../../GlobalFunctions';
import { useSelector } from 'react-redux'




const WastageWiseLabourPGram = ({tkn,  fdate, tdate}) => {

  const { loading, data, error } = useSelector(state => state?.Summary_Purchase);
  

  // ** State
  const [value, setValue] = useState('Wastage');


  const [apiData, setApiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);


  const [vendorNameList, setVendorNameList] = useState([]);
  const [wastageList, setWastageList] = useState([]);

  // useEffect(() => {

  //   const fetchData = async () => {
  //     try {

  //       // Fetch MonthWiseSaleAmount data
  //       let CustomerWiseSaleAmount = await fetchDashboardData(tkn,  fdate, tdate, "CustomerWiseSaleAmount");
  //       setApiData(CustomerWiseSaleAmount);
  //       setFilteredData(CustomerWiseSaleAmount);

  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  
  //   // fetchData(); 

  // },[fdate, tdate]);

  
  const custNames = ['TIFFANY', 'XBO', 'SA', 'CHOW', 'YF', 'KK', 'Pariya', 'Nancy']?.map((e) => capitalizeFirstLetter(e));

  const NetWtArr = [3.99, 2.74, 2.86, 5.89, 24.65, 1.24, 3.14, 12.76];
  const JobCountArr = [7, 42, 367, 7953, 779, 1581, 200, 150];
  const DiaPcsArr = [7, 21, 4, 1, 10, 17, 43, 57];
  const DiaCaratArr = [30.19, 29.89,22.17,22.15,22.10,18,15.94,18.90];

  const tabData = [
    {
      type: 'Wastage',
      series: [{ data: wastageList }]
    },
    // {
    //   type: 'Job Count',
    //   series: [{ data: JobCountArr }]
    // },
    // {
    //   type: 'Dia. Pcs',
    //   series: [{ data: DiaPcsArr }]
    // },
    // {
    //   type: 'Dia. Carat',
    //   series: [{ data: DiaCaratArr }]
    // },
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
                width: 100,
                height: 34,
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
  

  // ** Hook
  const theme = useTheme()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  // const colors = Array(9).fill(hexToRGBA(theme.palette.primary.main, 0.16))
  // const colors = Array(9)?.fill((theme?.palette?.primary?.main))
  const colors = Array(8)?.fill((theme?.palette?.customColors?.purple))

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
      formatter: val => `${formatAmountKWise(val)}`,
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
      // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      // categories: custNames,
      categories: vendorNameList,
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
        formatter: val => `${formatAmountKWise(val)}`,
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
    ]
  }


  useEffect(() => {
    if(data?.DT1?.length > 0){
      let arr = data?.DT1?.slice()?.sort((a,b) => b?.AVG_Wastage - a?.AVG_Wastage)?.slice(0, 8)?.map((e) => e?.Vendor);
      setVendorNameList(arr);
      let arr1 = data?.DT1?.slice()?.sort((a, b) => b?.AVG_Wastage - a?.AVG_Wastage)?.slice(0, 8)?.map((e) => e?.AVG_Wastage);
      setWastageList(arr1);
    }else{
      setVendorNameList([]);
      setWastageList([]);
    }
  },[data?.DT1]);

  return (
    <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
      <CardHeader
        title='Labour / Gm'
        subheader='Vendor wise'
        // action={
        //   <OptionsMenu
        //     options={['Last Week', 'Last Month', 'Last Year']}
        //     iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
        //   />
        // }
      />
      { loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem', minHeight:'394px' }}>
                                    <CircularProgress sx={{color:'lightgrey'}} />
                                    </Box> : <CardContent sx={{ '& .MuiTabPanel-root': { p: 0, pb:0 } }}>
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
            {/* <Tab
              disabled
              value='add'
              label={
                <Box
                  sx={{
                    width: 110,
                    height: 94,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '10px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: `1px dashed ${theme.palette.divider}`
                  }}
                >
                  <Avatar variant='rounded' sx={{ width: 34, height: 34, backgroundColor: 'action.selected' }}>
                    <Icon icon='tabler:plus' />
                  </Avatar>
                </Box>
              }
            /> */}
          </TabList>
          {renderTabPanels(value, theme, options, colors)}
        </TabContext>
      </CardContent>}
    </Card>
  )
}

export default WastageWiseLabourPGram
