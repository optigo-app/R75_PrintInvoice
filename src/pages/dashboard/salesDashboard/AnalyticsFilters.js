import { useTheme } from '@emotion/react';
import { Button, Card, Grid, Typography } from '@mui/material';
import React from 'react'

const AnalyticsFilters = () => {
    const theme = useTheme();
  return (
    <>
     <Card  className='fs_analytics_l'  style={{ height:'100px',display:'flex', justifyContent:'center', alignItems:'center', boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)'}} >
      <Grid container spacing={3}>
        <Grid item xs={12} lg={3} style={{ display:'flex', justifyContent:'center'}}>
            <Typography className='fs_analytics_l' variant='h3' color={theme?.palette?.customColors?.purple} sx={{p:1}}>Customer</Typography>
        </Grid>
        <Grid item xs={12} lg={3} style={{display:'flex', justifyContent:'center'}}>
            <Typography className='fs_analytics_l' variant='h3' color={theme?.palette?.customColors?.purple} sx={{p:1}}>Salesman</Typography>
        </Grid>
        <Grid item xs={12} lg={3} style={{display:'flex', justifyContent:'center'}}>
            <Typography className='fs_analytics_l' variant='h3' color={theme?.palette?.customColors?.purple} sx={{p:1}}>Office</Typography>
        </Grid>
        <Grid item xs={12} lg={3} style={{display:'flex', justifyContent:'center'}}>
            <Typography className='fs_analytics_l' variant='h3' color={theme?.palette?.customColors?.purple} sx={{p:1}}>Dates</Typography>
        </Grid>
      </Grid>
    </Card>
    </>
  )
}

export default AnalyticsFilters