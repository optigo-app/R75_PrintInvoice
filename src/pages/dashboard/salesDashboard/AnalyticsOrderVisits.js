// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Custom Components Imports
// import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomAvatar from '../@core/components/mui/avatar'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'
import Icon from '../@core/components/icon'
import { useTheme } from '@mui/material';

// #28C76F
const AnalyticsOrderVisits = ({tkn}) => {
  const theme = useTheme();
  return (
    <Card style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}}>
      <CardContent sx={{ p: theme => `${theme.spacing(1.5)} !important` }}>
        <Box sx={{ gap: 2, mb: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <Typography variant='body2' sx={{ color: 'text.disabled' }} className='fs_analytics_l'>
              Sales Overview
            </Typography>
            <Typography variant='h4' className='fs_analytics_l'>$42.5k</Typography>
          </div>
          <Typography sx={{ fontWeight: 1000, color: `${theme?.palette?.customColors?.green}` }} className='fs_analytics_l'>+18.2%</Typography>
        </Box>
        <Box sx={{ mb: 3.5, gap: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ py: 2.25, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='info' variant='rounded' sx={{ mr: 1.5, height: 24, width: 24 }}>
                <Icon icon='tabler:shopping-cart' color={`${theme?.palette?.customColors?.info}`} fontSize='1.125rem' />
              </CustomAvatar>
              <Typography sx={{ color: 'text.secondary' }} className='fs_analytics_l'>Order</Typography>
            </Box>
            <Typography variant='h5' className='fs_analytics_l'>62.2%</Typography>
            <Typography variant='body2' className='fs_analytics_l' sx={{ color: 'text.disabled' }}>
              6,440
            </Typography>
          </Box>
          <Divider flexItem sx={{ m: 0 }} orientation='vertical'>
            <CustomAvatar
              skin='light'
              color='secondary'
              sx={{ height: 24, width: 24, fontSize: '0.6875rem', color: 'text.secondary' }}
              className='fs_analytics_l'
            >
              VS
            </CustomAvatar>
          </Divider>
          <Box sx={{ py: 2.55, display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 1.5, color: 'text.secondary' }} className='fs_analytics_l'>Visits</Typography>
              <CustomAvatar skin='light' variant='rounded' sx={{ height: 24, width: 24 }}>
                <Icon icon='tabler:link' fontSize='1.125rem' color={`${theme?.palette?.customColors?.info}`} />
              </CustomAvatar>
            </Box>
            <Typography variant='h5' className='fs_analytics_l'>25.5%</Typography>
            <Typography variant='body2' sx={{ color: 'text.disabled' }} className='fs_analytics_l'>
              12,749
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          value={65}
          variant='determinate'
          sx={{
            height: 10,
            // '&.MuiLinearProgress-colorInfo': { backgroundColor: `${theme?.palette?.customColors?.purple}` },
            '&.MuiLinearProgress-colorInfo': { borderRadius:'10px' },
            '& .MuiLinearProgress-bar': {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderRadius:'10px',
              backgroundColor:`${theme?.palette?.customColors?.info}`
            },
          }}
          style={{
            backgroundColor:`${theme?.palette?.customColors?.purple}`,
            borderRadius:'10px'
          }}
        />
      </CardContent>
    </Card>
  )
}

export default AnalyticsOrderVisits
