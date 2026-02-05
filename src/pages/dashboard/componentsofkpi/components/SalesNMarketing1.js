import React, { useEffect, useState } from 'react'
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import { CircularProgress, Modal, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { formatAmountRound } from '../../GlobalFunctions';
import { checkNullUndefined } from './global';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSelector } from 'react-redux'

//SALES AND MARKETING 3ST BLOCK
const RawMaterial = ({bgColor, popUpList, orderCmplt, saleMTs, SMOrder, SMOrderLoader, OCLoader}) => {
  
    const SaleMarketingOrder = useSelector(state => state?.SaleMarketingOrder);
    const SaleMarketingOrderComplete = useSelector(state => state?.SaleMarketingOrderComplete);
    const SaleMarketingTotalSale = useSelector(state => state?.SaleMarketingTotalSale);
    
    
    
  
    const theme = useTheme();
    const isMaxWidth599px = useMediaQuery('(max-width:599px)');
    const [mainData, setMainData] = useState([]);
    const [orderModal, setOrderModal] = useState(false);
    const [popupDetails, setPopUpDetails] = useState([]);
    const [popUpHeader, setPopUpHeader] = useState('');

    const [popUpFlag, setPopUpFlag] = useState('');
    
    useEffect(() => {
      
      const smorderArr = SMOrder?.DT[0];

    const data4 = [
      {
        stats: `${safeValue(parseFloat(checkNullUndefined(SaleMarketingOrder?.data?.DT?.TotalOrder))?.toFixed(3))} gms`,
        title: 'Total Order',
      },
      {
        stats: `${safeValue(parseFloat(checkNullUndefined(SaleMarketingOrder?.data?.DT?.AvgOrderSize))?.toFixed(2))} gms`,
        title: 'Avg. Order Size',
      },
      {
        stats: `${((SaleMarketingOrderComplete?.data?.LeadTime))} Days`,
        title: 'Lead Time',
      },
      {
        stats: `${SaleMarketingOrderComplete?.data?.DelayTime} Days`,
        title: 'Delay Time',
      },
      {
        stats: `₹ ${formatAmountRound(parseFloat(checkNullUndefined(SaleMarketingTotalSale?.data?.DT?.AvgLabour))?.toFixed(2))}`,
        title: 'Avg. Labour',
      },
      {
        stats: `${parseFloat(checkNullUndefined(SaleMarketingTotalSale?.data?.DT?.SaleReturnPer))?.toFixed(2)} %`,
        title: 'Sales Return ',
      },
      {
        stats: `${Math.round(checkNullUndefined(SaleMarketingOrder?.data?.DT?.StockCountWithOutClub))?.toFixed(0)} jobs`,
        title: 'Avg. Stock Book Jobs',
      },
      {
        stats: `₹ ${formatAmountRound(parseFloat(checkNullUndefined(SaleMarketingOrderComplete?.data?.OverDueDebtorsAmount))?.toFixed(2))}`,
        title: 'Overdue Debtors',
      }
      ];

      setMainData(data4);

      setPopUpDetails(SaleMarketingOrder?.data?.DT1);
         
    },[orderCmplt, SMOrder, popUpList, saleMTs, SaleMarketingOrder?.data, SaleMarketingOrderComplete?.data, SaleMarketingTotalSale?.data]);

    const handleOpenOrderModal = (sale) => {
      
        if(sale?.title?.toLowerCase() === "total order" && parseFloat(sale?.stats) > 0){
          setOrderModal(true);
          setPopUpDetails(popupDetails);
          setPopUpHeader('Order Details');
          setPopUpFlag("order");
        }
        
        if(sale?.title?.toLowerCase() === "avg. order size" && parseFloat(sale?.stats) > 0){
          setOrderModal(true);
          setPopUpDetails(popupDetails);
          setPopUpHeader('Average Order Size Details');
          setPopUpFlag("orderavgsize");
        }
        
    }
    
  
    const renderStats = () => {
        return mainData?.map((sale, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} style={{paddingTop:isMaxWidth599px ? 20 : 48}}>
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              { !isMaxWidth599px && <>
              <Box sx={{ display: 'flex', flexDirection:'column' }}>
                <Typography variant='h6' color={bgColor} >{checkNullUndefined(sale.title)}</Typography>
                <Typography variant='h5' 
                onClick={() => handleOpenOrderModal(sale)} 
                style={{textDecoration:` ${(((sale?.title === 'Total Order' || sale?.title === "Avg. Order Size") && parseFloat(sale?.stats)) > 0) ? 'underline' : ''}`, 
                cursor: (((sale?.title === "Total Order" || sale?.title === "Avg. Order Size") && parseFloat(sale?.stats)) > 0) ? "pointer" : "default", 
                color : `${((sale?.title === "Total Order" || sale?.title === "Avg. Order Size") && (parseFloat(sale?.stats) > 0)) ? bgColor : theme?.palette?.grey?.[700]}`
              }}
                //  color={((sale?.title === "Total Order") && (sale?.stats > 0)) ? theme?.palette?.customColors?.purple : theme?.palette?.grey?.[700]} 
                 sx={{fontWeight:'bolder'}}>{checkNullUndefined(sale.stats)}</Typography>
              </Box></>
              }
              { isMaxWidth599px && <>
              <Box sx={{ display: 'flex', justifyContent:'space-between', alignItems:'center', width:'100%' }}>
                <Typography variant='h6' color={bgColor} >{checkNullUndefined(sale.title)}</Typography>
                <Typography variant='h5' onClick={() => handleOpenOrderModal(sale)}  
                style={{textDecoration:` ${(((sale?.title === 'Total Order' || sale?.title === "Avg. Order Size") && parseFloat(sale?.stats)) > 0) ? 'underline' : ''}`, 
                cursor: (((sale?.title === "Total Order" || sale?.title === "Avg. Order Size") && parseFloat(sale?.stats)) > 0) ? "pointer" : "default",
                color : `${((sale?.title === "Total Order" || sale?.title === "Avg. Order Size") && (parseFloat(sale?.stats) > 0)) ? bgColor : theme?.palette?.grey?.[700]}`
                }} 
                // color={ ((sale?.title === "Total Order" && parseFloat(sale?.stats) > 0)) ? theme?.palette?.customColors?.purple : theme?.palette?.grey?.[700]} 
                sx={{fontWeight:'bolder'}}>{checkNullUndefined(sale.stats)}</Typography>
              </Box></>
              }
            </Box>
          </Grid>
        ))
      }
    const safeValue = (value) => {
        if (
            value === null || 
            value === undefined || 
            value === "null" || 
            value === "undefined" || 
            value === Infinity || 
            value === -Infinity || 
            isNaN(value)
        ) {
            return 0;
        }
        return value;
    };

  return (
    <>
       <Card  className={`fs_analytics_l ${(SMOrderLoader || OCLoader) ? 'center_kpi' : ''}`}  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'230px'}}>
            {/* { (SMOrderLoader ||  OCLoader) ? */}
            { (SaleMarketingOrder?.loading ||  SaleMarketingOrderComplete?.loading || SaleMarketingTotalSale?.loading) ?
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding:'1rem',  }}>
              <CircularProgress sx={{color:'lightgrey'}} />
            </Box> :
              <CardContent
                sx={{ pt: theme => `${theme.spacing(4)} !important`, pb: theme => `${theme.spacing(4)} !important` }}
                >
            <Grid container spacing={6}>
                {renderStats()}
                {
                    orderModal && (
                      <Modal
                        open={orderModal}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                        onClose={() => setOrderModal(false)}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 550,
                            maxHeight:'500px',
                            overflow:'auto',
                            // backgroundColor: 'linear-gradient(135deg, #f3f4f6, #ffffff)',
                            backgroundColor:'white',
                            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
                            pt: 4,
                            px: 5,
                            pb: 3,
                            borderRadius: '12px',
                            outline:'none',
                            pt:0
                          }}
                          className="boxShadow_hp"
                        >
                          {/* <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}> */}
                          <Box 
                            sx={{
                              position: 'sticky',
                              top: 0,
                              zIndex: 10, // Ensure it stays above content
                              backgroundColor: 'white', // To make sure the header stays opaque over the content
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0 15px',
                              paddingTop:'20px',
                              paddingBottom:'10px',
                              marginBottom: '16px', // Adds a small gap to content below the sticky header
                              borderRadius: '12px 12px 0 0',
                              zIndex:1000
                              // boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Optional: Adds a small shadow to make it stand out
                            }}
                          >
                            <span></span>
                            <Typography
                              id="parent-modal-title"
                              variant="h5"
                              component="h2"
                              sx={{
                                textAlign: 'center',
                                color: '#333',
                                fontWeight: 'bold',
                                // pb: 2,
                                // borderBottom: '1px solid #ccc',
                              }}
                              className='fs_analytics_l'
                            >
                              {popUpHeader}
                            </Typography>
                            <Tooltip title="Close" style={{cursor:'pointer'}} onClick={() => setOrderModal(false)}><CancelIcon /></Tooltip>
                          </Box>
                          <Box
                            sx={{
                              mt: 3,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: "18px",
                            }}
                          >
                            {popupDetails?.map((e, i) => (
                              <Box
                                key={i}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '10px 15px',
                                  backgroundColor: '#f9fafb',
                                  borderRadius: '8px',
                                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                  transition: 'transform 0.2s, box-shadow 0.2s',
                                  margin: "0px 5px",
                                  '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                                  },
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: '500',
                                    color: '#555',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                  }}
                                  className='fs_analytics_l'
                                >
                                  {/* Add an icon here */}
                                  {e?.OrderTypeName}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: 'bold',
                                    color: '#222',
                                  }}
                                  className='fs_analytics_l'
                                >
                                  {/* { popUpFlag === "order" ?  `${(e?.NetWt)?.toFixed(3)} gm`}` : `${(e?.NetWt / e?.OrderCnt)?.toFixed(3)}` } */}
                                  { popUpFlag === "order" && <>{e?.NetWt?.toFixed(3)} gm</>}
                                  { popUpFlag !== "order" && <>{(safeValue(e?.NetWt / e?.OrderCnt))?.toFixed(2)} </>}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              mt: 3,
                            }}
                          >
                            <button
                              style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                                letterSpacing:'1.2px'
                              }}
                              className='fs_analytics_l'
                              onClick={() => setOrderModal(false)}
                              onMouseOver={(e) =>
                                (e.target.style.backgroundColor = '#0056b3')
                              }
                              onMouseOut={(e) =>
                                (e.target.style.backgroundColor = '#007bff')
                              }
                            >
                              Close
                            </button>
                          </Box>
                        </Box>
                      </Modal>
                  )
                }
            </Grid>
            </CardContent>
            }
        </Card>
    </>
  )
}
export default RawMaterial