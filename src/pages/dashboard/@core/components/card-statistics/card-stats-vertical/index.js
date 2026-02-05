// ** MUI Imports
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Component Import
import Icon from '../../../../@core/components/icon'
import CustomChip from '../../../../@core/components/mui/chip'
import CustomAvatar from '../../../../@core/components/mui/avatar'
// import Icon from 'src/@core/components/icon'
// import CustomChip from 'src/@core/components/mui/chip'
// import CustomAvatar from 'src/@core/components/mui/avatar'

const CardStatsVertical = props => {
  // ** Props
  const {
    sx,
    stats,
    title,
    chipText,
    subtitle,
    avatarIcon,
    avatarSize = 44,
    iconSize = '1.75rem',
    chipColor = 'primary',
    avatarColor = 'primary'
  } = props
  const RenderChip = chipColor === 'default' ? Chip : CustomChip

  return (
    <Card  className='fs_analytics_l'  style={{ height:'100px',display:'flex', justifyContent:'center', alignItems:'center', boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}} sx={{ ...sx }}>
      <Typography variant='h1' className='fs_analytics_l' color='primary'>Optigo Dashboard</Typography>
      {/* <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <CustomAvatar
          skin='light'
          variant='rounded'
          color={avatarColor}
          sx={{ mb: 3.5, width: avatarSize, height: avatarSize }}
        >
          <Icon icon={avatarIcon} fontSize={iconSize} />
        </CustomAvatar>
        <Typography variant='h5' sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant='body2' sx={{ mb: 1, color: 'text.disabled' }}>
          {subtitle}
        </Typography>
        <Typography sx={{ mb: 3.5, color: 'text.secondary' }}>{stats}</Typography>
        <RenderChip
          size='small'
          label={chipText}
          color={chipColor}
          {...(chipColor === 'default'
            ? { sx: { borderRadius: '4px', color: 'text.secondary' } }
            : { rounded: true, skin: 'light' })}
        />
      </CardContent> */}
    </Card>
  )
}

export default CardStatsVertical
