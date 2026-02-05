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
const QualityControl = ({ bgColor,  QuaC, qcInward, inwardLoader, QCLoader, InventoryRatio }) => {
  
    const QC = useSelector(state => state?.QC);
    const InventoryRatio1 = useSelector(state => state?.ITOR);
    const QcInward = useSelector(state => state?.QcInward);
    
  
    const theme = useTheme();

            const data = [
              {
                // stats: parseFloat(checkNullUndefined(obj?.ProductionApiData?.rd[0]?.qc_avg_inward))?.toFixed(2),
                // stats: `${safeValue(qcInward?.qc_avg_inward)} jobs`,
                stats: `${safeValue(QcInward?.data?.qc_avg_inward)} jobs`,
                title: 'Inward',
              },
              {
                // stats: ` ${(checkNullUndefined(QuaC?.JobMoveStockBookCount))} Jobs`,
                stats: ` ${(checkNullUndefined(QC?.data?.JobMoveStockBookCount))} Jobs`,
                title: 'Outward',
              },
              // {
              //   stats: `${(checkNullUndefined(parseInt((( InventoryRatio?.DT[0]?.NoOfDays === 0 ? 0 : QuaC?.QACountWithOutClub) / (InventoryRatio?.DT[0]?.NoOfDays === 0 ? 1 : InventoryRatio?.DT[0]?.NoOfDays)))))} Jobs`,
              //   title: 'Avg. QA Jobs',
              // },
              {
                stats: `${
                  checkNullUndefined
                    (
                      // parseInt(
                      //   (((InventoryRatio?.DT[0]?.NoOfDays ?? 0) === 0 ? 0 : QuaC?.QACountWithOutClub) / 
                      //   ((InventoryRatio?.DT[0]?.NoOfDays ?? 0) === 0 ? 1 : InventoryRatio?.DT[0]?.NoOfDays))
                      // )
                      parseInt(
                        (((InventoryRatio1?.data?.DT?.NoOfDays ?? 0) === 0 ? 0 : QC?.data?.QACountWithOutClub) / 
                        ((InventoryRatio1?.data?.DT?.NoOfDays ?? 0) === 0 ? 1 : InventoryRatio1?.data?.DT?.NoOfDays))
                      )
                 || 0
                )} Jobs`,
                title: 'Avg. QA Jobs',
              },
                      
              {
                // stats: `${safeValue(parseFloat(checkNullUndefined((( QuaC?.TotalJobCount_QA_To_Stock === 0 ? 0 : QuaC?.DaysDiff_QA_To_Stock) / (QuaC?.TotalJobCount_QA_To_Stock === 0 ? 1 : QuaC?.TotalJobCount_QA_To_Stock))))?.toFixed(2))} Days`,
                stats: `${safeValue(parseFloat(checkNullUndefined((( QC?.data?.TotalJobCount_QA_To_Stock === 0 ? 0 : QC?.data?.DaysDiff_QA_To_Stock) / (QC?.data?.TotalJobCount_QA_To_Stock === 0 ? 1 : QC?.data?.TotalJobCount_QA_To_Stock))))?.toFixed(2))} Days`,
                title: 'Avg. Prs. Time',
              }
            ]

      


    const renderStats = () => {
        return data?.map((sale, index) => (
          <Grid item xs={6} md={6} key={index} >
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              {/* <CustomAvatar skin='light' color={sale.color} sx={{ mr: 4, width: 42, height: 42 }}>
                <Icon icon={sale.icon} fontSize='1.5rem' />
              </CustomAvatar> */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6' color={bgColor} >{checkNullUndefined(sale.title)}</Typography>
                <Typography variant='h5' color={theme?.palette?.grey?.[700]} sx={{fontWeight:'bolder'}}>{checkNullUndefined(sale.stats)}</Typography>
              </Box>
            </Box>
          </Grid>
        ))
      }

  return (
    <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'198px', display:'flex', justifyContent:'center', alignItems:'center'}}>
        {/* <CardHeader
            title='Quality Control'
            sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
            // action={
            //     <Typography variant='body2' sx={{ color: 'text.disabled' }}>
            //     Updated 1 month ago
            //     </Typography>
            // }
            /> */}
        {
          // ( QCLoader || inwardLoader) ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem',  }}>
          ( QC?.loading || InventoryRatio1?.loading || QcInward?.loading) ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem',  }}>
          <CircularProgress sx={{color:'lightgrey'}} />
        </Box> :
          <CardContent
            sx={{ pt: theme => `${theme.spacing(0)} !important`, pb: theme => `${theme.spacing(3)} !important` }}
            >
        <Grid container spacing={6} >
            {renderStats()}
        </Grid>
        </CardContent>}
  </Card>
  )
}

export default QualityControl;
