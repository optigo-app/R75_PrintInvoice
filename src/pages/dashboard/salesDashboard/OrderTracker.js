import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import ReactApexcharts from '../@core/components/react-apexcharts'
import { useEffect, useState } from 'react';
import { CircularProgress, keyframes } from '@mui/material'
import { formatAmount, formatAmountRound } from '../GlobalFunctions'
const OrderTracker = ({ tkn, fdate, tdate, country, orderTracker }) => {
  const safeCountry = Number(country) || 1;
  const [apiData, setApiData] = useState([]);
  console.log('apiData: ', apiData);
  const [totalOrder, setTotalOrder] = useState({
    wt: 0,
    pcs: 0
  });
  console.log('totalOrder: ', totalOrder);
  const [task, setTask] = useState(85);
  console.log('ddddtask: ', task);
  const [taskLabel, setTaskLabel] = useState('In Stock');
  const [loader, setLoader] = useState(false);
  const theme = useTheme()

  useEffect(() => {

    const fetchData = async () => {
      try {

        setLoader(true);
        setApiData(orderTracker);

      } catch (error) {
        console.error("Error fetching data:", error);
        setLoader(false);
      }
    };

    fetchData();
  }, [orderTracker]);

  const data = [
    {
      subtitle: `${formatAmountRound((apiData[0]?.NewOrder ? apiData[0]?.NewOrder : 0) / +safeCountry)} (${apiData[0]?.NewOrderPcs ? apiData[0]?.NewOrderPcs : 0})`,
      title: 'New Order',
      avatarIcon: '',
      labelShow: false
    },
    {
      subtitle: `${formatAmountRound((apiData[0]?.InWIP ? apiData[0]?.InWIP : 0) / +safeCountry)} (${apiData[0]?.InWIPPcs ? apiData[0]?.InWIPPcs : 0})`,
      title: 'In WIP',
      avatarColor: 'warning',
      avatarIcon: '',
      labelShow: false
    },
    {
      subtitle: `${formatAmountRound((apiData[0]?.InStock ? apiData[0]?.InStock : 0) / +safeCountry)} (${apiData[0]?.InStockPcs ? apiData[0]?.InStockPcs : 0})`,
      avatarColor: 'info',
      title: 'In Stock',
      avatarIcon: '',
      labelShow: true
    }
  ];


  const options = {
    chart: {
      sparkline: { enabled: true }
    },
    stroke: { dashArray: 10 },
    labels: [taskLabel],
    colors: [(theme?.palette?.customColors?.purple)],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityTo: 0.5,
        opacityFrom: 1,
        shadeIntensity: 0.5,
        stops: [30, 70, 100],
        inverseColors: false,
        gradientToColors: [theme?.palette?.customColors?.purple]
      }
    },
    plotOptions: {
      radialBar: {
        endAngle: 130,
        startAngle: -140,
        hollow: { size: '60%' },
        track: { background: 'transparent' },
        dataLabels: {
          name: {
            offsetY: -15,
            color: theme.palette.text.disabled,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.body2.fontSize
          },
          value: {
            offsetY: 15,
            fontWeight: 500,
            formatter: value => `${value}%`,
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.h3.fontSize
          }
        }
      }
    },
    grid: {
      padding: {
        top: -30,
        bottom: 12
      }
    },
    responsive: [
      {
        breakpoint: 1300,
        options: {
          grid: {
            padding: {
              left: 22
            }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          grid: {
            padding: {
              left: 0
            }
          }
        }
      }
    ]
  }


  const handleTask = (item) => {
    if (!totalOrder.wt || totalOrder.wt === 0) {
      setTask(0);
      return;
    }

    if (item?.title?.toLowerCase() === "new order") {
      const isNewOrderPercentage = (orderTracker[0]?.NewOrder || 0) / totalOrder.wt / safeCountry * 100;
      setTask((isNewOrderPercentage)?.toFixed(2) || 0);
      setTaskLabel('In New');
    }
    if (item?.title?.toLowerCase() === 'in stock') {
      const inStockPercentage = (orderTracker[0]?.InStock || 0) / totalOrder.wt / safeCountry * 100;
      setTask((inStockPercentage)?.toFixed(2) || 0);
      setTaskLabel('In Stock');
    }
    if (item?.title?.toLowerCase() === 'in wip') {
      const inWIPPercentage = (orderTracker[0]?.InWIP || 0) / totalOrder.wt / safeCountry * 100;
      setTask((inWIPPercentage)?.toFixed(2) || 0);
      setTaskLabel('In WIP');
    }
  }


  useEffect(() => {
    if (!orderTracker || orderTracker.length === 0) {
      setTotalOrder({ wt: 0, pcs: 0 });
      setTask(0);
      return;
    }

    // Ensure values are checked for NaN
    const inStock = checkNaNVal((orderTracker[0]?.InStock) / +country);
    const inStockPcs = checkNaNVal(orderTracker[0]?.InStockPcs);

    const inWIP = checkNaNVal((orderTracker[0]?.InWIP) / +country);
    const inWIPPcs = checkNaNVal(orderTracker[0]?.InWIPPcs);

    const newOrder = checkNaNVal((orderTracker[0]?.NewOrder) / +country);
    const newOrderPcs = checkNaNVal(orderTracker[0]?.NewOrderPcs);

    const totalWt = inStock + inWIP + newOrder;
    const totalPcs = inStockPcs + inWIPPcs + newOrderPcs;
    const inStockPercentage = totalWt > 0 ? (inStock / totalWt) * 100 : 0;

    setTask((inStockPercentage)?.toFixed(2));
    setTaskLabel('In Stock');
    setTotalOrder({
      wt: totalWt,                                                                                                                                                                                                                                                                                                           
      wts: formatAmountRound(totalWt),
      pcs: totalPcs
    });

    setLoader(false);
  }, [apiData, country]);


  const checkNaNVal = (val) => {
    if (isNaN(val)) {
      return 0;
    }
    if (val === NaN || val === "NaN" || val === -Infinity || val === Infinity) {
      return 0
    } else {
      return val;
    }
  }

  const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

  const heartBeat = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;


  return (
    <Card style={{ boxShadow: '0px 4px 18px 0px rgba(47, 43, 61, 0.1)' }} className='fs_analytics_l'>
      <CardHeader
        sx={{ pb: 2, mb: 0, height: '95px' }}
        title='Order Tracker'
        subheader='Order Progress & Stock Status'
      />
      {
        0 ? <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          padding: '1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
        >
          <CircularProgress sx={{ color: 'white' }} />
        </Box> : <CardContent style={{ paddingBottom: '45px' }}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={5}>
              <Typography variant='h4'>
                {totalOrder.wts ?? ''}
                ({totalOrder.pcs ?? ''})
              </Typography>

              <Typography sx={{ pb: 3, color: 'text.secondary' }}>Total Orders</Typography>
              {data?.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer' }} onClick={() => handleTask(item)}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='h6'>{item.title}</Typography>
                      {item?.labelShow && (
                        <Typography
                          variant="caption"
                          sx={{
                            ml: 1,
                            py: 0.5,
                            color: '#28A745',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center', 
                            animation: `${heartBeat} 1.5s ease-in-out infinite`,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: '#28A745',
                              marginRight: .5,
                              boxShadow: '0 0 5px rgba(255, 255, 255, 0.6)',
                            }}
                          />
                          Live
                        </Typography>
                      )}
                    </Box>
                    <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                      {item.subtitle}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} sm={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ReactApexcharts type='radialBar' width={290} height={290} options={options} series={[task]} />
            </Grid>
          </Grid>
        </CardContent>
      }
    </Card>
  )
}

export default OrderTracker
