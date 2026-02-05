import React from 'react'
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { CircularProgress, useTheme } from '@mui/material';
import { checkNullUndefined, safeValue } from './global';
import { useSelector } from 'react-redux'
const ProductDevelopment = ({ bgColor, PrdDev, PDLoader}) => {

  const PD = useSelector(state => state?.PD);

    const theme = useTheme();
    const data = [
      {
        // stats: `${parseFloat(checkNullUndefined(PrdDev?.Cnt))}  / ${safeValue(parseInt(checkNullUndefined(Math.round(PrdDev?.MetalWeight))))} gm`,
        stats: `${parseFloat(checkNullUndefined(PD?.data?.Cnt))}  / ${safeValue(parseInt(checkNullUndefined(Math.round(PD?.data?.MetalWeight))))} gm`,
        title: 'New Development',
      },
      {
        // stats: `${safeValue(parseFloat(checkNullUndefined((PrdDev?.SaleCount / (PrdDev?.DesignCnt))))?.toFixed(2))} `,
        stats: `${safeValue(parseFloat(checkNullUndefined((PD?.data?.SaleCount / (PD?.data?.DesignCnt))))?.toFixed(2))} `,
        title: 'Repetation Rate',
      },
       
      ]

    const renderStats = () => { 
        return data?.map((sale, index) => (
          <Grid item xs={8} md={8} key={index}>
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6' color={bgColor}  >{checkNullUndefined(sale.title)}</Typography>
                <Typography variant='h5' color={theme?.palette?.grey?.[700]} sx={{fontWeight:'bolder', minWidth:'260px'}}>{checkNullUndefined(sale.stats)}</Typography>
              </Box>
            </Box>
          </Grid>
        ))
      }

  return (
    <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'198px', display:'flex', justifyContent:'center', alignItems:'center'}}>
         { PD?.loading ?
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem',  }}>
              <CircularProgress sx={{color:'lightgrey'}} />
            </Box> : <CardContent
            sx={{ pt: theme => `${theme.spacing(0)} !important`, pb: theme => `${theme.spacing(3)} !important` }}
            >
        <Grid container spacing={6}>
          
            {renderStats()}
            
        </Grid>
        </CardContent>}
  </Card>
  )
}

export default ProductDevelopment
