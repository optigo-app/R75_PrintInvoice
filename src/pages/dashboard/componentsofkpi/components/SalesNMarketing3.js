// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { formatAmountRound } from '../../GlobalFunctions';
import { CircularProgress } from '@mui/material';
import { checkNullUndefined, makeWordShort } from './global';
import { useSelector } from 'react-redux';

//SALES AND MARKETING 2ST BLOCK
const SalesNMarketing3 = ({ bgColor, BCwise, BCwiseLoader}) => {
  const theme = useTheme();

  const [apiData, setApiData] = useState([]);
  const [apiData2, setApiData2] = useState([]); 
  const state = useSelector(state => state?.SalesMarketing_TotalSaleBusinessClassWise);
  

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (apiData2?.length > 0) {
          // Create a shallow copy of the array before sorting and slicing
          const formatedArr = [...apiData2]?.sort((a, b) => b?.Amount - a?.Amount)?.slice(0, 5);
          const formatedArr2 = [...apiData2]?.sort((a, b) => b?.Amount - a?.Amount)?.slice(5);

        //   const sortedData = [...apiData2].sort((a, b) => b?.Amount - a?.Amount);
        // const formatedArr = sortedData.slice(0, 5);
        // const formatedArr2 = sortedData.slice(5);

          // const formatedArr = [...apiData2]?.slice(0, 5);
          // const formatedArr2 = [...apiData2].slice(5);
          
          
          const obj = {
            CustomerType: "Other",
            Amount: 0
          };
    
          formatedArr2.forEach((a) => {
            obj.Amount += a?.Amount;
          });
    
          // Instead of directly mutating the array, create a new array and update state
          const newData = [...formatedArr, obj];
    
          setApiData(newData);
          
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
  
    fetchData(); 

  },[apiData2]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (apiData2?.length > 0) {
  //         // Sort once, then slice for top 5 and the rest
  //         const sortedData = [...apiData2].sort((a, b) => b?.Amount - a?.Amount);
  //         const formatedArr = sortedData.slice(0, 5);
  //         const formatedArr2 = sortedData.slice(5);
  
  //         // Calculate the total amount for "Other" category
  //         const totalAmount = formatedArr2.reduce((sum, item) => sum + item?.Amount, 0);
  
  //         // Combine top 5 with "Other" category data
  //         setApiData([...formatedArr, { CustomerType: "Other", Amount: totalAmount }]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  
  //   fetchData();
  // }, [apiData2]);
  


  useEffect(() => {
    setApiData2(state?.data);
  },[state?.data]);
  

  
  return (
    <Card className={`fs_analytics_l ${state?.loading ? 'center_kpi' : ''}`}  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'230px', }}>

      <CardContent  sx={{
        maxHeight: '412px',
        overflow: 'auto',
        paddingBottom:'0px',
        '&::-webkit-scrollbar': {
          width: '6px',  
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
        {
          state?.loading ? 
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', top:`${(230 / 2)}px` }}>
              <CircularProgress sx={{color:'lightgrey'}} />
            </Box> :
         apiData?.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                '& img': { mr: 4 },
                alignItems: 'center',
                mb: index !== apiData?.length - 1 ? 1 : undefined,
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
                  <Typography variant='h6' color={bgColor} >{makeWordShort(item?.CustomerType) || ''}</Typography>
              
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    '& svg': { mr: 1 },
                    alignItems: 'center',
                   }}
                >
                  { item?.CustomerType === undefined ? <Typography variant='h6'>&nbsp;</Typography> : <Typography variant='h6' color={theme?.palette?.grey?.[700]} sx={{fontWeight:'bolder'}}>{`₹ ${formatAmountRound(checkNullUndefined(((item?.Amount)))?.toFixed(2))}`}</Typography>}
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default SalesNMarketing3;