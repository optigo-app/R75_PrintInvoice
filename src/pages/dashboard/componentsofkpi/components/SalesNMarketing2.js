// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { CircularProgress, useTheme } from '@mui/material';
import {  formatAmountRound } from '../../GlobalFunctions';
import { checkNullUndefined } from './global';
import { useSelector } from 'react-redux';
//SALES AND MARKETING 1ST BLOCK
const SalesNMarketing2 = ({ bgColor,  saleMTs, saleMTsLoader}) => {

  const SaleMarketingTotalSale = useSelector(state => state?.SaleMarketingTotalSale);
  

  const theme = useTheme();
const data5 = [
  {
  stats: `₹ ${formatAmountRound(parseFloat(checkNullUndefined(SaleMarketingTotalSale?.data?.DT?.Amount))?.toFixed(2))}`,
  title: 'Total Sale Amt',
  },
 {
  stats: `₹ ${formatAmountRound((checkNullUndefined(SaleMarketingTotalSale?.data?.DT?.MetalAmount))?.toFixed(2))}`,
  title: 'Metal Amt',
  },
 {
  stats: `₹ ${formatAmountRound((checkNullUndefined(SaleMarketingTotalSale?.data?.DT?.DiamondAmount))?.toFixed(2))}`,
  title: 'Diamond Amt',
},
 {
  stats: `₹ ${formatAmountRound((checkNullUndefined(SaleMarketingTotalSale?.data?.DT?.ColorStoneAmount))?.toFixed(2))}`,
  title: 'Color Stone Amt',
},
{
  // stats: `₹ ${formatAmountRound((checkNullUndefined((saleMTs?.LabourAmount - saleMTs?.OtherAmount)))?.toFixed(2))}`,
  stats: `₹ ${formatAmountRound((checkNullUndefined((SaleMarketingTotalSale?.data?.DT?.LabourAmount)))?.toFixed(2))}`,
  title: 'Labour Amt (L+DH+S)',
},
// {
//   stats: `₹ ${(formatAmountRound((checkNullUndefined((saleMTs?.OtherAmount + saleMTs?.DeliveryCharged)))?.toFixed(2))) === NaN ? 0 : formatAmountRound((checkNullUndefined((saleMTs?.OtherAmount + saleMTs?.DeliveryCharged)))?.toFixed(2))}`,
//   title: 'Other Charges (O+D+M)',
// }
{
  stats: `₹ ${formatAmountRound(checkNullUndefined((SaleMarketingTotalSale?.data?.DT?.OtherAmount || 0) + (SaleMarketingTotalSale?.data?.DT?.DeliveryCharged || 0)) || 0)}`,
  title: 'Other Charges (O+D+M)',
}

];

  return (
    <Card className={`fs_analytics_l ${saleMTsLoader ? 'center_kpi' : ''}`}  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'230px'}}>

      <CardContent  sx={{
        maxHeight: '412px',
        overflow: 'auto',
        paddingBottom:'0px',
        '&::-webkit-scrollbar': {
          width: '6px',  // Customize scrollbar width
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#BDBDBD',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      }}>
        { SaleMarketingTotalSale?.loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem',  }}>
              <CircularProgress sx={{color:'lightgrey'}} />
            </Box> : data5?.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                '& img': { mr: 4 },
                alignItems: 'center',
                // mb: index !== saleMTs?.length - 1 ? 1.89 : undefined,
                mb: 1,
                pb:0,
              }}
            >


              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom:'0px'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='h6' color={bgColor} >{checkNullUndefined(item?.title)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    '& svg': { mr: 1 },
                    alignItems: 'center',
                   }}
                >
                  <Typography variant='h6' color={theme?.palette?.grey?.[700]} sx={{fontWeight:'bolder'}}>{`${(checkNullUndefined(item?.stats))}`}</Typography>
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default SalesNMarketing2;