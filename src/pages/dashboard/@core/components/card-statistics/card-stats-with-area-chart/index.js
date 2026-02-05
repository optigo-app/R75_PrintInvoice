// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Component Imports
// import Icon from 'src/@core/components/icon'
// import CustomAvatar from 'src/@core/components/mui/avatar'
// import ReactApexcharts from 'src/@core/components/react-apexcharts'
import Icon from '../../../../@core/components/icon'
import CustomAvatar from '../../../../@core/components/mui/avatar'
import ReactApexcharts from '../../../../@core/components/react-apexcharts'

const CardStatsWithAreaChart = props => {
  // ** Props
  const {
    sx,
    stats,
    title,
    avatarIcon,
    chartSeries,
    avatarSize = 42,
    chartColor = 'primary',
    avatarColor = 'primary',
    avatarIconSize = '1.625rem'
  } = props

  // ** Hook
  const theme = useTheme()

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 2.5,
      curve: 'smooth'
    },
    grid: {
      show: false,
      padding: {
        top: 2,
        bottom: 17
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityTo: 0,
        opacityFrom: 1,
        shadeIntensity: 1,
        stops: [0, 100],
        colorStops: [
          [
            {
              offset: 0,
              opacity: 0.4,
              color: `${theme?.palette?.customColors?.green}`
            },
            {
              offset: 100,
              opacity: 0.1,
              color: `${theme?.palette?.customColors?.green}`
            }
          ]
        ]
      }
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: 'light',
        shadeIntensity: 1,
        color: `${theme?.palette?.customColors?.green}`
      }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false }
  }

  return (
    <Card  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}} sx={{ ...sx, pb:0.5 }}>
      <CardContent sx={{ pb: 0.4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <CustomAvatar skin='light' color={avatarColor} sx={{ mb: 2.5, width: avatarSize, height: avatarSize, backgroundColor:`#DCF6E8` }}>
          <Icon icon={avatarIcon} fontSize={avatarIconSize} color={`${theme?.palette?.customColors?.green}`} />
        </CustomAvatar>
        <Typography variant='h5' className='fs_analytics_l'>{stats}</Typography>
        <Typography variant='body2' className='fs_analytics_l'>{title}</Typography>
      </CardContent>
      <ReactApexcharts type='area' height={110} options={options} series={chartSeries}  />
    </Card>
  )
}

export default CardStatsWithAreaChart
