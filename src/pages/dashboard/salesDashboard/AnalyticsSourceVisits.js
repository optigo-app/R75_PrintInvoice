// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'
import Icon from '../@core/components/icon'

// ** Custom Components Imports
// import CustomChip from 'src/@core/components/mui/chip'
import CustomChip from '../@core/components/mui/chip'
// import OptionsMenu from 'src/@core/components/option-menu'
import OptionsMenu from '../@core/components/option-menu'

import imgIcon from "../images/banners/banner-1.jpg"
import { useTheme } from '@mui/material';

const data = [
  {
    amount: '1.2k',
    trendNumber: 4.2,
    icon: 'tabler:shadow',
    title: 'Direct Source',
    subtitle: 'Direct link click'
  },
  {
    amount: '31.5k',
    trendNumber: 8.2,
    icon: 'tabler:globe',
    title: 'Social Networks',
    subtitle: 'Social Channels'
  },
  {
    amount: '893',
    trendNumber: 2.4,
    icon: 'tabler:mail',
    title: 'Email Newsletter',
    subtitle: 'Mail Campaigns'
  },
  {
    amount: '342',
    trendNumber: 0.4,
    trend: 'negative',
    title: 'Referrals',
    icon: 'tabler:external-link',
    subtitle: 'Impact Radius Visits'
  },
  {
    title: 'ADVT',
    amount: '2.15k',
    trendNumber: 9.1,
    subtitle: 'Google ADVT',
    icon: 'tabler:discount-2'
  },
  {
    title: 'Other',
    amount: '12.5k',
    trendNumber: 6.2,
    icon: 'tabler:star',
    subtitle: 'Many Sources'
  }
]

const AnalyticsSourceVisits = () => {
  const theme = useTheme();
  return (
    <Card className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
      <CardHeader
        title='Source Visits'
        subheader='38.4k Visitors'
        action={
          <OptionsMenu
            options={['Last Week', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent>
        {data.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                // mb: index !== data.length - 1 ? [6.25, 6.25, 5.5, 6.25] : undefined
                mb: index !== data.length - 1 ? [4] : undefined
              }}
            >
              {/* <Avatar variant='rounded' sx={{ mr: 4, width: 34, height: 34 }}>
                <Icon icon={item.icon} />
              </Avatar> */}
              <Avatar variant='rounded' sx={{ mr: 4, width: 34, height: 34 }}>
                <img 
                  src={imgIcon} 
                  alt="Project Icon" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </Avatar>
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 4, color: 'text.secondary' }}>{item.amount}</Typography>
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    bgColor={item?.trend === 'negative' ? `${theme?.palette?.customColors?.lightBgRed}` : `${theme?.palette?.customColors?.lightBgGreen}`}
                    sx={{ 
                      lineHeight: 1, color: item?.trend === 'negative' ? `${theme?.palette?.customColors?.red}` : `${theme?.palette?.customColors?.green}`, fontWeight:'bold',
                      backgrounColor: item?.trend === 'negative' ? `${theme?.palette?.customColors?.lightBgRed}` : `${theme?.palette?.customColors?.lightBgGreen}`
                    }}
                    // color={item.trend === 'negative' ? 'error' : 'success'}
                    label={`${item.trend === 'negative' ? '-' : '+'}${item.trendNumber}%`}
                  />
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default AnalyticsSourceVisits
