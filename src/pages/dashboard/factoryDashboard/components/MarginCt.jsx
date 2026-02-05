// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'
// import Icon from '../@core/components/icon'

// ** Custom Components Imports
// import OptionsMenu from 'src/@core/components/option-menu'
// import OptionsMenu from '../@core/components/option-menu'

// import imgIcon from "../images/cards/brazil.png"
import { useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { fetchDashboardData, formatAmount, formatAmountKWise } from '../../GlobalFunctions';
import { cloneDeep } from 'lodash';

const data = [
  {
    title: '$8.45k',
    trendNumber: 25.8,
    subtitle: 'United States',
    imgSrc: '/images/cards/us.png',
    user:'Chow',
    soldPerCost:3510,
    CostPerCarat:1300
  },
  {
    title: '$7.78k',
    trend: 'negative',
    trendNumber: 16.2,
    subtitle: 'Brazil',
    imgSrc: '/images/cards/brazil.png',
    user:'KK',
    soldPerCost:3178,
    CostPerCarat:1030
  },
  {
    title: '$6.48k',
    subtitle: 'India',
    trendNumber: 12.3,
    imgSrc: '/images/cards/india.png',
    user:'Nancy',
    soldPerCost:14934,
    CostPerCarat:13703,
  },
  {
    title: '$5.12k',
    trend: 'negative',
    trendNumber: 11.9,
    subtitle: 'Australia',
    imgSrc: '/images/cards/australia.png',
    user:'Pariya',
    soldPerCost:3178,
    CostPerCarat:1030
  },
  {
    title: '$4.45k',
    subtitle: 'France',
    trendNumber: 16.2,
    imgSrc: '/images/cards/france.png',
    user:'SA',
    soldPerCost:3178,
    CostPerCarat:1030
  },
  {
    title: '$3.90k',
    subtitle: 'China',
    trendNumber: 14.8,
    imgSrc: '/images/cards/china.png',
    user:'Tiffany',
    soldPerCost:3178,
    CostPerCarat:1030
  },
  {
    title: '$3.90k',
    subtitle: 'China',
    trendNumber: 14.8,
    imgSrc: '/images/cards/china.png',
    user:'XRO',
    soldPerCost:3178,
    CostPerCarat:1030
  },
  {
    title: '$3.90k',
    subtitle: 'China',
    trendNumber: 14.8,
    imgSrc: '/images/cards/china.png',
    user:'YF',
    soldPerCost:3178,
    CostPerCarat:1030
  }
]

const MarginCt = ({tkn,  fdate, tdate}) => {
  const theme = useTheme();

  const [apiData, setApiData] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {

        // Fetch MonthWiseSaleAmount data
        let CountryWiseSaleAmount = await fetchDashboardData(tkn,  fdate, tdate, "CountryWiseSaleAmount");

        const arr = [];

        CountryWiseSaleAmount?.forEach((e) => {
          let obj = cloneDeep(e);
          let findrec = arr?.findIndex((a) => a?.Locker?.toLowerCase() === obj?.Locker?.toLowerCase());
          if(findrec === -1){
            arr.push(obj);
          }else{
            arr[findrec].SaleAmount += obj?.SaleAmount;
          }
        })

        CountryWiseSaleAmount = arr;

        setApiData(CountryWiseSaleAmount);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData(); 

  },[fdate, tdate]);

  return (
    <Card className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'29.56rem'}}>
      <CardHeader
        title='Vendor Wise Margin/ct'
        subheader=''
        sx={{pb:0,mb:0}}
        // action={
        //   <OptionsMenu
        //     options={['Last Week', 'Last Month', 'Last Year']}
        //     iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
        //   />
        // }
      />
      <CardContent  sx={{
        maxHeight: '412px',
        overflow: 'auto',
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
        <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', pb:2}}>
            <Typography variant='h6' sx={{display:'flex', alignItems:'center', justifyContent:'flex-start', width:'33%'}}>User</Typography>
            <Typography variant='h6' sx={{display:'flex', alignItems:'center', justifyContent:'center', width:'33%'}}>Sold Per Carat</Typography>
            <Typography variant='h6' sx={{display:'flex', alignItems:'center', justifyContent:'flex-end', width:'33%'}}>Sold Per Cost</Typography>
        </Box>
        {data?.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                '& img': { mr: 4 },
                alignItems: 'center',
                // mb: index !== data.length - 1 ? 4.5 : undefined
                mb: index !== data?.length - 1 ? 2.7 : undefined
              }}
            >
              {/* <img width={34} height={34} src={item.imgSrc} alt={item.subtitle} /> */}
              {/* <img width={34} height={34} src={imgIcon} alt={item.subtitle} /> */}

              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width:'33%' }}>
                  <Typography variant='h6' color={theme?.palette?.customColors?.purple} sx={{fontWeight:'600'}}>{item?.user}</Typography>
                  {/* <Typography variant='body2' sx={{ color: 'text' }}>
                    {item?.Country}
                  </Typography> */}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    '& svg': { mr: 1 },
                    alignItems: 'center',
                    width:'33%',
                    justifyContent:'center'
                    // '& > *': { color: item.trend === 'negative' ? 'error.main' : 'success.main' }
                    // '& > *': { fontWeight:'bolder', color: item.trend === 'negative' ? `${theme?.palette?.customColors?.red}` : `${theme?.palette?.customColors?.green}` }
                  }}
                >
                  {/* <Icon
                    fontSize='1.25rem'
                    icon={item.trend === 'negative' ? 'tabler:chevron-down' : 'tabler:chevron-up'}
                  /> */}
                  <Typography variant='h6' color={theme?.palette?.customColors?.grey} sx={{fontWeight:'bold'}}>{`${formatAmountKWise(item?.soldPerCost)}`}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    '& svg': { mr: 1 },
                    alignItems: 'center',
                    width:'33%',
                    justifyContent:'flex-end'
                    // '& > *': { color: item.trend === 'negative' ? 'error.main' : 'success.main' }
                    // '& > *': { fontWeight:'bolder', color: item.trend === 'negative' ? `${theme?.palette?.customColors?.red}` : `${theme?.palette?.customColors?.green}` }
                  }}
                >
                  {/* <Icon
                    fontSize='1.25rem'
                    icon={item.trend === 'negative' ? 'tabler:chevron-down' : 'tabler:chevron-up'}
                  /> */}
                  <Typography variant='h6' color={theme?.palette?.customColors?.grey} sx={{fontWeight:'bold'}}>{`${formatAmountKWise(item?.CostPerCarat)}`}</Typography>
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default MarginCt
