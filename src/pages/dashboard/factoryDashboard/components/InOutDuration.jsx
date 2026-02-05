// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
// import CustomTextField from 'src/@core/components/mui/text-field'
import CustomTextField from '../../@core/components/mui/text-field'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'
import Icon from '../../@core/components/icon'

// ** Component Import
import ReactApexcharts from '../../@core/components/react-apexcharts'
import { useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'

const columnColors = {
  bg: '#f8d3ff',
  series1: '#826af9',
  series2: '#d2b0ff'
}



const InOutDuration = () => {

  const { loading, data, error } = useSelector(state => state?.Vendor_In_Out_Duration);

  // ** Hook
  const theme = useTheme();

  // ** States
  const [endDate, setEndDate] = useState(null)
  const [startDate, setStartDate] = useState(null);

  const [vendorNameList, setVendroNameList] = useState([]);
  const [IOTimeList, setIOTimeList] = useState([]);
  const [countList, setCountList] = useState([]);

  const options = {
    chart: {
      offsetX: -10,
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    fill: { opacity: 1 },
    dataLabels: { enabled: false },
    colors: [columnColors.series1, columnColors.series2],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: { colors: theme.palette.text.secondary },
      markers: {
        offsetY: 1,
        offsetX: -3
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    stroke: {
      show: true,
      colors: ['transparent']
    },
    plotOptions: {
      bar: {
        columnWidth: '20%',
        colors: {
          backgroundBarRadius: 10,
          backgroundBarColors: [columnColors.bg, columnColors.bg, columnColors.bg, columnColors.bg, columnColors.bg]
        }
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true }
      }
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      categories: vendorNameList,
      crosshairs: {
        stroke: { color: theme.palette.divider }
      },
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    tooltip: {
      y: {
        formatter: function (val, { dataPointIndex }) {
          return `${val}  <span style="font-weight: normal;">Count: <strong>${countList[dataPointIndex] || 0}</strong></span>`;
        }
      }
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '35%'
            }
          }
        }
      }
    ]
  }

  const CustomInput = forwardRef((props, ref) => {
    const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return (
      <CustomTextField
        {...props}
        value={value}
        inputRef={ref}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Icon fontSize='1.25rem' icon='tabler:calendar-event' />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position='end'>
              <Icon fontSize='1.25rem' icon='tabler:chevron-down' />
            </InputAdornment>
          )
        }}
      />
    )
  })

  const handleOnChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  useEffect(() => {
    if (data?.DT?.length > 0) {
      let arr = data?.DT?.slice()?.sort((a, b) => b?.TotalJobCnt - a?.TotalJobCnt)?.slice(0, 10)?.map((e) => e?.Vendor);
      setVendroNameList(arr);
      let arr2 = data?.DT?.slice()?.sort((a, b) => b?.TotalJobCnt - a?.TotalJobCnt)?.slice(0, 10)?.map((e) => e?.AVG_DayDiff);
      setIOTimeList(arr2);
      let arr3 = data?.DT?.slice()?.sort((a, b) => b?.TotalJobCnt - a?.TotalJobCnt)?.slice(0, 10)?.map((e) => e?.TotalJobCnt);
      setCountList(arr3);
    } else {
      setVendroNameList([]);
      setIOTimeList([]);
      setCountList([]);
    }
  }, [data?.DT]);

  const series = [
    //   {
    //     name: 'Apple',
    //     data: [90, 120, 55, 100, 80, 125, 175, 70, 88]
    //   },
    //   {
    //     name: 'Samsung',
    //     data: [85, 100, 30, 40, 95, 90, 30, 110, 62]
    //   }
    {
      name: 'I/O Time',
      data: IOTimeList ?? [14, 15, 1555, 16, 16, 32, 42, 42]
    },
    // {
    //   name: 'Count',
    //   data: countList ?? [200, 1581, 7953, 289, 7, 367, 42, 779]
    // }
  ]

  return (
    <Card className='fs_facd bs_facd' sx={{ boxShadow: '0px 4px 18px 0px rgba(47, 43, 61, 0.1)' }}>
      <CardHeader
        title='In/Out Duration ( Vendorwise Sold )'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] },
        }}
      // action={
      //   <DatePicker
      //     selectsRange
      //     endDate={endDate}
      //     selected={startDate}
      //     id='apexchart-column'
      //     startDate={startDate}
      //     onChange={handleOnChange}
      //     placeholderText='Click to select a date'
      //     customInput={<CustomInput start={startDate} end={endDate} />}
      //   />
      // }
      />
      {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '1rem', minHeight: '440px' }}>
        <CircularProgress sx={{ color: 'lightgrey' }} />
      </Box> : <CardContent >
        <ReactApexcharts type='bar' height={443} options={options} series={series} />
      </CardContent>}
    </Card>
  )
}

export default InOutDuration
