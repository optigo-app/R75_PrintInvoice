import React, { useEffect, useState } from 'react'
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import { CircularProgress, useTheme } from '@mui/material';
import { useSelector } from 'react-redux'
import { formatAmount } from '../../GlobalFunctions'
import { checkNullUndefined } from '../../componentsofkpi/components/global';
const FactoryDataSummary = ({ tkn, bgColor, selectMaterial, selectCurrency }) => {

  const { loading, data, error } = useSelector(state => state?.Summary_Purchase);
  const summary_sale = useSelector(state => state?.Summary_Sale);


  const [labelname, setLabelName] = useState('Avg. D.ctw');
  const [labelvalue, setLabelValue] = useState('');

  const [setPerG, setSetPerG] = useState(0);
  const [costPerC, setCostPerG] = useState(0);
  const [soldPerC, setSoldPerC] = useState(0);

  const [DTObj, setDTObj] = useState();
  console.log('DTObj: ', DTObj);
  const [SSDTObj, setSSDTObj] = useState();

  const theme = useTheme();



  const comp_data = [
    {
      stats: labelvalue,
      title: labelname,
    },
    {
      stats: checkNullUndefined(formatAmount(((DTObj?.Total_Labour / DTObj?.Netwt) / selectCurrency))),
      title: 'Total Labour',
    },
    {
      stats: (formatAmount(DTObj?.Labour_Per_Gram / selectCurrency)),
      title: 'Labour Per Gram',
    },
    {
      stats: (formatAmount(setPerG / selectCurrency)),
      title: 'Setting Per Gram',
    },
    {
      stats: DTObj?.AVG_NetWt,
      title: 'Avg. NetWt',
    },
    {
      stats: DTObj?.Total_Unit,
      title: 'Total Unit',
    },
    // {
    //   stats: DTObj?.Gold_Loss?.toFixed(3),
    //   title: 'Gold Loss',
    // },
    {
      stats: DTObj?.TotalWastageLossAmount?.toFixed(2),
      title: 'Gold Loss',
    },
    {
      stats: SSDTObj?.In_Out_Duration,
      title: 'In/Out Duration',
    },
    {
      stats: checkNullUndefined(formatAmount((costPerC / selectCurrency))),
      title: 'Cost Per Carat',
    },
    {
      stats: checkNullUndefined(formatAmount((soldPerC / selectCurrency))),
      title: 'Sold Per Carat',
    }
  ];

  useEffect(() => {
    setLabelName(selectMaterial);
    let obj = data?.DT[0];
    console.log('ddddobj: ', obj);

    setDTObj(obj);
    let obj2 = summary_sale?.data?.DT[0];
    setSSDTObj(obj2);

    if (selectMaterial === 1 || selectMaterial === '1') {
      setLabelName('Avg. D.ctw');
      setLabelValue(obj?.AVG_D_Ctw);
      // let dctw = ((obj?.TotalJobCnt === 0 ? 0 : obj?.DiaWt) / (obj?.TotalJobCnt === 0 ? 1 : obj?.TotalJobCnt))?.toFixed(3);
      // setLabelValue(dctw);  
      setSetPerG(obj?.Setting_Per_Gram_Diam);
      setCostPerG(obj?.Cost_Per_Carat_D);
      setSoldPerC(obj2?.Sold_Per_Carat_D);
    }
    if (selectMaterial === 2 || selectMaterial === '2') {
      // let csctw = ((obj?.TotalJobCnt === 0 ? 0 : obj?.CSWt) / (obj?.TotalJobCnt === 0 ? 1 : obj?.TotalJobCnt))?.toFixed(3);
      setLabelName('Avg. C.ctw');
      setLabelValue(obj?.AVG_C_Ctw);
      // setLabelValue(csctw);
      setSetPerG(obj?.Setting_Per_Gram_CS);
      setCostPerG(obj?.Cost_Per_Carat_CS);
      setSoldPerC(obj2?.Sold_Per_Carat_CS);
    }
    if (selectMaterial === 3 || selectMaterial === '3') {
      // let miscwt = ((obj?.TotalJobCnt === 0 ? 0 : obj?.MISCWt) / (obj?.TotalJobCnt === 0 ? 1 : obj?.TotalJobCnt))?.toFixed(3);
      setLabelName('Avg. M.ctw');
      setLabelValue(obj?.AVG_M_Ctw);
      // setLabelValue(miscwt);
      setSetPerG(obj?.Setting_Per_Gram_M);
      setCostPerG(obj?.Cost_Per_Carat_M);
      setSoldPerC(obj2?.Sold_Per_Carat_M);
    }


  }, [selectMaterial, data, summary_sale]);



  const renderStats = () => {
    return comp_data?.map((sale, index) => (
      <Grid item xs={6} sm={6} md={2.4} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h4' color={"#5D5A68"} sx={{ fontWeight: 'bolder' }} >{sale.stats}</Typography>
            <Typography color={theme?.palette?.grey[600]} fontSize={"0.8rem"}   >{sale.title}</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }
  return (
    <>
      <Card className='fs_analytics_l' style={{ boxShadow: '0px 4px 18px 0px rgba(47, 43, 61, 0.1)' }}>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '1rem', minHeight: '204px' }}>
          <CircularProgress sx={{ color: 'lightgrey' }} />
        </Box> : <CardContent
          sx={{ pt: theme => `${theme.spacing(3)} !important`, pb: theme => `${theme.spacing(3)} !important` }}
        >
          <Grid container spacing={6}>
            {renderStats()}
          </Grid>
        </CardContent>}
      </Card>
    </>
  )
}

export default FactoryDataSummary